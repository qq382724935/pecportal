/*
 * @Author: 刘利军
 * @Date: 2020-04-24 16:13:10
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-08-05 18:02:27
 */

import React, {Component} from 'react';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import StaticServer from 'react-native-static-server';
import {OS, DocumentDirectoryPath, exists} from '../../utils/fs';
import {h5PostMessage} from '../../utils/webview';
import {Alert} from 'react-native';
import {connect} from 'react-redux';
import Loading from './Loading';

const FILE_PATH = DocumentDirectoryPath;
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
}

class Custom extends Component<CustomProps, CustomState> {
  constructor(props: Readonly<CustomProps>) {
    super(props);
    this.props.navigation.setOptions({
      title: this.props.route.params.title,
    });
    this.state = {
      path: '',
      uri: '',
      progress: 0,
    };
  }
  componentDidMount() {
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
        if (OS === 'ios') {
          this.setState({path: this.getFilePtah(path)});
        } else {
          let server = new StaticServer(9999, FILE_PATH, {
            localOnly: true,
          });
          server.start().then((value: string) => {
            this.setState({uri: `${value}/${path}`});
          });
        }
      } else {
        this.setState({uri});
      }
    } else {
      this.setState({uri});
    }
  };
  isJson = (data: any) => {
    try {
      if (typeof JSON.parse(data) === 'object') {
        return JSON.parse(data);
      }
    } catch (e) {
      Alert.alert('API调用失败，必须是正确的格式!');
      return '';
    }
  };
  messageChange = (event: WebViewMessageEvent) => {
    const data = this.isJson(event.nativeEvent.data);
    console.log('wbview messageChange: ', data);
    data && h5PostMessage(data, this.props.navigation);
  };
  webviewRender = () => {
    const {uri, path, progress} = this.state;
    if (uri) {
      return (
        <>
          {progress !== 1 && <Loading />}
          <WebView
            containerStyle={{flex: progress === 1 ? 1 : 0}}
            ref={(r) => (global.wevref = r)}
            source={{uri}}
            javaScriptEnabled={true}
            cacheEnabled={false}
            cacheMode="LOAD_NO_CACHE"
            onMessage={this.messageChange}
            startInLoadingState={true}
            onLoadProgress={({nativeEvent}) =>
              this.setState({progress: nativeEvent.progress})
            }
          />
        </>
      );
    }
    if (path) {
      const fileUri = `${path}/index.html`;
      const filePath = `${path}`;
      return (
        <>
          {progress !== 1 && <Loading />}
          <WebView
            containerStyle={{flex: progress === 1 ? 1 : 0}}
            ref={(r) => (global.wevref = r)}
            source={{
              uri: fileUri,
              baseUrl: filePath,
            }}
            originWhitelist={['*']}
            cacheEnabled={false}
            cacheMode="LOAD_NO_CACHE"
            allowFileAccess={true}
            javaScriptEnabled={true}
            allowFileAccessFromFileURLs={true}
            mixedContentMode="always"
            allowUniversalAccessFromFileURLs={true}
            allowingReadAccessToURL={filePath}
            onLoadProgress={({nativeEvent}) => {
              this.setState({progress: nativeEvent.progress});
            }}
          />
        </>
      );
    }
    return null;
  };
  render() {
    return this.webviewRender();
  }
}

const mapStateToProps = ({app, router}: any) => ({app, router});
export default connect(mapStateToProps)(Custom);
