/*
 * @Author: 刘利军
 * @Date: 2020-08-05 16:48:57
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-08-26 16:57:43
 * @Description:
 */
import React from 'react';
import {
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';
import {resetPage} from './navigation';
import {
  DocumentDirectoryPath,
  CachesDirectoryPath,
  exists,
  mkdir,
  copyFile,
  downloadFile,
  DownloadFileOptions,
  writeFile,
  readFile,
  moveFile,
} from './fs';

import {
  getDeviceId,
  getSystemVersion,
  getSystemName,
  getModel,
} from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';

const {width} = Dimensions.get('window');
import {FileDataProps} from './webview';
// 原生调用插件默认值
export const INIT_DATA = {initData: {pageType: '1'}};

/** 公共 */

export const FILES_PATH = `file://${DocumentDirectoryPath}`;
export const CACHES_PATH = `file://${CachesDirectoryPath}`;

export const PATH_CONF = `${FILES_PATH}/conf`; // 配置文件目录 长期存放 原生壳 自身的配置文件
export const PATH_WEBVIEW = `${FILES_PATH}/webview`; // WEBVIEW目录 长期存放 需要在原生壳中实现 离线应用的前端h5工程包
export const PATH_AUDIO = `${FILES_PATH}/audio`; // 音频目录 长期存放 原生壳 及 各业务中台 需要使用的音频类型的文件

export const PATH_ICON = `${FILES_PATH}/icon`; // 图标目录，长期存放 原生壳提供给所有app需要用到的图标
export const PATH_IMAGE = `${FILES_PATH}/image`; // 图片目录 长期存放 原生壳 及 各业务中台 需要使用的图片类型的文件
export const PATH_IMAGE_THUMBNAIL = `${FILES_PATH}/image_thumbnail`; // 缩略图文件目录 长期存放 原生壳 及 各业务中台 需要使用的图片之缩略图类型的文件

export const PATH_VIDEO = `${FILES_PATH}/video`; // 视件目录 长期存放 原生壳 及 各业务中台 需要使用的视频类型的文件
export const PATH_DOWNLOAD = `${FILES_PATH}/download`; // 下载目录 长期存放 原生壳 及 各业务中台 所下载的文件
export const PATH_LOG = `${FILES_PATH}/log`; // 日志目录 长期存放 原生壳 及 各业务中台 的日志类型的文件
export const PATH_OTHERS = `${FILES_PATH}/others`; // 其它目录 长期存放 原生壳 及 各业务中台 其它类型的文件（即：文件未被包含在上述所列的文件类型中）

export const PATH_IMAGE_PORTAL = `${PATH_IMAGE}/portal`; // 图片文件壳子存放目录

export const getAppData = (applicationType: string) => {
  return faList.filter((item) => {
    if (applicationType === '常用应用') {
      if (item.sort === 99 || item.applicationType === '全部') {
        return true;
      }
    }
    return item.applicationType === applicationType && item.sort !== 0;
  });
};

export const appRednder = (list: FAListProps[], navigation: any) => {
  return list.map((item, index: number) => (
    <TouchableOpacity
      key={index}
      onPress={() => {
        // item.press(navigation);
        switch (item.type) {
          case 'webview':
            resetPage({name: item.uri, navigation}, item.params);
            break;
          case 'page':
            resetPage({name: item.uri, navigation}, item.params);
            break;
        }
      }}>
      <View style={styles.faLink}>
        <Image source={item.icon} style={{marginBottom: 2}} />
        <Text ellipsizeMode={'tail'} numberOfLines={1}>
          {item.text}
        </Text>
      </View>
    </TouchableOpacity>
  ));
};

// 把cache目录下的文件copy到files。优化可直接移动
export const cacheCopyfiles = async (
  data: string[],
  filePath: string = PATH_IMAGE_PORTAL, // 默认是目录是图片下的壳子目录
) => {
  const isImagePath = await exists(filePath).then((res) => res);
  if (!isImagePath) {
    await mkdir(filePath);
  }
  return data.map((item) => {
    const itemS = item.split('/');
    const destPath = `${filePath}/${itemS[itemS.length - 1]}`;
    copyFile(item, destPath);
    return destPath;
  });
};

// 文件移动
export const moveFiles = async (
  data: string[],
  destPath: string,
  fileName: string[] = [],
) => {
  const isImagePath = await exists(destPath).then((res) => res);
  if (!isImagePath) {
    await mkdir(destPath);
  }
  return data.map((item, index) => {
    // 取item的文件名
    const itemS = item.split('/');
    let fName = itemS[itemS.length - 1];
    // H5传文件名称时，使用传过来的名称
    if (fileName.length > 0) {
      fName = fileName[index];
    }
    destPath = `${destPath}/${fName}`;
    moveFile(item, destPath)
      .then((res) => console.log(`common moveFiles res ${res}`))
      .catch((err) => console.log(`common moveFiles err ${err}`));
    return destPath;
  });
};

export const download = async (params: DownloadFileOptions, path: string) => {
  try {
    const isExists = await exists(path);
    if (!isExists) {
      await mkdir(path);
    }
  } catch (error) {
    return error;
  }
  return await downloadFile(params).promise;
};
// 文件名和文件名类型拼接， 例：name=a,type=json，return=a.json
export const fileNameSplit = ({name, type}: FileDataProps) => `${name}.${type}`;
// 数据写入文件
export const writeFileE = async (
  fixedPath: string,
  fileData: FileDataProps,
  jsonData: Object & string,
) => {
  const {path, type} = fileData;
  if (type === 'json') {
    if (Object.prototype.toString.call(jsonData) !== '[object Object]') {
      return new Promise((resolve, reject) => {
        reject({
          code: 211,
          filePath: `创建${type}类型文件：jsonData数据必须为一个对象,请确认!`,
        });
      });
    } else if (Object.keys(jsonData).length === 0) {
      return new Promise((resolve, reject) => {
        reject({
          code: 211,
          filePath: `创建${type}类型文件：jsonData数据不能为空对象,请确认!`,
        });
      });
    }
  } else if (type === 'text' || type === 'txt') {
    if (typeof jsonData !== 'string') {
      return new Promise((resolve, reject) => {
        reject({
          code: 211,
          filePath: `创建${type}类型文件：jsonData为字符串,请确认!`,
        });
      });
    }
  } else {
    return new Promise((resolve, reject) => {
      reject({code: 211, filePath: `暂不支持类型：${type},请确认！`});
    });
  }
  // 文件夹路径：固定目录+动态参数目录
  const writePath = `${fixedPath}/${path}`;
  // 文件路径：完整的文件目录
  const writePathName = `${writePath}/${fileNameSplit(fileData)}`;
  try {
    // 判断需要写入的文件是否存在
    const isOthers = await exists(fixedPath);
    const isExists = await exists(writePath);
    if (!isOthers) {
      await mkdir(fixedPath);
    }
    if (!isExists) {
      await mkdir(writePath);
    }
  } catch (error) {
    return error;
  }
  return new Promise((resolve, reject) => {
    writeFile(writePathName, JSON.stringify(jsonData))
      .then(() => resolve({code: 200, filePath: writePathName}))
      .catch((err) => reject({code: 210, filePath: err}));
  });
};

// 读取文件内容，path 完整的文件路径
export const readFileE = async (fixedPath: string, fileData: FileDataProps) => {
  const {path} = fileData;
  const queryFilePath = `${fixedPath}/${path}/${fileNameSplit(fileData)}`;
  return await readFile(queryFilePath)
    .then((res) => ({code: 200, data: JSON.parse(res)}))
    .catch((err) => ({code: 210, data: err}));
};

/** 公共 */

const styles = StyleSheet.create({
  faLink: {
    width: width / 4,
    marginBottom: 8,
    alignItems: 'center',
  },
});

//  项目唯一key定义，避免重复
export const STORAGE_KEY = {
  LOGIN: 'USER',
  APP_UPDATE_VERSION: 'appUpdateVersion',
};

/** 设备信息获取相关开始 */

export const getDeviceInfo = () => ({
  deviceId: getDeviceId(),
  model: getModel(),
  systemName: getSystemName(),
  systemVersion: getSystemVersion(),
});

export const getNetInfo = async () => {
  const netData = await NetInfo.fetch()
    .then((state) => state)
    .catch(() => '网络状态获取失败');
  return netData;
};

/** 设备信息获取相关结束 */

// 以下模拟数据
// applicationType 应用所属类别
// type 1. webview 2.page 3. plugin
// sort 0: 不显示 1：应用显示 99：全显示
export interface FAListProps {
  text: string;
  uri: string | undefined;
  type: string;
  icon: any;
  applicationType: string;
  params: any;
  sort: number;
}
export const faList: FAListProps[] = [
  {
    text: 'ECRC',
    icon: require('../assets/font14.png'),
    uri: 'WView',
    type: 'webview',
    applicationType: '子公司应用',
    sort: 99,
    params: {
      uri: 'https://ecrc.pec.com.cn/#/main/510011040421/5100/ios',
      title: 'ECRC',
      ...INIT_DATA,
    },
    // press: () => navigate('WView'),
  },
  {
    text: 'U订货',
    icon: require('../assets/font4.png'),
    uri: 'WView',
    type: 'webview',
    applicationType: '子公司应用',
    sort: 99,
    params: {
      uri: 'https://csmudh.upbuy.com.cn/',
      title: 'U订货',
      ...INIT_DATA,
    },
    // press: () => navigate('WView', {uri: 'https://csmudh.upbuy.com.cn/', title: 'U订货'}),
  },
  {
    text: '中台(离线)',
    icon: require('../assets/font10.png'),
    uri: 'WView',
    type: 'webview',
    applicationType: '子公司应用',
    sort: 99,
    params: {
      title: '运营中台',
      uri: 'http://shwt.pec.com.cn:8086/frontend/dianwei/index.html',
      path: 'dianwei',
      ...INIT_DATA,
    },
  },
  {
    text: 'H5',
    icon: require('../assets/font6.png'),
    uri: 'WView',
    type: 'webview',
    applicationType: '子公司应用',
    sort: 99,
    params: {
      title: 'H5',
      // uri: 'http://192.168.1.194/h5/index.html',
      uri: 'http://shwt.pec.com.cn:8086/liulijun/h5/index.html',
      path: 'h5',
      ...INIT_DATA,
    },
  },
  {
    text: '地图',
    uri: 'amap',
    type: 'webview',
    applicationType: '子公司应用',
    icon: require('../assets/font15.png'),
    sort: 99,
    params: {...INIT_DATA},
  },

  {
    text: '二维码',
    uri: 'qrcode',
    type: 'page',
    applicationType: '原生服务',
    icon: require('../assets/font7.png'),
    sort: 99,
    params: {...INIT_DATA},

    // press: () => navigate('qrcode'),
  },
  {
    type: 'page',
    text: '设备信息',
    icon: require('../assets/font1.png'),
    uri: 'deviceinfo',
    applicationType: '原生服务',
    sort: 1,
    params: {...INIT_DATA},
  },
  {
    type: 'page',
    text: '目录结构',
    icon: require('../assets/font15.png'),
    uri: 'files',
    applicationType: '原生服务',
    sort: 1,
    params: {...INIT_DATA},
  },
  {
    type: 'page',
    text: '文本生成图片',
    icon: require('../assets/font1.png'),
    uri: 'viewshot',
    applicationType: '原生服务',
    sort: 99,
    params: {...INIT_DATA},
  },
  {
    type: 'page',
    text: '全部',
    icon: require('../assets/font6.png'),
    uri: 'application',
    applicationType: '全部',
    sort: 1,
    params: {...INIT_DATA},
  },
  {
    text: '极光分享',
    icon: require('../assets/font2.png'),
    uri: undefined,
    type: 'plugin',
    applicationType: '原生服务',
    sort: 0,
    params: {...INIT_DATA},

    // press: () => {
    //   const message = {
    //     platform: 'wechat_session',
    //     type: 'text',
    //     text: 'JShare test text',
    //     imagePath: '',
    //   };
    //   JShareModule.share(
    //     message,
    //     (map: any) => {
    //       console.log('share succeed, map: ' + map);
    //     },
    //     (map: any) => {
    //       console.log('share failed, map: ' + JSON.stringify(map));
    //     },
    //   );
    // },
  },
  {
    text: '相册',
    icon: require('../assets/font9.png'),
    uri: undefined,
    type: 'plugin',
    applicationType: '原生服务',
    sort: 0,
    params: {...INIT_DATA},
    // press: () => {
    //   openPicker()
    //     .then((image: any) => {
    //       this.props.fileDataChange(image.path);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },
  },
];

// 新闻专区
export const JournalismList = [
  {
    title: '统一用心 武汉加油',
    text:
      '目前，新型冠状病毒感染的肺炎疫情依然持续，牵动着所有人的心。为助力在防控疫情一线的医务工作者和在各条战线上拼搏奉献的人们，截至2月26日，我们已向包括湖北省在内的全国各地累计捐赠了价值超过2000万元的产品，并向湖北省捐赠了100万元善款用于抗击疫情。    众志成城，共克时艰！统一企业将时刻关注着抗疫一线的需求，根据实际情况，结合企业资源，为疫情发生地区持续提供力所能及的帮助。 武汉加油！让我们一起打赢这场“战疫”！',
  },
  {
    title: '统一与你在一起！',
    text:
      '2019年6月17日22时55分，四川省宜宾市长宁县发生6.0级强烈地震。地震发生后，统一企业第一时间调配1600箱方便面和1300箱饮料，积极配合当地政府的抗震救灾安排，帮助灾区人民度过最艰难的时刻。',
  },
];
// 公告专区
export const noticeList = [];
