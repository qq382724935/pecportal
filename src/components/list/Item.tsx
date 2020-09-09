import React from 'react';
import {
  FlatList,
  TouchableHighlight,
  View,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {ListItemProps, DefaultProps} from '../../types/common';
import {resetPage} from '../../utils/navigation';
import {
  TEXT_COLOR,
  TITLE_COLOR,
  OTHER_COLOR,
  BorderColor,
  FS12,
  FS16,
} from '../../utils/styles/common';
import {black} from '../../utils/styles/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface ItemProps extends DefaultProps {
  list: Array<ListItemProps>;
  selectable?: boolean;
  children?: any;
  textAlign?: 'left' | 'center' | 'auto' | 'right' | 'justify' | undefined;
  style?: ViewStyle;
}
const Item = ({
  list,
  children,
  textAlign = 'left',
  style = {},
  selectable,
  navigation,
}: ItemProps): React.ReactElement => {
  // 图片内容区域获取，icon不存在则不显示
  const getImage = (item: any) => {
    let IMAGE: any;
    if (item.icon) {
      if (typeof item.icon === 'string') {
        IMAGE = {source: item.icon};
      } else {
        IMAGE = item.icon;
      }
      return (
        <View style={[styles.itemL, styles.image]}>
          <Image style={styles.image} source={IMAGE} />
        </View>
      );
    }
    return null;
  };
  // 右侧内容显示判断，根据text,content值显示方式不同,样式也有所不同
  const getContarin = (item: any) => {
    // 图片不存在，字体颜色为黑色
    const color = item.icon ? TEXT_COLOR : black;
    const contentFS = item.icon ? FS12 : FS16;
    return (
      <>
        {item.text ? (
          <View style={styles.rTop}>
            <Text numberOfLines={1} style={{...styles.rTitle, color}}>
              {item.text}
            </Text>
            <Text style={{...styles.rOther}}>{item.other}</Text>
          </View>
        ) : null}
        {item.content ? (
          <View>
            <Text
              numberOfLines={1}
              style={{
                ...styles.rContent,
                color,
                textAlign,
                fontSize: contentFS,
              }}
              selectable={selectable}>
              {item.content}
            </Text>
          </View>
        ) : null}
      </>
    );
  };
  // 图片不存在，调整距
  const getPadding = (item: ListItemProps) => (item.icon ? 8 : 12);
  return (
    <FlatList
      data={list}
      keyExtractor={(item: ListItemProps, index: number) =>
        `${item.key}${index}`
      }
      renderItem={({item, index}) => (
        <TouchableHighlight
          underlayColor="#DDDDDD"
          onPress={() => {
            if (item.press) {
              item.press();
              return;
            }
            // arrow代表显示箭头，同时可代表是=需要进行页面跳转
            // 执行到这代表没定义press，那默认使用页面跳转
            if (item.arrow) {
              resetPage(
                {name: 'commonPage', navigation},
                {title: item.text, pageName: item.pageName},
              );
            }
          }}>
          <View style={{...style, ...styles.item}}>
            {getImage(item)}
            <View
              style={{
                ...styles.itemR,
                borderBottomWidth: index === list.length - 1 ? 0 : 1,
                paddingTop: getPadding(item),
                paddingBottom: getPadding(item),
              }}>
              {children ? children : getContarin(item)}
            </View>
            {item.arrow ? (
              <View style={{marginTop: 2}}>
                <Ionicons
                  name="chevron-forward-outline"
                  size={22}
                  color={OTHER_COLOR}
                />
              </View>
            ) : null}
          </View>
        </TouchableHighlight>
      )}
    />
  );
};

export default Item;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    flex: 1,
    alignItems: 'center',
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
    paddingLeft: 8,
  },
  rTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rTitle: {
    fontSize: FS16,
    color: TITLE_COLOR,
    marginRight: 4,
  },
  rOther: {
    fontSize: FS12,
    color: OTHER_COLOR,
  },
  rContent: {
    color: TEXT_COLOR,
    fontSize: FS12,
  },
});
