import React from 'react';
import {StatusBar} from 'react-native';
import {DefaultProps} from '../types/common';
import {CommonPageBKColor} from '../utils/styles/common';
import AboutApp from './personal/AboutApp';
import Setting from './personal/Setting';

const COMPONENTS: any = {
  AboutApp,
  Setting,
};
interface CommonPage extends DefaultProps {}

const CommonPage = (props: CommonPage) => {
  const {
    navigation,
    route: {params},
  } = props;
  navigation.setOptions({title: params.title});
  const Custom = COMPONENTS[params.pageName];
  return (
    <>
      <StatusBar backgroundColor={CommonPageBKColor} barStyle="dark-content" />
      <Custom {...props} />
    </>
  );
};
export default CommonPage;
