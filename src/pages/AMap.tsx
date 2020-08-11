import React, {Component} from 'react';
import {
  Button,
  Alert,
  StyleSheet,
  PermissionsAndroid,
  View,
  Platform,
} from 'react-native';
import {
  init,
  Geolocation,
  setLocatingWithReGeocode,
  addLocationListener,
} from 'react-native-amap-geolocation';
// 使用自己申请的高德 App Key 进行初始化
import {MapView, LatLng} from 'react-native-amap3d';
import {getDistance} from 'geolib';
import {postMessageH5, PEC_MODULE} from '../utils/webview';
const {alert} = Alert;
interface AMapProps {
  route: any;
}
Platform.OS === 'android' &&
  PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  ]);
const ZOMM_LEVEL = 16;
const RADIUS = 100;
export class AMap extends Component<AMapProps> {
  constructor(props: Readonly<AMapProps>) {
    super(props);
  }
  state = {
    circle: {
      latitude: 39.906901,
      longitude: 116.397972,
    },
    marker: {
      latitude: 39.906901,
      longitude: 116.397972,
    },
  };
  mapView: any;
  initMap = async () => {
    await init({
      ios: '1500d840227f49e3fcbfb7f8463a3382',
      android: '53866f0e985f22e495b4a8f1a26bc1d3',
    });
  };

  async componentDidMount() {
    await this.initMap();
    setLocatingWithReGeocode(true);
    this.isGeo() && this.getCurrentPosition();
    addLocationListener((location) => {
      if (location.errorCode !== 0) {
        alert(`${location.locationDetail}`);
      }
    });
  }

  getCurrentPosition = () => {
    Geolocation.getCurrentPosition(({coords: {latitude, longitude}}) => {
      this.setState({
        marker: {latitude, longitude},
        circle: {latitude, longitude},
      });
      if (this.mapView) {
        this.mapView.setStatus(
          {
            tilt: 0,
            rotation: 0,
            center: {latitude, longitude},
            zoomLevel: this.props.route.params.zoomLevel || 16,
          },
          10, // 地图显示的时间
        );
      }
    });
  };
  _onMarkerPress = () => alert('onPress');
  _onInfoWindowPress = () => alert('onInfoWindowPress');
  drag = (data: LatLng) => {
    const {marker, circle} = this.state;
    const markerT = marker;
    this.setState({marker: data}, () => {
      if (this.isRice(getDistance(circle, data))) {
        this.setState({marker: markerT});
        this.mapView.setStatus({center: circle}, 10);
      }
    });
  };

  // 是否是H5打开
  isH5 = () => this.props.route.params.pageType === '2';
  // 是否是定位
  isGeo = () => this.props.route.params.moduleName === 'PEC_MAP_GEOLOCATION';
  // 是否超过Circle radius半径
  radius = () => {
    if (this.isH5()) {
      return this.props.route.params.radius / 2;
    }
    return RADIUS;
  };
  isRice = (distance: number) => distance > this.radius();
  // 定位显示按钮判断
  geoFooter = () => {
    return (
      <View style={{marginBottom: 16}}>
        {this.isH5() ? (
          <Button
            title="确认"
            onPress={() => {
              postMessageH5({
                moduleName: PEC_MODULE.PEC_MAP_GEOLOCATION.value,
                data: {...this.state},
              });
            }}
          />
        ) : (
          <Button title="定位" onPress={this.getCurrentPosition} />
        )}
      </View>
    );
  };
  // 定位mapview相关渲染
  GeoRender = () => {
    const {marker, circle} = this.state;
    if (this.isGeo() || !this.isH5()) {
      return (
        <>
          <MapView.Circle
            strokeWidth={1}
            strokeColor="rgba(0, 0, 255, 0.5)"
            fillColor="rgba(255, 0, 0, 0.5)"
            radius={this.radius() || RADIUS}
            coordinate={circle}
          />
          <MapView.Marker
            active
            draggable
            title="长按调整位置"
            onDragEnd={this.drag}
            // onInfoWindowPress={this._onInfoWindowPress}
            coordinate={marker}
          />
        </>
      );
    }
    return null;
  };
  AMap3D = () => {
    if (!this.isGeo()) {
      const {markerList = []} = this.props.route.params;
      interface MarkerListProps {
        color: string;
        coordinate: LatLng;
      }
      const markerPress = (data: MarkerListProps) => {
        postMessageH5({
          moduleName: PEC_MODULE.PEC_MAP_AMAP3D.value,
          data: data,
        });
      };
      return (
        <>
          {markerList.map((item: MarkerListProps, index: number) => (
            <MapView.Marker
              infoWindowDisabled={true}
              key={`${index}`}
              color={item.color ? item.color : 'red'}
              coordinate={item.coordinate}
              onPress={() => markerPress({...item})}
            />
          ))}
        </>
      );
    }
    return null;
  };
  render() {
    const {zoomLevel} = this.props.route.params;
    return (
      <View style={StyleSheet.absoluteFill}>
        <MapView
          ref={(ref) => {
            this.mapView = ref;
          }}
          zoomLevel={zoomLevel || ZOMM_LEVEL}
          style={{flex: 1}}>
          <this.GeoRender />
          <this.AMap3D />
        </MapView>
        {/* 定位或者壳子定入显示 */}
        {(this.isGeo() || !this.isH5()) && this.geoFooter()}
      </View>
    );
  }
}

export default AMap;
