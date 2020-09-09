/*
 * @Author: 刘利军
 * @Date: 2020-06-16 21:05:27
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-09-09 15:25:30
 * @Description:
 */

import Loading from './Loading';
import Bottom from './Bottom';
import UpdateVersionModal from './UpdateVersionModal';
import Additional from './Additional';

interface ModalCustomProps {
  Loading: typeof Loading;
  Bottom: typeof Bottom;
  UpdateVersionModal: typeof UpdateVersionModal;
  Additional: typeof Additional;
}

let ModalCustom: ModalCustomProps = {
  Loading,
  Bottom,
  Additional,
  UpdateVersionModal,
};
export default ModalCustom;
