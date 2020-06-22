import React from 'react';
import {
  FlatList,
  TouchableHighlight,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {ItemData} from '../../types/common';
export interface ItemProps {
  list: Array<ItemData>;
  selectable?: boolean;
}
const Item = ({list, selectable}: ItemProps): React.ReactElement => {
  return (
    <FlatList
      data={list}
      keyExtractor={(item: ItemData, index: number) => `${item.key}${index}`}
      renderItem={({item}) => (
        <TouchableHighlight
          underlayColor="#DDDDDD"
          onPress={item.press}
          style={styles.list}>
          <View style={styles.item}>
            <Text style={styles.label}>{item.label}：</Text>
            <View style={styles.value}>
              <Text selectable={selectable}>{item.value}</Text>
            </View>
          </View>
        </TouchableHighlight>
      )}
    />
  );
};

export default Item;

const styles = StyleSheet.create({
  list: {
    fontSize: 18,
    minHeight: 44,
    backgroundColor: '#ffffff',
    marginBottom: 10,
    justifyContent: 'center',
    padding: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  label: {
    minWidth: 100,
    textAlign: 'right',
  },
  value: {
    flex: 1,
  },
});
