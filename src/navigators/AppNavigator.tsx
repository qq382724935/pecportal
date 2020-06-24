/*
 * @Author: 刘利军
 * @Date: 2020-04-21 14:45:07
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-06-23 17:45:09
 */

import React, {PureComponent} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();

import DynamicTabNavigator from './TabNavigator';
import {WView} from '../components/index';

import DeviceInfo from '../pages/DeviceInfo';
import Welcome from '../pages/Welcome';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Files from '../pages/Files';
// import messagePush from '../pages/messagePush';
import Qrcode from '../pages/Qrcode';
// import share from '../pages/share';
// import imagePicker from '../pages/imagePicker';
// import maps from '../pages/maps';
// import DataBase from '../pages/DataBase';
import Camera from '../pages/Camera';

interface RouteOptions {
  title?: string;
  headerLeft?: any;
  headerShown?: boolean;
}
interface RouteData {
  name: string;
  component: React.ComponentType<any>;
  options?: RouteOptions;
}

const routeList: RouteData[] = [
  {name: 'login', component: Login, options: {title: '登录'}},
  {name: 'register', component: Register, options: {title: '注册'}},
  {name: 'welcome', component: Welcome, options: {headerShown: false}},
  {
    name: 'main',
    component: DynamicTabNavigator,
    options: {title: 'React Native', headerLeft: undefined},
  },
  {name: 'deviceinfo', component: DeviceInfo, options: {title: '设备信息'}},
  {name: 'files', component: Files, options: {title: '文件管理'}},
  {name: 'WView', component: WView.Custom, options: {title: 'WView'}},
  {name: 'camera', component: Camera, options: {title: '相机'}},
  {name: 'qrcode', component: Qrcode, options: {title: '二维码'}},
];

export default class AppNavigator extends PureComponent<PropsEntry> {
  constructor(props: any) {
    super(props);
  }
  routeRender = (data: RouteData[]) => {
    return data.map((item, index) => (
      <Stack.Screen
        name={item.name}
        key={index + 1}
        component={item.component}
        options={item.options}
      />
    ));
  };

  render() {
    const {initialRouteName} = this.props;
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRouteName}>
          {this.routeRender(routeList)}
          {/* <Stack.Screen
            name="Login"
            component={Login}
            options={{title: '登录'}}
          />

          <Stack.Screen
            name="Register"
            component={Register}
            options={{title: '注册'}}
          />

          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="Main"
            component={DynamicTabNavigator}
            options={{title: 'RN', headerLeft: undefined}}
          /> */}

          {/* <Stack.Screen
            name="messagePush"
            component={messagePush}
            options={{ title: '消息推送' }}
          />
          <Stack.Screen
            name="files"
            component={files}
            options={{ title: 'json/文本数据处理' }}
          />
          <Stack.Screen
            name="qrCode"
            component={qrCode}
            options={{ title: '二维码' }}
          />
          <Stack.Screen
            name="share"
            component={share}
            options={{ title: '第三方分享' }}
          />
          <Stack.Screen
            name="imagePicker"
            component={imagePicker}
            options={{ title: '相机和图片处理' }}
          />
          <Stack.Screen
            name="maps"
            component={maps}
            options={{ title: '定位+地图' }}
          />
          <Stack.Screen
            name="deviceinfo"
            component={DeviceInfo}
            options={{ title: '设备信息获取' }}
          />
          <Stack.Screen
            name="database"
            component={DataBase}
            options={{ title: '数据库操作' }}
          /> */}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

interface PropsEntry {
  // app: any;
  state: any;
  dispatch: any;
  initialRouteName: string;
}
