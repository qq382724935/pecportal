import React, {PureComponent} from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {postMessageH5, PEC_MODULE} from '../../utils/webview';
import {mkdir, exists, copyFile} from '../../utils/fs';
import {IMAGE_PORTAL} from '../../utils/common';
export interface PreviewShootProps {
  data: string[];
  navigation: any;
}
export class PreviewShoot extends PureComponent<PreviewShootProps> {
  render() {
    const {
      data,
      navigation: {goBack},
    } = this.props;
    return (
      <View>
        <Text
          style={{color: '#fff', paddingRight: 16, fontSize: 18}}
          onPress={async () => {
            const imagePortal = IMAGE_PORTAL;
            const imageSave = async () => {
              const isImagePath = await exists(imagePortal).then();
              if (!isImagePath) {
                await mkdir(imagePortal);
              }
              return data.map((item) => {
                const itemS = item.split('/');
                const destPath = `${imagePortal}/${itemS[itemS.length - 1]}`;
                copyFile(item, destPath);
                return destPath;
              });
            };
            postMessageH5({
              moduleName: PEC_MODULE.PEC_CAMERA_PHOTO,
              data: await imageSave(),
            });
            goBack();
          }}>
          保存
        </Text>
      </View>
    );
  }
}

const mapStateToProps = ({app, router}: any) => ({app, router});
export default connect(mapStateToProps)(PreviewShoot);
