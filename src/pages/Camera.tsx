import React, {PureComponent, Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  View,
  Text,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import ImagePicker from 'react-native-image-crop-picker';

import Marker, {Position} from 'react-native-image-marker';

class PickerFooter extends PureComponent<any> {
  render() {
    const {fileData, fileDataChange} = this.props;
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'center',
          flex: 1,
        }}>
        <Text
          style={{color: '#ffffff', marginRight: 8}}
          onPress={() => {
            ImagePicker.openCropper({
              path: fileData,
              width: 300,
              height: 400,
            })
              .then((image) => {
                fileDataChange(image.path);
              })
              .catch((err) => console.log(err));
          }}>
          图片裁剪
        </Text>
        <Text
          style={{color: '#ffffff'}}
          onPress={() => {
            Marker.markText({
              src: fileData,
              text: '水印内容',
              position: Position.center,
              color: '#FF0000',
              fontName: 'Arial-BoldItalicMT',
              fontSize: 88,
              scale: 1,
              quality: 100,
              shadowStyle: {
                dx: 0,
                dy: 0,
                radius: 0,
                color: '#0000FF',
              },
              textBackgroundStyle: {
                type: 'stretchX',
                paddingX: 0,
                paddingY: 0,
                color: '',
              },
            }).then((image) => {
              fileDataChange(`file:///${image}`);
            });
          }}>
          图片水印
        </Text>
      </View>
    );
  }
}

class PickerHeader extends PureComponent<any> {
  render() {
    return (
      <View style={styles.header}>
        <Text
          style={{color: '#ffffff'}}
          onPress={() => {
            this.props.fileDataChange(null);
          }}>
          返回
        </Text>
      </View>
    );
  }
}
class Picker extends Component<any> {
  render() {
    const {fileData, fileDataChange} = this.props;
    return (
      <View style={styles.container}>
        <PickerHeader fileDataChange={fileDataChange} />
        <Image style={{height: 500}} source={{uri: fileData}} />
        <PickerFooter {...this.props} />
      </View>
    );
  }
}

const flashType = ['auto', 'open', 'close'];
const switchType = ['photo', 'record', 'stopRecord'];

// true 照片，false 视频
const getSwitchType = (switchState: string) => switchType[0] === switchState;
class CameraHeader extends PureComponent<any> {
  //构造函数
  state = {
    flashChoice: false, // 是否打开闪光灯
    flashPng: require('../assets/flash_lamp_close.png'), // 闪光灯图片
  };

  // 闪光灯
  falshChange = (type: string) => {
    const {onChange} = this.props;
    switch (type) {
      case flashType[0]:
        onChange(RNCamera.Constants.FlashMode.auto);
        this.setState({
          flashPng: require('../assets/flash_lamp_auto.png'),
        });
        break;
      case flashType[1]:
        onChange(RNCamera.Constants.FlashMode.on);
        this.setState({
          flashPng: require('../assets/flash_lamp_open.png'),
        });
        break;
      case flashType[2]:
        onChange(RNCamera.Constants.FlashMode.off);
        this.setState({
          flashPng: require('../assets/flash_lamp_close.png'),
        });
        break;
    }
    this.setState({flashChoice: false});
  };

  render() {
    const {flashPng, flashChoice} = this.state;
    const {switchState} = this.props;
    return (
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
            <Text style={{color: '#ffffff'}}>00：00：00</Text>
          </View>
        ) : null}
      </View>
    );
  }
}

class CameraFooter extends PureComponent<any> {
  //构造函数
  state = {
    photoPng: require('../assets/photo.png'), // 相机按钮图案
    switchState: switchType[0], // 相机状态 ，照片，录制中，未录制
  };

  openPicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then((image: any) => {
        console.log('image', image);
        this.props.fileDataChange(image.path);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //切换前后摄像头
  switchCamera = () => {
    const {cameraType, onChange} = this.props;
    if (cameraType === RNCamera.Constants.Type.back) {
      onChange(RNCamera.Constants.Type.front);
    } else {
      onChange(RNCamera.Constants.Type.back);
    }
  };

  // 摄像模式切换
  switchChange = (type: string) => {
    this.setState({
      switchState: type,
      photoPng:
        type === switchType[0]
          ? require('../assets/photo.png')
          : require('../assets/record.png'),
    });
    this.props.switchChange(type);
  };

  takePhoto = () => {
    const {switchState} = this.state;
    switch (switchState) {
      case switchType[0]:
        this.takePicture();
        break;
      case switchType[1]:
        this.setState({
          photoPng: require('../assets/stop_record.png'),
          switchState: switchType[2],
        });
        // this.takeRecord();
        break;
      case switchType[2]:
        this.setState({
          photoPng: require('../assets/record.png'),
          switchState: switchType[1],
        });
        // this.stopRecord();
        break;
    }
  };

  // 拍照
  takePicture = async () => {
    const {camera} = this.props;
    if (camera) {
      const options = {quality: 0.5, base64: true};
      const data = await camera.takePictureAsync(options);
      this.props.fileDataChange(data.uri);
    }
  };

  // 开始录像
  takeRecord = async () => {
    const options = {
      quality: RNCamera.Constants.VideoQuality['480p'],
      // orientation: '', // 录制视频方向?
      maxFileSize: 100 * 1024 * 1024,
    };
    const {camera} = this.props;
    const data = await camera.recordAsync(options);
  };

  //停止录像
  stopRecord = () => {
    const {camera} = this.props;
    camera.stopRecording();
  };

  render() {
    const {switchState, photoPng} = this.state;
    return (
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
                  color: !getSwitchType(switchState) ? '#f4ea2a' : '#ffffff',
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
                  color: getSwitchType(switchState) ? '#f4ea2a' : '#ffffff',
                }}
                onPress={() => {
                  this.switchChange(switchType[0]);
                }}>
                照片
              </Text>
            </View>
            <View style={{...styles.switch, ...styles.operation}}>
              <TouchableOpacity onPress={this.openPicker}>
                <Image
                  source={require('../assets/album.png')}
                  style={styles.imageStyle}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={this.takePhoto}>
                <Image
                  source={photoPng}
                  style={{...styles.imageStyle, ...styles.capture}}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={this.switchCamera}>
                <Image
                  source={require('../assets/camera.png')}
                  style={styles.imageStyle}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
  }
}

class Camera extends PureComponent<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      flashMode: RNCamera.Constants.FlashMode.off, // 闪光灯模式
      cameraType: RNCamera.Constants.Type.back, // 相机模式 前置后置
      switchState: switchType[0], // 相机状态 ，照片，录制中，未录制
      camera: null,
      fileData: null,
    };
  }
  flashModeChange = (flashMode: string | number) => {
    this.setState({flashMode});
  };
  cameraTypeChange = (cameraType: string | number) => {
    this.setState({cameraType});
  };

  switchChange = (switchState: string) => {
    this.setState({switchState});
  };

  fileDataChange = (fileData: string) => {
    this.setState({fileData});
  };
  render() {
    const {cameraType, flashMode, switchState, camera, fileData} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {fileData ? (
          <Picker fileData={fileData} fileDataChange={this.fileDataChange} />
        ) : (
          <>
            <CameraHeader
              onChange={this.flashModeChange}
              switchState={switchState}
            />
            <RNCamera
              ref={(ref) => {
                this.setState({camera: ref});
              }}
              style={styles.preview}
              type={cameraType} // 摄像头 前置后置
              flashMode={flashMode} // 闪光灯
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
              onGoogleVisionBarcodesDetected={({barcodes}) => {
                console.log(barcodes);
              }}
            />
            <CameraFooter
              camera={camera}
              cameraType={cameraType}
              onChange={this.cameraTypeChange}
              switchChange={this.switchChange}
              fileDataChange={this.fileDataChange}
            />
          </>
        )}
      </SafeAreaView>
    );
  }
}

export default Camera;
const styles = StyleSheet.create({
  header: {
    flex: 0,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
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
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    width: 60,
    height: 60,
  },
  footer: {
    flexDirection: 'column',
    marginLeft: 8,
    marginRight: 8,
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
});
