import React, {PureComponent} from 'react';
import {
  StyleSheet,
  PanResponder,
  Platform,
  Text,
  View,
  Dimensions,
  GestureResponderEvent,
} from 'react-native';

const {height} = Dimensions.get('window');
const isIOS = () => Platform.OS === 'ios';
export interface CustomHeaderProps {
  goBack: Function;
}
export interface CustomHeaderState {
  showMore: boolean;
  moveTop?: number;
}
class CustomHeader extends PureComponent<CustomHeaderProps, CustomHeaderState> {
  state = {showMore: false, moveTop: 20};
  _panResponder: any;
  moveRange = ({nativeEvent: {pageY}}: GestureResponderEvent) => {
    if (isIOS()) {
      if (pageY > 68 && pageY < 280) {
        this.setState({moveTop: pageY});
      }
    } else {
      if (pageY > 28 && pageY < 280) {
        this.setState({moveTop: pageY});
      }
    }
  };

  UNSAFE_componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        let {dx, dy} = gestureState;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
          return true;
        } else {
          return false;
        }
        //return  (Math.abs(dx) > 5) || (Math.abs(dy) > 5); 请不要这种写法，某些三星机器异常
      },
      onPanResponderGrant: (evt, gestureState) => {
        // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
        // gestureState.{x,y} 现在会被设置为0
      },
      onPanResponderMove: (evt, gestureState) => {
        // 最近一次的移动距离为gestureState.move{X,Y}
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
        this.moveRange(evt);
      },
    });
  }

  render() {
    const {goBack} = this.props;
    const {showMore, moveTop} = this.state;
    let back = false; // 连续点击会出现error
    return (
      <View style={{...styles.more, top: moveTop}}>
        {showMore && (
          <View style={{...styles.bulr}}>
            <Text
              style={{...styles.textCustom}}
              onPress={() => {
                if (back) {
                  return;
                }
                back = true;
                goBack();
              }}>
              首页
            </Text>
          </View>
        )}
        {!showMore && (
          <View style={{...styles.bulr}} {...this._panResponder.panHandlers}>
            <Text
              style={styles.textCustom}
              onPress={() => {
                this.setState({showMore: true});
              }}>
              ···
            </Text>
          </View>
        )}
        {showMore && (
          <View style={{...styles.bulr}}>
            <Text
              style={{...styles.textCustom}}
              onPress={() => {
                this.setState({showMore: false});
              }}>
              ×
            </Text>
          </View>
        )}
      </View>
    );
  }
}

export default CustomHeader;

const styles = StyleSheet.create({
  more: {
    position: 'absolute',
    top: isIOS() ? 68 : 28,
    right: 20,
    height: 36,
    flexDirection: 'row',
  },
  bulr: {
    borderRadius: 10,
    marginLeft: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  textCustom: {
    color: '#fdffff',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    fontWeight: 'bold',
  },
});
