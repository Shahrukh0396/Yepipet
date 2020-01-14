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
    AsyncStorage,
    Platform
} from 'react-native';
import {connect} from 'react-redux';
import styles from '../../../constants/Form.style';
import Menu from '../../../components/Menu';
import { MaterialIcons } from '@expo/vector-icons';
import getReminderByOwnerAction from '../../../src/apiActions/reminder/getReminderByOwner';
import ItemSchedule from '../../../components/schedule/ItemSchedule';
import PopupConfirmSchedule from '../../../components/schedule/PopupConfirmSchedule';
import PopupSnooze from '../../../components/schedule/PopupSnooze';
import PopupConfirm from '../../../components/PopupConfirm';
import PopupNotification from '../../../components/PopupNotification';
import deleteReminderAction from '../../../src/apiActions/reminder/deleteReminder';
import updateReminderAction from '../../../src/apiActions/reminder/updateReminder';
import { dateHelper, dataHelper } from '../../../src/helpers';
import { Ionicons } from '@expo/vector-icons';
//complete task
import createCompleteTaskAction from '../../../src/apiActions/reminder/createCompleteTask';
import updateCompleteTaskAction from '../../../src/apiActions/reminder/updateCompleteTask';
import createMultipleCompleteTaskAction from '../../../src/apiActions/reminder/createMultipleCompleteTask';
import updateMultipleCompleteTaskAction from '../../../src/apiActions/reminder/updateMultipleCompleteTask';

class ReminderManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenMenu: false,
            checked: true,
            modalVisible: false,
            arrPastDue: [],
            arrUpComing: [],
            dataConfirm: null,
            checkAll: true,
            listPet: [],
            loading: false,
            dataDetele: null,
            modalVisibleDelete: false,
            descriptionDelete: null,
            visibleNotification: false,
            titleNotification: null,
            descriptionNotification: null,
            isNegative: false,
            isDeleteSuccess: false,
            closeAllSwipe: false,
            descriptionConfirm: '',
            dataIndex: null,
            dataSnooze: null,
            visibleSnooze: false
        }
    }

    componentWillMount() {
        this._renderListPets();
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {
            if(this.props.userSession.user)
                this._getReminder();
        });
    }
    
    componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
        console.log('this.state.arrPastDue ====================>', this.state.arrPastDue)
    }

    render() {
        const {navigate} = this.props.navigation;
        const {user} = this.props.userSession;
        const {
            arrPastDue, 
            dataConfirm, 
            modalVisible, 
            checkAll, 
            arrUpComing, 
            listPet, 
            loading,
            visibleNotification,
            titleNotification,
            descriptionNotification,
            descriptionConfirm,
            dataIndex,
            visibleSnooze
        } = this.state;

        return (
            <SafeAreaView style={styles.safeArea}>
                <Menu openMenu={this.state.isOpenMenu} 
                    navigation={this.props.navigation} 
                    closeMenu={() => this.setState({isOpenMenu: false})}
                />
                <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                    <Spinner visible={loading}/>
                    <View style={styles.container}>
                        <View style={{position:'relative', paddingBottom: 22, paddingTop: 25, justifyContent: 'center'}}>
                            <TouchableOpacity style={styles.button_back} onPress={() => this.setState({isOpenMenu: true})}>
                                <MaterialIcons name="menu" color="#000" size={25} />
                            </TouchableOpacity>
                            <Text style={[styles.title_head, {alignSelf: 'center'}]}>Schedules</Text>
                            <TouchableOpacity 
                                style={[styles.button_back, {right: 0, width: 30, height: 30}]}
                                onPress={() => navigate('ScheduleDetail', {petDetail: null})}
                            >
                                <MaterialIcons name="add-circle-outline" color="#000" size={30} />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.container_form, styles.form_group]}>
                            <View style={{flex: 0.3, paddingRight: 18}}>                    
                                <Image style={[styles.image_circle, {marginTop: 15}]} source={ (this.props.getAvatar && this.props.getAvatar.url) ? {uri: this.props.getAvatar.url} : require('../../../assets/images/default-avatar.jpg')}/>
                            </View>   
                            <View style={{flex: 0.7}}>
                                <View style={{position: 'relative'}}>
                                    <Text style={format.user_name}>{user && user.userFirstName} {user && user.userLastName}</Text>
                                    <TouchableOpacity style={format.button_edit} onPress={() => navigate('UserProfile')}>
                                        <Image style={{justifyContent: 'center', height: 27, width: 27}} source={require('../../../assets/images/icon-edit.png')}/>
                                    </TouchableOpacity>
                                </View>
                                <Text style={format.user_email}>{user && user.userEmail}</Text>
                                <Text style={format.user_phone}>{user && dataHelper.formatPhone(user.userPhone.toString())}</Text>
                            </View>
                        </View>

                        <View style={[styles.container_form, {marginBottom: 21}]}>
                            {
                                listPet && listPet.length > 0
                                ?
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                    <TouchableOpacity 
                                        style={format.button_check} 
                                        activeOpacity={1}
                                        onPress={this._checkAllPet}
                                    >
                                    {
                                        checkAll ? 
                                        <MaterialIcons name="check" size={30} color="#14c498" />
                                        : null
                                    }
                                    </TouchableOpacity>
                                    {
                                        listPet.map((item, index) => {
                                            return (
                                                <TouchableOpacity 
                                                    key={item.petID} 
                                                    style={{position: 'relative', paddingRight: 6, height: 60, marginRight: 18}}
                                                    activeOpacity={1}
                                                    onPress={() => this._toggleCheck(item, index)}
                                                >
                                                    <Image 
                                                        style={[styles.image_circle, format.image_circle, {borderColor: '#fb8f8f'}]} 
                                                        source={item.petPortraitURL ? {uri: item.petPortraitURL} : require('../../../assets/images/img-pet-default.png')}
                                                    />
                                                    {
                                                        item.isCheck ? 
                                                        <Image 
                                                            style={format.icon_check} 
                                                            source={require('../../../assets/images/icon-check.png')}
                                                        />
                                                        : null
                                                    }
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </ScrollView>
                                :
                                <View style={{flexDirection: 'column', alignItems: 'center' }}>
                                    <Text style={format.text_note}> You don't have any pets.</Text>
                                    <Text style={format.text_note}>Do you want add new pet ?</Text>
                                    <TouchableOpacity onPress={() => navigate('AddNewPet')}>
                                        <Ionicons name='md-add-circle-outline' size={30} style={{paddingTop: 5}}/>
                                    </TouchableOpacity>
                                </View>
                            }
                            </View>

                        <View style={{marginBottom: 20}}>
                            <View style={{flexDirection:'row', flexWrap:'wrap', marginBottom: 17, alignItems: 'center', height: 'auto'}}>
                                <Text style={format.title_big}>Past Due Tasks</Text>
                                <Image 
                                    style={{width: 18, height: 18}} 
                                    source={require('../../../assets/images/icon-past-due.png')}
                                />
                            </View>
                            <View style={[styles.container_form, { flex: 1 }]}>
                                <ScrollView 
                                    nestedScrollEnabled 
                                    style={{ maxHeight: 400 }}
                                    showsVerticalScrollIndicator={false}
                                >
                                    {    
                                        arrPastDue && arrPastDue.length ?
                                        arrPastDue.map((item, index) => {
                                            return (
                                                <ItemSchedule 
                                                    data={item}
                                                    check={() => this._checkReminder(item, index)}
                                                    isLast={index === arrPastDue.length - 1}
                                                    navigation={this.props.navigation}
                                                    isPastDue={true}
                                                    onCompleteAll={() => this._completeMultipleTask(item)}
                                                    onSkipAll={() => this._skipTask(item, index)}
                                                    onSkip={() => this._skipTask(item, index)}
                                                    onSnooze={() => this._confirmSnooze(item, index)}
                                                    key={index}
                                                />
                                            )
                                        })
                                        :<Text style={format.text_note}>No upcoming task.</Text>
                                    }
                                </ScrollView>
                            </View>
                        </View>

                        <View>
                            <View style={{flexDirection:'row', flexWrap:'wrap', marginBottom: 17, alignItems: 'center'}}>
                                <Text style={format.title_big}>Up coming tasks</Text>
                                <Image 
                                    style={{width: 18, height: 18}} 
                                    source={require('../../../assets/images/icon-up-coming.png')}
                                />
                            </View>
                            <View style={[styles.container_form, {flex: 1}]}>
                                <ScrollView 
                                    nestedScrollEnabled 
                                    style={{ maxHeight: 400 }}
                                    showsVerticalScrollIndicator={false}
                                    bounces={true}
                                >
                                    {    
                                        arrUpComing && arrUpComing.length ?
                                        arrUpComing.map((item, index) => {
                                            return (
                                                <ItemSchedule 
                                                    data={item}
                                                    check={() => this._checkReminder(item, index)}
                                                    isLast={index === arrUpComing.length - 1}
                                                    navigation={this.props.navigation}
                                                    onSkip={() => this._skipTask(item, index)}
                                                    onSnooze={() => this._confirmSnooze(item, index)}
                                                    key={index}
                                                />
                                            )
                                        })
                                        :<Text style={format.text_note}>No upcoming task.</Text>
                                    }
                                </ScrollView>
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={[styles.form_button, {backgroundColor: '#14c498'}]}
                            onPress={() => navigate('ViewCompleteTask')}
                        >
                            <Text style={styles.button_text}>View Past Tasks</Text>
                        </TouchableOpacity>

                        <PopupConfirmSchedule
                            visible={modalVisible} 
                            data={dataConfirm}
                            description={descriptionConfirm}
                            handleButton1={() => this._skipTask(dataConfirm, dataIndex)}
                            handleButton2={this._completeTask}
                            handleClose={() => this._closeConfirmSchedule()}
                        />

                        <PopupNotification 
                            visible={visibleNotification} 
                            buttonText={'Ok'} 
                            closeDisplay={this._closeNotification}
                            title={titleNotification}
                            description={descriptionNotification}
                            titleColor={'#000'}
                            isNegative={this.state.isNegative}
                        />
                        
                        <PopupSnooze
                            visible={visibleSnooze}
                            handleButton1={() => this.setState({visibleSnooze: false})}
                            handleClose={() => this.setState({visibleSnooze: false})}
                            handleButton2={this._snoozeTask}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    _checkAllPet = () =>{
        this.setState({checkAll: !this.state.checkAll}, () => {
            let listPet = [...this.state.listPet];
            listPet.forEach(item => {
                item.isCheck = this.state.checkAll;
            });
            this.setState({listPet}, () => {
                this._getReminder();
            });
        });
    }

    _renderListPets = () => {
        let arrPet = JSON.stringify(this.props.getPetsByOwner.list);
        arrPet = JSON.parse(arrPet);
        arrPet.forEach(item => {
            item.isCheck = true;
        });
        this.setState({listPet: arrPet});
    }

    _toggleCheck(item, index){
        let listPet = [...this.state.listPet];
        listPet[index].isCheck = !item.isCheck;
        this.setState({listPet}, () => {
            let result = this.state.listPet.filter(item => !item.isCheck);
            if(!result.length){
                this.setState({checkAll: true});
            }
            else if(result.length === 1) this.setState({checkAll: false});
            this._getReminder();
        });
    }

    _checkReminder = (data, index) => {
        let dataConfirm = {...data}
        if(new Date(data.tasks[0].completeTaskDateTime) < new Date()){
            let arrPastDue = [...this.state.arrPastDue];
            arrPastDue[index].isCheck = true;
            this.setState({arrPastDue});
        }
        else {
            let arrUpComing = [...this.state.arrUpComing];
            arrUpComing[index].isCheck = true;
            this.setState({arrUpComing});
        }
        dataConfirm.tasks = dataConfirm.tasks.slice(0, 1);
        this.setState({
            dataConfirm: dataConfirm,
            dataIndex: index,
            descriptionConfirm: `Did you ﬁnish ${dataConfirm.reminderCategory} for ${dataConfirm.petInformation.petName}? (This recurring task will show the next due date when completed.)`,
            modalVisible: true,
        })
    }

    _getReminder = async() => {
        this.setState({loading: true});
        // await AsyncStorage.removeItem('localReminder');
        // await AsyncStorage.removeItem('localCompleteTasks');
        // await AsyncStorage.removeItem('localSkipTasks');
        // await this.props.getReminderByOwnerAction(this.props.userSession.user.userID);
        let isConnected = await AsyncStorage.getItem('isConnected');
        let localReminder = await AsyncStorage.getItem('localReminder');
        let persist = await AsyncStorage.getItem('persist:root');
        persist = JSON.parse(persist);
        persist.getReminderByOwner = JSON.parse(persist.getReminderByOwner);
        let taskReminder = [];
        if(isConnected && !JSON.parse(isConnected)) {
            taskReminder = JSON.parse(localReminder);
        }
        else {
            if(!persist.getReminderByOwner){
                this.setState({loading: false});
                return;
            }
            if(persist.getReminderByOwner.data && persist.getReminderByOwner.data.length){
                if(localReminder === '[]' || !localReminder) {
                    taskReminder = persist.getReminderByOwner.data.map(item => this._createReminderTask(item, null, null)); //create task local
                }
                else {
                    // console.log('persist.getReminderByOwner.data ==============>', persist.getReminderByOwner.data)
                    taskReminder = JSON.parse(localReminder);
                    // taskReminder = persist.getReminderByOwner.data;
                    taskReminder = taskReminder.map(item => {
                        let obj = {...item};
                        // if(obj.task.reminderRepeatType === 'One Time')
                        if(obj.reminderRepeatType === 'One Time')
                            return obj;
                        else{
                            let current = new Date();
                            let tasks = obj.tasks;
                            let lastChild = tasks[tasks.length - 1];

                            if(tasks && new Date(lastChild.completeTaskDateTime) < current){
                                tasks.push({
                                    completeTaskDateTime: this._calculateDueDateTask(lastChild.completeTaskDateTime, obj.reminder.reminderRepeatType),
                                    completeTask: null
                                });
                            }
                            obj.tasks = tasks;
                            return obj;
                        }
                    })
                }
                await AsyncStorage.setItem('localReminder', JSON.stringify(taskReminder));
                // console.log('JSON.stringify(taskReminder)', JSON.stringify(taskReminder));
            }
            // let result = await this.props.getReminderByOwnerAction(this.props.userSession.user.userID);
            // if(!result){
            //     this.setState({loading: false});
            //     return;
            // }
            // if(result && result.length){
            //     let arrReminder = result;
            //     if(!localReminder){
            //         taskReminder = arrReminder.map(item => this._createReminderTask(item, null, null)); //create task local
            //     }
            //     else {
            //         taskReminder = JSON.parse(localReminder);
            //         if(JSON.stringify(arrReminder) !== JSON.stringify(persist.getReminderByOwner.data)){ //compare reminder on servar with local reminder
            //             let localCompleteTasks = await AsyncStorage.getItem('localCompleteTasks');
            //             localCompleteTasks = JSON.parse(localCompleteTasks);
            //             let localSkipTasks = await AsyncStorage.getItem('localSkipTasks');
            //             localSkipTasks = JSON.parse(localSkipTasks);
            //             arrReminder.forEach(async(item, index) => {
            //                 // let checkReminder = taskReminder.find(reminder => reminder.reminder.reminderID === item.reminderID);
            //                 let indexReminder = taskReminder.findIndex(reminder => reminder.reminder.reminderID === item.reminderID);
            //                 if(indexReminder >= 0){ //check reminder is created on local reminder?
            //                     let dataReminder = {...taskReminder[indexReminder]};
            //                     if(JSON.stringify(item) !== JSON.stringify(dataReminder.reminder)){ //compare reminder item on server width local reminder item
            //                         if(item.reminderRepeatType !== dataReminder.reminder.reminderRepeatType){
            //                             taskReminder[indexReminder] = this._createReminderTask(item, null, null); //create new reminder local
            //                             if(localCompleteTasks && localCompleteTasks.length){ // check and update local complete task 
            //                                 localCompleteTasks = localCompleteTasks.filter(complete => complete.reminder.reminderID !== item.reminderID);
            //                                 await AsyncStorage.setItem('localCompleteTasks', JSON.stringify(localCompleteTasks));
            //                             }
            //                             if(localSkipTasks && localSkipTasks.length){ // check and update local skip task
            //                                 localSkipTasks = localSkipTasks.filter(skip => skip.reminder.reminderID !== item.reminderID);
            //                                 await AsyncStorage.setItem('localSkipTasks', JSON.stringify(localSkipTasks));
            //                             }
            //                         }
            //                         else if(item.reminderDateTime !== dataReminder.reminder.reminderDateTime){ //check, get complete task and skip task of reminder to update local reminder
            //                             let completeTask = localCompleteTasks && localCompleteTasks.find(complete => complete.reminder.reminderID === item.reminderID) || null;
            //                             let skipTask = localSkipTasks && localSkipTasks.find(skip => skip.reminder.reminderID === item.reminderID) || null;
            //                             taskReminder[index] = this._createReminderTask(item, completeTask, skipTask);
            //                         }
            //                         else taskReminder[indexReminder].reminder = item; //update information of reminder local
            //                     }
            //                 }
            //                 else {
            //                     let newData = this._createReminderTask(item, null, null);
            //                     taskReminder.push(newData);
            //                 }
            //             })
            //         }
            //         else{
            //             taskReminder = taskReminder.map(item => {
            //                 let obj = {...item};
            //                 if(obj.reminder.reminderRepeatType === 'One Time')
            //                     return obj;
            //                 else{
            //                     let current = new Date();
            //                     let tasks = obj.tasks;
            //                     let lastChild = tasks[tasks.length - 1];

            //                     if(tasks && new Date(lastChild.completeTaskDateTime) < current){
            //                         tasks.push({
            //                             completeTaskDateTime: this._calculateDueDateTask(lastChild.completeTaskDateTime, obj.reminder.reminderRepeatType),
            //                             completeTask: null
            //                         });
            //                     }
            //                     obj.tasks = tasks;
            //                     return obj;
            //                 }
            //             })
            //         }
            //     }
            //     await AsyncStorage.setItem('localReminder', JSON.stringify(taskReminder));
            //     console.log('JSON.stringify(taskReminder)', JSON.stringify(taskReminder));
            // }
            // else {
            //     this.setState({loading: false});
            //     return;
            // }
        }
        this._setPastDueAndUpcoming(taskReminder);

        this.setState({loading: false});
    } 

    _calculateDueDateTask(date, repeatType) {
        // date = date.replace(' ', 'T');
        let dateTime = new Date(date);
        switch(repeatType){
            case 'Daily':
                return new Date(dateTime.setDate(dateTime.getDate() + 1));
            case 'Weekly':
                return new Date(dateTime.setDate(dateTime.getDate() + 7));
            case 'Every 2 Weeks':
                return new Date(dateTime.setDate(dateTime.getDate() + 7 * 2));
            case 'Monthly':
                return new Date(dateTime.setMonth(dateTime.getMonth() + 1));
            case 'Every 3 Months':
                return new Date(dateTime.setMonth(dateTime.getMonth() + 3));
            case 'Every 6 Months':
                return new Date(dateTime.setMonth(dateTime.getMonth() + 6));
            case 'Yearly':
                return new Date(dateTime.setFullYear(dateTime.getFullYear() + 1));
            default: 
                return dateTime;
        }
    }

    _createReminderTask = (reminder, completeTask, skipTask) => {
        let objReminder = null;
        let tasks = [];
        let dateTime = reminder.reminderDateTime.replace(' ', 'T');
        dateTime = new Date(dateHelper.convertDate(dateTime) + ' ' + dateHelper.convertTime(dateTime));
        let current = new Date(new Date().setDate(new Date().getDate() + 1));
        if(!reminder.reminderRepeatType || reminder.reminderRepeatType === 'One Time')
            tasks.push({completeTaskDateTime: dateTime, completeTask: null});
        else{
            do {
                let obj = {
                    completeTaskDateTime: dateTime,
                    completeTask: null
                };
                tasks.push(obj);
                dateTime = this._calculateDueDateTask(obj.completeTaskDateTime, reminder.reminderRepeatType);
            }
            while (dateTime < current);
        }
        if(completeTask)
            tasks = tasks.filter(item => !completeTask.tasks.find(complete => item.completeTaskDateTime === complete.completeTaskDateTime))
        
        if(skipTask)
            tasks = tasks.filter(item => !skipTask.tasks.find(skip => item.completeTaskDateTime === skip.completeTaskDateTime))
        
        objReminder = {
            reminder: reminder,
            tasks: tasks,
            petInformation: this.state.listPet.find(pet => pet.isCheck && pet.petID === reminder.petID)
        }
        return objReminder;
    }

    _setPastDueAndUpcoming = (data) => {
        if(!data && !data.length)
            return;
        let pastDueTasks = [];
        let upcomingTasks = [];
        data = data.filter(item => this.state.listPet.find(pet => item.petInformation.petID === pet.petID && pet.isCheck));
        data.forEach(item => {
            if(!item.tasks || !item.tasks.length)
                return;
            else {
                let obj = item;
                let pastDue = item.tasks.filter(task => new Date(task.completeTaskDateTime) < new Date() && !task.isSkipped);
                let upcoming = item.tasks.filter(task => new Date(task.completeTaskDateTime) > new Date() && !task.isSkipped);
                if(pastDue && pastDue.length){
                    obj = {...obj};
                    obj.tasks = pastDue;
                    let checkNotCompleteAll = pastDue.find(item => !item.isCompleted);
                    if(checkNotCompleteAll){
                        obj.isCompletedAll = false;
                        obj.tasks = obj.tasks.filter(item => !item.isCompleted);
                    }
                    else obj.isCompletedAll = true;
                    pastDueTasks.push(obj);
                }
                if(upcoming && upcoming.length){
                    obj = {...obj};
                    obj.tasks = upcoming;
                    let checkNotCompleteAll = upcoming.find(item => !item.isCompleted);
                    if(checkNotCompleteAll){
                        obj.isCompletedAll = false;
                        obj.tasks = obj.tasks.filter(item => !item.isCompleted);
                    }
                    else obj.isCompletedAll = true;
                    upcomingTasks.push(obj);
                }
            }
        })
        this.setState({
            arrPastDue: pastDueTasks.sort((item1, item2) => new Date(item1.tasks[0].completeTaskDateTime) - new Date(item2.tasks[0].completeTaskDateTime)),
            arrUpComing: upcomingTasks.sort((item1, item2) => new Date(item1.tasks[0].completeTaskDateTime) - new Date(item2.tasks[0].completeTaskDateTime))
        });

        // console.log('pastDueTasks', JSON.stringify(pastDueTasks));
        // console.log('upcomingTasks', JSON.stringify(upcomingTasks));
    }

    // _confirmTask = (data, completeDateTime) => {
    //     this.setState({modalVisible: false}, () => {
    //         this._completeTask(data, completeDateTime);
    //     });
    // }

    _completeTask = (data, completeDateTime) => {
        this.setState({modalVisible: false, loading: true}, async() =>{
            let dataCreate = {
                completedTaskCategory: data.reminder.reminderCategory,
                completedTaskCompletionTime: completeDateTime,
                completedTaskCreatedBy: data.reminder.reminderCreatedBy,
                completedTaskDateTime: dateHelper.convertDateUtcDateTime(data.tasks[0].completeTaskDateTime),
                completedTaskDescription: data.reminder.reminderDescription,
                completedTaskOnceOnly: 'Y',
                completedTaskRepeatType: data.reminder.reminderRepeatType,
                completedTaskTodo: data.reminder.reminderTodo,
                completedTaskTypeRelateTableID: data.reminder.reminderTypeRelateTableID,
                ownerID: data.reminder.ownerID,
                petID: data.reminder.petID,
                recompletedTaskSecondatyCategory: data.reminder.rereminderSecondaryCategory,
                recompletedTaskSecondatyCategoryID: data.reminder.rereminderSecondaryCategoryID,
                completedTaskGeneralReminderID: data.reminder.reminderID
            };
            let result = null;
            if(data.tasks[0].completeTask){
                dataCreate.completedTaskID = data.tasks[0].completeTask.completedTaskID;
                result = await this.props.updateCompleteTaskAction(dataCreate);
            }
            else result = await this.props.createCompleteTaskAction(dataCreate);

            if(!result){
                this.setState({
                    loading: false,
                    isDeleteSuccess: false,
                    isNegative: true, 
                    titleNotification: 'Error',
                    descriptionNotification: 'Complete task failed. Please try again.',
                    closeAllSwipe: true,
                    visibleNotification: true
                });
                return;
            }

            else {
                let localReminder = await AsyncStorage.getItem('localReminder');
                localReminder = JSON.parse(localReminder);
                let i = localReminder.findIndex(item => item.reminder.reminderID === data.reminder.reminderID);
                if(i >= 0){
                    let localIndexTask = localReminder[i].tasks.findIndex(item => item.completeTaskDateTime === data.tasks[0].completeTaskDateTime);
                    localReminder[i].isCheck = false;
                    let convertDate = localReminder[i].reminder.reminderDateTime.replace(' ', 'T');
                    if(localReminder[i].reminder.reminderRepeatType !== 'One Time' 
                        && new Date(convertDate) <= new Date(data.tasks[0].completeTaskDateTime))
                    {
                        localReminder[i].reminder.reminderDateTime = dateHelper.convertDateUtcDateTime(localReminder[i].tasks[localIndexTask + 1].completeTaskDateTime);
                        let dataUpdate = localReminder[i].reminder;
                        await this.props.updateReminderAction(dataUpdate);
                    }
                    localReminder[i].tasks[localIndexTask].isCompleted = true;
                    localReminder[i].tasks[localIndexTask].completeTask = {...result};
                    this._setPastDueAndUpcoming(localReminder);

                    await AsyncStorage.getItem('localCompleteTasks', async(err, result) => {
                        if(result){
                            result = JSON.parse(result);
                            let checkIndex = result.findIndex(item => item.reminder.reminderID === data.reminder.reminderID);
                            // console.log('checkIndex', checkIndex);
                            if(checkIndex >= 0)
                            result[checkIndex].tasks.push(data.tasks[0]);
                            else {
                                let reminder = {...localReminder[i]};
                                reminder.tasks = [data.tasks[0]];
                                result.push(reminder);
                            }
                        }
                        else{
                            let reminder = {...localReminder[i]};
                            reminder.tasks = [localReminder[i].tasks[localIndexTask]];
                            result = [];
                            result.push(reminder);
                        }
                        await AsyncStorage.setItem('localCompleteTasks', JSON.stringify(result));
                    })
                }
                await AsyncStorage.setItem('localReminder', JSON.stringify(localReminder));
                await this.props.getReminderByOwnerAction(this.props.userSession.user.userID);
                // console.log('localReminder', JSON.stringify(localReminder));

                this.setState({
                    loading: false
                }, () => {
                    this.props.navigation.navigate('ViewCompleteTask');
                })
            }
        });
    }

    _completeMultipleTask = (data) => {
        this.setState({loading: true}, async() =>{
            let dataCreate = {
                completedTaskCategory: data.reminder.reminderCategory,
                completedTaskCreatedBy: data.reminder.reminderCreatedBy,
                completedTaskDescription: data.reminder.reminderDescription,
                completedTaskOnceOnly: 'Y',
                completedTaskRepeatType: data.reminder.reminderRepeatType,
                completedTaskTodo: data.reminder.reminderTodo,
                completedTaskTypeRelateTableID: data.reminder.reminderTypeRelateTableID,
                ownerID: data.reminder.ownerID,
                petID: data.reminder.petID,
                recompletedTaskSecondatyCategory: data.reminder.rereminderSecondaryCategory,
                recompletedTaskSecondatyCategoryID: data.reminder.rereminderSecondaryCategoryID,
                completedTaskGeneralReminderID: data.reminder.reminderID
            };

            let arr = [];

            data.tasks.forEach(item => {
                let obj = {...dataCreate};
                obj.completedTaskCompletionTime = dateHelper.convertDateUtcDateTime(item.completeTaskDateTime);
                obj.completedTaskDateTime = dateHelper.convertDateUtcDateTime(item.completeTaskDateTime);
                if(item.completeTask){
                    obj.completedTaskCreatedDate = item.completeTask.completedTaskCreatedDate;
                    obj.completedTaskID = item.completeTask.completedTaskID;
                }
                arr.push(obj);
            })
            let arrCreate = arr.filter(item => !item.completedTaskID);
            let arrUpdate = arr.filter(item => item.completedTaskID);
            let resultCreate = [];
            let resultUpdate = [];
            if(arrCreate)
                resultCreate = await this.props.createMultipleCompleteTaskAction(arrCreate);
            if(arrUpdate)
                resultUpdate = await this.props.updateMultipleCompleteTaskAction(arrUpdate);

            if(resultCreate.length || resultUpdate.length)
                arr = [...resultCreate, ...resultUpdate];

            // console.log('arr', arr);

            if(!arr || !arr.length){
                this.setState({
                    loading: false,
                    isDeleteSuccess: false,
                    isNegative: true, 
                    titleNotification: 'Error',
                    descriptionNotification: 'Complete task failed. Please try again.',
                    closeAllSwipe: true,
                    visibleNotification: true
                });
            }

            else {
                let localReminder = await AsyncStorage.getItem('localReminder');
                localReminder = JSON.parse(localReminder);
              
                let i = await localReminder.findIndex(item => item.reminder.reminderID === data.reminder.reminderID);
                if(i >= 0){
                    let completeTasks = []; 
                    await data.tasks.forEach(async task => {
                        let localIndexTask = await localReminder[i].tasks.findIndex(item => item.completeTaskDateTime === task.completeTaskDateTime);
                        if(localIndexTask >= 0){
                            task.completeTask = await arr.find(item => dateHelper.convertDateUtcDateTime(task.completeTaskDateTime) === item.completedTaskDateTime);
                            localReminder[i].tasks[localIndexTask].completeTask = task.completeTask;
                            localReminder[i].tasks[localIndexTask].isCompleted = true;
                            completeTasks.push(task);
                        }
                    })

                    localReminder[i].isCheck = false;
                    let convertDate = await localReminder[i].reminder.reminderDateTime.replace(' ', 'T');
                    if(data.tasks.find(item => item.isSnooze))
                        data.tasks = await data.tasks.filter(item => !item.isSnooze);
                    if(localReminder[i].reminder.reminderRepeatType !== 'One Time'
                        && new Date(convertDate) <= new Date(data.tasks[data.tasks.length - 1].completeTaskDateTime))
                    {
                        localReminder[i].reminder.reminderDateTime = dateHelper.convertDateUtcDateTime(data.tasks[data.tasks.length - 1].completeTaskDateTime);
                        let dataUpdate = localReminder[i].reminder;
                        await this.props.updateReminderAction(dataUpdate);
                    }
                    this._setPastDueAndUpcoming(localReminder);

                    await AsyncStorage.getItem('localCompleteTasks', async(err, result) => {
                        if(!result){
                            let reminder = {...localReminder[i]};
                            reminder.tasks = completeTasks;
                            result = [];
                            result.push(reminder);
                        }
                        else {
                            result = JSON.parse(result);
                            let checkIndex = result.findIndex(item => item.reminder.reminderID === data.reminder.reminderID);
                            if(checkIndex >= 0)
                                result[checkIndex].tasks = [...result[checkIndex].tasks, ...completeTasks];
                            else {
                                let reminder = {...localReminder[i]};
                                reminder.tasks = completeTasks;
                                result.push(reminder);
                            }
                        }
                        await AsyncStorage.setItem('localCompleteTasks', JSON.stringify(result));
                    })
                    
                }
                await AsyncStorage.setItem('localReminder', JSON.stringify(localReminder));
                await this.props.getReminderByOwnerAction(this.props.userSession.user.userID);
                // console.log('localReminder', JSON.stringify(localReminder));

                this.setState({
                    loading: false
                }, () => {
                    this.props.navigation.navigate('ViewCompleteTask');
                })
            }
        });
    }

    _skipTask = async(data, index) => {
        if(new Date(data.tasks[0].completeTaskDateTime) < new Date()){
            let arrPastDue = [...this.state.arrPastDue];
            // console.log('arrPastDue[index]', arrPastDue[index]);
            arrPastDue[index].isCheck = false;
            await this.setState({arrPastDue});
        }
        else {
            let arrUpComing = [...this.state.arrUpComing];
            arrUpComing[index].isCheck = false;
            await this.setState({arrUpComing});
        }
        await this.setState({modalVisible: false, loading: true}, async() => {
            let localReminder = await AsyncStorage.getItem('localReminder');
            localReminder = JSON.parse(localReminder);
            let i = localReminder.findIndex(item => item.reminder.reminderID === data.reminder.reminderID);
            let arrSkip = []; 
            // console.log('dataSkip', data);
            localReminder[i].tasks.forEach( item => {
                let check = data.tasks.find(task => task.completeTaskDateTime === item.completeTaskDateTime);
                if(check){
                    arrSkip.push(check);
                    item.isSkipped = true;
                }
            });
            this._setPastDueAndUpcoming(localReminder);
            await AsyncStorage.setItem('localReminder', JSON.stringify(localReminder));

            await AsyncStorage.getItem('localSkipTasks', async(err, result) => {
                if(result){
                    result = JSON.parse(result);
                    let skipTaskIndex = result.findIndex(item => item.reminder.reminderID === data.reminder.reminderID);
                    if(skipTaskIndex < 0)
                        result.push(data);
                    else result[skipTaskIndex].tasks = [...result[skipTaskIndex].tasks,...arrSkip];
                }
                else {
                    result = [];
                    result.push(data);
                }
                await AsyncStorage.setItem('localSkipTasks', JSON.stringify(result), (err) => {
                    if(err){
                        this.setState({
                            loading: false,
                            isDeleteSuccess: false,
                            isNegative: true, 
                            titleNotification: 'Error',
                            descriptionNotification: 'Skip task failed. Please try again.',
                            closeAllSwipe: true,
                            visibleNotification: true
                        })
                    }
                    else {
                        this.setState({
                            loading: false
                        }, () => {
                            this.props.navigation.navigate('ViewCompleteTask');
                        })
                    }
                });
            })
        });
    }

    _closeNotification = () => {
        const {isDeleteSuccess} = this.state; 
        this.setState({visibleNotification: false}, () => {
            if(isDeleteSuccess){
                this.setState({
                    isDeleteSuccess: false,
                });
                this._getReminder();
            }
        });
    }

    _closeConfirmSchedule = () => {
        let data = {...this.state.dataConfirm}
        if(new Date(data.tasks[0].completeTaskDateTime) < new Date()){
            let arrPastDue = [...this.state.arrPastDue];
            arrPastDue[this.state.dataIndex].isCheck = false;
            this.setState({arrPastDue}, () => {
                this.setState({
                    modalVisible: false
                })
            });
        }
        else {
            let arrUpComing = [...this.state.arrUpComing];
            arrUpComing[this.state.dataIndex].isCheck = false;
            this.setState({arrUpComing}, () => {
                this.setState({
                    modalVisible: false
                })
            });
        }
        
    }

    _confirmSnooze = (item, index) => {
        this.setState({dataSnooze: item, dataIndex: index, visibleSnooze: true});
    }

    _snoozeTask = (dateType) => {
        this.setState({visibleSnooze: false}, () => {
            const {dataSnooze, dataIndex} = this.state;
            // console.log('dataSnooze', dataSnooze);
            // console.log('dataIndex', dataIndex);
            console.log('dateType', dateType);
        })
    }
}

const mapStateToProps = state => ({
    userSession: state.userSession,
    getReminderByOwner: state.getReminderByOwner,
    getPetsByOwner: state.getPetsByOwner,
    deleteReminder: state.deleteReminder,
    getAvatar: state.getAvatar,
    createCompleteTask: state.createCompleteTask,
    updateCompleteTask: state.updateCompleteTask,
    updateReminder: state.updateReminder,
    createMultipleCompleteTask: state.createMultipleCompleteTask
});

const mapDispatchToProps = {
    getReminderByOwnerAction,
    deleteReminderAction,
    createCompleteTaskAction,
    updateCompleteTaskAction,
    updateReminderAction,
    createMultipleCompleteTaskAction,
    updateMultipleCompleteTaskAction
}

export default connect(mapStateToProps, mapDispatchToProps)(ReminderManager);

const format = StyleSheet.create({
    user_name: {
        fontSize: Platform.OS === 'ios' ? 20 : 23,
        fontWeight: '700',
        color: '#ee7a23',
        textTransform: 'capitalize',
        marginBottom: 4,
        paddingRight: 30
    },
    user_email: {
        fontWeight: '400',
        color: '#000000',
        fontSize: Platform.OS === 'ios' ? 11 : 14,
        marginBottom: 7
    },
    user_phone: {
        fontSize: Platform.OS === 'ios' ? 13 : 16,
        fontWeight: '700',
        color: '#000'
    },
    button_edit: {
        position:'absolute',
        zIndex: 1,
        right: 0,
        borderWidth: 1, 
        borderColor: '#f0f0f0',
        borderRadius: 30/2,
    },
    image_pet: {
        width: 60,
        height: 60,
        borderRadius: 60/2
    },
    icon_check: {
        width: 24,
        height: 24,
        position: 'absolute',
        right: 0,
        bottom: 0
    },
    title_big: {
        color: '#202c3c',
        fontSize: Platform.OS === 'ios' ? 19 : 22,
        fontWeight: '700',
        paddingRight: 17
    },
    button_check: {
        width: 60,
        height: 60,
        borderWidth: 2,
        borderColor: '#14c498',
        borderRadius: 60/2,
        position: 'relative',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 18
    },
    text_note: {
        fontSize: Platform.OS === 'ios' ? 13 : 16,
        fontWeight: '400',
        fontStyle: 'italic',
        color: '#202c3c'
    },
    image_circle: {
        width: 60,
        height: 60,
        borderRadius: 60/2
    },
});
