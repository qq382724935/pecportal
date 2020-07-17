import * as Progress from 'react-native-progress';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';

const Mask = ({app}: any) => {
  const speed = Number(app.progress.speed);
  const progressRender = (progress: number) => progress / 100;
  return (
    <View style={styles.container}>
      <Progress.Circle
        showsText
        size={100}
        progress={progressRender(speed)}
        indeterminate={speed === 0}
      />
    </View>
  );
};

const mapStateToProps = ({app, router}: any) => ({app, router});
export default connect(mapStateToProps)(Mask);
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  label: {
    paddingTop: 8,
    fontSize: 18,
  },
});
