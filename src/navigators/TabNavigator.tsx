/*
 * @Author: 刘利军
 * @Date: 2020-04-19 15:42:07
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-07-03 09:25:21
 */

import React, {Component} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../pages/Home';
// import NativeSDK from '../pages/NativeSDK';
// import ThirdPartySDK from '../pages/ThirdPartySDK';
import Personal from '../pages/Personal';
import HTMLCache from '../pages/HTMLCache';

const Tab = createBottomTabNavigator();
export default class DynamicTabNavigator extends Component {
  tabScreenData = [
    {name: 'home', component: Home, options: {title: '主页'}},
    // {name: 'thirdPartySDK', component: ThirdPartySDK, options: {title: '第三方SDK'}},
    {name: 'h5', component: HTMLCache, options: {title: '消息中心'}},
    {name: 'personal', component: Personal, options: {title: '我的'}},
  ];
  tabScreenRender = (data: any[]) =>
    data.map((item, index) => (
      <Tab.Screen
        key={index + 1}
        name={item.name}
        component={item.component}
        options={item.options}
      />
    ));
  render() {
    return (
      <Tab.Navigator>{this.tabScreenRender(this.tabScreenData)}</Tab.Navigator>
    );
  }
}
