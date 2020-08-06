/*
 * @Author: 刘利军
 * @Date: 2020-04-21 15:21:03
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-08-06 15:40:15
 */
import React from 'react';
import {StyleSheet, ScrollView, View, Text} from 'react-native';
import {getAppData, appRednder} from '../utils/common';
const FrequentlyApp = ({navigation}: any) => {
  const list = getAppData('原生服务');
  const list2 = getAppData('子公司应用');
  return (
    <>
      <ScrollView>
        <View>
          <Text style={{marginTop: 8, marginLeft: 8}}>原生服务</Text>
          <View style={styles.faView}>{appRednder(list, navigation)}</View>
        </View>
        <View>
          <Text style={{marginTop: 8, marginLeft: 8}}>子公司应用</Text>
          <View style={styles.faView}>{appRednder(list2, navigation)}</View>
        </View>
      </ScrollView>
    </>
  );
};
const Application = (props: any) => {
  return (
    <>
      <FrequentlyApp {...props} />
    </>
  );
};

export default Application;
const styles = StyleSheet.create({
  faView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 8,
  },
});
