/*
 * @Author: 刘利军
 * @Date: 2020-04-24 16:13:10
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-07-24 10:05:43
 */

import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {OS, CachesDirectoryPath, exists} from '../../utils/fs';
import StaticServer from 'react-native-static-server';

interface CustomProps {
  navigation: any;
  route: RoutePoprs;
}
interface RoutePoprs {
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

export default class Custom extends Component<CustomProps, CustomState> {
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
  render() {
    const {uri, path} = this.state;

    if (uri) {
      return <WebView source={{uri}} />;
    }
    if (path) {
      const fileUri = `${path}/index.html`;
      const filePath = `${path}`;
      return (
        <WebView
          originWhitelist={['*']}
          cacheEnabled={false}
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
