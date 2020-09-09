import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import {AdditionalBKColor} from '../../utils/styles/common';
import Modal from 'react-native-modal';

export interface Additional {
  list: any[];
  display: boolean;
  onPress: () => {} | void;
}

export interface AdditionalList {
  label: string;
  icon: ImageSourcePropType;
  value: string;
  press: () => {} | void;
}

const listRender = (list: AdditionalList[]) => {
  return list.map((item: AdditionalList, index) => (
    <TouchableOpacity key={index} onPress={item.press}>
      <View
        style={[
          styles.Item,
          {borderBottomWidth: list.length - 1 !== index ? 1 : 0},
        ]}>
        <Image
          style={{width: 24, height: 24, marginRight: 8}}
          source={item.icon}
        />
        <Text>{item.label}</Text>
      </View>
    </TouchableOpacity>
  ));
};
const Additional = ({list = [], display = false, onPress}: Additional) => {
  if (!display) {
    return null;
  }
  return (
    <>
      <Modal
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={{margin: 0}}
        isVisible={display}
        onBackdropPress={onPress}
        backdropOpacity={0}>
        <View style={styles.add}>{listRender(list)}</View>
      </Modal>
    </>
  );
};

export default Additional;

const styles = StyleSheet.create({
  add: {
    position: 'absolute',
    backgroundColor: AdditionalBKColor,
    top: Platform.OS === 'ios' ? 76 : 30,
    right: 8,
    minHeight: 50,
    minWidth: 120,
    borderRadius: 5,
  },
  Item: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#e9e9e9',
    borderBottomWidth: 1,
    marginLeft: 12,
    marginRight: 12,
    paddingTop: 12,
    paddingBottom: 12,
  },
});
