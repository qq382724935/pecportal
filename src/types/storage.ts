/*
 * @Author: 刘利军
 * @Date: 2020-06-16 09:53:19
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-06-16 10:12:25
 * @Description:
 */

export interface KeyEntry { key: string; id?: string }
export interface SaveEntry {
    key: string,
    data: Object,
    id?: string,
    expires?: number,
}
