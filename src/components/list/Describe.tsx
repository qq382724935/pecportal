import React, {Children} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import TextButton from '../button/TextButton';

export interface DescribeProps {
  list: ListItemProps[];
  clean?: boolean;
  cleanTitle?: string;
  selectable?: boolean;
}
interface ListItemProps {
  label: string;
  value: string | number;
  onPress?(): void;
}
const Describe = ({
  list = [],
  clean = false,
  cleanTitle = '清除',
  selectable = false,
}: DescribeProps) => {
  const bbc = (index: number) =>
    list.length - 1 === index
      ? {...styles.item, borderBottomWidth: 0}
      : styles.item;
  return (
    <>
      {list.map((item: ListItemProps, index) => (
        <View style={bbc(index)} key={index}>
          <View>
            <Text numberOfLines={1} style={styles.label}>
              {item.label}：
            </Text>
          </View>
          <View style={styles.centen}>
            <Text selectable={selectable}>{item.value}</Text>
          </View>
          {clean ? (
            <TextButton onPress={item.onPress}>{cleanTitle}</TextButton>
          ) : null}
        </View>
      ))}
    </>
  );
};
export default Describe;
const styles = StyleSheet.create({
  item: {
    minHeight: 36,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  label: {
    maxWidth: 140,
    minWidth: 100,
    textAlign: 'right',
  },
  centen: {
    flex: 1,
    flexDirection: 'row',
  },
});
