/*
 * @Author: 刘利军
 * @Date: 2020-04-21 15:21:03
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-09-08 17:30:10
 */
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {getVersion} from 'react-native-device-info';
import {List} from '../../components/index';
import {loadToken} from '../../utils/storage';
import {STORAGE_KEY, defaultAppIcon} from '../../utils/common';
import {resetLogin} from '../../utils/navigation';
import {connect} from 'react-redux';
import {ListItemProps} from '../../types/common';
export interface PersonalProps {
  navigation: any;
}
export interface PersonalState {
  userName: string;
}
class Personal extends Component<PersonalProps, PersonalState> {
  state = {userName: ''};
  async componentDidMount() {
    await loadToken({key: STORAGE_KEY.LOGIN})
      .then(({userinfo}) => {
        this.setState({userName: userinfo.USERNAME});
      })
      .catch(() => {});
  }
  render() {
    const {navigation} = this.props;
    const {userName} = this.state;

    const myList: ListItemProps[] = [
      {
        text: '设置',
        arrow: true,
        type: 'page',
        uri: 'commonPage',
        pageName: 'Setting',
      },
      {
        text: '关于E协同',
        pageName: 'AboutApp',
        other: `版本号${getVersion()}`,
        type: 'page',
        uri: 'commonPage',
        arrow: true,
      },
    ];

    const Login = () => {
      return (
        <View style={{marginBottom: 8}}>
          <List.Item
            style={{paddingTop: 4, paddingBottom: 16}}
            list={[
              {
                text: '',
                content: `E协同账号：${userName}`,
                uri: '',
                icon: defaultAppIcon,
                sort: 1,
                params: null,
                applicationType: '',
                type: '',
                press: () => {
                  if (!userName) {
                    resetLogin({navigation});
                  }
                },
              },
            ]}>
            {userName ? null : (
              <View>
                <Text>点击登录</Text>
              </View>
            )}
          </List.Item>
        </View>
      );
    };

    return (
      <>
        <View style={{flex: 1}}>
          <Login />
          <View style={{marginBottom: 8}}>
            <List.Item list={myList} {...this.props} />
          </View>
        </View>
      </>
    );
  }
}

const mapStateToProps = ({app, router}: any) => ({app, router});
export default connect(mapStateToProps)(Personal);
