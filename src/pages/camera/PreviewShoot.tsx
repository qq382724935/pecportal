import React, {PureComponent} from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {postMessageH5} from '../../utils/webview';
import {
  DocumentDirectoryPath,
  writeFile,
  mkdir,
  exists,
  copyFile,
} from '../../utils/fs';
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
            // console.log('DocumentDirectoryPath', DocumentDirectoryPath);
            const imageThumbnailPath = `file://${DocumentDirectoryPath}/image_thumbnail/portal`;
            let arrayData: string[] = [];
            const imageSave = async () => {
              const isImagePath = await exists(imageThumbnailPath).then();
              if (!isImagePath) {
                await mkdir(imageThumbnailPath);
              }
              return data.map((item) => {
                const itemS = item.split('/');
                const destPath = `${imageThumbnailPath}/${
                  itemS[itemS.length - 1]
                }`;
                copyFile(item, destPath);
                return destPath;
              });
            };
            arrayData = await imageSave();
            console.log('arrayData', arrayData);
            postMessageH5({
              type: 'cameraPhoto',
              arrayData: arrayData,
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
