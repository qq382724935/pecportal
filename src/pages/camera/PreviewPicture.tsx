import React, {PureComponent} from 'react';
import {Image, View, SafeAreaView, StyleSheet, Text} from 'react-native';
// import ImagePicker from 'react-native-image-crop-picker';
// import Marker, {Position} from 'react-native-image-marker';
import {Back} from '../../components';
import PreviewVideo from './PreviewVideo';
import {postMessageH5, PEC_MODULE} from '../../utils/webview';
import {cacheCopyfiles} from '../../utils/fs';
class PreviewHeader extends PureComponent<any> {
  render() {
    const {onChange, children} = this.props;
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Back
            icon={require('../../assets/icon/cameraback.png')}
            onPress={() => {
              onChange('');
            }}
          />
          {children}
        </View>
      </>
    );
  }
}

class PickerFooter extends PureComponent<{fileData: string}> {
  render() {
    const {fileData} = this.props;
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 16,
          marginBottom: 16,
        }}>
        {/* <Text
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
        </Text> */}
        <Text
          style={{color: '#ffffff'}}
          onPress={async () => {
            // H5调用 直接返回结果给H5
            postMessageH5({
              moduleName: PEC_MODULE.PEC_CAMERA_PHOTO.value,
              data: await cacheCopyfiles([fileData]),
            });
          }}>
          保存
        </Text>
      </View>
    );
  }
}

interface PreviewPicturePoprs {
  onChange: any;
  fileData: any;
  type: string;
  navigation: any;
  H5: boolean;
}
class PreviewPicture extends PureComponent<PreviewPicturePoprs> {
  VideoCustom = () => {
    return (
      <View>
        <Text
          style={{color: '#fff', fontSize: 16, paddingRight: 16}}
          onPress={() => {
            console.log('保存');
          }}>
          保存
        </Text>
      </View>
    );
  };
  render() {
    const {fileData, type, navigation, H5} = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <PreviewHeader {...this.props}>
          {type === 'video' && <this.VideoCustom />}
        </PreviewHeader>
        {type === 'photo' && (
          <>
            <Image style={{flex: 1}} source={{uri: fileData}} />
            {H5 && <PickerFooter {...this.props} />}
          </>
        )}
        {type === 'video' && (
          <PreviewVideo result={fileData} navigation={navigation} />
        )}
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
