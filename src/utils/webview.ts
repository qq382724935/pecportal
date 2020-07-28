/*
 * @Author: 刘利军
 * @Date: 2020-07-28 13:42:43
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-07-28 15:58:04
 * @Description:
 */
import {resetPage} from './navigation';
export interface DataProps {
  type: string;
}
// 接收H5传过来的数据
const h5PostMessage = (data: DataProps, navigation: any) => {
  switch (data.type) {
    case 'photo':
      resetPage({name: 'cameraPhoto', navigation});
      break;
  }
};

// 发送数据给H5
interface PostMessageH5DataProps {
  type: string;
  data: any;
}
const postMessageH5 = (data: PostMessageH5DataProps) => {
  global.wevref && global.wevref.postMessage(JSON.stringify(data));
};
export {h5PostMessage, postMessageH5};
