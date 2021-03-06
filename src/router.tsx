import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import AppNavigator from './navigators/AppNavigator';
import SplashScreen from 'react-native-splash-screen';
import {auth, webApp} from './utils/auth';
import {subscribe} from './utils/zip';

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

  componentDidMount() {
    this.zipProgress = subscribe(() => {});
  }
  componentWillUnmount() {
    this.zipProgress && this.zipProgress.remove();
  }

  initAuth = async () => {
    const authData = await auth();
    this.setState(authData);
    SplashScreen.hide();
  };

  initWeb = async () => {
    await webApp('dianwei.zip');
  };

  // 下载配置文件
  render() {
    const {dispatch, router} = this.props;
    const {checkLogin, initialRouteName} = this.state;
    if (!initialRouteName || !checkLogin) {
      return null;
    }
    return (
      <>
        <AppNavigator
          dispatch={dispatch}
          state={router}
          initialRouteName={initialRouteName}
        />
      </>
    );
  }
}

const mapStateToProps = ({app, router}: any) => ({app, router});
export default connect(mapStateToProps)(Router);
