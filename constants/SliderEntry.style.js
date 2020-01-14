import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from './Colors';

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = viewportWidth;
// export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;

export default StyleSheet.create({
    slideInnerContainer: {
        // width: itemWidth,
        // height: slideHeight,
        // paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 18, // needed for shadow
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: "center"
    },
    shadow: {
        position: 'absolute',
        top: 0,
        left: itemHorizontalMargin,
        right: itemHorizontalMargin,
        bottom: 18,
        shadowColor: colors.black,
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        borderRadius: entryBorderRadius
    },
    imageContainer: {
        width: viewportWidth*0.7,
        height: viewportWidth*0.7,
        flex: 1,
        marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderRadius: Math.round(viewportWidth + viewportHeight)*0.7,
    },
    imageContainerEven: {
        backgroundColor: colors.black
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
        borderRadius: 50,  
    },
    // image's border radius is buggy on iOS; let's hack it!
    textContainer: {
        paddingTop: 40 - entryBorderRadius,
        paddingHorizontal: 18,

    },
    title: {
        color: colors.black,
        fontSize: 22,
        lineHeight: 26,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        textAlign: 'center'
    },
});