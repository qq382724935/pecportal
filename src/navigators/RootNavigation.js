/*
 * @Author: 刘利军
 * @Date: 2020-07-22 17:20:51
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-08-12 14:48:44
 * @Description:
 */

import {
  INIT_DATA,
} from '../utils/common';
import * as React from 'react';
export const navigationRef = React.createRef();
export function navigate(name, params) {
  navigationRef.current && navigationRef.current.navigate(name, {
    ...params,
    ...INIT_DATA,
  });
}