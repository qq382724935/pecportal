/*
 * @Author: 刘利军
 * @Date: 2020-06-14 17:52:04
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-06-16 15:35:24
 * @Description: 参考 https://github.com/sunnylqm/react-native-storage/blob/master/README.zh-CN.md
 */

import AsyncStorage from '@react-native-community/async-storage';
import Storage from 'react-native-storage';
import sync from './sync';
import { SaveEntry, KeyEntry } from '../../types/storage';
const storage = new Storage({
  // 最大容量，默认值1000条数据循环存储
  size: 1000,
  // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
  // 如果不指定则数据只会保存在内存中，重启后即丢失
  storageBackend: AsyncStorage,
  // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
  defaultExpires: 1000 * 3600 * 24,
  // 如果storage中没有相应数据，或数据已过期，
  // 则会调用相应的sync方法，无缝返回最新数据。
  // sync方法的具体说明会在后文提到
  sync,
});

/**
 * @description: 使用key来保存数据（key-only）这些数据一般是全局独有的,需要谨慎单独处理的数据,不要在key和id中使用_下划线符号!
 * @param {key} 唯一key
 * @param {id} 批量数据需要,请使用key和id来保存(key-id), 同类别（key）的大量数据上限1000，第1001个数据会覆盖第1个数据。
 * @param {expires} 数据有效期
 * @param {data} 保存的数据
 * @return:
 */
export const saveToken = (params: SaveEntry) => storage.save(params);

export const removeToken = (params: KeyEntry) => storage.remove(params);

export const loadToken = (params: KeyEntry) => storage.load(params);

// 获取某个key下的所有id(仅key-id数据)
export const getIdsForKey = (key: string) => storage.getIdsForKey(key);

// 获取某个key下的所有数据(仅key-id数据)
export const getAllDataForKey = (key: string) => storage.getAllDataForKey(key);

export default storage;
