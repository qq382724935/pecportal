/*
 * @Author: 刘利军
 * @Date: 2020-07-22 17:20:51
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-07-22 17:24:14
 * @Description:
 */

import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current && navigationRef.current.navigate(name, params);
}
