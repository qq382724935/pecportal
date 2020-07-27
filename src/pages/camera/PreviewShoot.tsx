import React, {PureComponent} from 'react';
import {View, Text} from 'react-native';
export interface PreviewShootProps {
  data: string[];
}
export class PreviewShoot extends PureComponent<PreviewShootProps> {
  render() {
    return (
      <View>
        <Text
          style={{color: '#fff', paddingRight: 16, fontSize: 18}}
          onPress={() => {
            console.log(this.props.data);
          }}>
          保存
        </Text>
      </View>
    );
  }
}

export default PreviewShoot;
