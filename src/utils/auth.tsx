import {loadToken} from './storage/index';
import {STORAGE_KEY} from './keys';
import {
  // DocumentDirectoryPath,
  CachesDirectoryPath,
  downloadFile,
  unlink,
  exists,
} from '../utils/fs';
// import config from '../httpconfig';

import {unzip} from './zip';

export const auth = async () => {
  let initialRouteName = await loadToken({key: STORAGE_KEY.LOGIN})
    .then(() => 'main')
    .catch(() => 'login');

  const advert = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(false);
    }, 0);
  });
  if (advert) {
    initialRouteName = 'welcome';
  }
  return {checkLogin: true, initialRouteName};
};

/**
 * @description: H5(web)应用下载
 * @param {pList} 包名
 * @return:
 */
export const webApp = async (FPATH: string) => {
  const toFile = `${CachesDirectoryPath}/${FPATH}`;

  const isExists = await exists(
    `${CachesDirectoryPath}/${FPATH.split('.zip')[0]}`,
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
  await unzip(toFile, CachesDirectoryPath).then(() => unlink(toFile));
};
