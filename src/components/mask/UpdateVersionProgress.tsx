import * as Progress from 'react-native-progress';
import React from 'react';
import Mask from './Mask';

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
  return (
    <Mask display={display}>
      <Progress.Circle
        showsText
        size={100}
        progress={progressRender(speed)}
        indeterminate={speed === 0}
      />
    </Mask>
  );
};

export default UpdateVersionProgress;
