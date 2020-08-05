/*
 * @Author: 刘利军
 * @Date: 2020-04-21 15:21:03
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-08-05 17:00:54
 */
import React from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import {resetPage} from '../utils/navigation';
const {width} = Dimensions.get('window');

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
          <Text ellipsizeMode={'tail'} numberOfLines={1}>
            {item.text}
          </Text>
        </View>
      </TouchableOpacity>
    ));
  };

  let list = [
    {
      text: '相机',
      uri: require('../assets/font13.png'),
      press: () => resetPage({name: 'cameraPhoto', navigation}),
    },
    {
      text: '地图',
      uri: require('../assets/font15.png'),
      press: () => resetPage({name: 'amap', navigation}),
    },
    {
      text: '设备信息',
      uri: require('../assets/font1.png'),
      press: () => resetPage({name: 'deviceinfo', navigation}),
    },
    {
      text: '目录结构',
      uri: require('../assets/font15.png'),
      press: () => resetPage({name: 'files', navigation}),
    },
    {
      text: '二维码',
      uri: require('../assets/font7.png'),
      press: () => resetPage({name: 'qrcode', navigation}),
    },
    {
      text: '文本生成图片文本生成图片文本生成图片',
      uri: require('../assets/font1.png'),
      press: () => resetPage({name: 'viewshot', navigation}),
    },

    // {
    //   text: '极光分享',
    //   uri: require('../assets/font2.png'),
    //   // press: () => {
    //   //   const message = {
    //   //     platform: 'wechat_session',
    //   //     type: 'text',
    //   //     text: 'JShare test text',
    //   //     imagePath: '',
    //   //   };
    //   //   JShareModule.share(
    //   //     message,
    //   //     (map: any) => {
    //   //       console.log('share succeed, map: ' + map);
    //   //     },
    //   //     (map: any) => {
    //   //       console.log('share failed, map: ' + JSON.stringify(map));
    //   //     },
    //   //   );
    //   // },
    //   press: () => Alert.alert('敬请期待!'),
    // },
  ];
  const list2 = [
    {
      text: 'ECRC',
      uri: require('../assets/font15.png'),
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
      uri: require('../assets/font4.png'),
      press: () =>
        resetPage(
          {name: 'WView', navigation},
          {uri: 'https://csmudh.upbuy.com.cn/', title: 'U订货'},
        ),
    },
    {
      text: '中台(离线)',
      uri: require('../assets/font10.png'),
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
      text: 'H5',
      uri: require('../assets/font6.png'),
      press: () =>
        resetPage(
          {name: 'WView', navigation},
          {
            title: 'H5',
            // uri: 'http://192.168.1.194:8080/a.html',
            uri: 'http://shwt.pec.com.cn:8086/liulijun/a.html',
            path: 'h5',
          },
        ),
    },
  ];
  return (
    <>
      <ScrollView>
        <View>
          <Text style={{marginTop: 8, marginLeft: 8}}>原生服务</Text>
          <View style={styles.faView}>{appRednder(list)}</View>
        </View>
        <View>
          <Text style={{marginTop: 8, marginLeft: 8}}>子公司应用</Text>
          <View style={styles.faView}>{appRednder(list2)}</View>
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
  faLink: {
    width: width / 4,
    marginBottom: 8,
    alignItems: 'center',
  },
});
