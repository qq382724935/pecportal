/*
 * @Author: 刘利军
 * @Date: 2020-04-21 13:49:03
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-08-05 17:08:05
 */

import React from 'react';
import dva from './utils/dva';
import appModel from './models/app';
import Router from './router';
import codePush from 'react-native-code-push';
let codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_START};

const app = dva({
  initialState: {},
  models: [appModel],
  onError(e: any) {
    console.log(e);
  },
});

const App = app.start(<Router />);
export default codePush(codePushOptions)(App);
