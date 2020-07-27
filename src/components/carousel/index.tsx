import React, {PureComponent} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
import Carousel, {
  ParallaxImage,
  AdditionalParallaxProps,
} from 'react-native-snap-carousel';

export interface CarouselCustomProps {
  data: string[];
  onChange: Function;
}
export interface CarouselCustomDataProps {
  title: string;
  subtitle: string;
  illustration: string;
}

interface RenderItem {
  item: CarouselCustomDataProps;
  index: number;
}

class CarouselCustom extends PureComponent<CarouselCustomProps> {
  renderItem = (
    {item, index}: RenderItem,
    parallaxProps: AdditionalParallaxProps,
  ) => {
    return (
      <>
        <View style={styles.item}>
          <ParallaxImage
            source={{uri: item.illustration}}
            containerStyle={[styles.imageContainer]}
            style={styles.image}
            parallaxFactor={0}
            {...parallaxProps}
          />
          <TouchableOpacity
            onPress={() => {
              this.props.onChange(index);
            }}>
            <View
              style={{
                alignItems: 'center',
                marginTop: 8,
              }}>
              <Image
                style={{width: 32, height: 32}}
                source={require('../../assets/icon/delete.png')}
              />
            </View>
          </TouchableOpacity>
          {/* <Text>{item.title}</Text> */}
        </View>
      </>
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
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
});
