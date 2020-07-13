/*
 * @Author: 刘利军
 * @Date: 2020-06-14 11:48:45
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-07-13 10:19:46
 * @Description:
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
// import JShareModule from 'jshare-react-native';
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

  render() {
    const {navigation} = this.props;
    let list: FAListProps[] = [
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
        text: '相册',
        uri: require('../assets/MBE风格多色图标-图片.png'),
        press: () => {
          openPicker()
            .then((image: any) => {
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
        press: () => Alert.alert('此功能已关闭'),
      },
      {
        text: '全部',
        uri: require('../assets/MBE风格多色图标-群组.png'),
        press: () => navigation.navigate('application'),
      },
    ];
    return <View style={styles.faView}>{this.appRednder(list)}</View>;
  }
}

interface NoticeProps {
  list: {title: string; text: string}[];
  title: string;
  navigation?: any;
}
class Notice extends Component<NoticeProps> {
  render() {
    const {navigation, list, title} = this.props;
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: '#d6d6d6',
          borderRadius: 10,
          marginBottom: 16,
        }}>
        <View
          style={{borderBottomWidth: 1, padding: 10, borderColor: '#d6d6d6'}}>
          <Text style={{fontSize: 12, color: 'rgba(0,0,0,.54)'}}>{title}</Text>
        </View>
        <View style={{paddingLeft: 10, paddingRight: 10}}>
          {list.length > 0 ? (
            list.map((item, index) => (
              <View
                key={index}
                style={
                  list.length - 1 === index
                    ? {paddingBottom: 8, paddingTop: 8}
                    : {
                        borderBottomWidth: 1,
                        borderColor: '#d6d6d6',
                        paddingBottom: 8,
                        paddingTop: 8,
                      }
                }>
                <Text
                  onPress={() =>
                    resetPage(
                      {name: 'journalism', navigation},
                      {text: item.text, title: item.title},
                    )
                  }
                  style={{color: '#ff6600'}}>
                  {item.title}
                </Text>
              </View>
            ))
          ) : (
            <View style={{paddingBottom: 8, paddingTop: 8}}>
              <Text>暂无新内容</Text>
              <Text
                style={{fontSize: 12, marginTop: 8, color: 'rgba(0,0,0,.54)'}}>
                有新公告会显示在此处
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}
class Home extends Component<any> {
  constructor(props: any) {
    super(props);
    // Platform.OS === 'ios' && JShareModule.setup();
  }
  list = [require('../assets/轮播1.jpg'), require('../assets/轮播2.png')];

  swiperRender = (list: any = []) =>
    list.map((item: any, index: number) => (
      <View key={index} style={styles.slide}>
        <Image style={styles.image} source={item} resizeMode="stretch" />
      </View>
    ));
  render() {
    const list = [
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

    return (
      <SafeAreaView>
        <ScrollView>
          <View style={styles.container}>
            <View style={{height: 150}}>
              <Swiper autoplay>{this.swiperRender(this.list)}</Swiper>
            </View>
            <View style={{margin: 10}}>
              <FrequentlyApp {...this.props} />
              <Notice list={list} title="新闻专区" {...this.props} />
              <Notice list={[]} title="公告专区" {...this.props} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default Home;
const styles = StyleSheet.create({
  container: {flex: 1},
  slide: {flex: 1},
  image: {width, flex: 1},
  faView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  faLink: {
    minWidth: 66,
    maxWidth: 74,
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
