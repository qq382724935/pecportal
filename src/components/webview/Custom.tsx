/*
 * @Author: 刘利军
 * @Date: 2020-04-24 16:13:10
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-09-21 11:47:36
 */

import React, {Component, useEffect} from 'react';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import {OS, exists} from '../../utils/fs';
import {h5PostMessage} from '../../utils/webview';
import {connect} from 'react-redux';
import Loading from './Loading';
import Error from './Error';
import CustomFixed from './CustomFixed';
import {SafeAreaView, StyleSheet} from 'react-native';
import {PATH_WEBVIEW} from '../../utils/common';
const FILE_PATH = PATH_WEBVIEW;

declare global {
  namespace NodeJS {
    interface Global {
      wevref: any | null;
    }
  }
}
interface CustomProps {
  navigation: any;
  route: WebViewRoutePoprs;
}
interface WebViewRoutePoprs {
  key: string;
  name: string;
  params: {
    uri: string;
    title: string;
    path: string;
  };
}
interface CustomState {
  path: string;
  uri: string;
  progress: number;
  showTop: boolean;
  renderError: boolean;
  errorName: string;
}

class Custom extends Component<CustomProps, CustomState> {
  constructor(props: Readonly<CustomProps>) {
    super(props);
    this.state = {
      path: '',
      uri: '',
      progress: 0,
      showTop: false,
      renderError: false,
      errorName: '',
    };
  }
  componentDidMount() {
    const {navigation, route} = this.props;
    navigation.setOptions({
      title: route.params.title,
    });
    this.initUri();
  }
  getFilePtah = (path: string) => `${FILE_PATH}/${path}`;
  initUri = async () => {
    const {uri = '', path = ''} = this.props.route.params;
    // path存在
    if (path) {
      // 资源目录中存在
      const isExists = await exists(this.getFilePtah(path))
        .then((res) => res)
        .catch((error) => console.log('error', error));
      if (isExists) {
        this.setState({path: this.getFilePtah(path)});
      } else {
        this.setState({uri});
      }
    } else {
      this.setState({uri});
    }
  };
  messageChange = (event: WebViewMessageEvent) => {
    const {bScroll, dScroll} = JSON.parse(event.nativeEvent.data);
    // 滚动监听事件存在
    if ((bScroll === 0 || bScroll) && (dScroll === 0 || dScroll)) {
      if (bScroll > 0 || dScroll > 0) {
        !this.state.showTop && this.setState({showTop: true});
      } else {
        this.setState({showTop: false});
      }
    } else {
      // 插件监听处理
      h5PostMessage(event.nativeEvent.data, this.props.navigation);
    }
  };

  initMore = () => {
    this.setState({renderError: false});
  };
  onScroll = `
    let scrollTimer;
    window.addEventListener('scroll',function(event){
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        window.ReactNativeWebView.postMessage(JSON.stringify({bScroll:document.body.scrollTop,dScroll:document.documentElement.scrollTop}));
      }, 300);
    });
    true
  `;
  webviewRender = () => {
    const {uri, path, progress, renderError} = this.state;
    const fileUri = `${path}/index.html`;
    const filePath = `${path}`;
    return (
      <>
        {progress !== 1 && <Loading />}
        <WebView
          originWhitelist={['*']}
          mixedContentMode="always"
          allowFileAccess={true}
          allowFileAccessFromFileURLs={true}
          allowUniversalAccessFromFileURLs={true}
          allowingReadAccessToURL={filePath}
          containerStyle={{flex: progress === 1 && !renderError ? 1 : 0}}
          ref={(r) => (global.wevref = r)}
          source={{
            uri: path ? fileUri : uri,
            baseUrl: filePath,
            headers: {
              'Cache-control': 'no-cache',
              Cache: 'no-cache',
            },
          }}
          injectedJavaScript={this.onScroll}
          javaScriptEnabled={true}
          cacheEnabled={false}
          cacheMode="LOAD_NO_CACHE"
          onError={(syntheticEvent) => {
            const {nativeEvent} = syntheticEvent;
            if (nativeEvent.code === -2) {
              this.setState({errorName: '当前网络不可用，点击重试'});
            }
            this.setState({renderError: true});
          }}
          onMessage={this.messageChange}
          onLoadProgress={({nativeEvent}) => {
            this.setState({progress: nativeEvent.progress});
          }}
        />
      </>
    );
  };
  render() {
    const {goBack} = this.props.navigation;
    const {name} = this.props.route;
    const {showTop, renderError, errorName} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {this.webviewRender()}
        {name === 'WView' && <CustomFixed goBack={goBack} top={showTop} />}
        {renderError && (
          <Error
            name={errorName}
            press={() => {
              this.initMore();
              global.wevref.reload();
            }}
          />
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({app, router}: any) => ({app, router});
export default connect(mapStateToProps)(Custom);

const styles = StyleSheet.create({
  container: {flex: 1},
});
