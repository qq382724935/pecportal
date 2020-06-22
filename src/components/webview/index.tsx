/*
 * @Author: 刘利军
 * @Date: 2020-06-16 21:05:27
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-06-18 10:14:49
 * @Description:
 */

import Custom from './Custom';

interface WViewProps {
  Custom: typeof Custom;
}
const WView: WViewProps = {Custom};

export default WView;
