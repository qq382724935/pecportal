import React, {useState, useEffect} from 'react';
import {View, Alert, StyleSheet, SafeAreaView} from 'react-native';
import {OTHER_COLOR, BorderColor, FS18} from '../../utils/styles/common';
import {DefaultProps, ListItemProps} from '../../types/common';
import {connect} from 'react-redux';
import {List, ModalCustom} from '../../components/index';
import {clearCache, getCacheSize} from '@yz1311/react-native-http-cache';
import {loadToken, removeToken} from '../../utils/storage';
import {STORAGE_KEY} from '../../utils/common';
import {resetLogin} from '../../utils/navigation';
interface SettingProps extends DefaultProps {}

const LOGIN_MODAL = 'unlogin';
const CACHE_MODAL = 'cache';
const CACHE_LOADING = 'loading';
const ACCOUNT_MODAL = 'account';
let isLoading = false;
const Setting = ({navigation}: SettingProps) => {
  const cacheSizeData = async () => {
    await getCacheSize().then((value) => {
      setcacheSize(value);
    });
  };
  const [userName, setuserName] = useState('');
  const [cacheSize, setcacheSize] = useState(0);
  const [modelType, setModal] = useState('');

  useEffect(() => {
    loadToken({key: STORAGE_KEY.LOGIN})
      .then(({userinfo}) => {
        setuserName(userinfo.USERNAME);
      })
      .catch(() => {});
    cacheSizeData();
  }, [userName, cacheSize]);

  const UnLogin = () => {
    return userName ? (
      <View>
        <List.Item
          textAlign="center"
          list={[
            {
              content: '切换账号',
              press: () => setModal(ACCOUNT_MODAL),
            },
            {
              content: `退出登录`,
              press: () => setModal(LOGIN_MODAL),
            },
          ]}
        />
      </View>
    ) : null;
  };
  const data: ListItemProps[] = [
    {
      text: '清除缓存',
      other: `${(cacheSize / 1000000).toFixed(2)}MB`,
      press: () => setModal(CACHE_MODAL),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ModalCustom.Loading
        text="正在清理..."
        modalVisible={modelType === CACHE_LOADING}
      />
      <View style={{marginBottom: 20}}>
        <List.Item list={data} />
      </View>
      <UnLogin />
      <ModalCustom.Bottom
        title="确认要退出登录吗"
        modalVisible={modelType === LOGIN_MODAL}
        contrim={() => {
          removeToken({key: STORAGE_KEY.LOGIN}).then(() => {
            setModal('');
            resetLogin({navigation}, true);
          });
        }}
        cancel={() => setModal('')}
      />
      <ModalCustom.Bottom
        title="确认要清除缓存吗"
        modalVisible={modelType === CACHE_MODAL}
        modalHide={() => {
          if (isLoading) {
            setModal(CACHE_LOADING);
            clearCache().then(async () => {
              await cacheSizeData();
              setModal('');
            });
          }
        }}
        contrim={() => {
          isLoading = true;
          setModal('');
        }}
        cancel={() => {
          isLoading = false;
          setModal('');
        }}
      />
      <ModalCustom.Bottom
        title="切换账号"
        modalVisible={modelType === ACCOUNT_MODAL}
        contentList={[
          {text: '商户1', press: () => setModal('')},
          {text: '商户2', press: () => setModal('')},
        ]}
        contrim={() => {}}
        cancel={() => setModal('')}
      />
    </SafeAreaView>
  );
};

const mapStateToProps = ({app, router}: any) => ({app, router});
export default connect(mapStateToProps)(Setting);

const styles = StyleSheet.create({
  container: {flex: 1},
});
