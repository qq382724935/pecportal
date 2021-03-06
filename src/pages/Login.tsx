/*
 * @Author: 刘利军
 * @Date: 2020-06-14 11:48:45
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-08-20 09:00:55
 * @Description:
 */
import React, {useState} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import {saveToken} from '../utils/storage';
import {resetHome, resetRegister} from '../utils/navigation';
import {qtData} from '../utils/sqlite';
import {STORAGE_KEY} from '../utils/common';

import {Form} from '../components/index';
import {APLSButton, TextButton} from '../components/button/index';

const Login = (props: any) => {
  const [form, setForm] = useState({username: 'admin', password: '123456'});
  const {username, password} = form;
  const loginClick = () => {
    qtData('PEC_USER', {
      data: [],
      ok: (data: any[]) => {
        if (data.length > 0) {
          saveToken({
            key: STORAGE_KEY.LOGIN,
            expires: username === 'admin' ? 1000 * 3600 : 1000 * 1800,
            data: {
              token: 'token123456',
              refreshToken: 'refreshToken123456',
              userinfo: data[0],
            },
          })
            .then(() => {
              resetHome(props);
            })
            .catch(() => {
              console.log('saveToken fail');
            });
        } else {
          Alert.alert('登录失败', '请确认账号密码是否正确！');
        }
      },
    });
  };
  return (
    <View style={styles.container}>
      <Form.Item
        defaultValue={username}
        label="账号"
        placeholder="请输入账号"
        onChange={(value: string) => setForm({...form, username: value})}
      />
      <Form.Item
        label="密码"
        defaultValue={password}
        placeholder="请输入密码"
        onChange={(value: string) => {
          setForm({...form, password: value});
        }}
      />
      <APLSButton isDisabled={!username || !password} onPress={loginClick}>
        登录
      </APLSButton>
      <View style={styles.textBtnContainer}>
        <TextButton
          onPress={() => {
            resetRegister(props);
          }}>
          新用户注册
        </TextButton>
        {/* <TextButton>忘记密码？</TextButton> */}
      </View>
    </View>
  );
};
export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  textBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
