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

export interface CarouselCustomProps {
  data: string[];
  onChange: Function;
  carouselKey: number;
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
  state = {
    index: 0,
  };

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps.data.length === nextProps.carouselKey) {
      this.setState({index: nextProps.carouselKey - 1});
    } else {
      this.setState({index: nextProps.carouselKey});
    }
  }

  renderItem = (
    {item, index}: RenderItem,
    parallaxProps: AdditionalParallaxProps,
  ) => {
    return (
      <>
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
          {index === this.state.index && (
            <>
              <View style={{alignItems: 'flex-start', marginTop: 8}}>
                <Text style={{fontSize: 16, color: '#fff', letterSpacing: 5}}>
                  第{index + 1}/{this.props.data.length}张
                </Text>
              </View>
              <View style={{alignItems: 'center'}}>
                <TouchableOpacity onPress={() => this.props.onChange(index)}>
                  <Image
                    style={{width: 32, height: 32}}
                    source={require('../../assets/icon/delete.png')}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
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
        onSnapToItem={(index) => {
          this.setState({index});
        }}
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
