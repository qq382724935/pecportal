/*
 * @Author: 刘利军
 * @Date: 2020-05-02 18:34:18
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-06-30 10:15:56
 */

module.exports = {
  dependencies: {
    'jshare-react-native': {
      platforms: {
        android: {
          packageInstance: 'new JSharePackage(false, false)',
        },
      },
    },
    'react-native-sqlite-storage': {
      platforms: {
        android: {
          sourceDir:
            '../node_modules/react-native-sqlite-storage/platforms/android-native',
          packageImportPath: 'import io.liteglue.SQLitePluginPackage;',
          packageInstance: 'new SQLitePluginPackage()',
        },
      },
    },
  },
};
