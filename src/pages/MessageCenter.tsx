/*
 * @Author: 刘利军
 * @Date: 2020-04-21 15:21:03
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-09-01 17:18:38
 */
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {List} from '../components/index';
const MessageCenter = () => {
  return (
    <>
      <List.Item list={[]}></List.Item>
    </>
  );
};

export default MessageCenter;
const styles = StyleSheet.create({
  header: {flexDirection: 'row', backgroundColor: '#ffffff'},
  title: {margin: 8},
  content: {
    backgroundColor: '#ffffff',
    padding: 8,
    marginTop: 8,
  },
});
