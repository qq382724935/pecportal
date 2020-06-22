import React from 'react';
import {StyleSheet} from 'react-native';
import APSLButton from 'apsl-react-native-button';

const APLSButton = ({style, textStyle, children, ...props}: any) => {
  return (
    <APSLButton
      {...props}
      style={[styles.button, style]}
      textStyle={[styles.buttonText, textStyle]}>
      {children}
    </APSLButton>
  );
};

export default APLSButton;

const styles = StyleSheet.create({
  button: {
    marginVertical: 1,
    backgroundColor: '#1890ff',
    borderRadius: 5,
    borderWidth: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
