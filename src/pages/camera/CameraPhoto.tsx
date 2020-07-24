import React, {PureComponent} from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  View,
  Text,
  Alert,
  ImageSourcePropType,
} from 'react-native';
import {RNCamera, CameraType, FlashMode} from 'react-native-camera';
import {openPicker, flashType, switchType} from '../../utils/cameraroll';
const {alert} = Alert;
import PreviewPicture from './PreviewPicture';

import {Back} from '../../components';
import {SafeAreaView} from 'react-native-safe-area-context';
// true 照片，false 视频
const getSwitchType = (switchState: string) => switchType[0] === switchState;
interface CameraState {
  flashMode: keyof FlashMode;
  cameraType: keyof CameraType;
  switchState: string;
  fileData: string;
  elapsed: number;
  recording: boolean;
  flashChoice: boolean;
  flashPng: ImageSourcePropType;
  photoPng: ImageSourcePropType;
  photoStatus: boolean;
  showPreview: boolean;
}
interface CameraProps {
  navigation: any;
}
class Camera extends PureComponent<CameraProps, CameraState> {
  constructor(props: Readonly<CameraProps>) {
    super(props);
    this.state = {
      flashMode: RNCamera.Constants.FlashMode.off, // 闪光灯模式
      cameraType: RNCamera.Constants.Type.back, // 相机模式 前置后置
      switchState: switchType[0], // 相机状态 ，照片，录制中，未录制
      fileData: '',
      flashChoice: false, // 是否打开闪光灯
      flashPng: require('../../assets/flash_lamp_close.png'), // 闪光灯图片
      elapsed: 0, // 视频计时
      photoPng: require('../../assets/photo.png'), // 相机按钮图案
      recording: false,
      photoStatus: false, // true 连拍
      showPreview: false,
    };
  }
  camera: any;
  recordingTimer: any; // 录制时间Timeout返回值，卸载组件需要清除
  recordingTimeOut: any; // 恢复相机状态
  // 拍照结束设置图片路径
  fileDataChange = (fileData: string) => {
    if (this.state.photoStatus) {
      if (fileData) {
        this.setState({fileData});
      } else {
        this.setState({showPreview: false});
      }
    } else {
      this.setState({fileData});
    }
  };

  // 闪光灯切换
  falshChange = (type: string) => {
    switch (type) {
      case flashType[0]:
        this.setState({
          flashPng: require('../../assets/flash_lamp_auto.png'),
          flashMode: RNCamera.Constants.FlashMode.auto,
        });
        break;
      case flashType[1]:
        this.setState({
          flashPng: require('../../assets/flash_lamp_open.png'),
          flashMode: RNCamera.Constants.FlashMode.on,
        });
        break;
      case flashType[2]:
        this.setState({
          flashPng: require('../../assets/flash_lamp_close.png'),
          flashMode: RNCamera.Constants.FlashMode.off,
        });
        break;
    }
    this.setState({flashChoice: false});
  };

  // 摄像头切换
  cameraTypeChange = () => {
    if (this.state.cameraType === RNCamera.Constants.Type.back) {
      this.setState({cameraType: RNCamera.Constants.Type.front});
    } else {
      this.setState({cameraType: RNCamera.Constants.Type.back});
    }
  };

  // 摄像模式切换
  switchChange = (switchState: string) => {
    const photoPng =
      switchState === switchType[0]
        ? require('../../assets/photo.png')
        : require('../../assets/record.png');
    this.setState({
      switchState,
      photoPng,
    });
  };
  // 拍摄，录制，暂停录制点击方法，需要判断录制状态修改图片
  takePhoto = () => {
    const {switchState} = this.state;
    switch (switchState) {
      case switchType[0]:
        this.takePicture();
        break;
      case switchType[1]:
        this.setState({
          photoPng: require('../../assets/stop_record.png'),
          switchState: switchType[2],
        });
        this.takeRecord();
        break;
      case switchType[2]:
        this.setState({
          photoPng: require('../../assets/record.png'),
          switchState: switchType[1],
        });
        this.stopRecord();
        break;
    }
  };

  // 开始拍照
  takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      this.fileDataChange(data.uri);
    }
  };

  // 开始录像
  takeRecord = async () => {
    if (this.camera && !this.state.recording) {
      const options = {
        quality: RNCamera.Constants.VideoQuality['480p'],
        // orientation: '', // 录制视频方向?
        // maxDuration: 60,
        maxFileSize: 100 * 1024 * 1024,
      };
      this.setState({recording: true}, async () => {
        let result = null;
        try {
          result = await this.camera.recordAsync(options);
          if (result) {
            alert('Video recorded!', JSON.stringify(result));
          }
          // give time for the camera to recover
          // 会导致内存泄漏
          // setTimeout(() => {
          //   console.log('setTimeout');
          //   this.setState({recording: false});
          // }, 500);

          // might be cleared on recording stop or
          // here if we had errors
          this.onRecordingEnd();
        } catch (err) {
          console.warn('VIDEO RECORD FAIL', err.message, err);
          alert('Error', 'Failed to store recorded video: ' + err.message);
        }
      });
    }
  };

  //停止录像
  stopRecord = () => {
    if (this.camera && this.state.recording) {
      this.camera.stopRecording();
      this.setState({elapsed: 0});
    }
  };

  // 开始录像响应事件
  onRecordingStart = () => {
    this.onRecordingEnd();
    if (this.state.recording) {
      this.setState({elapsed: 0});
      this.recordingTimer = setInterval(() => {
        this.setState({elapsed: this.state.elapsed + 1});
      }, 1000);
    }
  };

  // 暂停录像响应事件
  onRecordingEnd = () => {
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
      this.setState({recording: false});
    }
  };
  componentWillUnmount() {
    this.stopRecord();
    this.onRecordingEnd();
  }
  render() {
    const {
      cameraType,
      flashMode,
      switchState,
      photoPng,
      fileData,
      elapsed,
      flashChoice,
      flashPng,
      photoStatus,
      showPreview,
    } = this.state;
    const {
      navigation: {goBack},
    } = this.props;
    const elapsedTrans = (date: number) => {
      let day = Math.floor(date / (24 * 3600)); // Math.floor()向下取整
      let hour = Math.floor((date - day * 24 * 3600) / 3600);
      let minute = Math.floor((date - day * 24 * 3600 - hour * 3600) / 60);
      let second = date - day * 24 * 3600 - hour * 3600 - minute * 60;
      const timeTrans = (time: number) => (time < 10 ? `0${time}` : time);
      return `${timeTrans(hour)}：${timeTrans(minute)}：${timeTrans(second)}`;
    };
    const getImage = () => {
      return fileData ? {uri: fileData} : require('../../assets/album.png');
    };
    return (
      <>
        {fileData && (!photoStatus || showPreview) ? (
          // 拍照后预览
          <PreviewPicture fileData={fileData} onChange={this.fileDataChange} />
        ) : (
          <>
            <RNCamera
              ref={(ref) => {
                this.camera = ref;
              }}
              style={styles.preview}
              type={cameraType} // 摄像头 前置后置
              flashMode={flashMode} // 闪光灯
              onRecordingStart={this.onRecordingStart}
              onRecordingEnd={this.onRecordingEnd}
              // onTap={(data) => {
              //   console.log('onTap', data);
              // }}
              onDoubleTap={(data) => {
                console.log('onDoubleTap', data);
              }}
              androidCameraPermissionOptions={{
                title: '允许使用摄像机',
                message: '需要你的许可才能使用你的相机',
                buttonPositive: '确认',
                buttonNegative: '取消',
              }}
              androidRecordAudioPermissionOptions={{
                title: '允许使用录音',
                message: '需要你的许可才能使用你的音频',
                buttonPositive: '确认',
                buttonNegative: '取消',
              }}
              notAuthorizedView={<View>{cameraNotAuthorized}</View>}>
              <SafeAreaView style={styles.container}>
                {/* 摄像机头部组件 */}
                <View>
                  <Back
                    icon={require('../../assets/icon/cameraback.png')}
                    onPress={goBack}
                  />
                  <View style={styles.header}>
                    <View style={styles.imageBlock}>
                      <TouchableHighlight
                        onPress={() => {
                          this.setState({flashChoice: !flashChoice});
                        }}>
                        <Image source={flashPng} style={styles.imageStyle} />
                      </TouchableHighlight>
                      {flashChoice ? (
                        <View style={styles.choice}>
                          <Text
                            style={styles.choiceText}
                            onPress={() => {
                              this.falshChange(flashType[0]);
                            }}>
                            自动
                          </Text>
                          <Text
                            style={styles.choiceText}
                            onPress={() => {
                              this.falshChange(flashType[1]);
                            }}>
                            打开
                          </Text>
                          <Text
                            style={styles.choiceText}
                            onPress={() => {
                              this.falshChange(flashType[2]);
                            }}>
                            关闭
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    {!flashChoice && !getSwitchType(switchState) ? (
                      <View>
                        <Text style={{color: '#ffffff'}}>
                          {elapsedTrans(elapsed)}
                        </Text>
                      </View>
                    ) : (
                      <View>
                        <Text
                          style={{color: '#ffffff'}}
                          onPress={() => {
                            this.setState({
                              photoStatus: !photoStatus,
                              fileData: '',
                              showPreview: false,
                            });
                          }}>
                          切换模式({photoStatus ? '连拍' : '单拍'})
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* 摄像机底部组件 */}
                <View style={styles.footer}>
                  {switchState === switchType[2] ? (
                    <View
                      style={{
                        ...styles.switch,
                        ...styles.operation,
                        justifyContent: 'center',
                      }}>
                      <TouchableOpacity onPress={this.takePhoto}>
                        <Image
                          source={photoPng}
                          style={{...styles.imageStyle, ...styles.capture}}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <View
                        style={{
                          ...styles.switch,
                          marginLeft: !getSwitchType(switchState) ? 60 : 0,
                          marginRight: getSwitchType(switchState) ? 30 : 0,
                        }}>
                        <Text
                          style={{
                            ...styles.choiceText,
                            fontSize: 16,
                            color: !getSwitchType(switchState)
                              ? '#f4ea2a'
                              : '#ffffff',
                          }}
                          onPress={() => {
                            this.switchChange(switchType[1]);
                          }}>
                          视频
                        </Text>
                        <Text
                          style={{
                            ...styles.choiceText,
                            fontSize: 16,
                            color: getSwitchType(switchState)
                              ? '#f4ea2a'
                              : '#ffffff',
                          }}
                          onPress={() => {
                            this.switchChange(switchType[0]);
                          }}>
                          照片
                        </Text>
                      </View>
                      <View style={{...styles.switch, ...styles.operation}}>
                        <TouchableOpacity
                          onPress={() => {
                            if (photoStatus) {
                              this.setState({showPreview: true});
                            } else {
                              this.setState({showPreview: false});
                              openPicker()
                                .then((image: any) => {
                                  this.fileDataChange(image.path);
                                })
                                .catch((error) => {
                                  console.log(error);
                                });
                            }
                          }}>
                          <Image
                            source={getImage()}
                            style={styles.imageStyle}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.takePhoto}>
                          <Image
                            source={photoPng}
                            style={{...styles.imageStyle, ...styles.capture}}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.cameraTypeChange}>
                          <Image
                            source={require('../../assets/camera.png')}
                            style={styles.imageStyle}
                          />
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              </SafeAreaView>
            </RNCamera>
          </>
        )}
      </>
    );
  }
}

export default Camera;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  preview: {
    flex: 1,
  },
  header: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 26,
    height: 30,
    marginRight: 10,
    marginTop: 8,
  },
  imageBlock: {
    flex: 1,
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
  },
  imageStyle: {
    width: 30,
    height: 30,
  },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 8,
  },
  choiceText: {color: '#ffffff', fontSize: 14, marginRight: 16},
  item: {
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: '#d9d9d9',
  },
  capture: {
    width: 60,
    height: 60,
  },
  footer: {
    flexDirection: 'column',
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  switch: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  operation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cameraNotAuthorized: {
    padding: 20,
    paddingTop: 35,
  },
});

const cameraNotAuthorized = (
  <Text style={styles.cameraNotAuthorized}>
    Camera access was not granted. Please go to your phone's settings and allow
    camera access.
  </Text>
);
