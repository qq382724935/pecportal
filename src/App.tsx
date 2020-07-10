/*
 * @Author: 刘利军
 * @Date: 2020-04-21 13:49:03
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-07-10 13:29:19
 */

import React from 'react';
import dva from './utils/dva';
import appModel from './models/app';
import Router from './router';
// import codePush from 'react-native-code-push';

const app = dva({
  initialState: {},
  models: [appModel],
  onError(e: any) {
    console.log(e);
  },
});

const App = app.start(<Router />);
export default App;
