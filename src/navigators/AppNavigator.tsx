/*
 * @Author: 刘利军
 * @Date: 2020-04-21 14:45:07
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-07-17 08:58:30
 */

import React, {PureComponent} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();

import DynamicTabNavigator from './TabNavigator';
import {WView} from '../components/index';

import DeviceInfo from '../pages/DeviceInfo';
import Advertising from '../pages/Advertising';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Files from '../pages/Files';
import Qrcode from '../pages/Qrcode';
import Camera from '../pages/Camera';
import MyViewShot from '../pages/MyViewShot';
import AMap from '../pages/AMap';
import Journalism from '../pages/Journalism';

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
  {name: 'advertising', component: Advertising, options: {headerShown: false}},
  {
    name: 'main',
    component: DynamicTabNavigator,
    options: {title: '统一企业移动终端', headerLeft: undefined},
  },
  {name: 'deviceinfo', component: DeviceInfo, options: {title: '设备信息'}},
  {name: 'files', component: Files, options: {title: '文件管理'}},
  {name: 'WView', component: WView.Custom, options: {title: 'WView'}},
  {name: 'camera', component: Camera, options: {title: '相机'}},
  {name: 'qrcode', component: Qrcode, options: {title: '二维码'}},
  {name: 'viewshot', component: MyViewShot, options: {title: '文本转图片'}},
  {name: 'amap', component: AMap, options: {title: '地图'}},
  {name: 'journalism', component: Journalism, options: {title: '新闻页'}},
];
import {Mask} from '../components/index';
import {connect} from 'react-redux';

class AppNavigator extends PureComponent<PropsEntry> {
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
    const {initialRouteName, app} = this.props;
    return (
      <>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={initialRouteName}>
            {this.routeRender(routeList)}
          </Stack.Navigator>
        </NavigationContainer>
        {app.progress.show ? <Mask /> : null}
      </>
    );
  }
}
const mapStateToProps = ({app, router}: any) => ({app, router});
export default connect(mapStateToProps)(AppNavigator);

interface PropsEntry {
  app: any;
  router: any;
  state: any;
  dispatch: any;
  initialRouteName: string;
}
