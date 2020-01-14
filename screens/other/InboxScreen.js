import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    AsyncStorage
} from 'react-native';
import styles from '../../constants/Form.style';

export default class Inbox extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {navigate} = this.props.navigation;

        return (
            <SafeAreaView style={styles.safeArea}>
                <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                    <View style={styles.container}>
                        <Text style={{textAlign: 'center', paddingTop: 100}}>Coming Soon</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}
