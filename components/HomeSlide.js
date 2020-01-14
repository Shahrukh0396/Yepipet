import React, { Component } from 'react';
import { Platform, View, ScrollView, Text, StatusBar, SafeAreaView, TouchableHighlight, TouchableOpacity, StyleSheet, Dimensions, Linking} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from '../constants/SliderEntry.style';
import SliderEntry from './SliderEntry';
import styles from '../constants/Colors';
import colorClass, { colors } from '../constants/Colors';
import { ENTRIES1, ENTRIES2 } from '../static/entries';
import { scrollInterpolators, animatedStyles } from '../constants/Animations';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 1;
import {connect} from 'react-redux';
import getVersionAction from '../src/apiActions/info/getVersion';

class HomeSlide extends Component {
    constructor (props) {
        super(props);
        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM
        };
    }

    async componentWillMount(){
        await this.props.getVersionAction();
    }

    _renderItem ({item, index}) {
        return <SliderEntry data={item} even={(index + 1) % 2 === 0} />;
    }

    _renderItemWithParallax ({item, index}, parallaxProps) {
        return (
            <SliderEntry
              data={item}
              even={(index + 1) % 2 === 0}
              parallax={true}
              parallaxProps={parallaxProps}
            />
        );
    }

    _renderLightItem ({item, index}) {
        return <SliderEntry data={item} even={false} />;
    }

    _renderDarkItem ({item, index}) {
        return <SliderEntry data={item} even={true} />;
    }

    mainSlider () {
        const { slider1ActiveSlide } = this.state;

        return (
            <View style={styles.exampleContainer}>
                <Carousel
                    ref={(c) => { this._slider1Ref = c }}
                    data={ENTRIES1}
                    renderItem={this._renderItemWithParallax}
                    sliderWidth={sliderWidth}
                    itemWidth={itemWidth}
                    hasParallaxImages={true}
                    firstItem={SLIDER_1_FIRST_ITEM}
                    inactiveSlideScale={0.94}
                    inactiveSlideOpacity={0.7}
                    inactiveSlideShift={20}
                    containerCustomStyle={styles.slider}
                    contentContainerCustomStyle={styles.sliderContentContainer}
                    loop={true}
                    loopClonesPerSide={2}
                    autoplay={true}
                    // //   autoplayDelay={1000}
                    autoplayInterval={3000}
                    // onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                    onBeforeSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                    initialNumToRender={1}
                    removeClippedSubviews={true}
                />
                <Pagination
                    dotsLength={ENTRIES1.length}
                    activeDotIndex={slider1ActiveSlide}
                    containerStyle={styles.paginationContainer}
                    dotColor={'#b9e2f7'}
                    dotStyle={styles.paginationDot}
                    inactiveDotColor={colors.black}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                    carouselRef={this._slider1Ref}
                    tappableDots={!!this._slider1Ref}
                />
            </View>
        );
    }

    render () {
        const mainSlider = this.mainSlider();
        const {navigate} = this.props.navigation;
        
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <StatusBar
                      translucent={true}
                      backgroundColor={'rgba(0, 0, 0, 0.3)'}
                      barStyle={'light-content'}
                    />
                    <ScrollView
                      style={styles.scrollview}
                      scrollEventThrottle={200}
                      directionalLockEnabled={true}
                    >
                        { mainSlider }
                        <View style={styles.container}>
                            <TouchableOpacity style={stylesScreen.button_style} onPress={() => navigate('CreateAccount')}>
                                <Text style={stylesScreen.button_text}> Create Account </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[stylesScreen.button_style, stylesScreen.button_blue]} onPress={() => navigate('SignIn')}>
                                {/* <TouchableHighlight
                                    onPress={() => navigate('SignIn')}
                                > */}
                                    <Text style={stylesScreen.button_text}> Login </Text>
                                {/* </TouchableHighlight> */}
                            </TouchableOpacity>
                            <View>
                                <Text style={stylesScreen.privacy}>By signing up, you agree with the <Text style={colorClass.blue} onPress={() => Linking.openURL('http://www.yepipet.com/terms-of-service/')}>Terms of Service</Text> and <Text style={colorClass.blue} onPress={() => Linking.openURL('http://www.yepipet.com/privacy-policy/')}>Privacy Policy</Text></Text>
                                <Text style={[stylesScreen.privacy, {fontSize: 11, color: 'rgba(0,0,0,0.5)'}]}>{this.props.getVersion.data}</Text>
                                <Text style={[stylesScreen.privacyBuild, {fontSize: 11, color: 'rgba(0,0,0,0.5)'}]}>TFR1.S1.020</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => ({
    getVersion: state.getVersion
});

const mapDispatchToProps = {
    getVersionAction
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeSlide);
  
const stylesScreen = StyleSheet.create({
    button_style: {
      borderColor: colors.orange,
      borderWidth: 1,
      borderRadius: 30,
      width: viewportWidth*0.8,
      height: 50,
      backgroundColor: colors.orange,
      justifyContent: 'center',
      alignItems: 'center',
      textAlignVertical: "center",
      textAlign: "center",
      marginBottom: 20,
    },
    button_blue: {
      borderColor: colors.blue,
      backgroundColor: colors.blue,
    },
    button_text: {
      color: "#FFFFFF",
      fontWeight: "500"
    },
    privacy: {
      width: viewportWidth*0.8,
      marginBottom: 5,
      textAlign: "center",
      lineHeight: 22
    },
    privacyBuild: {
      width: viewportWidth*0.8,
      marginBottom: 40,
      textAlign: "center",
      lineHeight: 22
    },
  });