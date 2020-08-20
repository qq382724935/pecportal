import React, {useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';

import {ExecuteError} from '../types/sqlite';

import {resetBack} from '../utils/navigation';
import {atData} from '../utils/sqlite';

import {Form} from '../components/index';
import {APLSButton} from '../components/button/index';

const Register = (props: any) => {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const {username, password} = form;
  const registerClick = () => {
    atData('PEC_USER', {
      data: [
        {label: 'username', value: username},
        {label: 'password', value: password},
      ],
      ok: () => {
        Alert.alert('账号申请', '注册成功，前往登录页登录！', [
          {
            text: '取消',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: '确定',
            onPress: () => resetBack(props),
          },
        ]);
      },
      error: (err: ExecuteError) => {
        if (err.message === 'UNIQUE constraint failed: PEC_USER.USERNAME') {
          Alert.alert('注册失败，账号已存在！');
        } else {
          Alert.alert('注册失败');
        }
      },
    });
  };
  return (
    <View style={styles.container}>
      <Form.Item
        label="用户名"
        placeholder="请输入用户名"
        onChange={(value: string) => setForm({...form, username: value})}
      />
      <Form.Item
        label="密码"
        type="password"
        placeholder="请输入密码"
        onChange={(value: string) => setForm({...form, password: value})}
      />
      <APLSButton isDisabled={!username || !password} onPress={registerClick}>
        注册
      </APLSButton>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  textBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
