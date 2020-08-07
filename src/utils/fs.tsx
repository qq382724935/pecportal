import RNFS, {
  CachesDirectoryPath,
  MainBundlePath,
  DocumentDirectoryPath,
  LibraryDirectoryPath,
  DownloadDirectoryPath,
  ExternalCachesDirectoryPath,
  ExternalDirectoryPath,
  ExternalStorageDirectoryPath,
  TemporaryDirectoryPath,
  uploadFiles as RNFSuploadFiles,
  UploadFileOptions,
  UploadResult,
  downloadFile as RNFSdownloadFile,
  DownloadFileOptions,
  DownloadResult,
  stopDownload as RNFSstopDownload,
  resumeDownload as RNFSresumeDownload,
  isResumable as RNFSisResumable,
  completeHandlerIOS as RNFScompleteHandlerIOS,
  readDir as RNFSreadDir,
  ReadDirItem,
  readDirAssets as RNFSreadDirAssets,
  readFile as RNFSreadFile,
  read as RNFSread,
  readFileAssets as RNFSreadFileAssets,
  readFileRes as RNFSreadFileRes,
  writeFile as RNFSwriteFile,
  appendFile as RNFSappendFile,
  write as RNFSwrite,
  moveFile as RNFSmoveFile,
  copyFile as RNFScopyFile,
  copyFileAssets as RNFScopyFileAssets,
  copyFileRes as RNFSccopyFileRes,
  exists as RNFSexists,
  mkdir as RNFSmkdir,
  MkdirOptions,
  unlink as RNFSunlink,
} from 'react-native-fs';

// eslint-disable-next-line no-undef
export const OS = Platform.OS;

// 在方法前加上RNFS避免下方定义参数冲突
// 详细可参考 https://github.com/itinance/react-native-fs

/**
 * @description: 获取目录常量
 * @param {CachesDirectoryPath} 缓存目录绝对路径
 * @param {DocumentDirectoryPath} 文件目录绝对路径
 * @param {MainBundlePath} 主包目录绝对路径(ios)
 * @param {LibraryDirectoryPath} ~NSLibraryDirectory的绝对路径(ios)
 * @param {ExternalCachesDirectoryPath} 外部缓存目录绝对路径(android)
 * @param {TemporaryDirectoryPath} 临时目录绝对路径(android)
 * @param {DownloadDirectoryPath} 下载目录绝对路径(android)
 * @param {ExternalDirectoryPath} 外部文件的绝对路径，共享目录(android)
 * @param {ExternalStorageDirectoryPath} 外部存储共享目录的绝对路径(android)
 */
export {
  ExternalDirectoryPath,
  MainBundlePath,
  DownloadDirectoryPath,
  DocumentDirectoryPath,
  LibraryDirectoryPath,
  CachesDirectoryPath,
  ExternalCachesDirectoryPath,
  TemporaryDirectoryPath,
  ExternalStorageDirectoryPath,
};

// 文件操作，ios和android, encoding可以是utf8(默认)，ascii, base64。使用base64读取二进制文件。

/**
 * @description: 读取路径的内容。这必须是一条绝对路径
 * @param {dirpath} 路径地址
 * @return:
 */
export const readDir = (dirpath: string): Promise<ReadDirItem[]> =>
  RNFSreadDir(dirpath);

/**
 * @description: 在路径处读取文件(不适合大文件)
 * @param {filepath} 文件路径
 * @param {encoding} 可以是utf8(默认)，ascii, base64。使用base64读取二进制文件。
 * @return: 读取内容
 */
export const readFile = (
  filepath: string,
  encoding?: string,
): Promise<string> => RNFSreadFile(filepath, encoding);

/**
 * @description: 根据路径读取文件(不适合大文件)，多条数据获取
 * @param {filepath} 文件路径
 * @param {encoding} 可以是utf8(默认)，ascii, base64。使用base64读取二进制文件。
 * @return: 转换后的数据数组
 */
export const listReadFile = async (data: string[], encoding = 'utf8') => {
  let _data: string[] = [];
  for (let index = 0; index < data.length; index++) {
    await readFile(data[index], encoding)
      .then((base) => {
        _data.push(`data:image/jpeg;base64,${base}`);
      })
      .catch(() => {}); // 这边是防止传入文件不存在
  }
  return _data;
};

/**
 * @description: 从文件路径的给定位置读取长度字节并返回内容。适合大文件
 * @param {filepath} 文件路径
 * @param {length} 读取长度
 * @param {position} 开始位置
 * @return: 读取内容
 */
export const read = (
  filepath: string,
  length = 0,
  position = 0,
  encodingOrOptions?: any,
): Promise<string> => RNFSread(filepath, length, position, encodingOrOptions);

/**
 * @description: 将内容写入文件路径
 * @param {filepath} 文件路径
 * @param {contents} 写入的数据
 * @param {encoding} 可以是utf8(默认)，ascii, base64。使用base64读取二进制文件。
 * @return:
 */
export const writeFile = (
  filepath: string,
  contents: string,
  encoding?: string,
): Promise<void> => RNFSwriteFile(filepath, contents, encoding);

/**
 * @description: 将内容追加到文件路径
 * @param {filepath} 文件路径
 * @param {contents} 写入的数据
 * @param {encoding} 可以是utf8(默认)，ascii, base64。使用base64读取二进制文件。
 * @return:
 */
export const appendFile = (
  filepath: string,
  contents: string,
  encoding?: string,
): Promise<void> => RNFSappendFile(filepath, contents, encoding);

/**
 * @description: 在给定的随机访问位置将内容写入filepath。当位置未定义或为
 * @param {filepath} 文件路径
 * @param {contents} 写入的数据
 * @param {position} 给定的位置，未定义或为-1时，将内容追加到文件的末尾。
 * @param {encoding} 可以是utf8(默认)，ascii, base64。使用base64读取二进制文件。
 * @return:
 */
export const write = (
  filepath: string,
  contents: string,
  position?: number,
  encoding?: string,
): Promise<void> => RNFSwrite(filepath, contents, position, encoding);

/**
 * @description: 移动文件
 * @param {filepath} 文件路径
 * @param {contents} 移动的目录路径
 * @return:
 */
export const moveFile = (filepath: string, destPath: string): Promise<void> =>
  RNFSmoveFile(filepath, destPath);

/**
 * @description: 复制文件，android存在覆盖，ios存在报错
 * @param {filepath} 文件路径
 * @param {contents} 复制的目录路径
 * @return:
 */
export const copyFile = (filepath: string, destPath: string): Promise<void> =>
  RNFScopyFile(filepath, destPath);

/**
 * @description: 检查项目是否存在于filepath。
 * @param {filepath} 文件路径
 * @return: false
 */
export const exists = (filepath: string): Promise<boolean> =>
  RNFSexists(filepath);

/**
 * @description: 创建文件夹，多目录则自动创建父类，如果已经存在，则不抛出
 * @param {filepath} 文件路径
 * @param {options} 可以在IOS平台上提供NSURLIsExcludedFromBackupKey属性来设置该属性。如果应用程序存储的离线缓存数据没有这个属性，苹果将会拒绝。
 * @return:
 */
export const mkdir = (
  filepath: string,
  options?: MkdirOptions,
): Promise<void> => RNFSmkdir(filepath, options);

// 文件上传
export const uploadFiles = (
  params: UploadFileOptions,
): {jobId: number; promise: Promise<UploadResult>} => RNFSuploadFiles(params);

// 文件下载
export const downloadFile = (
  params: DownloadFileOptions,
): {jobId: number; promise: Promise<DownloadResult>} =>
  RNFSdownloadFile(params);

// 文件下载
export const unlink = (path: string): Promise<void> => RNFSunlink(path);

/**
 * @description: 仅ios
 * @param {stopDownload} 终止下载,部分文件将保留在文件系统上
 * @param {resumeDownload} 使用此ID恢复当前的下载作业
 * @param {isResumable} 检查具有此ID的下载作业是否可通过恢复 resumeDownload()
 * @param {completeHandlerIOS} 后台下载
 * @return:
 */
export const stopDownload = (jobId: number): void => RNFSstopDownload(jobId);
export const resumeDownload = (jobId: number): void =>
  RNFSresumeDownload(jobId);
export const isResumable = (jobId: number): Promise<boolean> =>
  RNFSisResumable(jobId);

export const completeHandlerIOS = (jobId: number): void =>
  RNFScompleteHandlerIOS(jobId);

/**
 * @description: 仅android
 */

// 读取assets目录下的内容
export const readDirAssets = (path: string): Promise<ReadDirItem[]> =>
  RNFSreadDirAssets(path);

// 在Android应用程序的assets文件夹的path处读取文件并返回内容，filepath是从assets文件夹根目录到该文件的相对路径。
export const readFileAssets = (
  filepath: string,
  encoding?: string,
): Promise<string> => RNFSreadFileAssets(filepath, encoding);

// 读取Android应用程序res文件夹中的文件名并返回内容。res/drawable用作图像文件的父文件夹，res/raw用作其他所有文件的父文件夹
export const readFileRes = (
  filepath: string,
  encoding?: string,
): Promise<string> => RNFSreadFileRes(filepath, encoding);

// 复制Android应用程序的资产文件夹中的filepath文件，并将其复制到给定的destPath路径。
export const copyFileAssets = (
  filepath: string,
  destPath: string,
): Promise<void> => RNFScopyFileAssets(filepath, destPath);

// 复制Android应用程序res文件夹中的文件到其他目录
export const copyFileRes = (
  filepath: string,
  destPath: string,
): Promise<void> => RNFSccopyFileRes(filepath, destPath);

export default RNFS;
