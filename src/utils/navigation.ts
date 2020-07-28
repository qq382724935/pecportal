/*
 * @Author: 刘利军
 * @Date: 2020-06-14 18:04:44
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-07-28 14:51:47
 * @Description: 全局导航跳转工具类 by CrazyCodeBoy
 */

import {CommonActions} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
interface Navigation {
  navigation: any;
  name?: string;
}

interface NavigationOptions {
  title?: string;
  uri?: string;
  path?: string;
  webref?: WebView;
}

/**
 * 页面跳转
 * @param navigation
 */
export const resetPage = (
  {navigation, name}: Navigation,
  options?: NavigationOptions | {},
) => navigation.navigate(name, options);

/**
 * 跳转到登录页
 * @param navigation
 */

export const resetLogin = ({navigation, name = 'login'}: Navigation) =>
  navigation.navigate(name);

/**
 * 跳转到注册页
 * @param navigation
 */

export const resetRegister = ({navigation, name = 'register'}: Navigation) => {
  navigation.navigate(name);
};

/**
 * 返回上一页
 * @param navigation
 */

export const resetBack = ({navigation}: Navigation) => {
  navigation.goBack();
};

/**
 * 重置到首页，清空路由栈
 * @param navigation
 */
export const resetHome = ({navigation, name = 'main'}: Navigation) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name}],
    }),
  );
};
