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
import {
  Button,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const {alert} = Alert;

export class AMap extends Component {
  state = {
    latitude: 31.21847113715278,
    longitude: 121.36036838107638,
    time: new Date(),
  };
  mapView: any;
  _coordinates = [
    {
      latitude: 40.05709979076149,
      longitude: 116.3879666289858,
    },
    {
      latitude: 39.806901,
      longitude: 116.297972,
    },
    {
      latitude: 39.906901,
      longitude: 116.397972,
    },
    {
      latitude: 39.706901,
      longitude: 116.397972,
    },
    {
      latitude: 40.06688438705133,
      longitude: 116.18563522088219,
    },
    {
      latitude: 40.027311378843564,
      longitude: 116.17952081121598,
    },
    {
      latitude: 39.99793594682176,
      longitude: 116.17062708823417,
    },
  ];
  initMap = async () => {
    await init({
      ios: '1500d840227f49e3fcbfb7f8463a3382',
      android: '53866f0e985f22e495b4a8f1a26bc1d3',
    });
  };
  componentDidMount() {
    setLocatingWithReGeocode(true);
    addLocationListener((location) => console.log('location：', location));
    this.initMap();
  }
  componentWillUnmount() {
    stop();
  }
  getCurrentPosition = () => {
    Geolocation.getCurrentPosition(({coords: {latitude, longitude}}) => {
      this.setState({latitude, longitude});
      this.mapView.setStatus(
        {tilt: 0, rotation: 0, zoomLevel: 16, center: {latitude, longitude}},
        1000,
      );
    });
  };
  _onMarkerPress = () => alert('onPress');
  _onInfoWindowPress = () => alert('onInfoWindowPress');
  drag = ({latitude, longitude}: any) =>
    console.log(`${latitude},${longitude}`);
  render() {
    return (
      <View style={StyleSheet.absoluteFill}>
        <MapView ref={(ref) => (this.mapView = ref)} style={{flex: 1}}>
          <MapView.Marker coordinate={this.state} />
          <MapView.Circle
            strokeWidth={1}
            strokeColor="rgba(0, 0, 255, 0.5)"
            fillColor="rgba(255, 0, 0, 0.5)"
            radius={50}
            coordinate={this.state}
          />

          <MapView.Marker
            active
            draggable
            title="一个可拖拽的标记"
            onDragEnd={this.drag}
            onInfoWindowPress={this._onInfoWindowPress}
            coordinate={this._coordinates[0]}
          />
          <MapView.Marker color="purple" coordinate={this._coordinates[1]} />
          <MapView.Marker
            image="flag"
            title="自定义图片"
            onPress={this._onMarkerPress}
            coordinate={this._coordinates[2]}
          />
          <MapView.Marker
            title="自定义 View"
            icon={() => (
              <View style={styles.customMarker}>
                <Text style={styles.markerText}>
                  {this.state.time.toLocaleTimeString()}
                </Text>
              </View>
            )}
            coordinate={this._coordinates[3]}
          />

          <MapView.Marker color="red" coordinate={this._coordinates[4]} />
          <MapView.Marker color="purple" coordinate={this._coordinates[6]} />
          <MapView.Marker color="green" coordinate={this._coordinates[5]} />
        </MapView>
        <View style={{marginBottom: 16}}>
          <Button
            title="定位"
            onPress={() => {
              this.getCurrentPosition();
            }}
          />
        </View>
      </View>
    );
  }
}

export default AMap;

const styles = StyleSheet.create({
  customIcon: {
    width: 40,
    height: 40,
  },
  customInfoWindow: {
    backgroundColor: '#8bc34a',
    padding: 10,
    borderRadius: 10,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#689F38',
    marginBottom: 5,
  },
  customMarker: {
    backgroundColor: '#009688',
    alignItems: 'center',
    borderRadius: 5,
    padding: 5,
  },
  markerText: {
    color: '#fff',
  },
});
