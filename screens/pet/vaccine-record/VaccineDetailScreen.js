import React, {Component} from 'react';
import {connect} from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    FlatList,
    Switch,
    AsyncStorage,
    KeyboardAvoidingView
} from 'react-native';
import styles from '../../../constants/Form.style';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { Dropdown } from 'react-native-material-dropdown';
import DatePicker from 'react-native-datepicker';
import updateVaccineAction from '../../../src/apiActions/vaccine/updateVaccine';
import getVaccineDetailAction from '../../../src/apiActions/vaccine/getVaccineDetail';
import createReminderAction from '../../../src/apiActions/reminder/createReminder';
import getReminderByOwnerAction from '../../../src/apiActions/reminder/getReminderByOwner';
import getRepeatTypesAction from '../../../src/apiActions/reminder/getRepeatTypes';
import PopupNotification from '../../../components/PopupNotification';
import {dateHelper} from '../../../src/helpers';
import {VaccineStatus, iOS} from '../../../src/common';

class ViewVaccine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrStatus: [
                {name: 'Completed', value: 'Completed', icon: 'check-circle', color: '#14c498'},
                {name: 'Not Needed', value: 'Not Needed', icon: 'not-interested', color: '#ee2323'},
                {name: 'Remind Me', value: 'Remind Me', icon: 'bell', color: '#ee7a23'}
            ],
            status: 'Completed',
            statusDefault: '',
            arrVaccine: [
                {value: "Distemper, measles, parainfluenza (Age 0: 6-8 week) [Recommended]"},
                {value: "Bordetella (Age 0: 6-8 week) [Recommended]"},
                {value: "Bordetella (Age 0: 10-12 week) [Optional]"}
            ],
            completeDate: null,
            remindMeDate: null,
            arrSchedule: [
                "Initial vaccination no later than 4 mos after birth",
                "Second vaccination within one year after the first",
                "Depending on the brand of the vaccine, recurring vaccination (booster shots) should occur annually or every 3 yrs"
            ],
            arrProvider: [],
            arrFrequency: [
                {value: 'One Time'},
                {value: 'Every 6 Month'},
                {value: 'Yearly'}
            ],
            careProvider: null,
            valueFrequency: null,
            valueVaccine: null,
            isPushNotification: false,
            isSyncToCalendar: true,
            pushNotification: 'off',
            syncToCalendar: 'on',
            visibleNotification: false,
            notifyTitle: '',
            NotifyText: '',
            note: '',
            vaccineDetail: null,
            vaccineStatus: VaccineStatus,
            isSubmit: false
        }
    };

    async componentWillMount() {
        console.log(this.props.navigation.state.params)
        const {params} = this.props.navigation.state;
        this._getProviders();
        let completeDate;
        let remindMeDate;
        if(params.vaccineDetail.vaccineName && !params.vaccineDetail.petVaccineHistoryID) {
            if (params.vaccineDetail.vaccineStatus.toUpperCase() === VaccineStatus.RemindMe)
                remindMeDate = params.vaccineDetail.vaccineRemindMeDate ? new Date(params.vaccineDetail.vaccineRemindMeDate) : null;
            else
                remindMeDate = null;
            completeDate = params.vaccineDetail.vaccineCompleteDate ? new Date(params.vaccineDetail.vaccineCompleteDate) : null;
        } else {
            if (params.vaccineDetail.status.toUpperCase() === VaccineStatus.RemindMe) {
                remindMeDate = (params.vaccineDetail.relatedReminderList && params.vaccineDetail.relatedReminderList[0])  ? dateHelper.jsCoreDateCreator(params.vaccineDetail.relatedReminderList[0].reminderDateTime) : null;
            }
            else  remindMeDate = null;
            completeDate = params.vaccineDetail.completedDate ? new Date(params.vaccineDetail.completedDate) : null;
        }
        if(params && params.vaccineDetail) {
            this.setState({
                status: params.vaccineDetail.vaccineStatus || params.vaccineDetail.status,
                statusDefault: params.vaccineDetail.vaccineStatus || params.vaccineDetail.status,
                note: params.vaccineDetail.vaccineNote,
                completeDate: completeDate,
                remindMeDate: remindMeDate,
            })

            if ((params.vaccineDetail.vaccineID !== 999999) && params.vaccineDetail.petVaccineHistoryID) {
                await this.props.getVaccineDetailAction(params.vaccineDetail.vaccineID);
                this.setState({vaccineDetail: this.props.getVaccineDetail.data});
            } else {
                this.setState({vaccineDetail: params.vaccineDetail});
            }
        }
        this.props.getProvidersByOwner.data; 
    }

    render () {
        const {arrStatus,arrVaccine, completeDate, remindMeDate, status, statusDefault, arrProvider, arrFrequency, isSubmit, pushNotification, syncToCalendar, vaccineDetail} = this.state;
        const {params} = this.props.navigation.state;
        const {navigate} = this.props.navigation;

        return (
            <KeyboardAvoidingView
                behavior="padding"
                enabled 
                style={{ flex: 1 }}
            >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                    <Spinner visible={this.props.updateVaccine.loading}/>
                    <View style={styles.container}>
                        <View style={{position:'relative', paddingBottom: 22, paddingTop: 25, justifyContent: 'center'}}>
                            <TouchableOpacity 
                                style={styles.button_back} 
                                onPress={() => this.props.navigation.goBack()}
                            >
                                <Image style={{width: 12, height: 21}} source={require('../../../assets/images/icon-back.png')}/>
                            </TouchableOpacity>
                            {
                                params && params.vaccineDetail ?
                                <Text style={[styles.title_head, {alignSelf: 'center'}]}>View Vaccine</Text>
                                :<Text style={[styles.title_head, {alignSelf: 'center'}]}>Add a Vaccine</Text>
                            }
                        </View>
                        <View style={[styles.container_form, {marginBottom: 26}]}>
                            <View style={format.group_relative}>
                                <Image style={format.icon_style} source={require('../../../assets/images/icon-vaccine.png')}/>
                                {params && params.vaccineDetail ?
                                    <Text style={[styles.title_container, {marginBottom: 15}]}>
                                        {params.vaccineDetail.vaccineName}
                                    </Text> :
                                    <View>
                                        <Dropdown
                                            data={arrVaccine}
                                            labelFontSize={16}
                                            dropdownOffset={{top: 0, left: 0}}
                                            inputContainerStyle={styles.form_dropdown}
                                            rippleInsets={{top: 0, bottom: -4 }}
                                            onChangeText={(value) => {this._handleChangeVaccine(value)}}
                                        />
                                        <View style={styles.form_group}>
                                            <Text style={[styles.form_label, {flex: 1,width: '40%'}]}>Frequency</Text>
                                            <View style={{width: '60%'}}>
                                                <Dropdown
                                                    data={arrFrequency}
                                                    labelFontSize={16}
                                                    dropdownOffset={{top: 0, left: 0}}
                                                    inputContainerStyle={styles.form_dropdown}
                                                    rippleInsets={{top: 0, bottom: -4 }}
                                                    onChangeText={(value) => {this._handleChangeFrequency(value)}}
                                                    valueExtractor={(value) => value}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                }
                                <Text style={styles.form_label_small}>
                                    Timing: {(vaccineDetail && vaccineDetail.vaccineTiming) || ''}
                                </Text>
                            </View>
                            <View style={[styles.group_radio, {marginTop: 10, marginBottom: 20, flex: 0.6}]}>
                                {arrStatus.map((item, i) => {
                                    return(
                                        <TouchableOpacity
                                            key={item.value} 
                                            style={[
                                                styles.btn_radio,
                                                item.value.toUpperCase() === status.toUpperCase() ? styles.btn_radio_active : {},
                                                {flex: 1/(arrStatus.length)},
                                                i === 0 ? styles.btn_radio_noborder : {}
                                            ]}
                                            onPress={() => this._handleChangeStatus(item.value)}
                                            disabled={statusDefault && statusDefault.toUpperCase() === this.state.vaccineStatus.Completed}
                                        >
                                            {/* <MaterialIcons name={`${data.icon}`} color={`${data.color}`} size={24} />l */}
                                            <Text style={item.value.toUpperCase() === status.toUpperCase() ? format.text_Choose : format.text_NoChoose  }>{item.name}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                            {status.toUpperCase() !== this.state.vaccineStatus.RemindMe ? (<View style={styles.form_group}>
                                <Text style={[styles.form_label, {flex: 1, width: '25%'}]}>Date</Text>
                                <View style={[styles.form_datepicker, {marginVertical: 10, width: '75%'}, (status.toUpperCase() === this.state.vaccineStatus.Completed && !completeDate && isSubmit) ? styles.form_input_error : null]}>
                                    <DatePicker
                                        style={{width: '100%'}}
                                        date={completeDate}
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
                                                source={require('../../../assets/images/icon-date.png')}
                                            />
                                        }
                                        onDateChange={(completeDate) => {this.setState({completeDate: completeDate})}}
                                    />
                                </View>
                            </View>) : (
                                <View style={styles.form_group}>
                                    <Text style={[styles.form_label, {flex: 1, width: '25%'}]}>Date</Text>
                                    <View style={[styles.form_datepicker, {marginVertical: 10, width: '75%'}, (!remindMeDate && isSubmit) ? styles.form_input_error : null]}>
                                        <DatePicker
                                            style={{width: '100%'}}
                                            date={remindMeDate}
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
                                                    source={require('../../../assets/images/icon-date.png')}
                                                />
                                            }
                                            onDateChange={(remindMeDate) => {this.setState({remindMeDate: remindMeDate})}}
                                        />
                                    </View>
                                </View>
                            )}
                            <View style={[styles.form_group, {position: 'relative'}]}>
                                <Text style={[styles.form_label, {flex: 1, width: '25%'}]}>By</Text>
                                <View style={{width: '75%', paddingRight: 40}}>
                                    <Dropdown
                                        data={arrProvider}
                                        labelFontSize={16}
                                        dropdownOffset={{top: 0, left: 0}}
                                        inputContainerStyle={[styles.form_dropdown, {width: '100%'}]}
                                        rippleInsets={{top: 0, bottom: -4 }}
                                        onChangeText={(value) => {this._handleChangeCareProvider(value)}}
                                    />
                                </View>
                                <TouchableOpacity style={format.btn_icon} onPress={() => navigate('Provider')}>
                                    <MaterialIcons size={30} name="account-box" color="#336A82" />
                                </TouchableOpacity>
                            </View>
                            {
                                status.toUpperCase() === 'REMIND ME' ?
                                <View style={{marginBottom: 20}}>
                                    <View style={styles.form_group}>
                                        <Text style={[styles.form_label, {flex: 1, width: '75%'}]}>
                                            Enable Push Reminder?
                                        </Text>
                                        <View style={{width: '25%'}}>
                                            <Switch
                                                value={ this.state.isPushNotification }
                                                onValueChange={this._togglePushNotification}
                                                trackColor="#14c498"
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.form_group}>
                                        <Text style={[styles.form_label, {flex: 1, width: '75%'}]}>
                                        Sync with Calendar
                                        </Text>
                                        <View style={{width: '25%'}}>
                                            <Switch
                                                value={ this.state.isSyncToCalendar }
                                                onValueChange={this._toggleSyncToCalendar}
                                                trackColor="#14c498"
                                            />
                                        </View>
                                    </View>
                                </View>
                                : null
                            }
                            <View style={styles.form_group}>
                                <Text style={[styles.form_label, {flex: 1, width: '25%'}]}>Note</Text>
                                <View style={{width: '75%'}}>
                                    <TextInput
                                        style={[styles.form_input, {height: 82, width: '100%'}]}
                                        editable = {true}
                                        maxHeight = {82}
                                        multiline = {true}
                                        onChangeText={(note)=>this.setState({note})}
                                        value={this.state.note}
                                    />
                                </View>
                            </View>
                        </View>
                        { vaccineDetail && vaccineDetail.vaccineName &&  vaccineDetail.vaccineID !== 999999 ?
                            <View style={styles.container_form}>
                                <Text style={format.title_big}>{vaccineDetail.vaccineName}</Text>
                                <Text style={format.title_small}>Animal Types</Text>
                                <Text style={format.text_normal}>{vaccineDetail.petType}</Text>
                                <Text style={format.title_small}>Background</Text>
                                <Text style={format.text_normal}>
                                    {vaccineDetail.vaccineInformation}
                                </Text>
                                <Text style={format.title_small}>Schedule/Frequency:</Text>
                                <View style={{position: 'relative', paddingLeft: 16}}>
                                    <MaterialIcons name="lens" size={6} color="#425159" style={format.icon_dot}/>
                                    <Text style={format.text_normal}>{vaccineDetail.vaccineRepeat}</Text>
                                </View>
                                {/* <FlatList
                                    data={this.state.arrSchedule}
                                    renderItem={({ item }) => (
                                        <View style={{position: 'relative', paddingLeft: 16}}>
                                            <MaterialIcons name="lens" size={6} color="#425159" style={format.icon_dot}/>
                                            <Text style={format.text_normal}>{item}</Text>
                                        </View>
                                    )}
                                    keyExtractor={index => index.toString()}
                                /> */}
                                <Text style={format.title_small}>Laws</Text>
                                <Text style={format.text_normal}>
                                   {vaccineDetail.vaccineLaw}
                                </Text>
                            </View>
                            : (null)
                        }
                        <TouchableOpacity onPress={this._save} style={styles.form_button}>
                            <Text style={styles.button_text}>Save</Text>
                        </TouchableOpacity>
                    </View>
                    <PopupNotification 
                        visible={this.state.visibleNotification} 
                        buttonText={'Ok'} 
                        closeDisplay={() => { 
                            this.setState({visibleNotification: false});
                            navigate('VaccineRecord');
                        }}
                        title={this.state.notifyTitle}
                        description={this.state.NotifyText}
                    />
                </ScrollView>
            </SafeAreaView>
            </KeyboardAvoidingView>
        )
    }

    _handleChangeCareProvider = (value) => {
        this.setState({careProvider: value})
    }

    _handleChangeFrequency = (value) => {
        this.setState({valueFrequency: value})
    }

    _handleChangeVaccine = (value) => {
        this.setState({valueVaccine: value})
    }

    _handleChangeStatus = (value) => {
        this.setState({status: value});
    }

    _togglePushNotification = (value) =>{
        this.setState({isPushNotification: value})
        if(value)
            this.setState({pushNotification: 'on'});
        else this.setState({pushNotification: 'off'});
    }

    _toggleSyncToCalendar = (value) =>{
        this.setState({isSyncToCalendar: value})
        if(this.state.isSyncToCalendar)
            this.setState({syncToCalendar: 'on'});
        else this.setState({syncToCalendar: 'off'});
    }

    _save = async () => {
        const {params} = this.props.navigation.state;
        const userID = await AsyncStorage.getItem('userID');
        this.setState({isSubmit: true});
        const data = {
            completedDate: this.state.status.toUpperCase() === VaccineStatus.NotNeeded ? '1900-01-01' : this.state.status.toUpperCase() === VaccineStatus.RemindMe ? null : this.state.completeDate,
            createdBy: userID,
            customVaccineName: this.state.vaccineDetail.customVaccineName || null,
            petID: params.petID,
            petVaccineHistoryID: params.vaccineDetail.petVaccineHistoryID || null,
            status: this.state.status,
            vaccineID: this.state.vaccineDetail.vaccineID,
            vaccineName: this.state.vaccineDetail.vaccineName,
            vaccineNote: this.state.note,
            vaccineStartAge: this.state.vaccineDetail.vaccineStartAge
        };
        if((data.status.toUpperCase() === VaccineStatus.Completed && !data.completedDate)
            || (data.status.toUpperCase() === VaccineStatus.RemindMe && !this.state.remindMeDate)
        )
            return ;
        await this.props.updateVaccineAction(data);
        if(this.props.updateVaccine.data) {
            if (data.status.toUpperCase() === VaccineStatus.RemindMe) {
                const reminder = {
                    ownerID: userID,
                    petID: params.petID,
                    reminderCategory: 'vaccine',
                    reminderCreatedBy: 'owner',
                    reminderCreatedDate: null,
                    reminderDateTime: dateHelper.convertDateUtc(this.state.remindMeDate),
                    reminderDescription: null,
                    reminderOnceOnly: 'Y',
                    reminderPushNotification: this.state.isPushNotification ? 'Y' : 'N',
                    reminderRepeatDetail: null,
                    reminderRepeatType: 'Once',
                    reminderSyncCalendar: this.state.isSyncToCalendar ? 'Y' : 'N',
                    reminderTodo: 'vaccine',
                    reminderTypeRelateTableID: params.vaccineDetail.petVaccineHistoryID || this.props.updateVaccine.data.petVaccineHistoryID
                }
                console.log('create reminder');
                await this.props.createReminderAction(reminder);
            }
           
            this.setState({notifyTitle: 'Yepi! Successfully!' , NotifyText: 'Thank you!', visibleNotification: true})
        }
        if (this.props.updateVaccine.error) {
            this.setState({notifyTitle: "Oops. Something's missing!" , NotifyText: 'Error. Please try again.', visibleNotification: true})
        }
    }

    _getRepeatTypes = () => {
        // await this.props.getRepeatTypesAction();
        if(this.props.getRepeatTypes.data)
            this.setState({arrFrequency: this.props.getRepeatTypes.data});
    }

    _getProviders = () => {
        let arrProvider = [...this.state.arrProvider];
        if(this.props.getProvidersByOwner.data && this.props.getProvidersByOwner.data.length){
            arrProvider = this.props.getProvidersByOwner.data.map(item => {
                let obj = {...item};
                obj.value = obj.cpLongName;
                return obj;
            });
            this.setState({arrProvider});
        }
    }
}

const mapStateToProps = state => ({
    createReminder: state.createReminder,
    updateVaccine: state.updateVaccine,
    getVaccineDetail: state.getVaccineDetail,
    getReminderByOwner: state.getReminderByOwner,
    getRepeatTypes: state.getRepeatTypes,
    getProvidersByOwner: state.getProvidersByOwner
});

const mapDispatchToProps = {
    getVaccineDetailAction,
    getReminderByOwnerAction,
    createReminderAction,
    updateVaccineAction,
    getRepeatTypesAction
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewVaccine)

const format = StyleSheet.create({
    icon_style: {
        width: 24,
        height: 24,
        marginRight: 10,
        position: 'absolute'
    },
    group_relative: {
        position: 'relative',
        paddingLeft: 34
    },
    title_big: {
        color: '#202c3c',
        fontSize: iOS ? 19 : 24,
        fontWeight: 'bold',
        marginBottom: 18
    },
    title_small: {
        color: '#202c3c',
        fontSize: iOS ? 12 : 15,
        fontWeight: 'bold',
        marginBottom: 9
    },
    text_normal: {
        color: 'rgba(32, 44, 60,0.4)',
        fontSize: iOS ? 12 : 15,
        fontWeight: '400',
        marginBottom: 18

    },
    icon_dot: {
        position: 'absolute',
        left: 0,
        top: 5
    },
    btn_icon: {
        height: 30,
        width: 30,
        position: 'absolute',
        right: 0
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