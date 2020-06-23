import React from 'react';
import {ItemData} from '../types/common';
import {List} from '../components/index';

import RNFS, {
  CachesDirectoryPath,
  MainBundlePath,
  DocumentDirectoryPath,
  LibraryDirectoryPath,
  OS,
} from '../utils/fs';

const params = '/zt/portal/llj';

const catalog: ItemData[] = [
  {
    label: '缓存目录绝对路径：',
    value: CachesDirectoryPath,
    type: 'all',
  },
  {
    label: '文件目录绝对路径：',
    value: DocumentDirectoryPath,
    type: 'all',
  },
  {
    label: '主包目录绝对路径(ios)',
    value: MainBundlePath,
    type: 'ios',
  },
  {
    label: 'NSLibraryDirectory的绝对路径(ios)',
    value: LibraryDirectoryPath,
    type: 'ios',
  },
  {
    label: '外部缓存目录绝对路径(android)：',
    value: RNFS.ExternalCachesDirectoryPath,
    type: 'android',
  },
  {
    label: '临时目录绝对路径(android)',
    value: RNFS.TemporaryDirectoryPath,
    type: 'android',
  },
  {
    label: '下载目录绝对路径(android)',
    value: RNFS.DownloadDirectoryPath,
    type: 'android',
  },
  {
    label: '外部文件的绝对路径，共享目录(android)',
    value: RNFS.ExternalDirectoryPath,
    type: 'android',
  },
  {
    label: '外部存储共享目录的绝对路径(android)',
    value: RNFS.ExternalStorageDirectoryPath,
    type: 'android',
  },

  {
    label: '参数路径：',
    value: params,
  },
];
const Files = () => {
  return (
    <>
      <List.Item
        list={catalog.filter((item) =>
          item.type === 'all' ? true : item.type === OS,
        )}
        selectable={true}
      />
    </>
  );
};

export default Files;
