import React, {useCallback, useState, useRef} from 'react';
import {
  SafeAreaView,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import {APLSButton} from '../components/button/index';
import {savePicture} from '../utils/cameraroll';
const MyViewShot = () => {
  const full = useRef<any>();
  const [preview, setPreview] = useState<any>(null);
  const [itemsCount, setItemsCount] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const onCapture = useCallback(() => {
    full.current.capture().then((uri: any) => {
      console.log(uri);
      setPreview({uri});
    });
  }, []);

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
          <Text>生成图片</Text>
        </APLSButton>

        <APLSButton
          onPress={() => {
            savePicture(preview.uri);
          }}>
          <Text>保存图片到相册</Text>
        </APLSButton>

        <Image
          fadeDuration={0}
          resizeMode="contain"
          style={styles.previewImage}
          source={preview}
        />
        <ViewShot ref={full} style={styles.container}>
          {Array(itemsCount)
            .fill(null)
            .map((_, index) => ({
              key: index,
              text: `${index + 1}`,
              color: `hsl(${(index * 13) % 360}, 50%, 80%)`,
            }))
            .map(({key, text, color}) => {
              return (
                <View style={[styles.item, {backgroundColor: color}]} key={key}>
                  <Text style={styles.itemText}>{text}</Text>
                </View>
              );
            })}
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
