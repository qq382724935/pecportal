/*
 * @Author: 刘利军
 * @Date: 2020-06-14 11:48:45
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-08-26 17:18:55
 * @Description:
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Text,
  SafeAreaView,
  ScrollView,
} from 'react-native';
// import JShareModule from 'jshare-react-native';
import Swiper from 'react-native-swiper';
import {resetPage} from '../utils/navigation';
import {checkForUpdate} from '../utils/CodePushUtils';
import {
  JournalismList,
  noticeList,
  getAppData,
  appRednder,
} from '../utils/common';
import {connect} from 'react-redux';

interface HomeProps {
  navigation: any;
  dispatch: any;
}
const {width} = Dimensions.get('window');

class FrequentlyApp extends Component<any> {
  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.faView}>
        {appRednder(getAppData('常用应用'), navigation)}
      </View>
    );
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
class Home extends Component<HomeProps> {
  constructor(props: Readonly<HomeProps>) {
    super(props);
    // Platform.OS === 'ios' && JShareModule.setup();
  }
  Sceenlist = [require('../assets/轮播1.jpg'), require('../assets/轮播2.png')];
  swiperRender = (swiper: any = []) =>
    swiper.map((item: any, index: number) => (
      <View key={index} style={styles.slide}>
        <Image style={styles.image} source={item} resizeMode="stretch" />
      </View>
    ));
  componentDidMount() {
    checkForUpdate(this.props.dispatch, true);
  }
  render() {
    return (
      <SafeAreaView>
        <ScrollView>
          <View style={styles.container}>
            <View style={{height: 150}}>
              <Swiper autoplay>{this.swiperRender(this.Sceenlist)}</Swiper>
            </View>
            <FrequentlyApp {...this.props} />
            <View style={{margin: 10}}>
              <Notice list={JournalismList} title="新闻专区" {...this.props} />
              <Notice list={noticeList} title="公告专区" {...this.props} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({app, router}: any) => ({app, router});
export default connect(mapStateToProps)(Home);
const styles = StyleSheet.create({
  container: {flex: 1},
  slide: {flex: 1},
  image: {width, flex: 1},
  faView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  faLink: {
    width: width / 4,
    marginBottom: 8,
    alignItems: 'center',
  },
});
