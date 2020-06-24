/*
 * @Author: 刘利军
 * @Date: 2020-06-14 11:48:45
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-06-24 13:33:44
 * @Description:
 */
import React from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';
import {resetPage} from '../utils/navigation';
import {Button} from '../components/index';
import JPush from 'jpush-react-native';

const Home = (props: any) => {
  const {navigation} = props;
  const list = [
    {
      label: '设备信息',
      press: () => resetPage({name: 'deviceinfo', navigation}),
    },
    {
      label: '资源目录',
      press: () => resetPage({name: 'files', navigation}),
    },
    {
      label: '相机',
      press: () => resetPage({name: 'camera', navigation}),
    },
    {
      label: '二维码',
      press: () => resetPage({name: 'qrcode', navigation}),
    },
    {
      label: '极光推送registerID',
      press: () => {
        JPush.getRegistrationID((result) =>
          Alert.alert('registerID:' + JSON.stringify(result)),
        );
      },
    },
    {
      label: '极光分享',
      press: () => {},
    },
  ];
  return (
    <View>
      {list.map((item, index) => (
        <Button.APLSButton key={index} style={styles.item} onPress={item.press}>
          <Text>{item.label}</Text>
        </Button.APLSButton>
      ))}
    </View>
  );
};
export default Home;
const styles = StyleSheet.create({
  item: {
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: '#d9d9d9',
  },
});
