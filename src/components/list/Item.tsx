import React from 'react';
import {
  FlatList,
  TouchableHighlight,
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import {ListItemProps} from '../../types/common';
import {
  TEXT_COLOR,
  TITLE_COLOR,
  TIME_COLOR,
  BorderColor,
  FS12,
  FS16,
  FS18,
} from '../../utils/styles/common';

export interface ItemProps {
  list: Array<ListItemProps>;
  selectable?: boolean;
}
const Item = ({list, selectable}: ItemProps): React.ReactElement => {
  return (
    <FlatList
      data={list}
      keyExtractor={(item: ListItemProps, index: number) =>
        `${item.key}${index}`
      }
      renderItem={({item, index}) => (
        <TouchableHighlight
          underlayColor="#DDDDDD"
          onPress={item.press}
          style={styles.list}>
          <View style={styles.item}>
            <View style={[styles.itemL, styles.image]}>
              <Image
                style={styles.image}
                source={require('../../assets/messageIcon.jpeg')}
              />
            </View>
            <View
              style={{
                ...styles.itemR,
                borderBottomWidth: index === list.length - 1 ? 0 : 1,
              }}>
              <View style={styles.rTop}>
                <Text numberOfLines={1} style={styles.rTitle}>
                  {item.text}
                </Text>
                <Text style={styles.rTime}>{item.time}</Text>
              </View>
              <View>
                <Text
                  numberOfLines={1}
                  style={styles.rContent}
                  selectable={selectable}>
                  {item.content}
                </Text>
              </View>
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
    fontSize: FS18,
    backgroundColor: '#ffffff',
  },
  item: {
    flexDirection: 'row',
    flex: 1,
  },
  image: {
    width: 44,
    height: 44,
    borderRadius: 5,
  },
  itemL: {
    margin: 8,
  },
  itemR: {
    flex: 1,
    justifyContent: 'space-evenly',
    borderBottomWidth: 1,
    borderBottomColor: BorderColor,
    paddingRight: 8,
    paddingBottom: 8,
    paddingTop: 8,
  },
  rTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rTitle: {
    fontWeight: 'bold',
    fontSize: FS16,
    color: TITLE_COLOR,
    marginRight: 4,
    flex: 1,
  },
  rTime: {
    fontSize: FS12,
    color: TIME_COLOR,
  },
  rContent: {
    color: TEXT_COLOR,
    fontSize: FS12,
  },
});
