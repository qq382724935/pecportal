/*
 * @Author: 刘利军
 * @Date: 2020-06-14 11:48:45
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-06-22 15:51:35
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
      label: '详细目录',
      press: () => resetPage({name: 'files', navigation}),
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
