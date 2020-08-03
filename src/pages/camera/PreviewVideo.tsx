import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';

import Video from 'react-native-video';
export interface PreviewVideoProps {
  result: ResultProps;
}

export interface ResultProps {
  codec: string;
  uri: string;
  videoOrientation: number;
  deviceOrientation: number;
  isRecordinglnterrupted: boolean;
}
export class PreviewVideo extends Component<PreviewVideoProps> {
  player: any;
  onBuffer = () => {};
  videoError = () => {};
  render() {
    const {uri} = this.props.result;
    return (
      <View style={{flex: 1}}>
        <Video
          controls={true}
          source={{
            uri,
          }} // Can be a URL or a local file.
          ref={(ref) => {
            this.player = ref;
          }} // Store reference
          onBuffer={this.onBuffer} // Callback when remote video is buffering
          onError={this.videoError} // Callback when video cannot be loaded
          style={styles.backgroundVideo}
        />
      </View>
    );
  }
}

export default PreviewVideo;

var styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
