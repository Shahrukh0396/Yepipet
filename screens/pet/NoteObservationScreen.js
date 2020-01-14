import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import {Alert, ImageEditor} from 'react-native';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import styles from '../../constants/Form.style';
import { EvilIcons } from '@expo/vector-icons';
import DatePicker from 'react-native-datepicker';
import {dateHelper} from '../../src/helpers';

class NoteObservation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: '07/07/2018',
            time: '05:30 PM'
        }
    }

    render() {
        const {date, time} = this.state;

        return (
            <SafeAreaView style={styles.safeArea}>
                <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                    <View style={styles.container}>
                        <View style={{position:'relative', paddingBottom: 22, paddingTop: 25, justifyContent: 'center'}}>
                            <TouchableOpacity 
                                style={styles.button_back} 
                                onPress={() => this.props.navigation.goBack()}
                            >
                                <Image style={{width: 12, height: 21}} source={require('../../assets/images/icon-back.png')}/>
                            </TouchableOpacity>
                            <Text style={[styles.title_head, {alignSelf: 'center'}]}>Feeding</Text>
                        </View>

                        <View style={[styles.container_form, {position: 'relative'}]}>

                            <Text style={[styles.title_container, {paddingRight: 40, marginBottom: 10, fontWeight: '700'}]}>
                                Feeding Instructions Summary
                            </Text>
                            <TouchableOpacity style={format.button_edit}>
                                <Image style={{justifyContent: 'center', height: 27, width: 27}} source={require('../../assets/images/icon-edit.png')}/>
                            </TouchableOpacity>
                            <Text style={styles.text_normal}>Feed 2 cups / 2x Daily. Approx 8 am and 6pm.</Text>
                        </View>

                        <TouchableOpacity style={styles.form_button}>
                            <Text style={styles.button_text}>Note an Observation</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

export default NoteObservation;

const format = StyleSheet.create({
    button_edit: {
        position:'absolute',
        zIndex: 1,
        right: 16,
        top: 16,
        borderWidth: 1, 
        borderColor: '#f0f0f0',
        borderRadius: 30/2,
    },
    text_normal: {
        color: 'rgba(32, 44, 60,0.4)',
        fontSize: 15,
        fontWeight: '400',
        marginBottom: 18

    }
});