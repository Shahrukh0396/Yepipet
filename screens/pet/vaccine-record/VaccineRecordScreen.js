import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Image,
    ScrollView,
    FlatList,
    KeyboardAvoidingView,
    AsyncStorage
} from 'react-native';
import styles from '../../../constants/Form.style';
import { EvilIcons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-material-dropdown';
import {connect} from 'react-redux';
import ItemVaccineRecord from '../../../components/vaccine-record/ItemVaccineRecord';
import PopupConfirm from '../../../components/PopupConfirm';
import getVaccinesAction from '../../../src/apiActions/vaccine/getVaccines';
import getVaccinesCustomAction from '../../../src/apiActions/vaccine/getVaccinesCustom';
import getReminderByOwnerAction from '../../../src/apiActions/reminder/getReminderByOwner';
import createVaccineMultipleAction from '../../../src/apiActions/vaccine/createVaccineMultiple';
import createVaccineCustomAction from '../../../src/apiActions/vaccine/createVaccineCustom';
import createReminderAction from '../../../src/apiActions/reminder/createReminder';
import updateVaccineMultipleAction from '../../../src/apiActions/vaccine/updateVaccineMulti';
import PopupNotification from '../../../components/PopupNotification';
import {dateHelper} from '../../../src/helpers';
import {VaccineStatus, iOS} from '../../../src/common';

class VaccineRecordsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // arrFrequency: [{value: 'Ontime'}, {value: 'Ontime'}],
            arrSchedule: [{value: '6-8 Weeks'}, {value: '12 - 24 weeks'}],
            arrAges: [0, 1, 2, 3],
            typeTab: 0,
            isAddVaccine: false,
            arrVaccine: [],
            arrVaccineAdd: [],
            visibleConfirm: false,
            descriptionConfirm: '',
            visibleNotification: false,
            notifyTitle: '',
            NotifyText: '',
            arrVaccineTab: [],
            getAll: false,
            loading: false,
            refresh: false,
        }
    }

    willFocus = this.props.navigation.addListener(
        'willFocus',
        payload => {
            this._getAllVaccine();
        }
    );

    handleRedirect(){
        this.props.navigation.navigate('ApproximateAge')
    }

    async componentWillMount() {
        // this._getAllVaccine();
    }

    render() {
        const {arrVaccineTab, arrVaccine, visibleConfirm} = this.state;
        const {navigate} = this.props.navigation;
        const {data, ageMonth, isStepAdd, isStepAge, avatar} = this.props.navigation.state.params;


        return (
            <KeyboardAvoidingView 
                behavior="padding"
                enabled 
                style={{ flex: 1 }}
            >
                <SafeAreaView style={styles.safeArea}>
                    <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                    <Spinner visible={this.state.loading}/>
                        <View style={styles.container}>
                            <View style={{position:'relative', paddingBottom: 22, paddingTop: 25, justifyContent: 'center'}}>
                                <TouchableOpacity style={styles.button_back} onPress={() => this._goBack()}>
                                    <Image style={{width: 12, height: 21}} source={require('../../../assets/images/icon-back.png')}/>
                                </TouchableOpacity>
                                <Text style={[styles.title_head, {alignSelf: 'center'}]}> Vaccine Records </Text>
                                { 
                                    isStepAdd || isStepAge ?
                                    <Text 
                                        style={[
                                            styles.text_skip,
                                            {position: 'absolute', right: 0}
                                        ]} 
                                        onPress={this._showSkipVaccineRecord}
                                    >
                                        Skip
                                    </Text>
                                    : null
                                }
                            </View>
                            <View style={styles.group_avatar}>
                                <View style={{alignItems: 'center'}}>
                                    {
                                        avatar ? 
                                        <Image style={[styles.image_circle, {borderColor: '#4e94b2'}]} 
                                            source={avatar ? {uri: avatar} : require('../../../assets/images/img-pet-default.png')}
                                        />
                                        :
                                        <Image style={[styles.image_circle, {borderColor: '#4e94b2'}]} 
                                            source={data.petPortraitURL ? {uri: data.petPortraitURL} : require('../../../assets/images/img-pet-default.png')}
                                        />
                                    }
                                    <View style={{flexDirection:'row', flexWrap:'wrap', marginBottom: 8, alignItems: 'stretch'}}>
                                        <Text style={styles.pet_name}>{data && data.petName}</Text>
                                        <Text style={styles.pet_info}>
                                            {data && data.ageInYears} {data.ageInYears > 1 ? `Years` : `Year`} { ageMonth ? ageMonth > 1 ? `${ageMonth} Months` : `${ageMonth} Month` : null }
                                        </Text>
                                    </View>
                                    <Text style={format.text_description}>
                                        Please update immunization record or create reminder for {data && data.petName}.
                                    </Text>
                                </View>
                            </View>
                            <View style={format.nav_tab}>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                    { this._renderNavTab() }
                                </ScrollView>
                            </View>
                            <View>
                                {this.state.arrVaccineTab.length ? <FlatList
                                    data={arrVaccineTab}
                                    renderItem={({ item, index }) => (
                                        <ItemVaccineRecord onChangeValue = {this._updateVaccineName} onChangeDate = {this._updateVaccineDate} onChangeStatus = {this._updateVaccineStatus}
                                            data={item}
                                            index = {index}
                                            navigation={this.props.navigation}
                                            petID={this.props.navigation.state.params.data.petID}
                                            onDel={this._onDel}
                                        />
                                    )}
                                    keyExtractor={(item, index) => 'key' + item.index}
                                /> : null}
                                {/* {
                                    this.state.arrVaccineAdd.length ? 
                                    <FlatList
                                        data={this.state.arrVaccineAdd}
                                        renderItem={({ item }) => (
                                            <ItemVaccineRecord onChangeValue = {this._updateVaccineName} onChangeDate = {this._updateVaccineDate} onChangeStatus = {this._updateVaccineStatus}
                                                data={item}
                                                navigation={this.props.navigation}
                                            />
                                        )}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                    : null
                                } */}
                            </View>
                            <View style={{paddingTop: 10}}>
                                <Image style={format.image_style} source={require('../../../assets/images/img-dog-hat.png')}/>
                                <TouchableOpacity 
                                    style={format.button_add} 
                                    onPress={this._addVaccination}
                                >
                                    <Text style={format.button_text_big}>Add new vaccination</Text>
                                    <Text style={format.button_text_normal}>Tab here to add a new vaccine that </Text>
                                    <Text style={format.button_text_normal}>is administered for your pet</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.form_button} onPress={this._createVaccineMultiple}>
                                <Text style={styles.button_text}>Save</Text>
                            </TouchableOpacity>
                        </View>

                        <PopupConfirm
                            visible={visibleConfirm}
                            buttonText1={'Cancel'}
                            buttonText2={'Skip'}
                            title={'Meow~ No vaccination record?'}
                            description={this.state.descriptionConfirm}
                            handleButton1={() => this.setState({visibleConfirm: false})}
                            handleButton2={this._skipVaccineRecord}
                        />
                        <PopupNotification 
                            visible={this.state.visibleNotification} 
                            buttonText={'Ok'} 
                            closeDisplay={() => this._closeNotification()}
                            title={this.state.notifyTitle}
                            description={this.state.NotifyText}
                        />
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        );
    }

    _renderNavTab() {
        const {data} = this.props.navigation.state.params;
        const {typeTab} = this.state;

        let navTab = [];
        let length = data.ageInYears;

        if(data.ageInDaysWithoutYears > 0)
            length = data.ageInYears + 1;

        for(let i = 0; i <= length ; i++){
            navTab.push(
                <TouchableOpacity 
                    key={i}
                    style={[
                        format.nav_item, 
                        {width: 100},
                        typeTab === i ? format.nav_item_active : {}
                    ]}
                    onPress={() => this._changeTab(i)}
                >
                    <Text 
                        style={[
                            format.nav_text, 
                            typeTab === i ? format.nav_text_active : {}
                        ]}
                    >
                    {i} Years</Text>
                </TouchableOpacity>
            )
        }

        return navTab;
    }

    _changeTab = (value, arrData) => {
        let arrVaccine = arrData ? arrData : this.state.arrVaccine;
        let arr = [];
        arr = arrVaccine.filter(item => item.vaccineStartAge === value);
        this.setState({typeTab: value, arrVaccineTab: arr});
    }

    _onPrev = () => {
        console.log('prev');
    }

    _onNext = () => {
        console.log('next');
    }

    _addVaccination = async () => {
         // const userID = await AsyncStorage.getItem('userID');
        const userID = this.props.userSession.user.userID;
        await this.setState(prevState => ({
            arrVaccine: [...prevState.arrVaccine, {
                'index': prevState.arrVaccine.length,
                'petID': this.props.navigation.state.params.data.petID,
                'customVaccineName': '',
                'vaccineNote': '',
                'vaccineStartAge': this.state.typeTab,
                'createdBy': userID,
                'status': 'Completed',
                'completedDate': ''
            }],
            arrVaccineTab: [...prevState.arrVaccineTab, {
                'index': prevState.arrVaccine.length,
                'petID': this.props.navigation.state.params.data.petID,
                'customVaccineName': '',
                'vaccineNote': '',
                'vaccineStartAge': this.state.typeTab,
                'createdBy': userID,
                'status': 'Completed',
                'completedDate': ''
            }]
        }));
        console.log('@========================>', this.state.arrVaccine)

        console.log('@@========================>',this.state.arrVaccineTab)
    }

    _updateVaccineName = (item, index) => {
        let arrVaccine = [...this.state.arrVaccine];
        arrVaccine[index].customVaccineName = item;
        this.setState({arrVaccine})
    }

    _updateVaccineDate = (item, index) => {
        let arrVaccine = [...this.state.arrVaccine];
        let status = arrVaccine[index].status || arrVaccine[index].vaccineStatus;    
        if (status.toUpperCase() === VaccineStatus.Completed)
            arrVaccine[index].completedDate = dateHelper.convertDateSendApi(item);
        if (status.toUpperCase() === VaccineStatus.RemindMe)
            arrVaccine[index].remindMeDate = dateHelper.convertDateSendApi(item);
        arrVaccine[index].isUpdate = true;
        if(!arrVaccine[index].status) arrVaccine[index].status = status;
        this.setState({arrVaccine})
    }

    _updateVaccineStatus = (item, index) => {
        let arrVaccine = [...this.state.arrVaccine];
        arrVaccine[index].status = item;
        arrVaccine[index].isUpdate = true;
        if(!arrVaccine[index].remindMeDate) arrVaccine[index].remindMeDate = arrVaccine[index].vaccineRemindMeDate || arrVaccine[index].reminderDateTime;
        this.setState({arrVaccine})
    }

    _createVaccineMultiple = async () => {
        const {data, ageMonth, isStepAdd, isStepAge} = this.props.navigation.state.params;
        const userID = this.props.userSession.user.userID;
        let validate = true;
        let arrVaccineAdd = [];
        let arrVaccineEditDefault = [];
        let arrVaccineEditCustom = [];
        let arrRemindMe = [];
        let dataRemindMe = {
            ownerID: userID,
            petID: this.props.navigation.state.params.data.petID,
            reminderCategory: 'vaccine',
            reminderCreatedBy: 'owner',
            reminderCreatedDate: null,
            reminderDateTime: null,
            // reminderDateTime: dateHelper.convertDateUtc(this.state.remindMeDate),
            reminderDescription: null,
            reminderOnceOnly: 'Y',
            reminderPushNotification: 'Y',
            reminderRepeatDetail: null,
            reminderRepeatType: 'One Time',
            reminderSyncCalendar: 'Y',
            reminderTodo: 'vaccine',
            reminderTypeRelateTableID: null
        }

        await this.state.arrVaccine.forEach(item => {
            if ((!item.vaccineID && !item.customVaccineName) || (item.status && item.status.toUpperCase() === VaccineStatus.Completed && !item.completedDate))
                validate = false;
            if (!item.vaccineID)
                arrVaccineAdd.push(item);
            else if (item.petVaccineHistoryID && item.vaccineID === 999999) {
                if (item.isUpdate)
                    arrVaccineEditCustom.push(item);
            } 
            else if (item.status && item.isUpdate) arrVaccineEditDefault.push(item);
        })
        console.log('validate', validate);
        if (!validate)
            return;

        await this.setState({loading: true});
        if (arrVaccineAdd.length) {
            await this.props.createVaccineCustomAction(arrVaccineAdd);
            if(this.props.createVaccineCustom.data) {
                this.props.createVaccineCustom.data.forEach(item => {
                    if(item.status.toUpperCase() === VaccineStatus.RemindMe) {
                        dataRemindMe.reminderTypeRelateTableID = item.petVaccineHistoryID;
                        let find = arrVaccineAdd.find(itemF => itemF.customVaccineName === item.customVaccineName);
                        dataRemindMe.reminderDateTime = dateHelper.convertDateUtc(find.remindMeDate);
                        arrRemindMe.push(this.props.createReminderAction(dataRemindMe));
                    }
                })
                // console.log('this.props.createVaccineCustom.data', this.props.createVaccineCustom.data);
            }
            if(this.props.createVaccineCustom.error) {
                this.setState({notifyTitle: "Oops. Something's missing!" , NotifyText: 'Create error. Please try again.', visibleNotification: true})
            }
        }
        
        if (arrVaccineEditDefault.length || arrVaccineEditCustom.length) {
            if (arrVaccineEditDefault.length) {
                arrVaccineEditDefault.map(item => item.customVaccineName = item.vaccineName);
                console.log('arrVaccineEditDefault', arrVaccineEditDefault);
                await this.props.updateVaccineMultipleAction(arrVaccineEditDefault);
                console.log('this.props.createVaccineMultiple.data', this.props.updateVaccineMulti.data);

                this.props.updateVaccineMulti.data.forEach(item => {
                    if(item.status.toUpperCase() === VaccineStatus.RemindMe) {
                        dataRemindMe.reminderTypeRelateTableID = item.petVaccineHistoryID;
                        let find = arrVaccineEditDefault.find(itemF => itemF.customVaccineName === item.customVaccineName);
                        dataRemindMe.reminderDateTime = dateHelper.convertDateUtc(find.remindMeDate);
                        arrRemindMe.push(this.props.createReminderAction(dataRemindMe));
                    }
                })
            }

            if (arrVaccineEditCustom.length) {
                console.log('arrVaccineEditCustom', arrVaccineEditCustom);
                await this.props.updateVaccineMultipleAction(arrVaccineEditCustom);
                console.log('this.props.createVaccineMultiple.data', this.props.updateVaccineMulti.data);
                await this.props.updateVaccineMulti.data.forEach(item => {
                    if(item.status.toUpperCase() === VaccineStatus.RemindMe) {
                        dataRemindMe.reminderTypeRelateTableID = item.petVaccineHistoryID;
                        let find = arrVaccineEditCustom.find(itemF => itemF.customVaccineName === item.customVaccineName);
                        dataRemindMe.reminderDateTime = dateHelper.convertDateUtc(find.remindMeDate);
                        arrRemindMe.push(this.props.createReminderAction(dataRemindMe));
                    }
                })  
            }

            if (this.props.updateVaccineMulti.error) {
                await this.setState({notifyTitle: "Oops. Something's missing!" , NotifyText: 'Create error. Please try again.', visibleNotification: true})
            }
        }
        if (arrRemindMe.length) {
            console.log('arrRemindMe.length', arrRemindMe.length);
            await Promise.all(arrRemindMe);
        }
        
        await this.setState({notifyTitle: 'Yepi! Successfully!' , NotifyText: 'Thank you!', visibleNotification: true, getAll: true})
        // this._getAllVaccine();  
        await this.setState({loading: false});
    }

    _getAllVaccine = async () => {
        const { data } = this.props.navigation.state.params
        this.setState({loading:true});
        await this.props.getVaccinesAction(this.props.navigation.state.params.data.petID);
        await this.props.getVaccinesCustomAction(this.props.navigation.state.params.data.petID);
 
        let vaccines = this.props.getVaccines.data || [];
        let vaccinesCustom = this.props.getVaccinesCustom.data || [];
        console.log('vaccines====================', vaccines);
        console.log('vaccinesCustom====================', vaccinesCustom);

        let arrVaccines = [...vaccines, ...vaccinesCustom];
        arrVaccines.map((item, index) => {
            item.index = index;
            item.petID = this.props.navigation.state.params.data.petID;
            if (item.status && item.status.toUpperCase() === VaccineStatus.RemindMe)
                item.reminderDateTime = item && item.relatedReminderList && item.relatedReminderList.length && item.relatedReminderList[0].reminderDateTime ;
            return item;
        })
        // console.log('arrVaccines====================', arrVaccines);

        await this._changeTab(data.ageInYears, arrVaccines);
        await this.setState({arrVaccine: arrVaccines, getAll: false, loading:false})
    }

    _showSkipVaccineRecord = () => {
        this.setState({
            descriptionConfirm: 'Up keep with vaccination is important to the health of your pet. YepiPet can help to send timely reminder for vaccination. Are you sure you want to skip this step?',
            visibleConfirm: true
        });
    }

    _skipVaccineRecord = () => {
        const {data, ageMonth, avatar} = this.props.navigation.state.params;
        this.setState({visibleConfirm: false});
        this.props.navigation.navigate('CareSchedule', {petDetail: data, ageMonth: ageMonth, isStep: true, avatar: avatar});
    }

    _goBack() {
        const {data, isStepAdd, isStepAge, avatar} = this.props.navigation.state.params;
        if(isStepAge)
            this.props.navigation.navigate('ApproximateAge', {data: data, avatar: avatar});
        if(isStepAdd)
            this.props.navigation.navigate('AddNewPet', {petUpdate: data, avatar: avatar});
        this.props.navigation.goBack();
    }

    _closeNotification() { 
        const {data, ageMonth, isStepAdd, isStepAge} = this.props.navigation.state.params;
        this.setState({visibleNotification: false}, () => {
            if(isStepAdd || isStepAge)
                this.props.navigation.navigate('CareSchedule', {petDetail: data, ageMonth: ageMonth, isStep: true});
            if (this.state.getAll)
                this._getAllVaccine();
        });
            
    }

    _onDel = async(value) => {
        console.log(value)
        let indexArrVaccine = this.state.arrVaccine.findIndex(item => item.index === value)
        let indexArrVaccineTab = this.state.arrVaccineTab.findIndex(item => item.index === value)

        await this.state.arrVaccine.splice(indexArrVaccine, 1)
        await this.state.arrVaccineTab.splice(indexArrVaccineTab, 1)
        await this.forceUpdate()
    }
}

const mapStateToProps = state => ({
    getVaccines: state.getVaccines,
    getVaccinesCustom: state.getVaccinesCustom,
    getReminderByOwner: state.getReminderByOwner,
    createVaccineMultiple: state.createVaccineMultiple,
    createVaccineCustom: state.createVaccineCustom,
    createReminder: state.createReminder,
    updateVaccineMulti: state.updateVaccineMulti,
    userSession: state.userSession
});

const mapDispatchToProps = {
    getVaccinesAction,
    getVaccinesCustomAction,
    getReminderByOwnerAction,
    createVaccineMultipleAction,
    createVaccineCustomAction,
    createReminderAction,
    updateVaccineMultipleAction
};

export default connect(mapStateToProps, mapDispatchToProps)(VaccineRecordsScreen)

const format = StyleSheet.create({
    nav_tab: {
        position: 'relative',
        height: 44, 
        borderRadius: 44/2,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 20
    },
    nav_button: {
        width: 40,
        height: 30,
        position: 'absolute',
        justifyContent: 'center'
    },
    nav_button_disabled: {
        opacity: 0.5
    },  
    nav_item: {
        height: 30,
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingVertical: 5
    },
    nav_item_active: {
        borderRadius: 30/2,
        backgroundColor: '#ee7a23'
    },
    nav_text: {
        color: '#000000',
        fontSize: iOS ? 12 : 15,
        fontWeight: '500',
        textAlign: 'center'
    },
    nav_text_active: {
        color: '#fff'
    },
    text_description: {
        fontSize: iOS ? 11 : 14,
        fontWeight: '400',
        color: 'rgba(32, 44, 60,0.4)',
        fontStyle: 'italic',
        marginTop: 6,
        textAlign: 'center'
    },
    button_add: {
        backgroundColor: '#336A82',
        paddingVertical: 10,
        borderRadius: 101/2
    },
    button_text_big: {
        fontWeight: '700',
        fontSize: iOS ? 17 : 20,
        color: '#fff',
        textAlign: 'center'
    },
    button_text_normal: {
        fontWeight: '500',
        color: '#fff',
        fontSize: iOS ? 12 : 15,
        textAlign: 'center'
    },
    image_style: {
        alignSelf: 'center',
        marginBottom: -11,
        position: 'relative',
        zIndex: 10,
        width: 111,
        height: 80
    }
});