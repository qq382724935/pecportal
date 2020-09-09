/*
 * @Author: 刘利军
 * @Date: 2020-06-16 21:03:13
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-09-08 15:52:48
 * @Description:
 */

export interface DefaultProps {
  navigation?: any;
  route?: any;
  dispatch?: any;
}
export interface ListDescribeProps {
  key?: string;
  label: string;
  value: string | number;
  type?: string;
  list?: ListDescribeProps[];
  press?: () => void;
}
export interface ListItemProps {
  text?: string; // 标题,例：ECRC
  key?: string;
  other?: string; // 右侧->上->右其它内容显示
  content?: string; // 显示的内容，消息中心会需要
  uri?: string | undefined; // 跳转页面的uri 例：wWview
  type?: string; // 类别：例：webveiw，page
  icon?: any; // 显示的图标
  arrow?: boolean; // 右侧箭头是否显示
  applicationType?: string; // 应用类型：例：常用应用，子公司应用
  params?: any;
  sort?: number;
  press?: () => void;
  pageName?: string; // 使用公共页面需要提供子页面的名称，某则显示空页面
}
