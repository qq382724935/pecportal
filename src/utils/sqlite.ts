/*
 * @Author: 刘利军
 * @Date: 2020-06-14 18:21:46
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-07-10 13:50:01
 * @Description:
 */

import {
  ExecuteError,
  transactionExecute,
  transactionExecuteRes,
  dataType,
} from '../types/sqlite';
import {Alert, Platform} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
const okCallback = () => console.log('打开数据库成功');
const errorCallback = (error: any) => console.log('打开数据库失败', error);
let db: any;
export const openDB = () => {
  if (!db) {
    // SQLite.DEBUG(true);
    // SQLite.enablePromise(false);
    const dbName = 'app.db'; // 数据库名称
    // const createFromLocation = 1; // 获取方式，android打不开
    const createFromLocation = Platform.OS === 'ios' ? 1 : '~app.db';
    // 打开数据库文件
    db = SQLite.openDatabase(
      {name: dbName, createFromLocation: createFromLocation},
      okCallback,
      errorCallback,
    );
  }
};

openDB();

export const closeDB = () => {
  if (db) {
    db.close();
    db = null;
  }
};
/**
 * @description: 数据库执行失败回调处理
 * @param {type} 类型：例：add,del,update,query
 * @param {err} 回调值
 * @return:
 */
const executeError = (type: string, {code, message}: ExecuteError) => {
  Alert.alert(
    `sqlite fail dev--------dev：${type}：错误编码：${code}；描述信息：${message}`,
  );
};

// 操作数据库类型定义
const ADD_TABLE = '新增表';
const DEL_TABLE = '删除表';
const QUERY_TABLE = '查询表';
const ADD_DATA = '新增数据';
const DEL_DATA = '删除数据';
const UPDATE_DATA = '更新数据';
const QUERY_DATA = '查询数据';

// 操作数据库
const operationData = (type: string, {sql, data, ok, error}: dataType) => {
  db.transaction((txn: any) => {
    txn.executeSql(
      sql,
      data,
      (tx: transactionExecute, res: transactionExecuteRes) => {
        let temp = [];
        switch (type) {
          case QUERY_DATA:
            for (let i = 0; i < res.rows.length; ++i) {
              temp.push(res.rows.item(i));
            }
            ok && ok(temp);
            break;
          case QUERY_TABLE:
            ok && (res.rows.length > 0 ? ok(true) : ok(false));
            break;
          default:
            ok && ok(tx, res);
            break;
        }
      },
      (err: ExecuteError) => {
        error && error(err);
        executeError(type, err);
      },
    );
  });
};

/**
 * @description: 创建表
 * @param {sql} 执行的sql语句
 */
export const createTable = (sql: string, ok?: Function, error?: Function) => {
  operationData(ADD_TABLE, {
    sql: sql,
    data: [],
    ok,
    error,
  });
};

/**
 * @description: 删除表
 * @param {tableName} 删除的表名
 */
export const delTable = (
  tableName: string,
  ok?: Function,
  error?: Function,
) => {
  operationData(DEL_TABLE, {
    sql: `DROP TABLE '${tableName}'`,
    data: [],
    ok,
    error,
  });
};

/**
 * @description: 查询表是否存在
 * @param {tableName} 使用``字符串拼接,在sql中会缺失引号
 * @param {ok} 成功回调
 * @param {error} 失败回调
 * @return 成功 true | false；
 */
export const queryTable = (
  tableName: string,
  ok?: Function,
  error?: Function,
) => {
  operationData(QUERY_TABLE, {
    sql: `SELECT sql FROM sqlite_master WHERE type='table' AND tbl_name='${tableName}'`,
    data: [],
    ok,
    error,
  });
};

/**
 * @description: 添加数据
 * @param {params} 接收一个包含{sql, data, ok, error}对象
 */
export const atData = (params: dataType) => operationData(ADD_DATA, params);

/**
 * @description: 删除数据
 * @param {params} 接收一个包含{sql, data, ok, error}对象
 */
export const dtData = (params: dataType) => operationData(DEL_DATA, params);

/**
 * @description: 更新数据
 * @param {params} 接收一个包含{sql, data, ok, error}对象
 */
export const etData = (params: dataType) => operationData(UPDATE_DATA, params);

/**
 * @description: 查询数据
 * @param {params} 接收一个包含{sql, data, ok, error}对象
 */
export const qtData = (params: dataType) => operationData(QUERY_DATA, params);

export type {QueryTableDataProps} from '../types/sqlite';

// createTable(
//   'CREATE TABLE PEC_USER(ID INTEGER PRIMARY KEY AUTOINCREMENT, USERNAME CHAR(20) NOT NULL UNIQUE,PASSWORD CHAR(50) NOT NULL)',
// );
// qtData({
//   sql: 'SELECT * FROM PEC_USER',
//   data: [],
// });
// qtData({
//   sql: 'SELECT * FROM USER where (username,password) VALUES (?,?)',
//   data: [],
// });
