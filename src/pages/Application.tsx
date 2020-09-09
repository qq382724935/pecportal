/*
 * @Author: 刘利军
 * @Date: 2020-04-21 15:21:03
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-09-09 16:57:04
 */
import React from 'react';
import {StyleSheet, ScrollView, View, Text} from 'react-native';
import {getAppData, appRednder, faList} from '../utils/common';
const FrequentlyApp = ({navigation}: any) => {
  let renderList: any[] = [];
  let dataKey: string[] = [];
  faList.map((item) => {
    if (item.applicationType !== '全部') {
      item.applicationType && dataKey.push(item.applicationType);
    }
  });
  const dataRender = () => {
    new Set(dataKey).forEach((value) => {
      renderList.push({text: value, data: getAppData(value)});
    });
    return renderList.map((item, index) => (
      <View key={index}>
        <Text style={styles.faTitle}>{item.text}</Text>
        <View style={styles.faView}>{appRednder(item.data, navigation)}</View>
      </View>
    ));
  };
  return <ScrollView>{dataRender()}</ScrollView>;
};
const Application = (props: any) => {
  return <FrequentlyApp {...props} />;
};
export default Application;
const styles = StyleSheet.create({
  faTitle: {
    marginTop: 12,
    marginLeft: 16,
    marginBottom: 12,
  },
  faView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
});
