/*
 * @Author: 刘利军
 * @Date: 2020-04-21 14:45:07
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-07-17 16:39:59
 */

import React, {PureComponent} from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();
import DynamicTabNavigator from './TabNavigator';
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
import {WView, Mask} from '../components/index';

interface RouteOptions {
  title?: string;
  headerLeft?: any;
  headerShown?: boolean;
  headerRight: any;
}
interface RouteData {
  name: string;
  component: React.ComponentType<any>;
  options: RouteOptions;
}

const HeaderRightRender = ({navigation: {goBack}}: any) => {
  return (
    <View style={{paddingRight: 16}}>
      <Text onPress={() => goBack()}>取消</Text>
    </View>
  );
};

const routeList: RouteData[] = [
  {
    name: 'login',
    component: Login,
    options: {title: '登录', headerRight: () => null},
  },
  {
    name: 'register',
    component: Register,
    options: {title: '注册', headerRight: () => null},
  },
  {
    name: 'advertising',
    component: Advertising,
    options: {headerShown: false, headerRight: () => null},
  },
  {
    name: 'main',
    component: DynamicTabNavigator,
    options: {
      title: '统一企业移动终端',
      headerLeft: undefined,
      headerRight: () => null,
    },
  },
  {
    name: 'deviceinfo',
    component: DeviceInfo,
    options: {title: '设备信息', headerRight: () => null},
  },
  {
    name: 'files',
    component: Files,
    options: {title: '文件管理', headerRight: () => null},
  },
  {
    name: 'WView',
    component: WView.Custom,
    options: {
      title: 'WView',
      headerLeft: () => null,
      headerRight: (props: any) => <HeaderRightRender {...props} />,
    },
  },
  {
    name: 'camera',
    component: Camera,
    options: {title: '相机', headerRight: () => null},
  },
  {
    name: 'qrcode',
    component: Qrcode,
    options: {title: '二维码', headerRight: () => null},
  },
  {
    name: 'viewshot',
    component: MyViewShot,
    options: {title: '文本转图片', headerRight: () => null},
  },
  {
    name: 'amap',
    component: AMap,
    options: {title: '地图', headerRight: () => null},
  },
  {
    name: 'journalism',
    component: Journalism,
    options: {title: '新闻页', headerRight: () => null},
  },
];

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
        options={(props) => ({
          headerBackTitleVisible: false,
          ...item.options,
          headerRight: () => item.options.headerRight(props),
        })}
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
        {/* <Stack.Screen
              name="WView"
              component={WView.Custom}
              options={({navigation: {goBack}}) => {
                return {
                  title: 'WView',
                  headerBackTitleVisible: false,
                  headerLeft: () => null,
                  headerRight: (props) => <HeaderRightRender goBack={goBack} />,
                };
              }}
            /> */}
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
