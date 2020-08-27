/*
 * @Author: 刘利军
 * @Date: 2020-07-28 13:42:43
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-08-25 08:46:37
 * @Description:
 */
import {Alert} from 'react-native';
import {resetPage} from './navigation';
import {listReadFile} from './fs';
import {
  ExecuteError,
  transactionExecute,
  transactionExecuteRes,
} from '../types/sqlite';
import {
  getNetInfo,
  getDeviceInfo,
  writeFileE,
  readFileE,
  PATH_OTHERS,
} from './common';
import {navigationRef} from '../navigators/RootNavigation';
import {
  createTable,
  queryTable,
  delTable,
  SQLITE,
  queryAllTable,
  alterTable,
  atData,
  qtData,
  dtData,
  etData,
} from './sqlite';

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
  PEC_SQLITE_TABLE: PecModuleItemProps;
  PEC_SQLITE_DATA: PecModuleItemProps;
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
 * PEC_SQLITE_DATA：操作数据库数据
 * PEC_SQLITE_TABLE：操作数据库表
 *
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
  PEC_SQLITE_TABLE: {route: '', value: 'PEC_SQLITE_TABLE'},
  PEC_SQLITE_DATA: {route: '', value: 'PEC_SQLITE_DATA'},
};
const MODULE = new Set(Object.keys(PEC_MODULE));

// 数据库操作返回的字段
const SQLITE_CODE: {[key: number]: string} = {
  301: SQLITE.ADD_TABLE.label,
  302: SQLITE.ALTER_TABLE.label,
  303: SQLITE.DEL_TABLE.label,
  304: SQLITE.QUERY_TABLE.label,
  311: SQLITE.ADD_DATA.label,
  312: SQLITE.UPDATE_DATA.label,
  313: SQLITE.DEL_DATA.label,
  314: SQLITE.QUERY_DATA.label,
};

// 模块code
const MODULE_CODE: {[key: number]: string} = {
  101: '调用的插件模块不存在',
  102: '缺少参数',
};

/**
 * code 200：所有的操作只要成功了都返回200
 * code 201：需要查询的数据为空
 */
const codeMessage: {[key: number]: string} = {
  200: '操作成功',
  201: '需要查询的数据为空',
  210: '找不到文件或文件目录',
  211: '类型参数不正确：',
  ...SQLITE_CODE,
  ...MODULE_CODE,
};
let error = '';

// RN接收H5的数据
const h5PostMessage = (eventData: string, navigation: any) => {
  const {moduleName, PecH5FrameData} = JSON.parse(eventData);
  const isModule = MODULE.has(moduleName);
  if (!isModule) {
    const msg = `模块${moduleName}不存在，请确认`;
    Alert.alert(msg);
    postMessageH5({moduleName, code: 101, data: msg}, false);
    return;
  }
  if (!isParams(moduleName, PecH5FrameData)) {
    const msg = `缺少模块调用参数${moduleName}:${error}，请确认`;
    Alert.alert(msg);
    postMessageH5({moduleName, code: 102, data: msg}, false);
    return;
  }
  myExecute(moduleName, PecH5FrameData, navigation);
};

// 根据模块名称验证必须参数是否存在
const isParams = (moduleName: string, data: DataProps & Array<string>) => {
  error = '';
  let valid = true;
  const {action, tableName, sql} = data;
  switch (moduleName) {
    case PEC_MODULE.PEC_QUERY.value:
      if (isPostMessageData(data.arrayData) !== 200) {
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
    case PEC_MODULE.PEC_SQLITE_TABLE.value:
      if (!action) {
        // 表操作方式不存在
        valid = false;
        error = '需要action参数';
      } else if ((action === 'create' || action === 'alter') && !sql) {
        // 创建表需要详细的sql语句
        valid = false;
        error = '缺少sql参数';
      } else if (action !== 'query' && !tableName) {
        // 查询表操作可以不需要表名,查询所有表
        valid = false;
        error = '缺少表名';
      }
      break;
    case PEC_MODULE.PEC_SQLITE_DATA.value:
      if (!action) {
        // 表操作方式不存在
        valid = false;
        error = '需要action参数';
      } else if (!tableName) {
        // 表操作方式不存在
        valid = false;
        error = '缺少表名';
      }
      break;
  }
  return valid;
};
// 调用模块
export interface DataProps {
  arrayData: never[];
  jsonData: Object & string;
  fileData: FileDataProps;
  sql?: string;
  tableName?: string;
  action?: string;
  type?: string;
  watermark?: string;
  continuous?: string;
  data?: Object;
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
  const {arrayData} = data;
  // default 页面插件，case操作型插件
  switch (moduleName) {
    case PEC_MODULE.PEC_QUERY.value:
      const {type = 'base64'} = data;
      postMessageH5(
        {
          moduleName,
          code: isPostMessageData(arrayData),
          data: await listReadFile(arrayData, type),
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
    case PEC_MODULE.PEC_SQLITE_TABLE.value:
      sqliteTableAction(moduleName, data);
      break;
    case PEC_MODULE.PEC_SQLITE_DATA.value:
      sqliteTableDataAction(moduleName, data);
      break;
    default:
      // 当有route为页面级插件，进行页面跳转
      if (PEC_MODULE[moduleName].route) {
        resetPage(
          {name: PEC_MODULE[moduleName].route, navigation},
          {initData: {...data, pageType: '2', moduleName}}, // 1: 原生，2：H5 ，其它页面一开始没做处理，无值就默认为原生
        );
      }
      break;
  }
};

// 数据库表操作判断
const sqliteTableAction = (
  moduleName: string,
  {action = '', tableName = '', sql = ''},
) => {
  switch (action) {
    case SQLITE.ADD_TABLE.value: // 创建表
      createTable(
        sql,
        (tx: transactionExecute, res: transactionExecuteRes) => {
          postMessageH5({moduleName, data: {tx, res}}, false);
        },
        (err: ExecuteError) => {
          postMessageH5({moduleName, code: 301, data: err}, false);
        },
      );
      break;
    case SQLITE.QUERY_TABLE.value: // 查询表
      if (tableName) {
        queryTable(
          tableName,
          (res: boolean) => {
            postMessageH5({moduleName, data: res}, false);
          },
          (err: ExecuteError) => {
            postMessageH5({moduleName, code: 301, data: err}, false);
          },
        );
      } else {
        queryAllTable((tx: transactionExecute, res: transactionExecuteRes) => {
          postMessageH5({moduleName, code: 304, data: {tx, res}}, false);
        });
      }

      break;
    case SQLITE.DEL_TABLE.value: // 删除表
      delTable(
        tableName,
        (res: boolean) => {
          postMessageH5({moduleName, data: res}, false);
        },
        (err: ExecuteError) => {
          postMessageH5({moduleName, code: 303, data: err}, false);
        },
      );
      break;
    case SQLITE.ALTER_TABLE.value: // 修改表
      alterTable(
        tableName,
        sql,
        (res: boolean) => {
          postMessageH5({moduleName, data: res}, false);
        },
        (err: ExecuteError) => {
          postMessageH5({moduleName, code: 302, data: err}, false);
        },
      );
      break;
  }
};

// 数据库表data操作判断
const sqliteTableDataAction = (
  moduleName: string,
  {action = '', tableName = '', arrayData = [], sql = ''},
) => {
  switch (action) {
    case SQLITE.ADD_DATA.value: // 新增数据
      atData(tableName, {
        data: arrayData,
        ok: (tx: transactionExecute, res: transactionExecuteRes) => {
          postMessageH5({moduleName, data: {tx, res}}, false);
        },
        error: (err: ExecuteError) => {
          postMessageH5({moduleName, code: 311, data: err}, false);
        },
      });
      break;
    case SQLITE.QUERY_DATA.value: // 查询数据
      qtData(tableName, {
        data: [],
        sql,
        ok: (res: boolean) => {
          postMessageH5({moduleName, data: res}, false);
        },
        error: (err: ExecuteError) => {
          postMessageH5({moduleName, code: 314, data: err}, false);
        },
      });
      break;
    case SQLITE.DEL_DATA.value: // 删除数据
      dtData(tableName, {
        data: arrayData,
        ok: (res: boolean) => {
          postMessageH5({moduleName, data: res}, false);
        },
        error: (err: ExecuteError) => {
          postMessageH5({moduleName, code: 313, data: err}, false);
        },
      });
      break;
    case SQLITE.UPDATE_DATA.value: // 修改数据
      etData(tableName, {
        data: arrayData,
        ok: (res: boolean) => {
          postMessageH5({moduleName, data: res}, false);
        },
        error: (err: ExecuteError) => {
          postMessageH5({moduleName, code: 312, data: err}, false);
        },
      });
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
  postMessageH5(
    {moduleName, data: {content: writeRes.data}, code: writeRes.code},
    false,
  );
};
// 验证data是否为空
const isPostMessageData = (data: string[]) =>
  data && data.length > 0 ? 200 : 201;

export interface PostMessageH5Props {
  moduleName: string;
  code?: number;
  data: any;
  pageType?: string;
}
// RN发送数据给H5
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
