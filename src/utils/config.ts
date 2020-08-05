/*
 * @Author: 刘利军
 * @Date: 2020-08-05 16:48:57
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-08-05 17:28:12
 * @Description:
 */
import {resetPage} from '../utils/navigation';
import {navigate} from '../navigators/RootNavigation';

interface FAListProps {
  text: string;
  uri: any;
  press: () => void;
}
export const faList: FAListProps[] = [
  {
    text: 'ECRC',
    uri: require('../assets/font14.png'),
    press: () =>
      navigate('WView', {
        uri: 'https://ecrc.pec.com.cn/#/main/510011040421/5100/ios',
        title: 'ECRC',
      }),
  },
  {
    text: 'U订货',
    uri: require('../assets/font4.png'),
    press: () =>
      navigate('WView', {uri: 'https://csmudh.upbuy.com.cn/', title: 'U订货'}),
  },
  {
    text: '中台(离线)',
    uri: require('../assets/font10.png'),
    press: () =>
      navigate('WView', {
        title: '运营中台',
        uri: 'http://shwt.pec.com.cn:8086/frontend/dianwei/index.html',
        path: 'dianwei',
      }),
  },
  {
    text: 'H5',
    uri: require('../assets/font6.png'),
    press: () =>
      navigate('WView', {
        title: 'H5',
        // uri: 'http://192.168.1.194:8080/a.html',
        uri: 'http://shwt.pec.com.cn:8086/liulijun/a.html',
        path: 'h5',
      }),
  },
  {
    text: '地图',
    uri: require('../assets/font15.png'),
    // press: () => Alert.alert('敬请期待！'),
    press: () => navigate('amap'),
  },
//   {
//     text: '相册',
//     uri: require('../assets/font9.png'),
//     press: () => {
//       openPicker()
//         .then((image: any) => {
//           this.props.fileDataChange(image.path);
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     },
//   },
  {
    text: '二维码生成',
    uri: require('../assets/font7.png'),
    press: () => navigate('qrcode'),
  },
  {
    text: '全部',
    uri: require('../assets/font6.png'),
    press: () => navigate('application'),
  },
];
