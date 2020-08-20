/*
 * @Author: 刘利军
 * @Date: 2020-06-15 20:20:39
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-08-19 21:32:58
 * @Description:
 */

export interface ExecuteError {
  code: string;
  message: string;
}

export interface transactionExecute {
  db: transactionExecuteDb;
}

interface transactionExecuteDb {
  openargs: transactionExecuteDbOpenargs;
  executes: Array<any>;
  readOnly: boolean;
  txlock: boolean;
  fn: Array<Function>;
  openError: Array<Function>;
  openSuccess: Array<Function>;
  success: any;
  error: any;
}

interface transactionExecuteDbOpenargs {
  assetFilename: string;
  createFromLocation: string;
  dblocation: string;
  name: string;
}

export interface transactionExecuteRes {
  insertId: any;
  rows: transactionExecuteResRows;
  rowsAffected: number;
}

interface transactionExecuteResRows {
  length: number;
  raw: Array<Function>;
  item: Function;
}

export interface dataType {
  sql?: string;
  data?: Array<any>;
  ok?: Function;
  error?: Function;
}

export interface QueryTableDataProps {
  PASSWORD: string;
  USERNAME: string;
  ID: string;
}
