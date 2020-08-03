import React, {PureComponent} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Text,
  Alert,
  ImageSourcePropType,
  Platform,
  Animated,
} from 'react-native';
import {RNCamera, CameraType, FlashMode} from 'react-native-camera';
import {openPicker, flashType, switchType} from '../../utils/cameraroll';
const {alert} = Alert;
import PreviewPicture from './PreviewPicture';
import PreviewShoot from './PreviewShoot';
import {Back, CarouselCustom} from '../../components';

// true 照片，false 视频
const getSwitchType = (switchState: string) => switchType[0] === switchState;
interface CameraState {
  flashMode: keyof FlashMode;
  cameraType: keyof CameraType;
  switchState: string;
  fileData: any[];
  elapsed: number;
  recording: boolean;
  flashChoice: boolean;
  flashPng: ImageSourcePropType;
  photoPng: ImageSourcePropType;
  photoStatus: boolean;
  showPreview: boolean;
  type: string;
  timeRed: any;
}
interface CameraProps {
  navigation: any;
  route: any;
}
class Camera extends PureComponent<CameraProps, CameraState> {
  constructor(props: Readonly<CameraProps>) {
    super(props);
    this.state = {
      flashMode: RNCamera.Constants.FlashMode.off, // 闪光灯模式
      cameraType: RNCamera.Constants.Type.back, // 相机模式 前置后置
      switchState: switchType[0], // 相机状态 ，照片，录制中，未录制
      fileData: [
        // {
        //   uri:
        //     'file:///var/mobile/Containers/Data/Application/6AF50FA9-8A98-4466-BB77-2260A81A1251/Library/Caches/Camera/71FCC381-2C5B-4427-81CB-57E5916F1A71.mov',
        // },
      ],
      flashChoice: false, // 是否打开闪光灯
      flashPng: require('../../assets/flash_lamp_close.png'), // 闪光灯图片
      elapsed: 0, // 视频计时
      photoPng: require('../../assets/photo.png'), // 相机按钮图案
      recording: false, // 是否开启录制 默认false 否
      photoStatus: true, // 拍照模式 默认:true 连拍
      showPreview: false, // 连拍预览：默认 false 不显示
      type: 'photo', // 预览类型 photo：拍照，video：视频
      timeRed: new Animated.Value(1),
    };
  }
  camera: any;
  recordingTimer: any; // 录制时间Timeout返回值，卸载组件需要清除
  recordingTimeOut: any; // 恢复相机状态
  // 拍照结束设置图片路径
  fileDataChange = (fileData: string) => {
    const {photoStatus, type} = this.state;
    // 连拍模式
    if (photoStatus && type === 'photo') {
      this.setState({fileData: [...this.state.fileData, fileData]});
    } else {
      if (fileData) {
        this.setState({fileData: [fileData]});
      } else {
        this.setState({fileData: []});
      }
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
    const swicthTemp = () => {
      const photoPng =
        switchState === switchType[0]
          ? require('../../assets/photo.png')
          : require('../../assets/record.png');
      this.setState({
        switchState,
        photoPng,
        type: switchState === switchType[0] ? 'photo' : 'video',
      });
    };
    this.resetFileData(swicthTemp);
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
        try {
          const result = await this.camera.recordAsync(options);
          if (result) {
            this.setState({
              recording: false,
              fileData: [result],
            });
          }
          // give time for the camera to recover
          // 会导致内存泄漏
          // setTimeout(() => {
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
      const time = 1000;
      const Ani = () => {
        Animated.timing(this.state.timeRed, {
          toValue: 0,
          duration: time / 2,
          useNativeDriver: false,
        }).start(() => {
          this.setState({timeRed: new Animated.Value(1)});
        });
      };
      Ani();
      this.recordingTimer = setInterval(() => {
        Ani();
        this.setState({elapsed: this.state.elapsed + 1});
      }, time);
    }
  };

  // 暂停录像响应事件
  onRecordingEnd = () => {
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }
  };

  // 重置摄像头数据确认
  resetFileData = (func: Function) => {
    const resetData = () => {
      this.setState({fileData: []}, () => {
        func();
      });
    };
    const {fileData, photoStatus} = this.state;
    // 连拍未保存时提示用户
    if (photoStatus && fileData.length > 0) {
      alert(
        '确认提醒',
        '目前在连拍状态，切换模式会导致未保存的照片丢失，请确认！',
        [
          {
            text: '取消',
            style: 'cancel',
          },
          {
            text: '确认',
            onPress: () => resetData(),
          },
        ],
      );
      return;
    }
    resetData();
  };

  carouselChange = (index: number) => {
    alert('确认提醒', '此照片删除后无法恢复，请确认！', [
      {
        text: '取消',
        style: 'cancel',
      },
      {
        text: '确认',
        onPress: () => {
          Platform.OS === 'android' &&
            index !== 0 &&
            global.carouselRef.snapToPrev();
          this.setState(
            {
              fileData: this.state.fileData.filter(
                (item, fileIndex) => fileIndex !== index,
              ),
            },
            () => {
              this.state.fileData.length === 0 &&
                this.setState({showPreview: false});
            },
          );
        },
      },
    ]);
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
      type,
      timeRed,
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
      return fileData.length > 0
        ? {uri: fileData[fileData.length - 1]}
        : require('../../assets/album.png');
    };
    console.log('fileData：', fileData);
    return (
      <>
        {/* // 拍照（单拍）后预览 */}
        {fileData.length > 0 && (!photoStatus || type === 'video') ? (
          <PreviewPicture
            fileData={fileData[0]}
            onChange={this.fileDataChange}
            type={type}
          />
        ) : (
          <>
            {/* 原生拍照组件 */}
            <RNCamera
              ref={(ref) => {
                this.camera = ref;
              }}
              style={styles.preview}
              type={cameraType} // 摄像头 前置后置
              flashMode={flashMode} // 闪光灯
              keepAudioSession={true}
              onRecordingStart={this.onRecordingStart}
              onRecordingEnd={this.onRecordingEnd}
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
                {/* 自定义摄像机操作组件 */}
                {showPreview ? (
                  // 连拍预览显示
                  <CarouselCustom
                    data={fileData}
                    onChange={this.carouselChange}
                  />
                ) : (
                  // 摄像机头部组件
                  <View>
                    <Back
                      icon={require('../../assets/icon/cameraback.png')}
                      onPress={goBack}
                    />
                    <View style={styles.header}>
                      <View style={styles.imageBlock}>
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({flashChoice: !flashChoice});
                          }}>
                          <Image
                            source={flashPng}
                            style={{
                              ...styles.imageStyle,
                              width: 22,
                              height: 22,
                            }}
                          />
                        </TouchableOpacity>
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
                      {flashChoice ? null : !getSwitchType(switchState) ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Animated.View
                            style={{
                              borderRadius: 50,
                              width: 5,
                              height: 5,
                              backgroundColor: 'red',
                              marginRight: 8,
                              opacity: timeRed,
                            }}
                          />
                          <Text style={{color: '#ffffff'}}>
                            {elapsedTrans(elapsed)}
                          </Text>
                        </View>
                      ) : (
                        <View>
                          <Text
                            style={{color: '#ffffff'}}
                            onPress={() => {
                              this.resetFileData(() => {
                                this.setState({
                                  photoStatus: !photoStatus,
                                });
                              });
                            }}>
                            切换模式({photoStatus ? '连拍' : '单拍'})
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
                {/* 摄像机底部组件 */}
                <View style={styles.footer}>
                  {/* 点击录制视频显示 */}
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
                      {/* 停止录制视频或者拍照模式组件 */}
                      {showPreview ? null : (
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
                      )}

                      {/* 打开相册，拍照，录制视频按钮，摄像头切换 */}
                      <View style={{...styles.switch, ...styles.operation}}>
                        {fileData.length > 0 || !photoStatus ? (
                          <TouchableOpacity
                            onPress={() => {
                              // 相册icon点击事件，false:单拍显示相册，true：连拍设置showPreview显示PreviewShoot组件
                              if (photoStatus) {
                                this.setState({showPreview: !showPreview});
                              } else {
                                openPicker()
                                  .then((image: any) => {
                                    this.fileDataChange(image.path);
                                  })
                                  .catch(() => {});
                              }
                            }}>
                            <Image
                              source={getImage()}
                              style={styles.imageStyle}
                            />
                          </TouchableOpacity>
                        ) : (
                          <View style={styles.imageStyle} />
                        )}
                        {/* 连拍预览展示判断 */}
                        {showPreview ? (
                          <PreviewShoot data={fileData} {...this.props} />
                        ) : (
                          <>
                            <TouchableOpacity onPress={this.takePhoto}>
                              <Image
                                source={photoPng}
                                style={{
                                  ...styles.imageStyle,
                                  ...styles.capture,
                                }}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.cameraTypeChange}>
                              <Image
                                source={require('../../assets/camera.png')}
                                style={styles.imageStyle}
                              />
                            </TouchableOpacity>
                          </>
                        )}
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
    height: 30,
    marginLeft: 26,
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
    borderRadius: 5,
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
