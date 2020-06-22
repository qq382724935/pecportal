/*
 * @Author: 刘利军
 * @Date: 2020-06-16 21:05:27
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-06-18 13:24:01
 * @Description:
 */

import Item from './Item';
import Describe from './Describe';

interface ListProps {
  Item: typeof Item;
  Describe: typeof Describe;
}

let List: ListProps = {Item, Describe};
export default List;
