/*
 * @Author: 刘利军
 * @Date: 2020-04-21 15:21:03
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-09-07 14:05:44
 */
import React from 'react';
import {List} from '../components/index';
import {faList} from '../utils/common';
import {resetPage} from '../utils/navigation';

export interface MessageCenterProps {
  navigation: any;
}
const MessageCenter = ({navigation}: MessageCenterProps) => {
  let listData: any[] = JSON.parse(JSON.stringify(faList));
  listData = listData
    .filter((item) => item.content)
    .map((item) => {
      item.uri = 'news';
      item.press = () => {
        resetPage({name: item.uri, navigation}, item.params);
      };
      return item;
    });
  return (
    <>
      <List.Item list={listData} />
    </>
  );
};

export default MessageCenter;
