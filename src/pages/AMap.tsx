import React, {Component} from 'react';
import {
  init,
  Geolocation,
  setLocatingWithReGeocode,
  addLocationListener,
  start,
  stop,
} from 'react-native-amap-geolocation';
// 使用自己申请的高德 App Key 进行初始化
import {MapView} from 'react-native-amap3d';
import {Dimensions, View, Text, Switch, StyleSheet, Button} from 'react-native';
const {width} = Dimensions.get('window');

export class AMap extends Component {
  // addLocationListener((location) => console.log('location：', location));
  state = {
    latitude: 39.91095,
    longitude: 116.37296,
    showsCompass: true,
    showsScale: true,
    showsZoomControls: true,
    showsLocationButton: true,
  };
  initMap = async () => {
    await init({
      ios: '1500d840227f49e3fcbfb7f8463a3382',
      android: '53866f0e985f22e495b4a8f1a26bc1d3',
    });
  };
  componentDidMount() {
    setLocatingWithReGeocode(true);
    this.initMap();
  }
  componentWillUnmount() {
    stop();
  }
  getCurrentPosition = () => {
    Geolocation.getCurrentPosition(({coords}) => {
      console.log('coords：', coords);
      this.setState({latitude: coords.latitude, longitude: coords.longitude});
    });
  };

  render() {
    return (
      <View style={StyleSheet.absoluteFill}>
        <MapView
          style={{flex: 1, marginBottom: 72}}
          zoomLevel={16}
          tilt={60}
          center={this.state}
          zoomEnabled={true}
          scrollEnabled={true}
          rotateEnabled={true}
          tiltEnabled={true}
          showsCompass={this.state.showsCompass}
          showsScale={this.state.showsScale}
          showsLocationButton={this.state.showsLocationButton}
          locationEnabled={true}
          onLocation={(nativeEvent) =>
            console.log(`${nativeEvent.latitude}, ${nativeEvent.longitude}`)
          }
          showsZoomControls={this.state.showsZoomControls}
        />
      </View>
    );
  }
}

export default AMap;
