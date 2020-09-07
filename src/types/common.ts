/*
 * @Author: 刘利军
 * @Date: 2020-06-16 21:03:13
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-09-07 13:33:21
 * @Description:
 */

export interface ListDescribeProps {
  key?: string;
  label: string;
  value: string | number;
  type?: string;
  list?: ListDescribeProps[];
  press?: () => void;
}

export interface ListItemProps {
  text: string; // 标题,例：ECRC
  key?: string;
  time?: string; // 最新时间
  content: string; // 显示的内容，消息中心会需要
  uri: string | undefined; // 跳转页面的uri 例：wWview
  type: string; // 类别：例：webveiw，page
  icon: any; // 显示的图标
  applicationType: string; // 应用类型：例：常用应用，子公司应用
  params: any;
  sort: number;
  press?: () => void;
}
