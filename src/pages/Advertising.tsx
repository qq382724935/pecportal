/*
 * @Author: 刘利军
 * @Date: 2020-06-14 11:48:45
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-09-09 08:38:52
 * @Description:
 */
import React, {useEffect, useState} from 'react';
import {View, Image, Text, StyleSheet, Platform} from 'react-native';
import {resetHome} from '../utils/navigation';
import {loadToken} from '../utils/storage/index';
import {STORAGE_KEY, pecJson} from '../utils/common';
let go = false; // 判断是否点击过跳过
const Advert = ({navigation}: any) => {
  let {showTime, skipTime, url} = pecJson.appConfig.advertising;
  const [skip, setskip] = useState(skipTime / 1000);
  const goPage = () => {
    if (!go) {
      loadToken({key: STORAGE_KEY.LOGIN})
        .then(() => {
          resetHome({navigation, name: 'main'});
        })
        .catch(() => {
          resetHome({navigation, name: 'login'});
        });
    }
    go = true;
  };
  useEffect(() => {
    const cleanSkipTime = setTimeout(() => {
      if (skip > 0) {
        setskip(skip - 1);
      }
    }, 1000);
    const cleanTime = setTimeout(() => {
      goPage();
    }, showTime - skipTime);
    return () => {
      clearTimeout(cleanTime);
      clearTimeout(cleanSkipTime);
      go = false;
    };
  }, [skip]);
  return (
    <View style={styles.container}>
      {skip <= 0 && (
        <View style={styles.bulr}>
          <Text
            style={{color: '#fff'}}
            onPress={() => {
              goPage();
            }}>
            跳过
          </Text>
        </View>
      )}
      <Image
        style={styles.image}
        source={{
          uri: url,
        }}
      />
    </View>
  );
};

const Advertising = (props: any) => <Advert {...props} />;

export default Advertising;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bulr: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 68,
    minHeight: 38,
    top: Platform.OS === 'ios' ? 68 : 28,
    right: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  textCustom: {
    color: '#fdffff',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    fontWeight: 'bold',
  },
  image: {
    flex: 1,
    zIndex: -1,
  },
});
