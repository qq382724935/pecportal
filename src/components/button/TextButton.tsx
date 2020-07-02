import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
const TextButton = ({children, onPress}: any) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={styles.buttonText}>{children}</Text>
  </TouchableOpacity>
);

export default TextButton;

const styles = StyleSheet.create({
  buttonText: {
    color: '#1890ff',
    marginRight: 8,
  },
});
