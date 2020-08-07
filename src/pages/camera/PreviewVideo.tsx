import React, {Component} from 'react';
import {StyleSheet, Platform, View} from 'react-native';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
export interface PreviewVideoProps {
  result: ResultProps;
  navigation: any;
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
  VideoRender = () => {
    const {uri} = this.props.result;
    return Platform.OS === 'ios' ? (
      <Video
        controls={true}
        source={{uri}} // Can be a URL or a local file.
        ref={(ref) => (this.player = ref)} // Store reference
        onBuffer={this.onBuffer} // Callback when remote video is buffering
        onError={this.videoError} // Callback when video cannot be loaded
        style={styles.contrain}
      />
    ) : (
      <VideoPlayer source={{uri}} disableBack={true} style={styles.contrain} />
    );
  };
  render() {
    return (
      <View style={styles.contrain}>
        <this.VideoRender />
      </View>
    );
  }
}

export default PreviewVideo;

var styles = StyleSheet.create({
  contrain: {
    flex: 1,
  },
});
