import React, {PureComponent} from 'react';
import {Image, View, SafeAreaView, StyleSheet, Text} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Marker, {Position} from 'react-native-image-marker';
import {savePicture} from '../../utils/cameraroll';
import {Back} from '../../components';

class PickerHeader extends PureComponent<any> {
  render() {
    const {onChange} = this.props;
    return (
      <Back
        icon={require('../../assets/icon/cameraback.png')}
        onPress={() => {
          onChange('');
        }}
      />
    );
  }
}
class PickerFooter extends PureComponent<any> {
  render() {
    const {fileData, onChange} = this.props;
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 16,
          marginBottom: 16,
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
                onChange(image.path);
              })
              .catch((err) => console.log(err));
          }}>
          裁剪
        </Text>
        <Text
          style={{color: '#ffffff', marginRight: 8}}
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
              onChange(`file:///${image}`);
            });
          }}>
          水印
        </Text>
        <Text
          style={{color: '#ffffff'}}
          onPress={() =>
            savePicture(fileData).then(() => {
              onChange('');
            })
          }>
          保存
        </Text>
      </View>
    );
  }
}

interface PreviewPicture {
  onChange: any;
  fileData: string;
}
class PreviewPicture extends PureComponent<any> {
  render() {
    const {fileData} = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <PickerHeader {...this.props} />
        <Image style={{flex: 1}} source={{uri: fileData}} />
        <PickerFooter {...this.props} />
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default PreviewPicture;