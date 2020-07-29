import React, {PureComponent} from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {postMessageH5} from '../../utils/webview';
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
          onPress={() => {
            postMessageH5({
              type: 'cameraPhoto',
              arrayData: data,
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
