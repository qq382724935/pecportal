import React, {PureComponent} from 'react';
import {StyleSheet} from 'react-native';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import {resetPage} from '../../utils/navigation';
import {Back} from '../../components';
import {postMessageH5, PEC_MODULE} from '../../utils/webview';
export interface CameraScanProps {
  navigation: any;
  route: any;
}
export interface CameraScanState {
  scandata: any;
}

class CameraScan extends PureComponent<CameraScanProps, CameraScanState> {
  constructor(props: Readonly<CameraScanProps>) {
    super(props);
    this.state = {scandata: null};
  }
  unsubscribe: any;
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      if (this.state.scandata) {
        this.setState({scandata: null});
      }
    });
  }
  onBarCodeRead = (scandata: any) => {
    if (!this.state.scandata) {
      this.setState({scandata});
      const {pageType} = this.props.route.params;
      // H5调用 直接返回结果给H5
      if (pageType === '2') {
        postMessageH5({moduleName: PEC_MODULE.PEC_SCAN.value, data: scandata});
      } else {
        resetPage(
          {name: 'cameraScanPreview', navigation: this.props.navigation},
          {scandata},
        );
      }
    }
  };
  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  render() {
    const {
      navigation: {goBack},
    } = this.props;
    const {scandata} = this.state;

    return (
      <>
        <RNCamera onBarCodeRead={this.onBarCodeRead} style={styles.preview}>
          {scandata ? null : <BarcodeMask />}
        </RNCamera>
        <Back
          position="absolute"
          icon={require('../../assets/icon/cameraback.png')}
          onPress={goBack}
        />
      </>
    );
  }
}
export default CameraScan;
const styles = StyleSheet.create({
  preview: {
    flex: 1,
  },
});
