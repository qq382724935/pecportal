import Item from './Item';
import React from 'react';
import {View} from 'react-native';

export interface DescriptionsProps {
  children?: React.ReactNode;
}

const Descriptions = ({children}: DescriptionsProps) => {
  return <View>{children}</View>;
};

Descriptions.Item = Item;
export default Descriptions;
