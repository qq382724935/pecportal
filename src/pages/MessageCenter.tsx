/*
 * @Author: 刘利军
 * @Date: 2020-04-21 15:21:03
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-07-13 10:34:24
 */
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const MessageCenter = () => {
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>待办</Text>
        <Text style={styles.title}>已办</Text>
        <Text style={styles.title}>已阅</Text>
      </View>
      <View style={styles.content}>
        <Text>请查阅甲提交的流程：公告2</Text>
        <Text>时间：2020年7月13日</Text>
      </View>
      <View style={styles.content}>
        <Text>请查阅甲提交的流程：公告3</Text>
        <Text>时间：2020年4月13日</Text>
      </View>
      <View style={styles.content}>
        <Text>请查阅甲提交的流程：公告4</Text>
        <Text>时间：2020年2月8日</Text>
      </View>
      <View style={styles.content}>
        <Text>请查阅甲提交的流程：公告5</Text>
        <Text>时间：2020年4月23日</Text>
      </View>
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
