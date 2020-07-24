/*
 * @Author: 刘利军
 * @Date: 2020-06-16 21:05:27
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-07-22 15:14:51
 * @Description:
 */

import UpdateVersionProgress from './UpdateVersionProgress';
import Additional from './Additional';

interface MaskProps {
  UpdateVersionProgress: typeof UpdateVersionProgress;
  Additional: typeof Additional;
}

let Mask: MaskProps = {UpdateVersionProgress, Additional};
export default Mask;
