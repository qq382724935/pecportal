/*
 * @Author: 刘利军
 * @Date: 2020-08-05 16:48:57
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-08-07 10:01:31
 * @Description:
 */
import React from 'react';
import {
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';
import {resetPage} from '../utils/navigation';
const {width} = Dimensions.get('window');
export interface FAListProps {
  text: string;
  uri: string | undefined;
  type: string;
  icon: any;
  applicationType: string;
  params?: any;
  sort: number;
}
// applicationType 应用所属类别
// type 1. webview 2.page 3. plugin
// sort 0: 不显示 1：应用显示 99：全显示
export const faList: FAListProps[] = [
  {
    text: 'ECRC',
    icon: require('../assets/font14.png'),
    uri: 'WView',
    type: 'webview',
    applicationType: '子公司应用',
    sort: 99,
    params: {
      uri: 'https://ecrc.pec.com.cn/#/main/510011040421/5100/ios',
      title: 'ECRC',
    },
    // press: () => navigate('WView'),
  },
  {
    text: 'U订货',
    icon: require('../assets/font4.png'),
    uri: 'WView',
    type: 'webview',
    applicationType: '子公司应用',
    sort: 99,
    params: {uri: 'https://csmudh.upbuy.com.cn/', title: 'U订货'},
    // press: () => navigate('WView', {uri: 'https://csmudh.upbuy.com.cn/', title: 'U订货'}),
  },
  {
    text: '中台(离线)',
    icon: require('../assets/font10.png'),
    uri: 'WView',
    type: 'webview',
    applicationType: '子公司应用',
    sort: 99,
    params: {
      title: '运营中台',
      uri: 'http://shwt.pec.com.cn:8086/frontend/dianwei/index.html',
      path: 'dianwei',
    },
  },
  {
    text: 'H5',
    icon: require('../assets/font6.png'),
    uri: 'WView',
    type: 'webview',
    applicationType: '子公司应用',
    sort: 99,
    params: {
      title: 'H5',
      uri: 'http://192.168.1.194/h5/index.html',
      // uri: 'http://shwt.pec.com.cn:8086/liulijun/a.html',
      path: 'h5',
    },
  },
  {
    text: '地图',
    uri: 'amap',
    type: 'webview',
    applicationType: '子公司应用',
    icon: require('../assets/font15.png'),
    sort: 99,
  },

  {
    text: '二维码',
    uri: 'qrcode',
    type: 'page',
    applicationType: '原生服务',
    icon: require('../assets/font7.png'),
    sort: 99,
    // press: () => navigate('qrcode'),
  },
  {
    type: 'page',
    text: '设备信息',
    icon: require('../assets/font1.png'),
    uri: 'deviceinfo',
    applicationType: '原生服务',
    sort: 1,
  },
  {
    type: 'page',
    text: '目录结构',
    icon: require('../assets/font15.png'),
    uri: 'files',
    applicationType: '原生服务',
    sort: 1,
  },
  {
    type: 'page',
    text: '文本生成图片',
    icon: require('../assets/font1.png'),
    uri: 'viewshot',
    applicationType: '原生服务',
    sort: 99,
  },
  {
    type: 'page',
    text: '全部',
    icon: require('../assets/font6.png'),
    uri: 'application',
    applicationType: '全部',
    sort: 1,
  },
  {
    text: '极光分享',
    icon: require('../assets/font2.png'),
    uri: undefined,
    type: 'plugin',
    applicationType: '原生服务',
    sort: 0,
    // press: () => {
    //   const message = {
    //     platform: 'wechat_session',
    //     type: 'text',
    //     text: 'JShare test text',
    //     imagePath: '',
    //   };
    //   JShareModule.share(
    //     message,
    //     (map: any) => {
    //       console.log('share succeed, map: ' + map);
    //     },
    //     (map: any) => {
    //       console.log('share failed, map: ' + JSON.stringify(map));
    //     },
    //   );
    // },
  },
  {
    text: '相册',
    icon: require('../assets/font9.png'),
    uri: undefined,
    type: 'plugin',
    applicationType: '原生服务',
    sort: 0,
    // press: () => {
    //   openPicker()
    //     .then((image: any) => {
    //       this.props.fileDataChange(image.path);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },
  },
];

export const getAppData = (applicationType: string) => {
  return faList.filter((item) => {
    if (applicationType === '常用应用') {
      if (item.sort === 99 || item.applicationType === '全部') {
        return true;
      }
    }
    return item.applicationType === applicationType && item.sort !== 0;
  });
};

export const appRednder = (list: FAListProps[], navigation: any) => {
  return list.map((item, index: number) => (
    <TouchableOpacity
      key={index}
      onPress={() => {
        // item.press(navigation);
        switch (item.type) {
          case 'webview':
            resetPage({name: item.uri, navigation}, item.params);
            break;
          case 'page':
            resetPage({name: item.uri, navigation});
            break;
        }
      }}>
      <View style={styles.faLink}>
        <Image source={item.icon} style={{marginBottom: 2}} />
        <Text ellipsizeMode={'tail'} numberOfLines={1}>
          {item.text}
        </Text>
      </View>
    </TouchableOpacity>
  ));
};
// 新闻专区
export const JournalismList = [
  {
    title: '统一用心 武汉加油',
    text:
      '目前，新型冠状病毒感染的肺炎疫情依然持续，牵动着所有人的心。为助力在防控疫情一线的医务工作者和在各条战线上拼搏奉献的人们，截至2月26日，我们已向包括湖北省在内的全国各地累计捐赠了价值超过2000万元的产品，并向湖北省捐赠了100万元善款用于抗击疫情。    众志成城，共克时艰！统一企业将时刻关注着抗疫一线的需求，根据实际情况，结合企业资源，为疫情发生地区持续提供力所能及的帮助。 武汉加油！让我们一起打赢这场“战疫”！',
  },
  {
    title: '统一与你在一起！',
    text:
      '2019年6月17日22时55分，四川省宜宾市长宁县发生6.0级强烈地震。地震发生后，统一企业第一时间调配1600箱方便面和1300箱饮料，积极配合当地政府的抗震救灾安排，帮助灾区人民度过最艰难的时刻。',
  },
];
// 公告专区
export const noticeList = [];

// 公共路径
import {DocumentDirectoryPath, CachesDirectoryPath} from '../utils/fs';
export const FILES_PATH = `file://${DocumentDirectoryPath}`;
export const CACHES_PATH = `file://${CachesDirectoryPath}`;
export const IMAGE_PORTAL = `${FILES_PATH}/image/portal`;

const styles = StyleSheet.create({
  faLink: {
    width: width / 4,
    marginBottom: 8,
    alignItems: 'center',
  },
});

//  项目唯一key定义，避免重复
export const STORAGE_KEY = {
  LOGIN: 'USER',
};
