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

class AddObservation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: '07/07/2018',
            time: '05:30 PM'
        }
    }

    render() {
        const {petDetail, ageMonth,navigate} = this.props.navigation.state.params;
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
                            <Text style={[styles.title_head, {alignSelf: 'center'}]}>Add an Observation</Text>
                        </View>

                        <View style={styles.group_avatar}>
                            <View style={{alignItems: 'center'}}>
                                <Image style={styles.image_circle} 
                                    source={petDetail.petPortraitURL ? {uri: petDetail.petPortraitURL} : require('../../assets/images/img-pet-default.png')}
                                />
                                <View style={{flexDirection:'row', flexWrap:'wrap', marginBottom: 8, alignItems: 'stretch'}}>
                                    <Text style={styles.pet_name}>{petDetail && petDetail.petName}</Text>
                                    <Text style={styles.pet_info}>
                                        {petDetail && petDetail.ageInYears} {petDetail.ageInYears > 1 ? `Years` : `Year`} { petDetail.ageMonth ? petDetail.ageMonth > 1 ? `${petDetail.ageMonth} Months` : `${petDetail.ageMonth} Month` : null }
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.container_form}>
                            <View style={{marginBottom: 16}}>
                                <Text style={styles.form_label_small}>Date</Text>
                                <View style={styles.form_datepicker}>
                                    <DatePicker
                                        style={{width: '100%'}}
                                        date={date}
                                        mode="date"
                                        placeholder="  /   /"
                                        format="MM/DD/YYYY"
                                        minDate="01/01/1900"
                                        confirmBtnText="Done"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                            dateIcon: {
                                                position: 'absolute',
                                                right: 0,
                                                top: 4
                                            },
                                            dateInput: {
                                                marginRight: 36,
                                                borderWidth: 0,
                                                height: 44,
                                                alignItems: 'flex-start',
                                                padding: 9
                                            }
                                        }}
                                        iconComponent={
                                            <Image 
                                                style={{width: 15, height: 16, marginRight: 20}}
                                                source={require('../../assets/images/icon-date.png')}
                                            />
                                        }
                                        onDateChange={(date) => {this.setState({date: date})}}
                                    />
                                </View>
                            </View>

                            <View style={{marginBottom: 16}}>
                                <Text style={styles.form_label_small}>Time</Text>
                                <View style={styles.form_datepicker}>
                                    <DatePicker
                                        style={{width: '100%'}}
                                        date={time}
                                        mode="time"
                                        placeholder="  /   /"
                                        format="HH:mm A"
                                        minDate="01/01/1900"
                                        confirmBtnText="Done"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                            dateIcon: {
                                                position: 'absolute',
                                                right: 0,
                                                top: 4
                                            },
                                            dateInput: {
                                                marginRight: 36,
                                                borderWidth: 0,
                                                height: 44,
                                                alignItems: 'flex-start',
                                                padding: 9
                                            }
                                        }}
                                        iconComponent={
                                            <Image 
                                                style={{width: 15, height: 16, marginRight: 20}}
                                                source={require('../../assets/images/icon-clock.png')}
                                            />
                                        }
                                        onDateChange={(time) => {this.setState({time: time})}}
                                    />
                                </View>
                            </View>

                            <View style={{marginBottom: 16}}>
                                <Text style={styles.form_label_small}>Observation</Text>
                                <TextInput
                                    style={[styles.form_input, {height: 82}]}
                                    editable = {true}
                                    maxHeight = {82}
                                    multiline = {true}
                                />
                            </View>
                        </View>

                        <TouchableOpacity style={styles.form_button}>
                            <Text style={styles.button_text}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

export default AddObservation;