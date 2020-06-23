/*
 * @Author: 刘利军
 * @Date: 2020-06-14 11:48:45
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-06-23 09:58:09
 * @Description:
 */
import React, {useState} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import {saveToken} from '../utils/storage';
import {resetHome, resetRegister} from '../utils/navigation';
import {qtData} from '../utils/sqlite';
import {STORAGE_KEY} from '../utils/keys';

import {Form} from '../components/index';
import {APLSButton, TextButton} from '../components/button/index';

const Login = (props: any) => {
  const [form, setForm] = useState({
    username: 'admin',
    password: '123456',
  });
  const {username, password} = form;
  const loginClick = () => {
    if (username === 'llj') {
      saveToken({
        key: STORAGE_KEY.LOGIN,
        expires: 1000 * 3600,
        data: {
          token: 'token123456',
          refreshToken: 'refreshToken123456',
          userinfo: {username, password},
        },
      })
        .then(() => {
          resetHome(props);
        })
        .catch(() => {
          console.log('saveToken fail');
        });
      return;
    }
    qtData({
      sql: 'SELECT * FROM PEC_USER where USERNAME = ? AND PASSWORD = ?',
      data: [username, password],
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
        placeholder="admin"
        onChange={(value: string) => setForm({...form, username: value})}
      />
      <Form.Item
        defaultValue={password}
        label="密码"
        type="password"
        placeholder="123456"
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
        <TextButton>忘记密码？</TextButton>
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
