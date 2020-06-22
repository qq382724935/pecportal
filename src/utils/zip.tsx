import {
  zip,
  unzip as RNZNunzip,
  unzipAssets,
  subscribe,
} from 'react-native-zip-archive';
const unzip = (sourcePath: string, targetPath: string, charset = 'UTF-8') =>
  RNZNunzip(sourcePath, targetPath, charset)
    .then((path) => path)
    .catch((error) => error);

export {subscribe, unzip};
