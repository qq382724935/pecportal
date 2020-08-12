import React, {Component} from 'react';
import {View, Text} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export interface QrcodeProps {
  route: any;
}
class Qrcode extends Component<QrcodeProps> {
  constructor(props: Readonly<QrcodeProps>) {
    super(props);
  }
  getInitData = () => this.props.route.params.initData;
  render() {
    const {content, info} = this.getInitData();
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          padding: 16,
        }}>
        <QRCode size={200} value={content} logoSize={50} />
        <View style={{marginTop: 16}}>
          <Text>二维码概要信息：{info}</Text>
        </View>
      </View>
    );
  }
}

export default Qrcode;
