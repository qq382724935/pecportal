import {PermissionsAndroid, Platform} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import ImagePicker, {Options} from 'react-native-image-crop-picker';

const flashType = ['auto', 'open', 'close'];
const switchType = ['photo', 'record', 'stopRecord'];
async function hasAndroidPermission() {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
}

async function savePicture(tag: string, type = {}) {
  if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
    return;
  }
  CameraRoll.save(tag, type);
}

const openPicker = (options?: Options) =>
  ImagePicker.openPicker({
    width: 300,
    height: 400,
    cropping: true,
    ...options,
  });

export {savePicture, openPicker};
export {flashType, switchType};
