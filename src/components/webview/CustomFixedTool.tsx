import React from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {white} from '../../utils/styles/colors';

const CustomFixedTool = () => {
  return (
    <View style={styles.more}>
      <TouchableWithoutFeedback
        onPress={() => {
          global.wevref.injectJavaScript(
            'document.body.scrollTop = document.documentElement.scrollTop = 0',
          );
        }}>
        <View style={styles.bulr}>
          <Ionicons name={'chevron-up-outline'} size={18} color={white} />
          <Text style={{...styles.textCustom}}>顶部</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default CustomFixedTool;

const styles = StyleSheet.create({
  more: {
    position: 'absolute',
    bottom: 80,
    right: 20,
  },
  bulr: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
  },
  textCustom: {
    color: white,
    paddingBottom: 10,
    fontWeight: 'bold',
  },
});
