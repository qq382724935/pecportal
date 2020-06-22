/*
 * @Author: 刘利军
 * @Date: 2020-05-20 17:03:46
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-06-22 16:05:50
 */

import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {
  getDeviceId,
  getSystemVersion,
  getSystemName,
  getPhoneNumber,
  getBuildId,
  getModel,
  getCarrier,
} from 'react-native-device-info';

import NetInfo from '@react-native-community/netinfo';

import {ItemData} from '../types/common';

const renderItem = (item: ItemData, index: string) => {
  return (
    <View key={index}>
      <View style={{flexDirection: 'row', marginTop: 8, marginLeft: 8}}>
        <Text style={{fontSize: 18}}>{item.label}：</Text>
        <Text style={{fontSize: 18}}>{item.value}</Text>
      </View>
      <View style={{marginLeft: 16}}>
        {item.list &&
          item.list.map((listItem, listIndex) => {
            return renderItem(listItem, `${index}${listIndex}`);
          })}
      </View>
    </View>
  );
};
class DeviceInfo extends Component {
  state: any = {phoneNumber: null, buildId: null, netInfoState: {}};
  unsubscribe: any;

  componentDidMount() {
    getPhoneNumber().then((phoneNumber) => this.setState({phoneNumber}));
    getBuildId().then((buildId) => this.setState({buildId}));
    getCarrier().then((carrier) => this.setState({carrier}));
    this.unsubscribe = NetInfo.addEventListener((netInfoState) => {
      this.setState({netInfoState});
    });
  }
  UNSAFE_componentWillMount() {
    this.unsubscribe && this.unsubscribe();
  }
  render() {
    const {
      phoneNumber,
      buildId,
      carrier,
      netInfoState: {type, isConnected, isInternetReachable, details},
    } = this.state;

    const list: ItemData[] = [
      {label: '设备唯一ID(标识码)', value: getDeviceId()},
      {label: '设备型号', value: getModel()},
      {label: '设备操作系统名称', value: getSystemName()},
      {label: '设备操作系统版本', value: getSystemVersion()},
      {label: '操作系统内部版本号', value: buildId},
      {label: '设备电话号码', value: phoneNumber},
      {label: '运营商名称', value: carrier},
    ];
    const list2: ItemData[] = [
      {label: '是否存在网络连接', value: `${isConnected}`},
      {label: '网络连接可以访问Internet', value: `${isInternetReachable}`},
      {
        label: '网络连接类型',
        value: type,
        list: [
          {label: 'none', value: '没有网络连接处于活动状态'},
          {label: 'unknown', value: '网络状态无法确定或尚未确定'},
          {
            label: 'cellular',
            value: '蜂窝网络',
            list: [
              {
                label: '网络运营商名称',
                value: `${details && details.carrier}`,
              },
              {
                label: '蜂窝网络类型',
                value: `${details && details.cellularGeneration}`,
              },
            ],
          },
          {label: 'wifi', value: '无线网络上的活动网络'},
          {label: 'ethernet', value: '有线以太网上的活动网络'},
          {label: 'bluetooth', value: '蓝牙活动网络'},
          {label: 'wimax', value: '通过VPN的活动网络'},
          {label: 'other', value: '另一类网络上的活动网络'},
        ],
      },
    ];
    return (
      <View>
        {list.map((item, index) => renderItem(item, `list1${index}`))}
        {list2.map((item, index) => renderItem(item, `list2${index}`))}
      </View>
    );
  }
}

export default DeviceInfo;
