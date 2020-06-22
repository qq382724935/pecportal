/*
 * @Author: 刘利军
 * @Date: 2020-06-14 11:48:45
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-06-22 17:07:43
 * @Description:
 */
import React from 'react';
import {StyleSheet, SafeAreaView, Text} from 'react-native';
import {resetPage} from '../utils/navigation';
import {Button} from '../components/index';
const HTMLCache = ({navigation}: any) => {
  const list = [
    {
      label: 'Demo1',
      press: () =>
        resetPage(
          {name: 'WView', navigation},
          {
            title: 'Angular Demo1',
            uri: 'http://shwt.pec.com.cn:8086/liulijun/linedemo1/',
            path: 'linedemo1',
          },
        ),
    },
    {
      label: 'Demo2',
      press: () =>
        resetPage(
          {name: 'WView', navigation},
          {
            title: 'Angular Demo2',
            uri: 'http://shwt.pec.com.cn:8086/liulijun/linedemo2/',
            path: 'linedemo2',
          },
        ),
    },
  ];
  return (
    <SafeAreaView>
      {list.map((item, index) => (
        <Button.APLSButton key={index} style={styles.item} onPress={item.press}>
          <Text>{item.label}</Text>
        </Button.APLSButton>
      ))}
    </SafeAreaView>
  );
};
export default HTMLCache;
const styles = StyleSheet.create({
  item: {
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: '#d9d9d9',
  },
});
