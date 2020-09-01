import React, {PureComponent} from 'react';
import {StyleSheet, Platform, Text, View} from 'react-native';
export interface CustomHeaderProps {
  goBack: Function;
}
export interface CustomHeaderState {
  showMore: boolean;
}
class CustomHeader extends PureComponent<CustomHeaderProps, CustomHeaderState> {
  state = {showMore: false};
  render() {
    const {goBack} = this.props;
    const {showMore} = this.state;
    let back = false; // 连续点击会出现error
    return (
      <View style={styles.more}>
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
        <View style={{...styles.bulr}}>
          {!showMore && (
            <Text
              style={styles.textCustom}
              onPress={() => {
                this.setState({showMore: true});
              }}>
              ···
            </Text>
          )}
          {showMore && (
            <Text
              style={{...styles.textCustom}}
              onPress={() => {
                this.setState({showMore: false});
              }}>
              ×
            </Text>
          )}
        </View>
      </View>
    );
  }
}

export default CustomHeader;

const styles = StyleSheet.create({
  more: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 68 : 28,
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
