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
    console.log(uri);
    return (
      <View style={{flex: 1}}>
        <Video
          source={{
            uri:
              'file:///var/mobile/Containers/Data/Application/1C39C8FD-810B-4677-BB69-C1E6F2C2F8CC/Library/Caches/Camera/A7DFC4BB-6640-445C-8AE3-B1E256EE4432.mov',
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
