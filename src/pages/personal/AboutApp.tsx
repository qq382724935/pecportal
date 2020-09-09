import React from 'react';
import {View, Image, Alert, Text, StyleSheet, SafeAreaView} from 'react-native';
import {List} from '../../components/index';
import {getVersion} from 'react-native-device-info';
import {OTHER_COLOR, BorderColor, FS18} from '../../utils/styles/common';
import {checkForUpdate} from '../../utils/CodePushUtils';
import {DefaultProps, ListItemProps} from '../../types/common';
import {AppIcon} from '../../utils/common';
import {connect} from 'react-redux';
interface AboutAppProps extends DefaultProps {}
const AboutApp = ({dispatch}: AboutAppProps) => {
  const data: ListItemProps[] = [
    {
      text: '版本升级',
      press: () => checkForUpdate(dispatch),
    },
    {
      text: '证照信息',
      press: () => {
        Alert.alert('暂无功能可使用');
      },
    },
    {
      text: '软件许可及服务协议',
      press: () => {
        Alert.alert('暂无功能可使用');
      },
    },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <View style={styles.app}>
          <Image style={styles.appIcon} source={AppIcon} />
          <Text style={styles.version}>版本号 {getVersion()}</Text>
        </View>
        <List.Item list={data} />
      </View>
      <View style={styles.copyright}>
        <Text>统一公司 版权所有</Text>
        <Text>Copyright © 2020-{new Date().getFullYear().toString()}</Text>
      </View>
    </SafeAreaView>
  );
};
const mapStateToProps = ({app, router}: any) => ({app, router});
export default connect(mapStateToProps)(AboutApp);

const styles = StyleSheet.create({
  container: {flex: 1},
  app: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: BorderColor,
  },
  appIcon: {
    width: 88,
    height: 88,
    borderRadius: 10,
    marginBottom: 10,
  },
  version: {color: OTHER_COLOR, fontSize: FS18},
  copyright: {
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
