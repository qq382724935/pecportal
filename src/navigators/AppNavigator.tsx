/*
 * @Author: 刘利军
 * @Date: 2020-04-21 14:45:07
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-08-26 17:19:05
 */

import React, {PureComponent} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
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
import MyViewShot from '../pages/MyViewShot';
import AMap from '../pages/AMap';
import Journalism from '../pages/Journalism';
import CameraPhoto from '../pages/camera/CameraPhoto';
import CameraScan from '../pages/camera/CameraScan';
import CameraScanPreview from '../pages/camera/CameraScanPreview';

import {WView, Mask} from '../components/index';
import {navigationRef, navigate} from './RootNavigation.js';

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

const WViewHeaderRightRender = ({navigation: {goBack}}: any) => {
  return (
    <View style={{paddingRight: 16}}>
      <Text onPress={() => goBack()}>取消</Text>
    </View>
  );
};

const MainHeaderRightRender = ({app: {additional}, dispatch}: any) => {
  return (
    <TouchableOpacity
      onPress={() => {
        dispatch({
          type: 'app/updateState',
          payload: {additional: !additional},
        });
      }}>
      <View
        style={{
          marginRight: 16,
          width: 40,
          alignItems: 'flex-end',
        }}>
        <Image
          style={{width: 16, height: 16}}
          source={require('../assets/icon/add.png')}
        />
      </View>
    </TouchableOpacity>
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
      headerRight: (props: any) => <MainHeaderRightRender {...props} />,
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
      headerShown: false,
      headerLeft: () => null,
      headerRight: (props: any) => <WViewHeaderRightRender {...props} />,
    },
  },
  {
    name: 'cameraPhoto',
    component: CameraPhoto,
    options: {title: '相机', headerRight: () => null, headerShown: false},
  },
  {
    name: 'cameraScan',
    component: CameraScan,
    options: {title: '扫一扫', headerRight: () => null, headerShown: false},
  },
  {
    name: 'cameraScanPreview',
    component: CameraScanPreview,
    options: {title: '预览', headerRight: () => null, headerShown: false},
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
          headerRight: () =>
            item.options.headerRight({...props, ...this.props}),
        })}
      />
    ));
  };

  render() {
    const {
      initialRouteName,
      app: {additional, updateVersionData},
      dispatch,
    } = this.props;
    const list2 = [
      {
        label: '扫一扫',
        icon: require('../assets/icon/scan.png'),
        press: () => {
          dispatch({
            type: 'app/updateState',
            payload: {additional: !additional},
          });
          navigate('cameraScan', {});
        },
      },
      {
        label: '相机',
        icon: require('../assets/icon/photo.png'),
        press: () => {
          dispatch({
            type: 'app/updateState',
            payload: {additional: !additional},
          });
          navigate('cameraPhoto');
        },
      },
    ];
    return (
      <>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator initialRouteName={initialRouteName}>
            {this.routeRender(routeList)}
          </Stack.Navigator>
        </NavigationContainer>

        <Mask.UpdateVersionModal
          display={updateVersionData.show}
          data={updateVersionData}
        />

        <Mask.Additional
          list={list2}
          display={additional}
          onPress={() => {
            dispatch({
              type: 'app/updateState',
              payload: {additional: !additional},
            });
          }}
        />
      </>
    );
  }
}
const mapStateToProps = ({app, router}: PropsEntry) => ({app, router});
export default connect(mapStateToProps)(AppNavigator);

interface PropsEntry {
  app: any;
  router: any;
  state: any;
  dispatch: any;
  initialRouteName: string;
}
