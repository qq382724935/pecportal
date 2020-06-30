/*
 * @Author: 刘利军
 * @Date: 2020-06-14 11:48:45
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-06-30 10:19:36
 * @Description:
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, Alert, Platform} from 'react-native';
import {resetPage} from '../utils/navigation';
import {Button} from '../components/index';
import JPush from 'jpush-react-native';
import JShareModule from 'jshare-react-native';

interface HomeProps {
  navigation: any;
}

class Home extends Component<any> {
  constructor(props: any) {
    super(props);
    Platform.OS === 'ios' && JShareModule.setup();
  }
  render() {
    const {navigation} = this.props;
    const list = [
      {
        label: '二维码',
        press: () => resetPage({name: 'qrcode', navigation}),
      },
      {
        label: '设备信息',
        press: () => resetPage({name: 'deviceinfo', navigation}),
      },
      {
        label: '资源目录',
        press: () => resetPage({name: 'files', navigation}),
      },
      {
        label: '极光推送registerID',
        press: () => {
          JPush.getRegistrationID((result) =>
            Alert.alert('registerID:' + JSON.stringify(result)),
          );
        },
      },
      {
        label: '广告配置(文件读写)',
        press: () => resetPage({name: 'advertising', navigation}, {type: true}),
      },
      {
        label: '文本转图片',
        press: () => resetPage({name: 'viewshot', navigation}),
      },
      {
        label: '相机',
        press: () => resetPage({name: 'camera', navigation}),
      },
      {
        label: '第三方平台(微信)分享',
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
    ];
    return (
      <View>
        {list.map((item, index) => (
          <Button.APLSButton
            key={index}
            style={styles.item}
            onPress={item.press}>
            <Text>{item.label}</Text>
          </Button.APLSButton>
        ))}
      </View>
    );
  }
}

export default Home;
const styles = StyleSheet.create({
  item: {
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: '#d9d9d9',
  },
});
