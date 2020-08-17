import React, {useCallback, useState, useRef} from 'react';
import {
  SafeAreaView,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import {APLSButton} from '../components/button/index';
import {moveFiles, PATH_OTHERS} from '../utils/common';
import {postMessageH5, PEC_MODULE} from '../utils/webview';

const MyViewShot = (props: any) => {
  const {
    quality = 0.9,
    jsonData = '测试数据',
    pageType,
    fileData = {name: '', type: 'png', path: 'portal'},
  } = props.route.params.initData;
  const {name, type, path} = fileData;
  const full = useRef<any>();
  const [itemsCount, setItemsCount] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const fielName = name && type ? [`${name}.${type}`] : name;
  const fielPath = `${PATH_OTHERS}/${path}`;
  const onCapture = useCallback(() => {
    full.current.capture().then(async (uri: string) => {
      const data = await moveFiles([uri], fielPath, fielName);
      postMessageH5({
        moduleName: PEC_MODULE.PEC_DATA_SAVE_IMAGE.value,
        data,
        pageType,
      });
    });
  }, [fielPath, fielName, pageType]);
  const ContentRender = () => {
    if (typeof jsonData === 'string') {
      return <Text>{jsonData}</Text>;
    }
    return <Text>object类型数据还需考虑页面排版设计</Text>;
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.root}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            setTimeout(() => {
              setItemsCount(itemsCount + 10);
              setRefreshing(false);
            }, 5000);
          }}
        />
      }>
      <SafeAreaView>
        <APLSButton onPress={onCapture}>
          <Text>保存</Text>
        </APLSButton>
        {/* <APLSButton
          onPress={() => {
            savePicture(preview.uri)
              .then(() => Alert.alert('图片已保存到相册'))
              .catch((err) => Alert.alert(`保存到相册失败！${err}`));
          }}>
          <Text>保存图片到相册</Text>
        </APLSButton> */}

        <ViewShot
          ref={full}
          style={styles.container}
          options={{format: type, quality}}>
          <ContentRender />
        </ViewShot>
      </SafeAreaView>
    </ScrollView>
  );
};
export default MyViewShot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  root: {
    paddingVertical: 20,
  },
  content: {
    backgroundColor: '#fff',
  },
  item: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 22,
    color: '#666',
  },
  previewImage: {
    height: 200,
    backgroundColor: 'black',
  },
});
