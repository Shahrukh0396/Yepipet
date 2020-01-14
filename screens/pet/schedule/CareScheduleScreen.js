import React from 'react';
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
    KeyboardAvoidingView,
    Alert
} from 'react-native';
import styles from '../../../constants/Form.style';
import { EvilIcons } from '@expo/vector-icons';
import PopupConfirm from '../../../components/PopupConfirm';
import ItemCareSchedule from '../../../components/schedule/ItemCareSchedule';
import PopupNotification from '../../../components/PopupNotification';
import {connect} from 'react-redux';
import getSuggestedReminderAction from '../../../src/apiActions/reminder/getSuggestedReminder';
import getRepeatTypesActions from '../../../src/apiActions/reminder/getRepeatTypes';
import updatePetAction from '../../../src/apiActions/pet/updatePet';
import {dateHelper,dataHelper} from '../../../src/helpers';
import createMultipleReminderAction from '../../../src/apiActions/reminder/createMultipleReminder';
import { convertDateSendApi } from '../../../src/helpers/dateHelper';
import getCategoryInfoAction from '../../../src/apiActions/reminder/getCategoryInfo';
import getReminderByPetAction from '../../../src/apiActions/reminder/getReminderByPet';
import updateReminderAction from '../../../src/apiActions/reminder/updateReminder';
import deleteReminderAction from '../../../src/apiActions/reminder/deleteReminder';
import getPetsByOwnerAction from '../../../src/apiActions/pet/getPetsByOwner';
import getReminderByOwnerAction from '../../../src/apiActions/reminder/getReminderByOwner';
import getProvidersByOwnerAction from '../../../src/apiActions/provider/getProvidersByOwner';
import { iOS } from '../../../src/common';

class CareScheduleScreen extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            arrReminder: [],
            reminder: null,
            isAddReminder: false,
            modalVisible: false,
            titleNotification: '',
            descriptionNotification: '',
            titleColor: '#000',
            isNegative: false,
            loading: false,
            arrCategory: []
        }
    }

    async componentWillMount() {
        await this._getCategoryInfo();
        await this.props.getRepeatTypesActions();
    }

    async componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = await navigation.addListener("didFocus", () => {
            if(this.props.userSession.user)
                this._getReminders();
        });
    }
    
    async componentWillUnmount() {
        await this.focusListener.remove();
    }


    render() {
        const { 
            isAddReminder, 
            arrReminder,
            modalVisible,
            titleNotification,
            descriptionNotification,
            titleColor,
            isNegative,
            loading,
            arrCategory
        } = this.state;
        const {petDetail, ageMonth, isStep, avatar} = this.props.navigation.state.params;

        return (
            <KeyboardAvoidingView 
                behavior="padding"
                enabled 
                style={{ flex: 1 }}
            >
                <SafeAreaView style={styles.safeArea}>
                    <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                        <Spinner visible={loading}/>
                        <View style={styles.container}>
                            <View style={{position:'relative', paddingBottom: 22, paddingTop: 25, justifyContent: 'center'}}>
                                <TouchableOpacity style={styles.button_back} onPress={() => this.props.navigation.goBack()}>
                                    <Image style={{width: 12, height: 21}} source={require('../../../assets/images/icon-back.png')}/>
                                </TouchableOpacity>
                                <Text style={[styles.title_head, {alignSelf: 'center'}]}> Care Schedule</Text>
                                {   
                                    isStep ? 
                                    <Text 
                                        style={[
                                            styles.text_skip,
                                            {position: 'absolute', right: 0}
                                        ]} 
                                        onPress={() => this.props.navigation.navigate('UserManage', {petCreated: petDetail})}
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
                                        <Image 
                                            style={[styles.image_circle, {borderColor: '#4e94b2'}]} 
                                            source={petDetail.petPortraitURL ? {uri: petDetail.petPortraitURL} : require('../../../assets/images/img-pet-default.png')}
                                        />
                                    }
                                    <View style={{flexDirection:'row', flexWrap:'wrap', marginBottom: 8, alignItems: 'stretch'}}>
                                        <Text style={styles.pet_name}>{petDetail.petName}</Text>
                                        <Text style={styles.pet_info}>
                                            {petDetail.ageInYears} {petDetail.ageInYears > 1 ? `Years` : `Year`} { ageMonth ? ageMonth > 1 ? `${ageMonth} Months` : `${ageMonth} Month` : null }
                                        </Text>
                                    </View>
                                    <Text style={format.text_description}>
                                        We recommend creating following care tasks and reminders here. 
                                        So, you never forget anything {petDetail.petName} needs again! 
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <FlatList
                                    data={arrReminder}
                                    renderItem={({ item, index }) => (
                                        <ItemCareSchedule
                                            data={item}
                                            arrCategory={arrCategory}
                                            arrRepeat={this.props.getRepeatTypes.data}
                                            index={index}
                                            navigation={this.props.navigation}
                                            onRepeat={this._updateReminderRepeatType}
                                            onCategory={this._updateReminderCategory}
                                            onTodo={this._updateReminderTodo}
                                            onPushNotification={this._updatePushNotification}
                                            onSyncToCalendar={this._updateSyncToCalendar}
                                            onDate={this._updateDate}
                                            onTime={this._updateTime}
                                            onStatus={this._updateReminderStatus}
                                            onDescription={this._updateReminderDescription}
                                            onDel={this._onDel}
                                        />
                                    )}
                                    keyExtractor={(item, index) => 'index' + index.toString()}
                                />
                                {/* {
                                    isAddReminder ? 
                                    <ItemCareSchedule 
                                        navigation={this.props.navigation}
                                        arrRepeat={this.props.getRepeatTypes.data}
                                        petDetail={petDetail}
                                    />
                                    : null
                                } */}
                            </View>
                            <View>
                                <Image style={format.image_style} source={require('../../../assets/images/img-dog.png')}/>
                                <TouchableOpacity 
                                    style={format.button_add} 
                                    onPress={this._addReminder}
                                    disabled={isAddReminder}
                                >
                                    <Text style={format.button_text_big}>Add a reminder</Text>
                                    <Text style={format.button_text_normal}>Tap here to create a new task or </Text>
                                    <Text style={format.button_text_normal}>reminder for {petDetail && petDetail.petName}</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.form_button} onPress={this._save}>
                                <Text style={styles.button_text}>Save</Text>
                            </TouchableOpacity>
                            <PopupNotification 
                                visible={modalVisible} 
                                buttonText={'Ok'} 
                                closeDisplay={this._closePopup}
                                title={titleNotification}
                                description={descriptionNotification}
                                titleColor={titleColor}
                                isNegative={isNegative}
                            />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        )
    }

    _addReminder = async() => {
        // this.setState({isAddReminder: true});
        await this.setState(prevState => ({
            arrReminder: [...prevState.arrReminder, {
                ownerID: this.props.userSession.user.userID,
                petID: this.props.navigation.state.params.petDetail.petID,
                reminderCreatedBy: "owner",
                reminderCategory: null,
                reminderDate: dateHelper.convertDate(new Date()),
                reminderTime: dateHelper.convertTime(new Date()),
                reminderDateTime: null,
                reminderDescription: null,
                reminderPushNotification: 'N',
                reminderSyncCalendar: 'N',
                reminderRepeatType: null,
                reminderTodo: null,
                reminderTypeRelateTableID: 0,
                reminderOnceOnly: 'Y',
                reminderStatus: 'Remind Me'
            }],
        }), () => {
            console.log(this.state.arrReminder)
        });
    }

    _getReminders = async() => {
        this.setState({loading: true});
        let result = null;
        if(this.props.navigation.state.params.petDetail.petHasSetSuggestedReminders === 'N')
            result = await this.props.getSuggestedReminderAction(this.props.navigation.state.params.petDetail.petID);
        else {
            result = await this.props.getReminderByPetAction(this.props.navigation.state.params.petDetail.petID);
            result = await result.filter(item => { return this._compareDateTimeToCurrent(item.reminderDateTime, item.reminderRepeatType) })
        }
        if(result){
            let arrReminder = result;
            await arrReminder.forEach(item => {
                item.reminderStatus = 'Remind Me'
            });
            await this.setState({arrReminder});
        }
        setTimeout(() => {
            this.setState({loading: false})
        }, 300);
    }

    _getCategoryInfo = async() => {
        await this.props.getCategoryInfoAction();
        if(this.props.getCategoryInfo.data){
            let arr = Object.keys(this.props.getCategoryInfo.data).map((key) => key.toLowerCase());
            await this.setState({ arrCategory: arr });
        }
    }

    _skipCareSchedule = async() => {

    }

    _updateReminderRepeatType = async(value, index) => {
        let arrReminder = [...this.state.arrReminder];
        arrReminder[index].reminderRepeatType = value;
        await this.setState({arrReminder});
    }

    _updateReminderCategory = async(value, index) => {
        let arrReminder = [...this.state.arrReminder];
        arrReminder[index].reminderCategory = value;
        await this.setState({arrReminder});
    }

    _updateReminderTodo = async(value, index) => {
        let arrReminder = [...this.state.arrReminder];
        arrReminder[index].reminderTodo = value;
        await this.setState({arrReminder});
    }

    _updatePushNotification = async(value, index) => {
        let arrReminder = [...this.state.arrReminder];
        arrReminder[index].reminderPushNotification = value ? 'Y' : 'N';
        arrReminder[index].isUpdate = true;
        await this.setState({arrReminder});
    }

    _updateSyncToCalendar = async(value, index) => {
        let arrReminder = [...this.state.arrReminder];
        arrReminder[index].reminderSyncCalendar = value ? 'Y' : 'N';
        arrReminder[index].isUpdate = true;
        await this.setState({arrReminder});
    }

    _updateDate = async(value, index) => {
        let arrReminder = [...this.state.arrReminder];
        arrReminder[index].reminderDate = value;
        await this.setState({arrReminder});
    }

    _updateTime = async(value, index) => {
        let arrReminder = [...this.state.arrReminder];
        arrReminder[index].reminderTime = value;
        await this.setState({arrReminder});
    }

    _updateReminderStatus = async(value, index) => {
        let arrReminder = [...this.state.arrReminder];
        arrReminder[index].reminderStatus = value;
        await this.setState({arrReminder});
    }

    _updateReminderDescription = async(value, index) => {
        let arrReminder = [...this.state.arrReminder];
        arrReminder[index].reminderDescription = value;
        await this.setState({arrReminder});
    }

    _save = async() => {
        await this.setState({loading: true});
        const {arrReminder} = this.state;
        let dataPet = this.props.navigation.state.params.petDetail;
        let updateReminders = [];
        let createReminders = [];
        let deleteReminders = [];
        if(this.props.navigation.state.params.petDetail === 'N')
            createReminders = await arrReminder.filter(item => item.reminderStatus !== 'Not Needed');
        else {
            await arrReminder.forEach(item => {
                console.log(item)
                if(item.reminderID){
                    if(item.reminderStatus === 'Not Needed')
                        deleteReminders.push(item);
                    else if(item.isUpdate)
                        updateReminders.push(item);
                }
                else if(item.reminderStatus !== 'Not Needed')
                    createReminders.push(item)
            });
        }
        if(createReminders.length){
            await createReminders.forEach(async(item) =>{
                if(item.reminderDate && item.reminderTime)
                    item.reminderDateTime = await dateHelper.convertDateUtcDateTime(`${item.reminderDate} ${item.reminderTime}`)
            });
            let validateReminder = await createReminders.find(item => !item.reminderCreatedDate && (!item.reminderCategory || !item.reminderDate || !item.reminderTime));
            if(validateReminder){
                await this.setState({
                    titleNotification: "Oops. Something's missing!" , 
                    descriptionNotification: 'Create error. Please try again.', 
                    isNegative: true,
                    loading: false,
                    modalVisible: true
                });
                return;
            }
            await this.props.createMultipleReminderAction(createReminders);
            if(this.props.createMultipleReminder.data){
                await this.props.getProvidersByOwnerAction(this.props.userSession.user.userID);
                if(dataPet.petHasSetSuggestedReminders === 'N'){
                    dataPet.petHasSetSuggestedReminders = 'Y';
                    await this.props.updatePetAction(dataPet);
                    await this.props.getPetsByOwnerAction(this.props.userSession.user.userID);
                }
            }
            if(this.props.createMultipleReminder.error){
                await this.setState({
                    titleNotification: "Oops. Something's missing!" , 
                    descriptionNotification: 'Create error. Please try again.', 
                    isNegative: true,
                    loading: false,
                    modalVisible: true
                });
                return;
            }
        }

        if(updateReminders.length){
            await Promise.all(updateReminders.map(item => this.props.updateReminderAction(item)));
        }

        if(deleteReminders.length){
            await Promise.all(deleteReminders.map(item => this.props.deleteReminderAction(item.reminderID)));
        }

        // if(updateReminders.length){

        // }


        await this.setState({
            loading: false,
            titleNotification: "Yepi! Successfully!" , 
            descriptionNotification: 'Thank you!', 
            isNegative: false,
            modalVisible: true
        });
    }

    _closePopup = async() => {
        await this.setState({modalVisible: false}, () => {
            if(this.props.navigation.state.params && this.props.navigation.state.params.isStep)
                this.props.navigation.navigate('UserManage', {petCreated: this.props.navigation.state.params.petDetail})
            return;
        });
        await this._getReminders();
    }

    _compareDateTimeToCurrent(dateTime, repeatType) {
        if(!dateTime)
            return true;
        let date = new Date(dateTime.replace(' ', 'T'));
        let current = new Date();
        if(repeatType === 'One Time' && date > current)
            return true;
        if(repeatType === 'Daily' && new Date(current.setHours(date.getHours(), date.getMinutes(), date.getMilliseconds())) > new Date())
            return true;
        if(repeatType === 'Weekly' && date.getDay() > new Date().getDay())
            return true;
        if(repeatType === 'Every 2 Weeks' && date > current)
            return true;   
        if(repeatType === 'Monthly' && date.getDate() > current.getDate())
            return true;  
        if(repeatType === 'Every 3 Months' && date > current)
            return true; 
        if(repeatType === 'Every 6 Months' && date > current)
            return true; 
        if(repeatType === 'Yearly' && (date.getMonth() > current.getMonth() || (date.getMonth() === current.getMonth() && date.getDate() > current.getDate()))){
            return true;  
        }
        return false;
    }

    _onDel = async(index) => {
        await this.state.arrReminder.splice(index, 1)
        await this.setState({
            arrReminder: [...this.state.arrReminder]
        });
        await this.forceUpdate();
    }
}

const mapStateToProps = state => ({
    getSuggestedReminder: state.getSuggestedReminder,
    getRepeatTypes: state.getRepeatTypes,
    updatePet: state.updatePet,
    userSession: state.userSession,
    createMultipleReminder: state.createMultipleReminder,
    getCategoryInfo: state.getCategoryInfo,
    getReminderByPet: state.getReminderByPet,
    getReminderByOwner: state.getReminderByOwner
});

const mapDispatchToProps = {
    getSuggestedReminderAction,
    getRepeatTypesActions,
    updatePetAction,
    createMultipleReminderAction,
    getCategoryInfoAction,
    getReminderByPetAction,
    updateReminderAction,
    deleteReminderAction,
    getPetsByOwnerAction,
    getReminderByOwnerAction,
    getProvidersByOwnerAction
}

export default connect(mapStateToProps, mapDispatchToProps)(CareScheduleScreen);

const format = StyleSheet.create({
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
        fontWeight: 'bold',
        fontSize: iOS ? 17 : 20,
        color: '#fff',
        textAlign: 'center'
    },
    button_text_normal: {
        fontWeight: 'bold',
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
        height: 63
    }
});