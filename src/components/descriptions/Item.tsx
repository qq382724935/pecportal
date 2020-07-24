import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

export interface DescriptionsProps {}
interface DescriptionsItemProps {
  label: string;
  children: React.ReactNode;
}
const Item = ({label, children}: DescriptionsItemProps) => {
  return (
    <View style={styles.item}>
      <Text style={styles.label}>{label}：</Text>
      <Text style={styles.centen}>{children}</Text>
    </View>
  );
};
export default Item;
const styles = StyleSheet.create({
  item: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    // borderBottomColor: '#ddd',
    // borderBottomWidth: 1,
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
