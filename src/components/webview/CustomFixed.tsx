import React, {PureComponent} from 'react';
import {
  StyleSheet,
  PanResponder,
  Text,
  View,
  GestureResponderEvent,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
const {height} = Dimensions.get('window');
const moveBottom = 68;
export interface CustomHeaderProps {
  goBack: Function;
  top: boolean;
}
export interface CustomHeaderState {
  showMore: boolean;
  moveBottom?: number;
}
class CustomHeader extends PureComponent<CustomHeaderProps, CustomHeaderState> {
  state = {showMore: false, moveBottom};
  _panResponder: any;
  moveRange = ({nativeEvent: {pageY}}: GestureResponderEvent) => {
    console.log(pageY);
    if (pageY > 128 && pageY < 580) {
      this.setState({moveBottom: height - pageY});
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
    const {goBack, top} = this.props;
    const {showMore, moveBottom} = this.state;
    let back = false; // 连续点击会出现error
    return (
      <>
        <View style={{...styles.more, bottom: moveBottom}}>
          <View>
            {showMore && (
              <>
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
                {top && (
                  <View style={{...styles.bulr}}>
                    <Text
                      style={{...styles.textCustom}}
                      onPress={() => {
                        global.wevref.injectJavaScript(
                          'document.body.scrollTop = document.documentElement.scrollTop = 0',
                        );
                      }}>
                      顶部
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
          {!showMore && (
            // <TouchableWithoutFeedback
            //   onPress={() => {
            //     this.setState({showMore: true});
            //   }}
            //  >
            //   <View style={{...styles.bulr}}  {...this._panResponder.panHandlers}>
            //     <Text style={{...styles.textCustom}}>···</Text>
            //   </View>
            // </TouchableWithoutFeedback>
            <View style={{...styles.bulr}} {...this._panResponder.panHandlers}>
              <Text
                style={{...styles.textCustom}}
                onPress={() => {
                  this.setState({showMore: true});
                }}>
                ···
              </Text>
            </View>
          )}
          {showMore && (
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({showMore: false});
              }}>
              <View style={{...styles.bulr}}>
                <Text style={{...styles.textCustom}}>×</Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
      </>
    );
  }
}

export default CustomHeader;

const styles = StyleSheet.create({
  more: {
    flex: 1,
    width: 68,
    position: 'absolute',
    bottom: moveBottom,
    right: 20,
  },

  bulr: {
    minWidth: 68,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 5,
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
