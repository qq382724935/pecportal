/*
 * @Author: 刘利军
 * @Date: 2020-07-28 13:42:43
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-07-29 14:53:06
 * @Description:
 */
import {resetPage} from './navigation';
import {listReadFile} from './fs';
// 接收H5传过来的数据
export interface H5PostMessageProps {
  type: string;
  arrayData?: string[];
  objectData?: any;
}
const h5PostMessage = async (
  {type, arrayData = []}: H5PostMessageProps,
  navigation: any,
) => {
  switch (type) {
    case 'cameraPhoto':
      resetPage({name: type, navigation});
      break;
    case 'imageBase':
      const _data = await listReadFile(arrayData, 'base64');
      postMessageH5({type, arrayData: _data});
      break;
  }
};

// 发送数据给H5
interface PostMessageH5DataProps {
  type: string;
  arrayData?: string[] | any[];
  objectData?: any;
}
const postMessageH5 = (data: PostMessageH5DataProps) => {
  global.wevref && global.wevref.postMessage(JSON.stringify(data));
};

export {h5PostMessage, postMessageH5};
