/*
 * @Author: 刘利军
 * @Date: 2020-06-14 18:21:46
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-08-20 09:01:18
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
const executeError = (type: string, {message}: ExecuteError) => {
  Alert.alert(`${type}失败：${message}`);
};

// 操作数据库类型定义
export const SQLITE = {
  ADD_TABLE: {value: 'create', label: '新增表'},
  DEL_TABLE: {value: 'delete', label: '删除表'},
  QUERY_TABLE: {value: 'query', label: '查询表'},
  ALTER_TABLE: {value: 'alter', label: '修改表'},
  ADD_DATA: {value: 'insert', label: '新增表'},
  DEL_DATA: {value: 'delete', label: '删除数据'},
  UPDATE_DATA: {value: 'update', label: '更新数据'},
  QUERY_DATA: {value: 'query', label: '查询数据'},
  QUERY_ALL_TABLE: {value: 'queryAll', label: '查询所有表'},
};
// const ADD_TABLE = '新增表';
// const DEL_TABLE = '删除表';
// const QUERY_TABLE = '查询表';
// const ALTER_TABLE = '修改表';
// const ADD_DATA = '新增数据';
// const DEL_DATA = '删除数据';
// const UPDATE_DATA = '更新数据';
// const QUERY_DATA = '查询数据';

// 操作数据库
const operationData = (type: string, {sql, data, ok, error}: dataType) => {
  db.transaction((txn: any) => {
    txn.executeSql(
      sql,
      data,
      (tx: transactionExecute, res: transactionExecuteRes) => {
        let temp = [];
        switch (type) {
          case SQLITE.QUERY_TABLE.label:
            for (let i = 0; i < res.rows.length; ++i) {
              temp.push(res.rows.item(i));
            }
            ok && (res.rows.length > 0 ? ok(true) : ok(false));
            break;
          case SQLITE.QUERY_DATA.label:
            for (let i = 0; i < res.rows.length; ++i) {
              temp.push(res.rows.item(i));
            }
            ok && ok(temp);
            break;
          case SQLITE.DEL_DATA.label:
          case SQLITE.UPDATE_DATA.label:
            ok && (res.rowsAffected > 0 ? ok(true) : ok(false));
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
export const createTable = (sql = '', ok?: Function, error?: Function) => {
  operationData(SQLITE.ADD_TABLE.label, {
    sql,
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
  operationData(SQLITE.DEL_TABLE.label, {
    sql: `DROP TABLE '${tableName}'`,
    data: [],
    ok,
    error,
  });
};

/**
 * @description: 查询表是否存在
 * @param {tableName}
 * @param {ok} 成功回调
 * @param {error} 失败回调
 * @return 成功 true | false；
 */
export const queryTable = (
  tableName: string,
  ok?: Function,
  error?: Function,
) => {
  operationData(SQLITE.QUERY_TABLE.label, {
    sql: `SELECT name FROM sqlite_master WHERE name='${tableName}'`,
    data: [],
    ok,
    error,
  });
};

/**
 * @description: 修改表 新增单个字段
 * @param {tableName} 表名
 * @param {ok} 成功回调
 * @param {error} 失败回调
 * @return 成功 true | false；
 */
export const alterTable = (
  tableName: string,
  sql: string,
  ok?: Function,
  error?: Function,
) => {
  operationData(SQLITE.ALTER_TABLE.label, {
    sql: `ALTER TABLE ${tableName} ADD ${sql}`,
    data: [],
    ok,
    error,
  });
};

/**
 * @description: 查询所有表
 * @param {tableName} 表名
 * @param {ok} 成功回调
 * @param {error} 失败回调
 * @return 成功 true | false；
 */
export const queryAllTable = (ok?: Function, error?: Function) => {
  operationData(SQLITE.QUERY_ALL_TABLE.label, {
    sql: "SELECT name FROM sqlite_master WHERE type='table' order by name",
    data: [],
    ok,
    error,
  });
};

// 字段数据处理
const fieldProcess = (data: any[]) => {
  // 过滤为条件的数据并返回字段的值
  const conditionValues = data.filter((element) => !element.condition);
  const values = conditionValues.map((element) => element.value);
  let condition = '';
  data
    .filter((element) => element.condition)
    .map((element, index) => {
      if (index === 0) {
        condition += `WHERE ${element.label} = '${element.value}'`;
      } else {
        condition += `${condition} AND ${element.label} = '${element.value}'`;
      }
    });
  let updateValue = '';
  conditionValues.forEach((element) => {
    updateValue += `${element.label} = '${element.value}'`;
  });
  return {
    field: data.map((element) => element.label).join(','),
    values,
    symbol: [...values].fill('?').join(','), // 有几个动态字段值
    condition,
    updateValue,
  };
};

/**
 * @description: 添加数据
 * @param {params} 接收一个包含{sql, data, ok, error}对象
 */
export const atData = (tableName = '', {data = [], ok, error}: dataType) => {
  let {field, symbol, values} = fieldProcess(data);
  const SQL = `INSERT INTO ${tableName} (${field}) VALUES (${symbol})`;
  operationData(SQLITE.ADD_DATA.label, {sql: SQL, data: values, ok, error});
};

/**
 * @description: 删除数据
 * @param {params} 接收一个包含{sql, data, ok, error}对象
 */
export const dtData = (tableName = '', {data = [], ok, error}: dataType) => {
  let {condition} = fieldProcess(data);
  let SQL = `DELETE FROM ${tableName}`;
  if (condition.length > 0) {
    SQL = `${SQL} ${condition}`;
    operationData(SQLITE.DEL_DATA.label, {sql: SQL, ok, error});
  }
};
/**
 * @description: 更新数据
 * @param {params} 接收一个包含{sql, data, ok, error}对象
 */
export const etData = (tableName = '', {data = [], ok, error}: dataType) => {
  let {condition, updateValue} = fieldProcess(data);
  let SQL = `UPDATE ${tableName} SET ${updateValue}`;
  if (condition.length > 0) {
    SQL = `${SQL} ${condition}`;
  }
  operationData(SQLITE.DEL_DATA.label, {sql: SQL, ok, error});
};

/**
 * @description: 查询数据
 * @param {params} 接收一个包含{sql, data, ok, error}对象
 */
export const qtData = (
  tableName = '',
  {data = [], sql, ok, error}: dataType,
) => {
  operationData(SQLITE.QUERY_DATA.label, {
    sql: sql ? sql : `SELECT * FROM ${tableName}`,
    data,
    ok,
    error,
  });
};

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
