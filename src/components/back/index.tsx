import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  StatusBar,
  Platform,
} from 'react-native';
export interface BackProps {
  position?: string;
  iconsize?: IconSizeProps;
  icon: ImageSourcePropType;
  onPress?: (_?: any) => {} | void;
}

export interface IconSizeProps {
  width: number | string;
  height: number | string;
}
const Back = ({
  position = 'relative',
  icon,
  iconsize = {width: 16, height: 16},
  onPress,
}: BackProps) => {
  return (
    <>
      {/* 安卓隐藏状态栏，调用摄像机会导致闪屏 */}
      {Platform.OS === 'ios' && (
        <StatusBar
          backgroundColor="#ff0000"
          translucent={true}
          hidden={true}
          animated={true}
        />
      )}
      <View
        style={[
          styles.container,
          position === 'absolute' ? styles.absolute : null,
        ]}>
        <View
          style={{
            width: 64,
            height:
              position === 'absolute' || Platform.OS === 'android' ? 48 : 0,
            paddingLeft: 32,
            justifyContent: 'center',
          }}>
          <TouchableOpacity onPress={onPress}>
            <Image style={iconsize} source={icon} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};
export default Back;

const styles = StyleSheet.create({
  container: {
    height: 48,
  },
  absolute: {...StyleSheet.absoluteFillObject, marginTop: 28},
});
