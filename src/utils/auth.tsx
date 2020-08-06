import {loadToken, saveToken} from './storage/index';
import {STORAGE_KEY} from './keys';
import {DocumentDirectoryPath, downloadFile, unlink, exists} from '../utils/fs';

import {unzip} from './zip';
export const pecJson = require('../assets/pec.json');
// 初始化路由
export const auth = async () => {
  const advertising = await loadToken({key: 'config'})
    .then((value) => value)
    .catch(() => {});
  if (advertising) {
    if (advertising.show) {
      return {checkLogin: true, initialRouteName: 'advertising'};
    }
  } else {
    if (pecJson) {
      await saveToken({key: 'config', data: pecJson.appConfig.advertising});
      return {checkLogin: true, initialRouteName: 'advertising'};
    }
  }

  let initialRouteName = await loadToken({key: STORAGE_KEY.LOGIN})
    .then(() => 'main')
    .catch(() => 'login');
  return {checkLogin: true, initialRouteName};
};

/**
 * @description: H5(web)应用下载
 * @param {pList} 包名
 * @return:
 */
export const webApp = async (FPATH: string) => {
  const toFile = `${DocumentDirectoryPath}/${FPATH}`;

  const isExists = await exists(
    `${DocumentDirectoryPath}/${FPATH.split('.zip')[0]}`,
  );
  if (isExists) {
    return;
  }
  await downloadFile({
    fromUrl: `http://shwt.pec.com.cn:8086/liulijun/${FPATH}`,
    toFile,
  })
    .promise.then((res) => {
      console.log(`${FPATH}下载成功：`, res);
    })
    .catch((error) => {
      console.log(`${FPATH}下载失败：`, error);
    });
  await unzip(toFile, DocumentDirectoryPath).then(() => unlink(toFile));
};
