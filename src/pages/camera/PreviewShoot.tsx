import React, {PureComponent} from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {postMessageH5, PEC_MODULE} from '../../utils/webview';
import {cacheCopyfiles} from '../../utils/fs';

export interface PreviewShootProps {
  data: string[];
  navigation: any;
}
export class PreviewShoot extends PureComponent<PreviewShootProps> {
  render() {
    const {data} = this.props;
    return (
      <View>
        <Text
          style={{color: '#fff', paddingRight: 16, fontSize: 18}}
          onPress={async () => {
            postMessageH5({
              moduleName: PEC_MODULE.PEC_CAMERA_PHOTO.value,
              data: await cacheCopyfiles(data),
            });
          }}>
          保存
        </Text>
      </View>
    );
  }
}

const mapStateToProps = ({app, router}: any) => ({app, router});
export default connect(mapStateToProps)(PreviewShoot);
