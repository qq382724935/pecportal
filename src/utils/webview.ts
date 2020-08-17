/*
 * @Author: 刘利军
 * @Date: 2020-07-28 13:42:43
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-08-14 14:12:55
 * @Description:
 */
import {resetPage} from './navigation';
import {listReadFile} from './fs';
import {
  getNetInfo,
  getDeviceInfo,
  writeFileE,
  readFileE,
  PATH_OTHERS,
} from './common';
import {navigationRef} from '../navigators/RootNavigation';
import {Alert} from 'react-native';

export interface PecModuleProps {
  [key: string]: PecModuleItemProps;
  PEC_QUERY: PecModuleItemProps;
  PEC_SCAN: PecModuleItemProps;
  PEC_MAP_GEOLOCATION: PecModuleItemProps;
  PEC_MAP_AMAP3D: PecModuleItemProps;
  PEC_CAMERA_PHOTO: PecModuleItemProps;
  PEC_PHONE_DEVICE: PecModuleItemProps;
  PEC_PHONE_NET: PecModuleItemProps;
  PEC_DATA_SAVE_FILE: PecModuleItemProps;
  PEC_DATA_QUERY: PecModuleItemProps;
  PEC_DATA_SAVE_IMAGE: PecModuleItemProps;
  PEC_QRCODE: PecModuleItemProps;
}

export interface PecModuleItemProps {
  route: string;
  value: string;
}

/**
 * 值是使用对象以后可能有扩展的需要
 * PEC_CAMERA_PHOTO：拍照  data返回string[]
 * PEC_QUERY：查看照片 data返回string[]
 * PEC_MAP_GEOLOCATION：高德地图-定位
 * PEC_MAP_AMAP3D：高德地图-地图显示
 * PEC_PHONE_DEVICE：设备信息
 * PEC_PHONE_NET：设备网络信息
 * PEC_QRCODE: 生成二维码
 * PEC_SCAN：扫码：条形码和QR码 data返回any{}
 * PEC_DATA_SAVE_FILE：文本处理：生成json/文本数据文件
 * PEC_DATA_SAVE_IMAGE：文本处理：文本数据生成图片
 * PEC_DATA_QUERY：文本处理：查看已生成的json/文本数据
 */
export const PEC_MODULE: PecModuleProps = {
  PEC_SCAN: {route: 'cameraScan', value: 'PEC_SCAN'},
  PEC_MAP_GEOLOCATION: {route: 'amap', value: 'PEC_MAP_GEOLOCATION'},
  PEC_MAP_AMAP3D: {route: 'amap', value: 'PEC_MAP_AMAP3D'},
  PEC_CAMERA_PHOTO: {route: 'cameraPhoto', value: 'PEC_CAMERA_PHOTO'},
  PEC_QRCODE: {route: 'qrcode', value: 'PEC_QRCODE'},
  PEC_QUERY: {route: '', value: 'PEC_QUERY'},
  PEC_PHONE_DEVICE: {route: '', value: 'PEC_PHONE_DEVICE'},
  PEC_PHONE_NET: {route: '', value: 'PEC_PHONE_NET'},
  PEC_DATA_QUERY: {route: '', value: 'PEC_DATA_QUERY'},
  PEC_DATA_SAVE_FILE: {route: '', value: 'PEC_DATA_SAVE_FILE'},
  PEC_DATA_SAVE_IMAGE: {route: 'viewshot', value: 'PEC_DATA_SAVE_IMAGE'},
};
const MODULE = new Set(Object.keys(PEC_MODULE));
/**
 * code 200：成功
 * code 201：需要查询的数据为空
 */
const codeMessage: {[key: number]: string} = {
  200: '操作成功',
  201: '需要查询的数据为空',
  210: '找不到文件或文件目录',
  211: '类型参数不正确：',
};

let error = '';

// RN接收H5的数据
const h5PostMessage = (eventData: string, navigation: any) => {
  const {moduleName, PecH5FrameData} = JSON.parse(eventData);
  const isModule = MODULE.has(moduleName);
  if (!isModule) {
    Alert.alert(`模块${moduleName}不存在，请确认`);
    return;
  }
  if (!isParams(moduleName, PecH5FrameData)) {
    Alert.alert(`调用模块${moduleName}缺少参数:${error}，请确认`);
    return;
  }
  myExecute(moduleName, PecH5FrameData, navigation);
};

// 根据模块名称验证必须参数是否存在
const isParams = (moduleName: string, data: DataProps & Array<string>) => {
  error = '';
  let valid = true;
  switch (moduleName) {
    case PEC_MODULE.PEC_QUERY.value:
      if (isPostMessageData(data.imageNames) !== 200) {
        valid = false;
        error = '传递的是空数组';
      }
      break;
    case PEC_MODULE.PEC_DATA_SAVE_FILE.value:
    case PEC_MODULE.PEC_DATA_SAVE_IMAGE.value:
      if (!data.fileData) {
        error = 'fileData';
        return;
      }
      const {name, type, path} = data.fileData;
      if (!name) {
        error += 'name;';
      }
      if (!type) {
        error += 'type;';
      }
      if (!path) {
        error += 'path;';
      }
      if (error) {
        valid = false;
      }
      break;
  }

  return valid;
};
// 调用模块
export interface DataProps {
  imageNames: string[];
  jsonData: Object & string;
  fileData: FileDataProps;
}
export interface FileDataProps {
  name: string;
  type: string;
  path: string;
}
const myExecute = async (
  moduleName: string,
  data: DataProps,
  navigation: any,
) => {
  const {imageNames} = data;
  // default 是进行页面跳转的，不跳页面用case判断操作
  switch (moduleName) {
    case PEC_MODULE.PEC_QUERY.value:
      postMessageH5(
        {
          moduleName,
          code: isPostMessageData(imageNames),
          data: await listReadFile(imageNames, 'base64'),
        },
        false,
      );
      break;
    case PEC_MODULE.PEC_PHONE_DEVICE.value:
      postMessageH5({moduleName, data: getDeviceInfo()}, false);
      break;
    case PEC_MODULE.PEC_PHONE_NET.value:
      postMessageH5({moduleName, data: await getNetInfo()}, false);
      break;
    case PEC_MODULE.PEC_DATA_SAVE_FILE.value:
      jsonDataSave(moduleName, data);
      break;
    case PEC_MODULE.PEC_DATA_QUERY.value:
      jsonDataQuery(moduleName, data);
      break;
    default:
      if (PEC_MODULE[moduleName].route) {
        resetPage(
          {name: PEC_MODULE[moduleName].route, navigation},
          {initData: {...data, pageType: '2', moduleName}}, // 1: 原生，2：H5 ，其它页面一开始没做处理，无值就默认为原生
        );
      }
      break;
  }
};

// 生成数据
const jsonDataSave = async (
  moduleName: string,
  {fileData, jsonData}: DataProps,
) => {
  const writeRes = await writeFileE(PATH_OTHERS, fileData, jsonData)
    .then((res) => res)
    .catch((err) => err);
  postMessageH5(
    {
      moduleName,
      data: {filePath: writeRes.filePath},
      code: writeRes.code,
    },
    false,
  );
};

// 查看数据
const jsonDataQuery = async (moduleName: string, {fileData}: DataProps) => {
  const writeRes = await readFileE(PATH_OTHERS, fileData);
  console.log(writeRes);
  postMessageH5(
    {moduleName, data: {content: writeRes.data}, code: writeRes.code},
    false,
  );
};
// 验证data是否为空
const isPostMessageData = (data: string[]) =>
  data && data.length > 0 ? 200 : 201;

// RN发送数据给H5
export interface PostMessageH5Props {
  moduleName: string;
  code?: number;
  data: any;
  pageType?: string;
}
const postMessageH5 = (
  {moduleName, code = 200, data, pageType = '2'}: PostMessageH5Props,
  back = true, // 回到前一页
) => {
  // H5调用发送回调
  if (pageType === '2') {
    const res = {code, moduleName, msg: codeMessage[code], data};
    global.wevref && global.wevref.postMessage(JSON.stringify(res));
    back && navigationRef.current.goBack();
  }
};

export {h5PostMessage, postMessageH5};
