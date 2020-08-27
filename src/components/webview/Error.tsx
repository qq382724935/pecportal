import React from 'react';
import {StyleSheet, View, Text, TouchableWithoutFeedback} from 'react-native';

const Error = ({name = '无法打开，点击重试', press = () => {}}) => {
  return (
    <TouchableWithoutFeedback
      style={{...styles.container}}
      onPress={() => {
        press && press();
      }}>
      <View style={{...styles.container}}>
        <Text style={styles.text}>{name}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Error;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  text: {
    color: 'rgba(0,0,0,.45)',
  },
});
