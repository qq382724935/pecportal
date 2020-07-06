/*
 * @Author: 刘利军
 * @Date: 2020-06-14 11:48:45
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-07-06 10:03:58
 * @Description:
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Dimensions,
  Image,
  Text,
  TouchableHighlight,
} from 'react-native';
import JShareModule from 'jshare-react-native';
import Swiper from 'react-native-swiper';
import {resetPage} from '../utils/navigation';
import {openPicker} from '../utils/cameraroll';

interface HomeProps {
  navigation: any;
}
const {width} = Dimensions.get('window');

interface FAListProps {
  text: string;
  uri: any;
  press: () => void;
}
class FrequentlyApp extends Component<any> {
  appRednder = (list: FAListProps[]) => {
    return list.map((item, index: number) => (
      <TouchableHighlight
        onPress={() => {
          item.press();
        }}>
        <View style={styles.faLink} key={index}>
          <Image source={item.uri} style={{marginBottom: 2}} />
          <Text>{item.text}</Text>
        </View>
      </TouchableHighlight>
    ));
  };

  render() {
    const {navigation} = this.props;
    console.log('navigation', navigation);
    let list: FAListProps[] = [
      {
        text: 'ECRC',
        uri: require('../assets/MBE风格多色图标-云盘.png'),
        press: () => resetPage({name: 'qrcode', navigation}),
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
        text: '定位',
        uri: require('../assets//MBE风格多色图标-指南针.png'),
        press: () => resetPage({name: 'bdmap', navigation}),
      },
      {
        text: '资源目录',
        uri: require('../assets/MBE风格多色图标-文档.png'),
        press: () => resetPage({name: 'files', navigation}),
      },
      {
        text: '相册',
        uri: require('../assets/MBE风格多色图标-图片.png'),
        press: () => {
          openPicker()
            .then((image: any) => {
              console.log('image', image);
              this.props.fileDataChange(image.path);
            })
            .catch((error) => {
              console.log(error);
            });
        },
      },
      {
        text: '二维码',
        uri: require('../assets/MBE风格多色图标-时间.png'),
        press: () => resetPage({name: 'qrcode', navigation}),
      },
      {
        text: '极光分享',
        uri: require('../assets/MBE风格多色图标-分享.png'),
        press: () => {
          const message = {
            platform: 'wechat_session',
            type: 'text',
            text: 'JShare test text',
            imagePath: '',
          };
          JShareModule.share(
            message,
            (map: any) => {
              console.log('share succeed, map: ' + map);
            },
            (map: any) => {
              console.log('share failed, map: ' + JSON.stringify(map));
            },
          );
        },
      },
      {
        text: '公司新闻',
        uri: require('../assets/MBE风格多色图标-广播.png'),
        press: () => resetPage({name: 'qrcode', navigation}),
      },
      {
        text: '全部',
        uri: require('../assets/MBE风格多色图标-群组.png'),
        press: () => resetPage({name: 'qrcode', navigation}),
      },
    ];
    return <View style={styles.faView}>{this.appRednder(list)}</View>;
  }
}
class Home extends Component<any> {
  constructor(props: any) {
    super(props);
    Platform.OS === 'ios' && JShareModule.setup();
  }
  list = [require('../assets/轮播1.jpeg'), require('../assets/轮播3.jpeg')];
  swiperRender = (list: any = []) =>
    list.map((item: any, index: number) => (
      <View key={index} style={styles.slide}>
        <Image style={styles.image} source={item} />
      </View>
    ));
  render() {
    return (
      <View style={styles.container}>
        <View style={{height: 150}}>
          <Swiper style={styles.wrapper} autoplay>
            {this.swiperRender(this.list)}
          </Swiper>
        </View>
        <FrequentlyApp {...this.props} />
      </View>
    );
  }
}

export default Home;
const styles = StyleSheet.create({
  container: {flex: 1},
  wrapper: {marginBottom: 8},
  slide: {flex: 1},
  image: {width, flex: 1},
  faView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faLink: {
    borderWidth: 1,
    borderColor: '#FFF',
    width: 66,
    marginLeft: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
});

// const list = [
//   {
//     label: '极光推送registerID',
//     press: () => {
//       JPush.getRegistrationID((result) =>
//         Alert.alert('registerID:' + JSON.stringify(result)),
//       );
//     },
//   },
//   {
//     label: '文本转图片',
//     press: () => resetPage({name: 'viewshot', navigation}),
//   },

//   {
//     label: '百度地图',
//     press: () => resetPage({name: 'bdmap', navigation}),
//   },
// ];
