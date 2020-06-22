import React from 'react';
import {create} from 'dva-core';
import {Provider} from 'react-redux';

export interface Options {
  models: any[];
  initialState: any;
  onError: (e: any) => void;
  onAction?: any[];
  extraReducers?: any;
}

export default function (options: Options) {
  const app = create(options);
  // HMR workaround
  if (!global.registered) {
    options.models.forEach((model: any) => app.model(model));
  }
  global.registered = true;

  app.start();
  const store = app._store;

  app.start = (container: any) => () => (
    <Provider store={store}>{container}</Provider>
  );

  app.getStore = () => store;

  return app;
}
