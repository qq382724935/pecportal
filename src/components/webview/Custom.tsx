/*
 * @Author: 刘利军
 * @Date: 2020-04-24 16:13:10
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-07-28 16:08:55
 */

import React, {Component} from 'react';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import StaticServer from 'react-native-static-server';
import {OS, CachesDirectoryPath, exists} from '../../utils/fs';
import {h5PostMessage} from '../../utils/webview';
import {Alert} from 'react-native';
import {connect} from 'react-redux';
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
    };
  }
  componentDidMount() {
    this.initUri();
  }
  getFilePtah = (path: string) => `${CachesDirectoryPath}/${path}`;
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
          let server = new StaticServer(9999, CachesDirectoryPath, {
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
    if (data) {
      h5PostMessage(JSON.parse(event.nativeEvent.data), this.props.navigation);
    }
  };
  render() {
    const {uri, path} = this.state;
    if (uri) {
      return (
        <WebView
          ref={(r) => (global.wevref = r)}
          source={{uri}}
          cacheEnabled={false}
          cacheMode="LOAD_NO_CACHE"
          onMessage={this.messageChange}
        />
      );
    }
    if (path) {
      const fileUri = `${path}/index.html`;
      const filePath = `${path}`;
      return (
        <WebView
          originWhitelist={['*']}
          cacheEnabled={false}
          cacheMode="LOAD_NO_CACHE"
          allowFileAccess={true}
          javaScriptEnabled={true}
          allowFileAccessFromFileURLs={true}
          mixedContentMode="always"
          allowUniversalAccessFromFileURLs={true}
          allowingReadAccessToURL={filePath}
          source={{
            uri: fileUri,
            baseUrl: filePath,
          }}
        />
      );
    }
    return null;
  }
}

const mapStateToProps = ({app, router}: any) => ({app, router});
export default connect(mapStateToProps)(Custom);
