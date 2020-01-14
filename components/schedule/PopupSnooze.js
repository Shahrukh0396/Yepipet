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
import { Dropdown } from 'react-native-material-dropdown';

export default class PopupConfirmSchedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrSnooze: [{value: '1 day'}, {value: '1 week'}, {value: '1 month'}, {value: '3 month'}],
            dateType: '1 day'
        }
    }

    static propTypes = {
        visible: PropTypes.bool,
        buttonText1: PropTypes.string,
        buttonText2: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
    }

    static defaultProps = {
        visible: false,
        title: 'Meow. Snooze Grooming?',
        description: 'During the snooze, no reminder will be created for this care schedule.',
        buttonText1: 'Cancel',
        buttonText2: 'Confirm'
    }

    //Close Popup
    handleButton1(){
        if(this.props.handleButton1){
            this.props.handleButton1();
        }
    }

    handleButton2(){
        if(this.props.handleButton2){
            this.props.handleButton2(this.state.dateType);
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

        const {arrSnooze, dateType} = this.state;
        
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible}
            >
                <View style={format.popup_backdrop}>
                    <View style={[format.popup_container, {position: 'relative'}]}>
                        <TouchableOpacity 
                            style={{position: 'absolute', right: 5, top: 4, width: 40}}
                            onPress={() => this.handleClose()}
                        >
                            <MaterialIcons name="close" size={30}/>
                        </TouchableOpacity>
                        <ScrollView scrollEnabled={true} scrollEventThrottle={200} showsVerticalScrollIndicator={false}>
                            <View style={{alignItems: 'center', marginBottom: 16}}>
                                <Image style={{width: 145, height: 107}} source={require('../../assets/images/img-dog-confirm.png')}/>
                            </View>
                            <Text style={format.text_title}>{title}</Text>
                            <View>
                                <Text style={format.text_description}>Snooze for</Text>
                                <Dropdown
                                    data={arrSnooze}
                                    labelFontSize={16}
                                    dropdownOffset={{top: 0, left: 0}}
                                    inputContainerStyle={styles.form_dropdown}
                                    rippleInsets={{top: 0, bottom: -4 }}
                                    onChangeText={(value) => {this.setState({dateType: value})}}
                                />
                            </View>
                            <Text style={format.text_description}>{description}</Text>
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