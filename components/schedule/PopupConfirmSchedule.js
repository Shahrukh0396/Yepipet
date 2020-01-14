import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    ScrollView,
    Modal,
    TouchableOpacity,
    Image,
    Dimensions,
    TextInput
} from 'react-native';
import styles from '../../constants/Form.style';
import PropTypes from 'prop-types';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
import DatePicker from 'react-native-datepicker';
import { dateHelper } from '../../src/helpers';
import { MaterialIcons } from '@expo/vector-icons';

export default class PopupConfirmSchedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: dateHelper.convertDate(new Date()),
            time: dateHelper.convertTime(new Date())
        }
    }

    static propTypes = {
        visible: PropTypes.bool,
        buttonText1: PropTypes.string,
        buttonText2: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        data: PropTypes.object
    }

    static defaultProps = {
        visible: false,
        title: 'Hooray. Complete?',
        description: 'Did you ﬁnish Give Kikland dog vitamin for Juno? (This recurring task will show the next due date when completed.)',
        buttonText1: 'Skip',
        buttonText2: 'Complete'
    }

    //Close Popup
    handleButton1(){
        if(this.props.handleButton1){
            this.props.handleButton1();
        }
    }

    handleButton2(){
        if(this.props.handleButton2){
            this.props.handleButton2(this.props.data, dateHelper.convertDateUtcDateTime(`${this.state.date} ${this.state.time}`));
        }
    }

    handleClose(){
        if(this.props.handleClose){
            this.props.handleClose();
        }
    }

    render() {
        const {
            visible, 
            buttonText1, 
            buttonText2, 
            title, 
            description
        } = this.props;
        
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible}
            >
                <View style={format.popup_backdrop}>
                    <View style={[format.popup_container, {position: 'relative'}]}>
                        <TouchableOpacity 
                            style={{position: 'absolute', right: 10, top: 4, width: 40}}
                            onPress={() => this.handleClose()}
                        >
                            <MaterialIcons name="close" size={30}/>
                        </TouchableOpacity>
                        <ScrollView scrollEnabled={true} scrollEventThrottle={200} showsVerticalScrollIndicator={false}>
                            <View style={{alignItems: 'center', marginBottom: 16}}>
                                <Image style={{width: 145, height: 107}} source={require('../../assets/images/img-dog-confirm.png')}/>
                            </View>
                            <Text style={format.text_title}>{title}</Text>
                            <Text style={format.text_description}>{description}</Text>
                            <View style={{marginBottom: 20}}>
                                <Text style={format.form_label}>Date</Text>
                                <View style={styles.form_datepicker} >
                                    <DatePicker
                                        style={{width: '100%'}}
                                        date={this.state.date}
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
                                        onDateChange={(date) => this._changeDateTime(date, this.state.time)}
                                    />
                                </View>
                            </View>
                            <View style={{marginBottom: 20}}>
                                <Text style={format.form_label}>Time</Text>
                                <View style={styles.form_datepicker} >
                                    <DatePicker
                                        style={{width: '100%'}}
                                        date={this.state.time}
                                        mode="time"
                                        placeholder=""
                                        format="LT"
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
                                                style={{width: 16, height: 16, marginRight: 20}}
                                                source={require('../../assets/images/icon-clock.png')}
                                            />
                                        }
                                        onDateChange={(time) => this._changeDateTime(this.state.date, time)}
                                    />
                                </View>
                            </View>
                            <View style={styles.form_group}>
                                <TouchableOpacity
                                    onPress={() => this.handleButton1()}
                                    style={[
                                        styles.form_button, 
                                        {flex: 0.5, marginRight: 5},
                                        format.form_button1
                                    ]}
                                >
                                    <Text style={[styles.button_text, {color: '#000000'}]}>{buttonText1}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.handleButton2()}
                                    style={[
                                        styles.form_button, 
                                        {flex: 0.5, marginLeft: 5}
                                    ]}
                                >
                                    <Text style={styles.button_text}>{buttonText2}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        );
    }

    _changeDateTime = (date, time) => {
        if(new Date(`${date} ${time}`) < new Date(this.props.data.tasks[0].completeTaskDateTime))
            this.setState({
                date: dateHelper.convertDate(new Date()),
                time: dateHelper.convertTime(new Date())
            })
        else 
        this.setState({
            date: date,
            time: time
        })
    }
}

const format = StyleSheet.create({
    popup_backdrop: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 16,
        paddingTop: 50,
        height: viewportHeight
    },
    popup_container: {
        borderRadius: 8,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 30,
        // alignItems: 'center'
        textAlign: 'center'
    },
    text_title: {
        color: '#000000',
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 15,
        textAlign: 'center'
    },
    text_description: {
        color: '#425159',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 20,
        textAlign: 'center',
    },
    form_button1:{
        backgroundColor: '#ebebf1'
    },
    form_label: {
        color: '#202c3c',
        fontWeight: '400',
        fontSize: 13,
        marginBottom: 6
    }
});