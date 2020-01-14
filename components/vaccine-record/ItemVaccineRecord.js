import React, {Component} from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import styles from '../../constants/Form.style';
import { MaterialIcons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-material-dropdown';
import DatePicker from 'react-native-datepicker';
import { VaccineStatus, iOS } from '../../src/common';
import {dateHelper} from '../../src/helpers';
export default class ItemVaccineRecord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrStatus: [
                {name: 'Completed', value: 'Completed', icon: 'check-circle', color: '#14c498'},
                {name: 'Not Needed', value: 'Not Needed', icon: 'not-interested', color: '#ee2323'},
                {name: 'Remind Me', value: 'Remind Me', icon: 'notifications', color: '#516bf0'}
            ],
            vaccine: '',
            vaccineName: '',
            vaccineDate: '',
            status: this.props.data.status || this.props.data.vaccineStatus,
            statusDefault: this.props.data.status || this.props.data.vaccineStatus,
            isHide: false,
            vaccineStatus: VaccineStatus
        }
    };
    static propTypes = {
        data: PropTypes.object,
        isAdd: PropTypes.bool
    }

    static defaultProps = {
        isAdd: false
    }

    componentWillReceiveProps(newProps) {    
        if(newProps.data.status !== this.props.data.status)
            this.setState({status: newProps.data.status, statusDefault: newProps.data.status})
    }
    componentWillMount() {
        this._getVaccineDate();
    }

    render () {
        const {arrStatus, vaccineName, customVaccineName, vaccineDate, isHide, status, statusDefault, vaccineStatus} = this.state;
        const {isAdd, data, petID} = this.props;
        const {navigate} = this.props.navigation;

        return (
            <View style={[styles.container_form, {position: 'relative', marginBottom: 26}]}>
                {
                    data.vaccineID ? 
                    <View>
                        <TouchableOpacity 
                            style={format.button_toggle} 
                            onPress={() => this.setState(prevState => ({isHide: !prevState.isHide}))}
                        >
                           <Image 
                                style={[{height: 21, width: 21}, isHide ? format.rotate_img : null]} 
                                source={require('../../assets/images/icon-up.png')}
                            />
                        </TouchableOpacity>
                        <View style={format.group_relative}>
                            <Image style={format.icon_style} source={require('../../assets/images/icon-vaccine.png')}/>
                            <Text style={[styles.title_container, {marginBottom: 15}]}>
                                { (data.vaccineName || data.customVaccineName) + '('+ (data.isMandatory || data.vaccineOrigin) +')' }
                            </Text>
                            {
                                (statusDefault && (statusDefault.toUpperCase() !== this.state.vaccineStatus.Completed)) ? null :
                                <Text style={styles.form_label_small}>
                                    Timing:  
                                    {
                                        data.vaccineTiming 
                                        ? 
                                            data.vaccineTiming 
                                        : 
                                            data.completedDate 
                                            ? 
                                                this._convertDate(data.completedDate.split(" ")[0]) 
                                                : 
                                                    data.reminderDateTime 
                                                    ? 
                                                        this._convertDate(data.reminderDateTime.split(" ")[0]) 
                                                    :
                                                        null
                                    }
                                </Text>
                            }
                        </View>
                        {
                            isHide ? null :
                            <View>
                                { (statusDefault && statusDefault.toUpperCase() === this.state.vaccineStatus.Completed) || (status && status.toUpperCase() === this.state.vaccineStatus.NotNeeded) ? null : 
                                <View style={[styles.form_datepicker, {marginVertical: 10}, (!this.state.vaccineDate && status && status.toUpperCase() === 'COMPLETED') ? styles.form_input_error : '']} >
                                    <DatePicker
                                        style={{width: '100%'}}
                                        date={vaccineDate}
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
                                        onDateChange={(date) => {this._onDate(date)}}
                                    />
                                </View>}
                                <View style={[styles.group_radio, {marginTop: 10, borderWidth: 0}]}>
                                    {arrStatus.map((item, i) => {
                                        return(
                                            <View key={item.value} style={{flex: 1/(arrStatus.length)}}>
                                                <MaterialIcons name={`${item.icon}`} color={`${item.color}`} size={24} style={{textAlign: 'center', marginBottom: 5}} />
                                                <TouchableOpacity
                                                    style={[
                                                        styles.btn_radio,
                                                        {borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e0e0e0'},
                                                        (status && item.value.toUpperCase() === status.toUpperCase()) ? styles.btn_radio_active : {},
                                                        i === (arrStatus.length - 1) ? {borderRightWidth: 1} : {},
                                                    ]}
                                                    onPress={() => this._onStatus(item.value)}
                                                    //disabled={statusDefault && statusDefault.toUpperCase() === this.state.vaccineStatus.Completed}
                                                >
                                                    {/* <MaterialIcons name={`${data.icon}`} color={`${data.color}`} size={24} /> */}
                                                    <Text style={(status && item.value.toUpperCase() === status.toUpperCase()) ? format.text_Choose : format.text_NoChoose}>{item.name}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })}
                                </View>
                                <View 
                                    style={{
                                        borderTopWidth: 1,
                                        borderTopColor: '#e0e0e0',
                                        marginTop: 20,
                                        marginHorizontal: -20
                                    }}
                                >
                                    <Text style={format.text_link} onPress={() => navigate('VaccineDetail', {vaccineDetail: data, petID: petID})}>View detail ></Text>
                                </View>
                            </View>
                        }
                    </View>
                    :
                    <View>
                        <View style={format.group_del}>
                            <TouchableOpacity style={format.button_del} onPress={() => this._onDel()}>
                                <MaterialIcons name="clear" color="#fff" size={20} style={format.text_icon_del} />
                            </TouchableOpacity>
                        </View>
                        <View style={[format.group_relative, {paddingRight: 0}]}>
                            <Image style={format.icon_style} source={require('../../assets/images/icon-vaccine.png')}/>
                            {/* <Dropdown
                                data={arrVaccine}
                                labelFontSize={16}
                                dropdownOffset={{top: 0, left: 0}}
                                inputContainerStyle={[styles.form_dropdown, {flex: 0.6}]}
                                rippleInsets={{top: 0, bottom: -4 }}
                                onChangeText={(value) => {this._handleChangeVaccine(value)}}
                            /> */}
                             <TextInput name='vaccine_name'
                                    style={[styles.form_input, !this.state.vaccineName ? styles.form_input_error : '']} 
                                    placeholder="Vaccine name" 
                                    onChangeText={this._onInput}
                            />
                            <View style={[styles.form_datepicker, {marginVertical: 10}, (!this.state.vaccineDate && status && status.toUpperCase() === 'COMPLETED') ? styles.form_input_error : '']} >
                                <DatePicker
                                    style={{width: '100%'}}
                                    date={vaccineDate}
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
                                    onDateChange={(date) => {this._onDate(date)}}
                                />
                            </View>
                        </View>
                        <View style={[styles.group_radio, {marginTop: 10, borderWidth: 0}]}>
                            {arrStatus.map((item, i) => {
                                return(
                                    <View key={item.value} style={{flex: 1/(arrStatus.length)}}>
                                        <MaterialIcons name={`${item.icon}`} color={`${item.color}`} size={24} style={{textAlign: 'center', marginBottom: 5}} />
                                        <TouchableOpacity
                                            style={[
                                                styles.btn_radio,
                                                {borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e0e0e0'},
                                                status && item.value.toUpperCase() === status.toUpperCase() ? styles.btn_radio_active : {},
                                                i === (arrStatus.length - 1) ? {borderRightWidth: 1} : {},
                                            ]}
                                            onPress={() => this._onStatus(item.value)}
                                        >
                                            {/* <MaterialIcons name={`${data.icon}`} color={`${data.color}`} size={24} />l */}
                                            <Text style={{color: status && item.value.toUpperCase() === status.toUpperCase() ? '#fff' : '#000', textAlign: 'center', fontSize: 16}}>{item.name}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                }
            </View>
        )
    }

    _selectStatusVaccine = (value) =>{
        // this.setState({status: value});
        // console.log('_selectStatusVaccine', value);
    }

    _getVaccineDate = (status) => {
        if (!status)
            status = this.state.status;
        const {vaccineStatus} = this.state;
        const {data} = this.props;

        let getVaccineDate = status && status.toUpperCase() === vaccineStatus.Completed 
                ? (data.vaccineCompleteDate ? data.vaccineCompleteDate : data.completedDate)
                : status && status.toUpperCase() === vaccineStatus.RemindMe
                ? (data.vaccineRemindMeDate ? data.vaccineRemindMeDate : data.reminderDateTime)
                : null;
        getVaccineDate = getVaccineDate ? this._convertDate(getVaccineDate.split(" ")[0]) : null;
        this.setState({vaccineDate: getVaccineDate}, ()=>{
            this.forceUpdate();
        });
    }

    _handleChangeVaccine = (value) => {
        this.setState({vaccine: value});
    }

    _onInput = (value) => {
        this.setState({vaccineName: value});
        this.props.onChangeValue(value, this.props.data.index);
    }

    _onDate = (date) => {
        this.setState({vaccineDate: date});
        this.props.onChangeDate(date, this.props.data.index);
    }

    _onStatus = (value) => {
        this._getVaccineDate(value);
        this.setState({status: value});
        this.props.onChangeStatus(value, this.props.data.index);
        
        // if (value.toUpperCase() !== 'COMPLETED')
        //     this._onDate(null);
    }

    _convertDate = (date) => {
        return dateHelper.convertDate(date);
    }

    _onDel = () => {
        if(this.props.onDel)
            this.props.onDel(this.props.data.index)
    }
}

const format = StyleSheet.create({
    icon_style: {
        width: 24,
        height: 24,
        marginRight: 10,
        position: 'absolute'
    },
    button_toggle: {
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1,
        height: 22,
        width: 22,
        backgroundColor: 'rgba(78, 148, 178, 0.08)',
        borderRadius: 22/2,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    group_relative: {
        position: 'relative',
        paddingHorizontal: 34
    },
    text_link: {
        color: '#4e94b2',
        fontSize: iOS ? 12 : 15,
        fontWeight: '600',
        textAlign: 'center',
        paddingTop: 16,
        backgroundColor: 'transparent'
    },
    rotate_img: {
        transform: [{
            rotate: "180deg"
        }]
    },

    button_del: {
        height: 30,
        width: 30,
        position: 'absolute',
        right: -10,
        top: -10,
        borderRadius: 30/2,
        backgroundColor: 'red'
    },

    group_del: {
        position: 'relative',
        paddingBottom: 30,
    },

    text_icon_del: {
        fontWeight: 'bold',
        padding: 5
    },
    
    text_NoChoose: {
        color: '#000',
        textAlign: 'center',
        fontSize: iOS ? 11 : 16
    },
    text_Choose: {
        color: '#fff',
        textAlign: 'center',
        fontSize: iOS ? 11 : 16
    }
});