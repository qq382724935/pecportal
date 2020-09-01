/*
 * @Author: 刘利军
 * @Date: 2020-04-19 15:42:07
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-09-01 16:37:04
 */

import React, {Component} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../pages/Home';
import Personal from '../pages/Personal';
import Application from '../pages/Application';
import MessageCenter from '../pages/MessageCenter';
import {StatusBar, Platform, Image} from 'react-native';
import {STATUS_BAR} from '../utils/styles/common';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
const Tab = createBottomTabNavigator();
export default class DynamicTabNavigator extends Component {
  tabScreenData = [
    {name: 'home', component: Home, options: {title: '主页'}},
    // {
    //   name: 'messageCenter',
    //   component: MessageCenter,
    //   options: {title: '消息'},
    // },
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
      <>
        {Platform.OS === 'android' && (
          <StatusBar backgroundColor={STATUS_BAR} barStyle="dark-content" />
        )}
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName: any;
              switch (route.name) {
                case 'home':
                  iconName = focused ? 'home' : 'home-outline';
                  break;
                case 'messageCenter':
                  iconName = focused
                    ? 'chatbox-ellipses'
                    : 'chatbox-ellipses-outline';
                  break;
                case 'application':
                  iconName = focused ? 'grid' : 'grid-outline';
                  break;
                case 'personal':
                  iconName = focused ? 'person' : 'person-outline';
                  break;
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}>
          {this.tabScreenRender(this.tabScreenData)}
        </Tab.Navigator>
      </>
    );
  }
}
