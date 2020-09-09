import {AppState, Platform, Alert} from 'react-native';
import codePush from 'react-native-code-push';
import RNConfigReader from 'react-native-config-reader';
import {loadToken} from './storage/index';
import {STORAGE_KEY} from './common';
import {NetInfo} from './deviceInfo';
interface CodePushDeploymentKeyProps {
  ios: any;
  android: any;
  windows?: any;
  macos?: any;
  web?: any;
}
const CodePushDeploymentKey: CodePushDeploymentKeyProps = {
  ios: {
    debug: 'YHS_Xl_95qrAf2JzUv9ZTPfMMfBrjtJ3DosYR',
    staging: 'YHS_Xl_95qrAf2JzUv9ZTPfMMfBrjtJ3DosYR',
    release: 'W0v3Wkjg6mhRCYYdn5ryydvuIrRVg-D11t23A',
  },
  android: {
    debug: 'ytOg6NBDbr2RVrgvArolrb_fR6-1Y1CR_kXDR',
    releasestaging: 'ytOg6NBDbr2RVrgvArolrb_fR6-1Y1CR_kXDR',
    release: '4XHFgV5n2snRSrRfApAaOsvosUWrDNleYZezMO',
  },
};

const getDeploymentKey = () => {
  const buildType = RNConfigReader.BUILD_TYPE.toLowerCase();
  const deploymentKey = CodePushDeploymentKey[Platform.OS][buildType];
  return deploymentKey;
};

const codePushStatusDidChange = async (syncStatus: any) => {
  switch (syncStatus) {
    case codePush.SyncStatus.CHECKING_FOR_UPDATE:
      // 0 - 正在查询CodePush服务器以进行更新。
      console.info('[CodePush] Checking for update.');
      break;
    case codePush.SyncStatus.AWAITING_USER_ACTION:
      // 1 - 有可用的更新，并且向最终用户显示了一个确认对话框。（仅在updateDialog使用时适用）
      console.info('[CodePush] Awaiting user action.');
      break;
    case codePush.SyncStatus.DOWNLOADING_PACKAGE:
      // 2 - 正在从CodePush服务器下载可用更新。
      console.info('[CodePush] Downloading package.');
      break;
    case codePush.SyncStatus.INSTALLING_UPDATE:
      // 3 - 已下载一个可用的更新，并将其安装。
      console.info('[CodePush] Installing update.');
      break;
    case codePush.SyncStatus.UP_TO_DATE:
      // 4 - 应用程序已配置的部署完全最新。
      console.info('[CodePush] App is up to date.');
      break;
    case codePush.SyncStatus.UPDATE_IGNORED:
      // 5 该应用程序具有可选更新，最终用户选择忽略该更新。（仅在updateDialog使用时适用）
      console.info('[CodePush] User cancelled the update.');
      break;
    case codePush.SyncStatus.UPDATE_INSTALLED:
      // 6 - 安装了一个可用的更新，它将根据 SyncOptions 中的 InstallMode指定在 syncStatusChangedCallback 函数返回后立即或在下次应用恢复/重新启动时立即运行。
      console.info('[CodePush] Installed update.');
      break;
    case codePush.SyncStatus.SYNC_IN_PROGRESS:
      // 7 - 正在执行的 sync 操作
      console.info('[CodePush] Sync already in progress.');
      break;
    case codePush.SyncStatus.UNKNOWN_ERROR:
      // -1 - 同步操作遇到未知错误。
      console.info('[CodePush] An unknown error occurred.');
      break;
  }
};
let myDispatch: any;
const dispatchChange = (data: Object) => {
  if (myDispatch) {
    myDispatch({
      type: 'app/updateState',
      payload: {updateVersionData: {show: true, speed: 0, ...data}},
    });
  }
};
const codePushDownloadDidProgress = (progress: any) => {
  const curPercent = (
    (progress.receivedBytes / progress.totalBytes) *
    100
  ).toFixed(0);
  console.log('[CodePushUtils] Downloading Progress', `${curPercent}%`);
  // console.log(`${progress.receivedBytes} of ${progress.totalBytes} received.`);
  dispatchChange({speed: curPercent});
};
export const syncImmediate = async () => {
  const deploymentKey = getDeploymentKey();
  codePush.sync(
    {deploymentKey, installMode: codePush.InstallMode.IMMEDIATE},
    codePushStatusDidChange,
    codePushDownloadDidProgress,
  );
};

export const checkForUpdate = async (dispatch: Function, appStart = false) => {
  if (appStart) {
    // wifi模式下启动应用检测版本
    const {type, isInternetReachable, isConnected} = await NetInfo.fetch().then(
      (state) => state,
    );
    if (type !== 'wifi' || !isInternetReachable || !isConnected) {
      return;
    }
    const data = await loadToken({key: STORAGE_KEY.APP_UPDATE_VERSION})
      .then((res) => res)
      .catch((err) => err);
    if (data.number >= 3) {
      return;
    }
  }
  const deploymentKey = getDeploymentKey();
  const update = await codePush.checkForUpdate(deploymentKey);
  console.log(update);
  myDispatch = dispatch;
  if (!update) {
    !appStart && Alert.alert('提示', '已是最新版本');
  } else {
    dispatchChange(update);
  }
};

export const codePushSync = () => {
  AppState.addEventListener('change', (newState) => {
    newState === 'active' && syncImmediate();
  });
};
