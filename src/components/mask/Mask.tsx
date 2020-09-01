import React from 'react';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
// import {connect} from 'react-redux';
export interface MaskProps {
  display: boolean;
  onPress?: () => {} | void;
  children?: JSX.Element;
  opacity?: number;
}
const Mask = ({
  children,
  display = true,
  opacity = 0.5,
  onPress = () => {},
}: MaskProps) => {
  if (!display) {
    return null;
  }
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          ...styles.container,
          backgroundColor: `rgba(0,0,0,${opacity})`,
        }}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};

// const mapStateToProps = ({app, router}: any) => ({app, router});
// export default connect(mapStateToProps)(Mask);
export default Mask;
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
