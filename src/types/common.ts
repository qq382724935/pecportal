/*
 * @Author: 刘利军
 * @Date: 2020-06-16 21:03:13
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-06-16 23:41:36
 * @Description:
 */

export interface ItemData {
  key?: string;
  label: string;
  value: string | number;
  type?: string;
  list?: ItemData[];
  press?: () => void;
}
