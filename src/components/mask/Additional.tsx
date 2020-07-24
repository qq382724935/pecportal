import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import Mask from './Mask';

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
      <Mask display={display} onPress={onPress} />
      <View style={styles.add}>{listRender(list)}</View>
    </>
  );
};

export default Additional;

const styles = StyleSheet.create({
  add: {
    position: 'absolute',
    backgroundColor: '#fff',
    top: 86,
    right: 20,
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
