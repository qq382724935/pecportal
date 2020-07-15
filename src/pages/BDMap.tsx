import React, {Component} from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
// import {
//   BaiduMapManager,
//   MapView,
//   Geolocation,
//   Overlay,
// } from 'react-native-baidu-map';
// const {Marker, Circle, Polyline} = Overlay;
// Platform.OS === 'ios' &&
//   BaiduMapManager.initSDK('EACHkfyDnSgv1gxQQA4j487lCxZYf04T');

// const {width} = Dimensions.get('window');
import {Button, List} from '../components/index';
const CoorType = 'bd09ll';
class BDMap extends Component {
  state = {
    location: {latitude: 31.224366424942186, longitude: 121.36691287024577},
    center: {latitude: 31.224366424942186, longitude: 121.36691287024577},
    data: [],
    markers: [
      {
        location: {
          longitude: 121.36610488905758,
          latitude: 31.223214921265967,
        },
      },
      {
        location: {
          longitude: 121.36772183897553,
          latitude: 31.223153159792506,
        },
      },
      {
        location: {
          longitude: 121.36685048263087,
          latitude: 31.221663151893548,
        },
      },
      {
        location: {
          longitude: 121.36734455066136,
          latitude: 31.22438066143267,
        },
      },
    ],
  };

  getCurrentPosition = () => {
    Geolocation.getCurrentPosition()
      .then((data: any) => {
        const {latitude, longitude} = data;
        let _data = [];
        for (const key in data) {
          _data.push({label: key, value: data[key]});
        }
        console.log(_data);
        this.setState({
          location: {latitude, longitude},
          center: {latitude, longitude},
          data: _data,
        });
      })
      .catch(() => {});
  };

  startLocating = () => {
    Geolocation.startLocating((data: any) => {
      console.log(data);
    }, CoorType);
  };

  stopLocating = () => {
    Geolocation.stopLocating();
  };
  render() {
    const {location, center, data, markers} = this.state;
    const trackList = [
      {latitude: 31.224372941346875, longitude: 121.36736251677155},
      {latitude: 31.22397921612703, longitude: 121.36782065258164},
      {latitude: 31.223809373363963, longitude: 121.3696172636016},
      {latitude: 31.223994656362933, longitude: 121.36966217887708},
      {latitude: 31.223909735033942, longitude: 121.37099167103186},
    ];
    return (
      <SafeAreaView>
        <ScrollView>
          {/* <View style={styles.body}>
            <MapView
              showsUserLocation={true}
              locationData={location}
              zoom={18}
              trafficEnabled={true}
              zoomControlsVisible={true}
              mapType={MapTypes.NORMAL}
              center={center}
              style={{width, height: 400}}>
              <Marker location={location} />
              {markers.map((marker, index) => (
                <Marker
                  key={'marker-' + index}
                  title="点击了我"
                  location={marker.location}
                />
              ))}
              <Circle
                radius={200}
                stroke={{width: 1, color: 'AA000000'}}
                fillColor="AA000000"
                center={{
                  longitude: 121.36835065283253,
                  latitude: 31.226766137441103,
                }}
              />
              <Polyline
                points={trackList}
                stroke={{width: 1, color: 'AA000000'}}
              />
              <Marker
                title="自定义图标"
                icon={{
                  uri:
                    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1593593507618&di=b273e567d9925d19b389ea37a1c6d6f8&imgtype=0&src=http%3A%2F%2Fsxgs.open.com.cn%2FWeb_Study%2Fasset%2Fscripts%2Fareas%2Fstudent%2Fpersonal%2Fimg%2Fexpression_icon.jpg',
                }}
                location={{
                  latitude: 31.226719818097497,
                  longitude: 121.36763200842455,
                }}
              />
            </MapView>
          </View> */}
          <View style={styles.footer}>
            <Button.TextButton onPress={this.getCurrentPosition}>
              <Text>当前位置</Text>
            </Button.TextButton>
            <Button.TextButton onPress={this.startLocating}>
              <Text>持续定位</Text>
            </Button.TextButton>
            <Button.TextButton onPress={this.stopLocating}>
              <Text>停止持续定位</Text>
            </Button.TextButton>
          </View>
          <List.Describe list={data} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default BDMap;

const styles = StyleSheet.create({
  body: {flex: 1},
  footer: {padding: 8, flexDirection: 'row'},
});
