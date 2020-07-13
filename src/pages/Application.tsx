/*
 * @Author: 刘利军
 * @Date: 2020-04-21 15:21:03
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-07-13 10:23:44
 */
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
  Alert,
} from 'react-native';
import {resetPage} from '../utils/navigation';
const FrequentlyApp = ({navigation}: any) => {
  const appRednder = (list: any[]) => {
    return list.map((item, index: number) => (
      <TouchableOpacity
        key={index}
        onPress={() => {
          item.press();
        }}>
        <View style={styles.faLink}>
          <Image source={item.uri} style={{marginBottom: 2}} />
          <Text>{item.text}</Text>
        </View>
      </TouchableOpacity>
    ));
  };

  let list = [
    {
      text: 'ECRC',
      uri: require('../assets/MBE风格多色图标-云盘.png'),
      press: () =>
        resetPage(
          {name: 'WView', navigation},
          {
            uri: 'https://ecrc.pec.com.cn/#/main/510011040421/5100/ios',
            title: 'ECRC',
          },
        ),
    },
    {
      text: 'U订货',
      uri: require('../assets/MBE风格多色图标-广播.png'),
      press: () =>
        resetPage(
          {name: 'WView', navigation},
          {uri: 'https://csmudh.upbuy.com.cn/', title: 'U订货'},
        ),
    },
    {
      text: '中台(离线)',
      uri: require('../assets/MBE风格多色图标-文档.png'),
      press: () =>
        resetPage(
          {name: 'WView', navigation},
          {
            title: '运营中台',
            uri: 'http://shwt.pec.com.cn:8086/frontend/dianwei/index.html',
            path: 'dianwei',
          },
        ),
    },
    {
      text: '设备信息',
      uri: require('../assets/MBE风格多色图标-安全.png'),
      press: () => resetPage({name: 'deviceinfo', navigation}),
    },
    {
      text: '相机',
      uri: require('../assets/MBE风格多色图标-相机.png'),
      press: () => resetPage({name: 'camera', navigation}),
    },
    {
      text: '目录机构',
      uri: require('../assets//MBE风格多色图标-指南针.png'),
      press: () => resetPage({name: 'files', navigation}),
      // press: () => Alert.alert('敬请期待！'),
    },
    {
      text: '二维码',
      uri: require('../assets/MBE风格多色图标-时间.png'),
      press: () => resetPage({name: 'qrcode', navigation}),
    },
  ];
  const list2 = [
    {
      text: '地图',
      uri: require('../assets/icon1/地图.png'),
      press: () => Alert.alert('敬请期待！'),
    },
    {
      text: '联系人',
      uri: require('../assets/icon1/联系人.png'),
      press: () => Alert.alert('敬请期待！'),
    },

    {
      text: '短信',
      uri: require('../assets/icon1/短信.png'),
      press: () => Alert.alert('敬请期待！'),
    },
    {
      text: '游览器',
      uri: require('../assets/icon1/游览器.png'),
      press: () => Alert.alert('敬请期待！'),
    },
    {
      text: '文件夹',
      uri: require('../assets/icon1/文件夹.png'),
      press: () => Alert.alert('敬请期待！'),
    },
    {
      text: '摇一摇',
      uri: require('../assets/icon1/摇一摇.png'),
      press: () => Alert.alert('敬请期待！'),
    },
    {
      text: '搜索',
      uri: require('../assets/icon1/搜索.png'),
      press: () => Alert.alert('敬请期待！'),
    },
    {
      text: '邮箱',
      uri: require('../assets/icon1/邮箱.png'),
      press: () => Alert.alert('敬请期待！'),
    },
    {
      text: '计算器',
      uri: require('../assets/icon1/计算器.png'),
      press: () => Alert.alert('敬请期待！'),
    },
  ];
  const list3 = [
    {
      text: 'ECRC',
      uri: require('../assets/MBE风格多色图标-云盘.png'),
      press: () =>
        resetPage(
          {name: 'WView', navigation},
          {
            uri: 'https://ecrc.pec.com.cn/#/main/510011040421/5100/ios',
            title: 'ECRC',
          },
        ),
    },
    {
      text: 'U订货',
      uri: require('../assets/MBE风格多色图标-广播.png'),
      press: () =>
        resetPage(
          {name: 'WView', navigation},
          {uri: 'https://csmudh.upbuy.com.cn/', title: 'U订货'},
        ),
    },
    {
      text: '中台(离线)',
      uri: require('../assets/MBE风格多色图标-文档.png'),
      press: () =>
        resetPage(
          {name: 'WView', navigation},
          {
            title: '运营中台',
            uri: 'http://shwt.pec.com.cn:8086/frontend/dianwei/index.html',
            path: 'dianwei',
          },
        ),
    },
    {
      text: '运营app',
      uri: require('../assets/icon1/文件夹.png'),
      press: () => Alert.alert('敬请期待！'),
    },
    {
      text: 'up售货机',
      uri: require('../assets/icon1/音乐.png'),
      press: () => Alert.alert('敬请期待！'),
    },
  ];
  return (
    <>
      <View>
        <Text style={{marginTop: 8, marginLeft: 8}}>常用应用</Text>
        <View style={styles.faView}>{appRednder(list)}</View>
      </View>
      <View>
        <Text style={{marginTop: 8, marginLeft: 8}}>子公司应用</Text>
        <View style={styles.faView}>{appRednder(list3)}</View>
      </View>
      <View>
        <Text style={{marginTop: 8, marginLeft: 8}}>其它应用</Text>
        <View style={styles.faView}>{appRednder(list2)}</View>
      </View>
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
  faLink: {
    minWidth: 66,
    maxWidth: 74,
    marginBottom: 8,
    alignItems: 'center',
  },
});
