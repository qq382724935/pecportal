import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
export interface LoadingProps {
  text?: string;
  modalVisible: boolean;
}
const Loading = ({text, modalVisible}: LoadingProps) => {
  return (
    <Modal
      isVisible={modalVisible}
      backdropOpacity={0}
      animationIn="fadeIn"
      animationOut="fadeOut">
      <View style={[styles.load_box]}>
        <ActivityIndicator animating={true} color="#FFF" size={'large'} />
        <Text style={[styles.load_text]}>{text || '加载中'}</Text>
      </View>
    </Modal>
  );
};
export default Loading;

const styles = StyleSheet.create({
  load_box: {
    minWidth: 100,
    height: 100,
    backgroundColor: '#0008',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  load_text: {
    paddingTop: 8,
    color: '#FFF',
  },
});
