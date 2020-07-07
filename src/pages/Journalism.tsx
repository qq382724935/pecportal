import React, {Component} from 'react';
import {Text, View} from 'react-native';

export class Journalism extends Component<any> {
  render() {
    const {text, title} = this.props.route.params;
    const {navigation} = this.props;
    navigation.setOptions({title});
    return (
      <View>
        <Text style={{fontSize: 18}}>&emsp;&emsp;{text}</Text>
      </View>
    );
  }
}

export default Journalism;
