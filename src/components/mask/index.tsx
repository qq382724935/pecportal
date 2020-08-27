/*
 * @Author: 刘利军
 * @Date: 2020-06-16 21:05:27
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-08-26 10:37:18
 * @Description:
 */

import UpdateVersionProgress from './UpdateVersionProgress';
import UpdateVersionModal from './UpdateVersionModal';
import Additional from './Additional';

interface MaskProps {
  UpdateVersionProgress: typeof UpdateVersionProgress;
  Additional: typeof Additional;
  UpdateVersionModal: typeof UpdateVersionModal;
}

let Mask: MaskProps = {UpdateVersionProgress, Additional, UpdateVersionModal};
export default Mask;
