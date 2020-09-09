import * as Progress from 'react-native-progress';
import React from 'react';
import {View, Text} from 'react-native';

export interface UpdateVersionProgressProps {
  progress: any;
  display: boolean;
}
const UpdateVersionProgress = ({
  display,
  progress,
}: UpdateVersionProgressProps) => {
  if (!display) {
    return null;
  }
  const speed = Number(progress);
  const progressRender = (progres: number) => progres / 100;
  const SPEED = progressRender(speed);
  return (
    <View
      style={{
        margin: 10,
        alignItems: 'center',
      }}>
      <Progress.Bar
        progress={SPEED}
        borderWidth={0}
        unfilledColor="#e9e9e9"
        color="#0170fe"
        indeterminate={speed === 0}
      />
      <Text style={{color: '#0170fe'}}>{speed}%</Text>
      <Text style={{color: '#e9e9e9'}}>
        {speed === 0
          ? '正在连接服务器，请稍等...'
          : speed === 100
          ? '正在安装应用，请稍等...'
          : '正在下载安装包，请稍等...'}
      </Text>
    </View>
  );
};

export default UpdateVersionProgress;
