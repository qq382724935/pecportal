/*
 * @Author: 刘利军
 * @Date: 2020-07-28 13:42:43
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-08-07 18:04:30
 * @Description:
 */
import {resetPage} from './navigation';
import {listReadFile} from './fs';
import {Alert} from 'react-native';

/**
 * 值是使用对象以后可能有扩展的需要
 * PEC_CAMERA_PHOTO：拍照  data返回string[]
 * PEC_PHOTO_QUERY：查看照片 data返回string[]
 * PEC_MAP_GEOLOCATION：高德地图定位
 * PEC_SCAN：扫码：条形码和QR码 data返回any{}
 */
export const PEC_MODULE: any = {
  PEC_PHOTO_QUERY: {route: '', value: 'PEC_PHOTO_QUERY'},
  PEC_SCAN: {route: 'cameraScan', value: 'PEC_SCAN'},
  PEC_MAP_GEOLOCATION: {route: 'amap', value: 'PEC_MAP_GEOLOCATION'},
  PEC_CAMERA_PHOTO: {route: 'cameraPhoto', value: 'PEC_CAMERA_PHOTO'},
};
const MODULE = new Set(Object.keys(PEC_MODULE));
/**
 * code 200：成功
 * code 201：需要查询的数据为空
 */
const codeMessage: any = {200: '查询成功', 201: '需要查询的数据为空'};
// RN接收H5的数据
const h5PostMessage = (eventData: string, navigation: any) => {
  const {moduleName, data} = JSON.parse(eventData);
  const isModule = MODULE.has(moduleName);
  if (!isModule) {
    Alert.alert(`模块${moduleName}不存在，请确认`);
    return;
  }
  myExecute(moduleName, data, navigation);
};

// 调用模块
export interface DataProps {
  imageNames?: string[];
}
const myExecute = async (
  moduleName: string,
  data: DataProps,
  navigation: any,
) => {
  const {imageNames = []} = data;
  // default 是进行页面跳转的，不跳页面用case判断操作
  switch (moduleName) {
    case PEC_MODULE.PEC_PHOTO_QUERY.value:
      postMessageH5({
        moduleName,
        code: isPostMessageData(imageNames),
        data: await listReadFile(imageNames, 'base64'),
      });
      break;
    default:
      resetPage(
        {name: PEC_MODULE[moduleName].route, navigation},
        {pageType: 2}, // 1: 原生，2：H5 ，其它页面一开始没做处理，无值就默认为原生
      );
      break;
  }
};
// 验证data是否为空
const isPostMessageData = (data: string[]) =>
  data && data.length > 0 ? 200 : 201;

// RN发送数据给H5
export interface PostMessageH5Props {
  moduleName: string;
  code?: number;
  data: any;
}
const postMessageH5 = ({moduleName, code = 200, data}: PostMessageH5Props) => {
  const res = {code, moduleName, msg: codeMessage[code], data};
  global.wevref && global.wevref.postMessage(JSON.stringify(res));
};

export {h5PostMessage, postMessageH5};
