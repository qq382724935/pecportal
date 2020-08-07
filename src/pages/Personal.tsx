/*
 * @Author: 刘利军
 * @Date: 2020-04-21 15:21:03
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-08-06 16:13:57
 */
import React, {Component} from 'react';
import {Button, View, Text, Alert} from 'react-native';
import {getVersion} from 'react-native-device-info';
import {List, Button as myButton} from '../components/index';

import {qtData, dtData, QueryTableDataProps} from '../utils/sqlite';
import {loadToken, removeToken} from '../utils/storage';
import {STORAGE_KEY} from '../utils/common';
import {resetHome, resetLogin} from '../utils/navigation';
import {connect} from 'react-redux';

import {
  getCacheSize,
  clearCache,
  clearHttpCache,
  getHttpCacheSize,
  clearImageCache,
  getImageCacheSize,
} from '@yz1311/react-native-http-cache';

import {checkForUpdate} from '../utils/CodePushUtils';
export interface PersonalProps {
  navigation: any;
  dispatch: any;
}
export interface PersonalState {
  userName: string;
  cType: string | null;
  userData: any[];
}
class Personal extends Component<PersonalProps, PersonalState> {
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
    const {navigation, dispatch} = this.props;
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
      {
        label: '版本升级',
        press: () => {
          checkForUpdate(dispatch);
        },
      },
    ];

    return (
      <>
        {userName ? (
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
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <myButton.APLSButton
              style={{
                backgroundColor: '#d9d9d9',
                marginLeft: 8,
                marginRight: 8,
              }}
              onPress={() => {
                resetLogin({navigation});
              }}>
              <Text>登录</Text>
            </myButton.APLSButton>
          </View>
        )}
      </>
    );
  }
}

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
      type: 'query',
    };
  }

  refresh = () => {
    qtData({
      sql: 'SELECT * FROM PEC_USER',
      data: [],
      ok: (value: QueryTableDataProps[]) =>
        this.setState({
          userData: value.map((item) => ({
            value: item.PASSWORD,
            label: item.USERNAME,
            onPress: () => {
              if (item.USERNAME === 'admin') {
                Alert.alert('暂时无法删除admin账号');
                return;
              }
              dtData({
                sql: 'DELETE FROM PEC_USER WHERE USERNAME = ?',
                data: [item.USERNAME],
                ok: () => {
                  this.refresh();
                },
              });
            },
          })),
        }),
    });
  };
  render() {
    const {userData, type} = this.state;
    const {navigation} = this.props;
    return (
      <>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8}}>
          {/* <View style={{marginRight: 8}}>
            <Button
              title="查询数据"
              onPress={() => {
                this.setState({type: 'query'});
                this.refresh();
              }}
            />
          </View>
          <View style={{marginRight: 8}}>
            <Button
              title="添加数据"
              onPress={() => {
                resetRegister({navigation});
              }}
            />
          </View> */}
          <View style={{marginRight: 8}}>
            <Button
              title="退出登录"
              onPress={() => {
                removeToken({key: STORAGE_KEY.LOGIN}).then(() =>
                  resetHome({navigation}),
                );
              }}
            />
          </View>
        </View>
        {type === 'query' ? (
          <List.Describe list={userData} clean={true} cleanTitle="删除" />
        ) : null}
      </>
    );
  }
}

const mapStateToProps = ({app, router}: any) => ({app, router});
export default connect(mapStateToProps)(Personal);
