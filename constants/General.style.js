import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from './Colors';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export default StyleSheet.create({
    bold: {
        fontWeight: 'bold'
    },
    mb10: {
        marginBottom: 10
    },
    mb20: {
        marginBottom: 20
    },
    mb30: {
        marginBottom: 30
    }
})