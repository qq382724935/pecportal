import React, {PureComponent} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import {Descriptions, Back} from '../../components';

export interface CameraScanPreviewProps {
  route: CameraScanPreviewRouteProps;
  navigation: any;
}
interface CameraScanPreviewRouteProps {
  params: any;
  key: string;
  name: string;
}
export interface CameraScanPreviewState {
  fadeAnim: any;
}
class CameraScanPreview extends PureComponent<
  CameraScanPreviewProps,
  CameraScanPreviewState
> {
  constructor(props: Readonly<CameraScanPreviewProps>) {
    super(props);
  }

  render() {
    const {
      navigation: {goBack},
      route: {
        params: {scandata},
      },
    } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <Back
          icon={require('../../assets/icon/back_grey.png')}
          onPress={goBack}
        />
        <Descriptions>
          <Descriptions.Item label="条码类型">
            {scandata.type}
          </Descriptions.Item>
          <Descriptions.Item label="条码内容">
            {scandata.data}
          </Descriptions.Item>
        </Descriptions>
      </SafeAreaView>
    );
  }
}
export default CameraScanPreview;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
