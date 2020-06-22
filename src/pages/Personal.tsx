/*
 * @Author: 刘利军
 * @Date: 2020-04-21 15:21:03
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-06-22 16:06:03
 */
import React, {Component} from 'react';
import {Button, View, Text} from 'react-native';
import {getVersion} from 'react-native-device-info';
import {List, Button as myButton} from '../components/index';

import {qtData, QueryTableDataProps} from '../utils/sqlite';
import {loadToken, removeToken} from '../utils/storage';
import {STORAGE_KEY} from '../utils/keys';
import {resetHome} from '../utils/navigation';
import {
  getCacheSize,
  clearCache,
  clearHttpCache,
  getHttpCacheSize,
  clearImageCache,
  getImageCacheSize,
} from '@yz1311/react-native-http-cache';

class CacheManage extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }
  state = {imageCache: '', httpCache: '', cacheSize: ''};

  initCache = () => {
    getImageCacheSize().then((imageCache) => {
      this.setState({imageCache});
    });
    getCacheSize().then((cacheSize) => {
      this.setState({cacheSize});
    });
    getHttpCacheSize().then((httpCache) => {
      this.setState({httpCache});
    });
  };
  navListener: any;
  componentDidMount() {
    this.initCache();
    this.navListener = this.props.navigation.addListener('tabPress', () => {
      this.initCache();
    });
  }

  componentWillUnmount() {
    this.navListener && this.navListener();
  }
  UNSAFE_componentWillMount() {
    this.navListener && this.navListener();
  }

  render() {
    const {imageCache, httpCache, cacheSize} = this.state;
    const list = [
      {
        label: 'ImageView',
        value: imageCache,
        onPress: () => {
          clearImageCache().then((value: any) => {
            this.setState({imageCache: value});
          });
        },
      },
      {
        label: '网络请求',
        value: httpCache,
        onPress: () => {
          clearHttpCache().then((value) => {
            this.setState({httpCache: value});
          });
        },
      },
      {
        label: '所有缓存',
        value: cacheSize,
        onPress: () => {
          clearCache().then((value) => {
            this.setState({cacheSize: value});
          });
        },
      },
    ];
    return (
      <>
        <List.Describe list={list} clean={true} />
      </>
    );
  }
}

class UserManage extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      userData: [],
    };
  }
  render() {
    const {userData} = this.state;
    const {navigation} = this.props;
    return (
      <>
        <Text style={{margin: 8, fontSize: 16}}>用户表</Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8}}>
          <View style={{marginRight: 8}}>
            <Button
              title="查询数据"
              onPress={() => {
                qtData({
                  sql: 'SELECT * FROM PEC_USER',
                  data: [],
                  ok: (value: QueryTableDataProps[]) =>
                    this.setState({
                      userData: value.map((item) => ({
                        value: item.PASSWORD,
                        label: item.USERNAME,
                      })),
                    }),
                });
              }}
            />
          </View>
          <View style={{marginRight: 8}}>
            <Button title="添加数据" onPress={() => {}} />
          </View>
          <View style={{marginRight: 8}}>
            <Button title="删除数据" onPress={() => {}} />
          </View>
          <View style={{marginRight: 8}}>
            <Button
              title="退出登录"
              onPress={() => {
                removeToken({key: STORAGE_KEY.LOGIN}).then(() =>
                  resetHome({navigation, name: 'login'}),
                );
              }}
            />
          </View>
        </View>
        <List.Describe list={userData} />
      </>
    );
  }
}

class Personal extends Component {
  state = {userName: '', cType: null, userData: []};
  componentDidMount() {
    loadToken({key: STORAGE_KEY.LOGIN})
      .then(({userinfo}) => {
        this.setState({userName: userinfo.USERNAME});
      })
      .catch((error) => {
        console.log('error------------------------------------', error);
      });
  }

  render() {
    const {userName, cType} = this.state;
    const describeList = [
      {
        label: '用户名',
        value: userName,
      },
      {label: '版本号', value: getVersion()},
    ];
    const list = [
      {label: '用户管理', press: () => this.setState({cType: '1'})},
      {label: '缓存管理', press: () => this.setState({cType: '2'})},
    ];

    return (
      <>
        <List.Describe list={describeList} />
        {list.map((item, index) => (
          <myButton.APLSButton
            key={index}
            style={{backgroundColor: '#d9d9d9'}}
            onPress={item.press}>
            <Text>{item.label}</Text>
          </myButton.APLSButton>
        ))}
        {cType === '1' ? <UserManage {...this.props} /> : null}
        {cType === '2' ? <CacheManage {...this.props} /> : null}
      </>
    );
  }
}
export default Personal;
