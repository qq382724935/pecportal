/*
 * @Author: 刘利军
 * @Date: 2020-06-14 11:48:45
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-06-23 09:27:41
 * @Description:
 */
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {resetPage} from '../utils/navigation';
import {Button} from '../components/index';

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
    // {
    //   label: '相机功能',
    //   press: () => resetPage({name: 'files', navigation}),
    // },
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
