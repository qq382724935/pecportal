import React, {PureComponent} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  Text,
} from 'react-native';
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
import Carousel, {
  ParallaxImage,
  AdditionalParallaxProps,
} from 'react-native-snap-carousel';
declare global {
  namespace NodeJS {
    interface Global {
      carouselRef: any;
    }
  }
}
export interface CarouselCustomProps {
  data: string[];
  onChange: Function;
}
export interface CarouselCustomDataProps {
  title: string;
  subtitle: string;
  illustration: string;
  key?: string;
}

interface RenderItem {
  item: CarouselCustomDataProps;
  index: number;
}
class CarouselCustom extends PureComponent<CarouselCustomProps> {
  state = {index: 0};
  renderItem = (
    {item, index}: RenderItem,
    parallaxProps: AdditionalParallaxProps,
  ) => {
    return (
      <View
        style={{
          ...styles.item,
          marginTop: Platform.OS === 'android' ? 12 : 0,
        }}>
        <ParallaxImage
          source={{uri: item.illustration}}
          containerStyle={[styles.imageContainer]}
          style={styles.image}
          parallaxFactor={0}
          {...parallaxProps}
        />
        <>
          <View style={styles.delete}>
            <Text style={{fontSize: 16, color: '#fff', letterSpacing: 2}}>
              第{index + 1}/{this.props.data.length}张
            </Text>
          </View>
          <View style={styles.delete}>
            <TouchableOpacity onPress={() => this.props.onChange(index)}>
              <Image
                style={{width: 32, height: 32}}
                source={require('../../assets/icon/delete.png')}
              />
            </TouchableOpacity>
          </View>
        </>
      </View>
    );
  };

  render() {
    const {data} = this.props;
    // 传过来的是['file://'] 转换格式
    const dataToData = () => {
      return data.map((item) => ({
        title: '',
        subtitle: '',
        illustration: item,
      }));
    };
    return (
      <Carousel
        ref={(r) => (global.carouselRef = r)}
        onSnapToItem={(index) => this.setState({index})}
        sliderWidth={screenWidth}
        sliderHeight={screenHeight}
        itemWidth={screenWidth - 60}
        data={dataToData()}
        hasParallaxImages={true}
        renderItem={this.renderItem}
      />
    );
  }
}
export default CarouselCustom;
const styles = StyleSheet.create({
  item: {
    width: screenWidth - 60,
    height: screenHeight - 140,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 10,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  delete: {
    alignItems: 'center',
    marginTop: 8,
  },
});
