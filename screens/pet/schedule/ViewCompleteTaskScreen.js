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
    AsyncStorage
} from 'react-native';
import {connect} from 'react-redux';
import styles from '../../../constants/Form.style';
import { MaterialIcons } from '@expo/vector-icons';
import getPetsByOwnerAction from '../../../src/apiActions/pet/getPetsByOwner';
import getCompleteTaskByOwnerAction from '../../../src/apiActions/reminder/getCompleteTaskByOwner';
import ItemTask from '../../../components/schedule/ItemTask';
import PopupConfirm from '../../../components/PopupConfirm';
import updateCompleteTaskAction from '../../../src/apiActions/reminder/updateCompleteTask';
import updateReminderAction from '../../../src/apiActions/reminder/updateReminder';

class ViewCompleteTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrCompleteTasks: [],
            arrSkipTasks: [],
            checkAll: true,
            loading: false,
            dataConfirm: null,
            visibleConfirm: false,
            visibleTitle: '',
            dataIndex: null

        }
    }

    componentWillMount() {
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {
            if(this.props.userSession.user)
                this._getCompleteAndSkipTasks();
        });
    }

    componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
    }

    render() {
        const {navigate} = this.props.navigation;
        const {user} = this.props.userSession;
        const {checkAll, arrCompleteTasks, arrSkipTasks, loading, visibleConfirm, visibleTitle, dataConfirm} = this.state;

        return (
            <SafeAreaView style={styles.safeArea}>
                <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                    <Spinner visible={loading}/>
                    <View style={styles.container}>
                        <View style={{position:'relative', paddingBottom: 22, paddingTop: 25, justifyContent: 'center'}}>
                            <TouchableOpacity 
                                style={styles.button_back} 
                                onPress={() => this.props.navigation.goBack()}
                            >
                                <Image style={{width: 12, height: 21}} source={require('../../../assets/images/icon-back.png')}/>
                            </TouchableOpacity>
                            <Text style={[styles.title_head, {alignSelf: 'center'}]}>View Completed Tasks</Text>
                        </View>
                        <View style={[styles.container_form, styles.form_group]}>
                            <View style={{flex: 0.3, paddingRight: 18}}>                    
                                <Image style={styles.image_circle} source={ (this.props.getAvatar && this.props.getAvatar.url) ? {uri: this.props.getAvatar.url} : require('../../../assets/images/default-avatar.jpg')}/>
                            </View>   
                            <View style={{flex: 0.7}}>
                                <View style={{position: 'relative'}}>
                                    <Text style={format.user_name}>{user && user.userFirstName} {user && user.userLastName}</Text>
                                    <TouchableOpacity style={format.button_edit} onPress={() => navigate('UserProfile')}>
                                        <Image style={{justifyContent: 'center', height: 27, width: 27}} source={require('../../../assets/images/icon-edit.png')}/>
                                    </TouchableOpacity>
                                </View>
                                <Text style={format.user_email}>{user && user.userEmail}</Text>
                                <Text style={format.user_phone}>{user && user.userPhone}</Text>
                            </View>
                        </View>

                        <View style={[styles.container_form, {marginBottom: 21}]}>
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
                                <View style={{position: 'relative', paddingRight: 6, height: 60, marginRight: 18}}>
                                    <Image 
                                        style={[styles.image_circle, format.image_pet, {borderColor: '#fb8f8f'}]} 
                                        source={require('../../../assets/images/Pet_01.png')}
                                    />
                                    <Image 
                                        style={format.icon_check} 
                                        source={require('../../../assets/images/icon-check.png')}
                                    />
                                </View>
                                <View style={{position: 'relative', paddingRight: 12, height: 60, marginRight: 18}}>
                                    <Image 
                                        style={[styles.image_circle, format.image_pet, {borderColor: '#4e94b2'}]} 
                                        source={require('../../../assets/images/Pet_02.png')}
                                    />
                                    <Image 
                                        style={format.icon_check} 
                                        source={require('../../../assets/images/icon-check.png')}
                                    />
                                </View>
                                <View style={{position: 'relative', paddingRight: 12, height: 60, marginRight: 18}}>
                                    <Image 
                                        style={[styles.image_circle, format.image_pet, {borderColor: '#85d8c3'}]} 
                                        source={require('../../../assets/images/Pet_03.png')}
                                    />
                                    <Image 
                                        style={format.icon_check} 
                                        source={require('../../../assets/images/icon-check.png')}
                                    />
                                </View>
                            </ScrollView>
                        </View>

                        <View style={{marginBottom: 20}}>
                            <View style={{flexDirection:'row', flexWrap:'wrap', marginBottom: 17, alignItems: 'center'}}>
                                <Text style={format.title_big}>Completed Tasks</Text>
                                <Image 
                                    style={{width: 18, height: 18}} 
                                    source={require('../../../assets/images/icon-check.png')}
                                />
                            </View>
                            <View style={[styles.container_form, {flex: 1}]}>
                                {
                                    arrCompleteTasks && arrCompleteTasks.length?
                                    <FlatList
                                        data={arrCompleteTasks}
                                        renderItem={({ item, index }) => (
                                            <ItemTask 
                                                isCheck={true}
                                                data={item}
                                                onUndo={() => this._handleConfirmUndo(item)}
                                                isLast={index === arrCompleteTasks.length - 1}
                                                navigation={this.props.navigation}
                                            />
                                        )}
                                        keyExtractor={(item, index) => index.toString()}
                                        nestedScrollEnabled 
                                        style={{ maxHeight: 400 }}
                                        showsVerticalScrollIndicator={false}
                                    />
                                    : <Text style={format.text_note}>No completed tasks.</Text>
                                }
                            </View>
                        </View>
                        <View style={{marginBottom: 20}}>
                            <View style={{flexDirection:'row', flexWrap:'wrap', marginBottom: 17, alignItems: 'center'}}>
                                <Text style={format.title_big}>Skipped Tasks</Text>
                                <Image 
                                    style={{width: 18, height: 18}} 
                                    source={require('../../../assets/images/icon-block.png')}
                                />
                            </View>
                            <View style={[styles.container_form, {flex: 1}]}>
                                {
                                    arrSkipTasks && arrSkipTasks.length?
                                    <FlatList
                                        data={arrSkipTasks}
                                        renderItem={({ item, index }) => (
                                            <ItemTask 
                                                isCheck={true}
                                                data={item}
                                                onUndo={() => this._handleConfirmUndo(item)}
                                                isLast={index === arrSkipTasks.length - 1}
                                                navigation={this.props.navigation}
                                                isSkip={item.isSkip}
                                                
                                            />
                                        )}
                                        keyExtractor={(item, index) => index.toString()}
                                        nestedScrollEnabled 
                                        style={{ maxHeight: 400 }}
                                        showsVerticalScrollIndicator={false}
                                    />
                                    : <Text style={format.text_note}>No skipped tasks.</Text>
                                }
                            </View>
                        </View>

                        <PopupConfirm
                            data={dataConfirm}
                            visible={visibleConfirm}
                            buttonText1={'No'}
                            buttonText2={'Yes'}
                            title={visibleTitle}
                            description={''}
                            handleButton1={() => this.setState({visibleConfirm: false})}
                            handleButton2={this._handleUndo}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>  
        );
    }

    _checkAllPet = () =>{
        this.setState({checkAll: !this.state.checkAll});
    }

    _getCompleteAndSkipTasks = () => {
        this.setState({loading: true}, async() => {
            await AsyncStorage.multiGet(['localCompleteTasks', 'localSkipTasks'], (err, stores) => {
                let arrCompleteTasks = [];
                let arrSkipTasks = [];
                let localCompleteTasks = JSON.parse(stores[0][1]);
                let localSkipTasks = JSON.parse(stores[1][1]);
                if(localCompleteTasks){
                    localCompleteTasks.forEach(item => {
                        item.tasks.forEach(task => {
                            let obj = {...item};
                            let tasks = [];
                            tasks.push(task);
                            obj.tasks = [...tasks];
                            obj.isCheck = true;
                            arrCompleteTasks.push(obj);
                        });
                    });
                    arrCompleteTasks = arrCompleteTasks.sort((item1, item2) => new Date(item1.tasks[0].completeTaskDateTime) - new Date(item2.tasks[0].completeTaskDateTime));
                }
                if(localSkipTasks){
                    localSkipTasks.forEach(item => {
                        item.tasks.forEach(task => {
                            let obj = {...item};
                            let tasks = [];
                            tasks.push(task);
                            obj.tasks = [...tasks];
                            obj.isSkip = true;
                            arrSkipTasks.push(obj);
                        });
                    });
                    arrSkipTasks = arrSkipTasks.sort((item1, item2) => new Date(item1.tasks[0].completeTaskDateTime) - new Date(item2.tasks[0].completeTaskDateTime))
                }
                    
                this.setState({arrCompleteTasks, arrSkipTasks, loading: false});
            })
        });
        // let localCompleteTasks = await AsyncStorage.getItem('localCompleteTasks');
        // let localSkipTasks = await AsyncStorage.getItem('localSkipTasks');
        // let arrCompleteTasks = [];
        // let arrSkipTasks = [];
        // console.log('localCompleteTasks', localCompleteTasks);
        // console.log('localSkipTasks', localSkipTasks);
        // if(localCompleteTasks){
        //     localCompleteTasks = JSON.parse(localCompleteTasks);
        //     localCompleteTasks.forEach(item => {
        //         item.tasks.forEach(task => {
        //             let obj = {...item};
        //             let tasks = [];
        //             tasks.push(task);
        //             obj.tasks = [...tasks];
        //             obj.isCheck = true;
        //             arrCompleteTasks.push(obj);
        //         });
        //     });
        //     arrCompleteTasks = arrCompleteTasks.sort((item1, item2) => new Date(item1.tasks[0].completeTaskDateTime) - new Date(item2.tasks[0].completeTaskDateTime))
        // }
        // if(localSkipTasks){
        //     localSkipTasks = JSON.parse(localSkipTasks);
        //     localSkipTasks.forEach(item => {
        //         item.tasks.forEach(task => {
        //             let obj = {...item};
        //             let tasks = [];
        //             tasks.push(task);
        //             obj.tasks = [...tasks];
        //             obj.isSkip = true;
        //             arrSkipTasks.push(obj);
        //         });
        //     });
        //     arrSkipTasks = arrSkipTasks.sort((item1, item2) => new Date(item1.tasks[0].completeTaskDateTime) - new Date(item2.tasks[0].completeTaskDateTime))
        // }
    }

    _handleConfirmUndo = (data, index) => {
        this.setState({
            dataConfirm: data,
            dataIndex: index,
            visibleTitle: 'Are you sure you want to undo this task?',
            visibleConfirm: true
        })
    }

    _handleUndo = () => {
        this.setState({visibleConfirm: false, loading: true}, () => {
            if(this.state.dataConfirm.isSkip)
                this._undoSkip();
            else this._undoComplete();
        })
    }

    _undoSkip = async() => {
        let data = {...this.state.dataConfirm};
        let arrSkipTasks = [...this.state.arrSkipTasks];
        arrSkipTasks = arrSkipTasks.splice(this.state.dataIndex, 1);

        let localReminder = await AsyncStorage.getItem('localReminder');
        localReminder = JSON.parse(localReminder);

        let indexReminder = localReminder.findIndex(item => item.reminder.reminderID === data.reminder.reminderID);
        let indexReminderTask = localReminder[indexReminder].tasks.findIndex(item => item.isSkipped && item.completeTaskDateTime === data.tasks[0].completeTaskDateTime);
        localReminder[indexReminder].tasks[indexReminderTask].isSkipped = false;

        let localSkipTasks = await AsyncStorage.getItem('localSkipTasks');
        localSkipTasks = JSON.parse(localSkipTasks);
        let indexSkipTask = localSkipTasks.findIndex(item => item.reminder.reminderID === data.reminder.reminderID);
        localSkipTasks[indexSkipTask].tasks = localSkipTasks[indexSkipTask].tasks.filter(item => item.completeTaskDateTime !== data.tasks[0].completeTaskDateTime);

        let setLocalReminder = AsyncStorage.setItem('localReminder', JSON.stringify(localReminder));
        let setlocalSkipTasks = AsyncStorage.setItem('localSkipTasks', JSON.stringify(localSkipTasks));
        Promise.all([setLocalReminder, setlocalSkipTasks]).then(() => {
            this.setState({arrSkipTasks, loading: false}, () => {
                this.props.navigation.goBack();
            })
        })
    }

    _undoComplete = async() => {
        let data = {...this.state.dataConfirm};
        let dataUpdate = {...data.completeTask};
        dataUpdate.completedTaskCompletionTime = null;
        
        await this.props.updateCompleteTaskAction(dataUpdate);
        if(this.props.updateCompleteTask.error){
            this.setState({loading: false});
            return;
        }

        if(this.props.updateCompleteTask.data){
            let arrCompleteTasks = [...this.state.arrCompleteTasks];
            arrCompleteTasks = arrCompleteTasks.splice(this.state.dataIndex, 1);
            let localReminder = await AsyncStorage.getItem('localReminder');
            localReminder = JSON.parse(localReminder);

            let indexReminder = localReminder.findIndex(item => item.reminder.reminderID === data.reminder.reminderID);
            let indexReminderTask = localReminder[indexReminder].tasks.findIndex(item => item.isCompleted && item.completeTaskDateTime === data.tasks[0].completeTaskDateTime);
            localReminder[indexReminder].tasks[indexReminderTask].isCompleted = false;

            let localCompleteTasks = await AsyncStorage.getItem('localCompleteTasks');
            localCompleteTasks = JSON.parse(localCompleteTasks);
            let indexCompleteTask = localCompleteTasks.findIndex(item => item.reminder.reminderID === data.reminder.reminderID);
            localCompleteTasks[indexCompleteTask].tasks = localCompleteTasks[indexCompleteTask].tasks.filter(item => item.completeTaskDateTime !== data.tasks[0].completeTaskDateTime);

            let setLocalReminder = AsyncStorage.setItem('localReminder', JSON.stringify(localReminder));
            let setlocalCompleteTasks = AsyncStorage.setItem('localCompleteTasks', JSON.stringify(localCompleteTasks));

            Promise.all([setLocalReminder, setlocalCompleteTasks]).then(() => {
                this.setState({arrCompleteTasks, loading: false}, () => {
                    this.props.navigation.goBack();
                })
            })
        }
    }
}

const mapStateToProps = state => ({
    userSession: state.userSession,
    getCompleteTaskByOwner: state.getCompleteTaskByOwner,
    getAvatar: state.getAvatar,
    updateCompleteTask: state.updateCompleteTask,
    updateReminder: state.updateReminder
});

const mapDispatchToProps = {
    getPetsByOwnerAction,
    getCompleteTaskByOwnerAction,
    updateCompleteTaskAction,
    updateReminderAction
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewCompleteTask);

const format = StyleSheet.create({
    user_name: {
        fontSize: 23,
        fontWeight: '700',
        color: '#ee7a23',
        textTransform: 'capitalize',
        marginBottom: 4,
        paddingRight: 30
    },
    user_email: {
        fontWeight: '400',
        color: '#000000',
        fontSize: 14,
        marginBottom: 7
    },
    user_phone: {
        fontSize: 16,
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
        fontSize: 22,
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
    }
});