import React, {Component} from 'react';
import {View, Button} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

class Qrcode extends Component {
  state = {qrValue: new Date().toString()};
  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{marginBottom: 16}}>
          <Button
            title="刷新"
            onPress={() => {
              this.setState({qrValue: new Date().toString()});
            }}
          />
        </View>
        <QRCode
          size={200}
          value={this.state.qrValue}
          logo={{
            uri:
              'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2684613759,2628279694&fm=26&gp=0.jpg',
          }}
          logoSize={50}
        />
      </View>
    );
  }
}

export default Qrcode;
