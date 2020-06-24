import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import AppNavigator from './navigators/AppNavigator';

import SplashScreen from 'react-native-splash-screen';
import {auth, webApp} from './utils/auth';
import {subscribe} from './utils/zip';

import JPush from 'jpush-react-native';

class Router extends PureComponent<any> {
  state = {
    checkLogin: false,
    initialRouteName: '',
  };
  zipProgress: any;
  constructor(props: any) {
    super(props);
    this.initAuth();
    this.initWeb();
  }
  connectListener: any;
  mobileNumberListener: any;
  customMessageListener: any;
  tagAliasListener: any;
  localNotificationListener: any;
  notificationListener: any;
  componentDidMount() {
    JPush.init();
    //连接状态
    this.connectListener = (result: any) => {
      console.log('connectListener:' + JSON.stringify(result));
    };
    JPush.addConnectEventListener(this.connectListener);
    //通知回调
    this.notificationListener = (result: any) => {
      console.log('notificationListener:' + JSON.stringify(result));
    };
    JPush.addNotificationListener(this.notificationListener);
    //本地通知回调
    this.localNotificationListener = (result: any) => {
      console.log('localNotificationListener:' + JSON.stringify(result));
    };
    JPush.addLocalNotificationListener(this.localNotificationListener);
    //自定义消息回调
    this.customMessageListener = (result: any) => {
      console.log('customMessageListener:' + JSON.stringify(result));
    };
    JPush.addCustomMessagegListener(this.customMessageListener);
    //tag alias事件回调
    this.tagAliasListener = (result: any) => {
      console.log('tagAliasListener:' + JSON.stringify(result));
    };
    JPush.addTagAliasListener(this.tagAliasListener);
    //手机号码事件回调
    this.mobileNumberListener = (result: any) => {
      console.log('mobileNumberListener:' + JSON.stringify(result));
    };
    JPush.addMobileNumberListener(this.mobileNumberListener);
    this.zipProgress = subscribe(() => {
      // console.log(`progress: ${progress}\nprocessed at: ${filePath}`);
    });
  }
  componentWillUnmount() {
    this.zipProgress && this.zipProgress.remove();
    JPush.removeListener(this.connectListener);
    JPush.removeListener(this.customMessageListener);
    JPush.removeListener(this.notificationListener);
    JPush.removeListener(this.localNotificationListener);
    JPush.removeListener(this.tagAliasListener);
    JPush.removeListener(this.mobileNumberListener);
  }

  initAuth = async () => {
    const authData = await auth();
    this.setState(authData);
    SplashScreen.hide();
  };

  initWeb = async () => {
    // await webApp(['linedemo1.zip', 'linedemo1.zip']);
    await webApp('linedemo1.zip');
    await webApp('linedemo2.zip');
  };

  // 下载配置文件
  render() {
    const {dispatch, router} = this.props;
    const {checkLogin, initialRouteName} = this.state;
    if (!initialRouteName || !checkLogin) {
      return null;
    }
    return (
      <AppNavigator
        dispatch={dispatch}
        state={router}
        initialRouteName={initialRouteName}
      />
    );
  }
}

const mapStateToProps = ({app, router}: any) => ({app, router});
export default connect(mapStateToProps)(Router);
