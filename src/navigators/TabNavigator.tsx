/*
 * @Author: 刘利军
 * @Date: 2020-04-19 15:42:07
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-07-13 10:24:44
 */

import React, {Component} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../pages/Home';
import Personal from '../pages/Personal';
import Application from '../pages/Application';
import MessageCenter from '../pages/MessageCenter';

const Tab = createBottomTabNavigator();
export default class DynamicTabNavigator extends Component {
  tabScreenData = [
    {name: 'home', component: Home, options: {title: '主页'}},
    {
      name: 'messageCenter',
      component: MessageCenter,
      options: {title: '消息'},
    },
    {name: 'application', component: Application, options: {title: '应用'}},
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
