import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Animated} from 'react-native';

const Loading = () => {
  const [colorAnim, setstate] = useState(new Animated.Value(0));
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(colorAnim, {
        toValue: 0.2,
        duration: 2000,
        useNativeDriver: false,
      }).start(() => {
        setstate(new Animated.Value(0));
      });
    }, 0);
    return () => {
      clearTimeout(timer);
    };
  }, [colorAnim]);
  return (
    <>
      <View style={{...styles.container}}>
        <Animated.Text
          style={{
            ...styles.text,
            opacity: colorAnim,
          }}>
          e协同
        </Animated.Text>
      </View>
    </>
  );
};

export default Loading;
const styles = StyleSheet.create({
  container: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 68,
    fontWeight: '600',
    opacity: 0.2,
  },
});
