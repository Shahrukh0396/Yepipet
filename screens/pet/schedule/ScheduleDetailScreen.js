import React, {Component} from 'react';
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
    Alert, 
    ImageEditor,
    KeyboardAvoidingView,
    AsyncStorage
} from 'react-native';
import {Feather,EvilIcons,FontAwesome,AntDesign} from '@expo/vector-icons';
import styles from '../../../constants/Form.style';
import { MaterialIcons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-material-dropdown';
import Autocomplete from 'react-native-autocomplete-input';
import DatePicker from 'react-native-datepicker';
import PetActivity from '../../../components/PetActivity';
// import SearchableDropdown from 'react-native-searchable-dropdown';
import {connect} from 'react-redux';
import getCategoryInfoAction from '../../../src/apiActions/reminder/getCategoryInfo';
import getRepeatTypesAction from '../../../src/apiActions/reminder/getRepeatTypes';
import createReminderAction from '../../../src/apiActions/reminder/createReminder';
import createMultipleReminderAction from '../../../src/apiActions/reminder/createMultipleReminder';
import uploadReminderImageAction from '../../../src/apiActions/reminder/uploadReminderImage';
import getReminderImageAction from '../../../src/apiActions/reminder/getReminderImage';
import updateReminderAction from '../../../src/apiActions/reminder/updateReminder';
import deleteReminderAction from '../../../src/apiActions/reminder/deleteReminder';
import getReminderByOwnerAction from '../../../src/apiActions/reminder/getReminderByOwner';
import {dataHelper, dateHelper} from '../../../src/helpers';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions'
import PopupNotification from '../../../components/PopupNotification';
import PopupConfirm from '../../../components/PopupConfirm';
import { Ionicons } from '@expo/vector-icons';

class dataScheduleScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrCategory: [],
            arrTodo: [],
            arrResultTodo: [],
            arrRepeat: [],
            reminderDate: dateHelper.convertDate(new Date()),
            reminderTime: dateHelper.convertTime(new Date()),
            isPushNotification: true,
            isSyncToCalendar: false,
            pushNotification: 'Y',
            syncToCalendar: 'N',
            reminderCategory: null,
            reminderTodo: null,
            reminderRepeatType: 'One Time',
            reminderDescription: null,
            valueLabel: null,
            showActivity: false,
            hideResults: false,
            arrPet: [],
            checkAll: true,
            formDataImage1: null,
            formDataImage2: null,
            imageReminder1: null,
            imageReminder2: null,
            modalVisible: false,
            titleNotification: null,
            descriptionNotification: null,
            isNegative: false,
            loading: false,
            modalVisibleDelete: false,
            descriptionDelete: null,
            localReminder: null,
            localCompleteTasks: null,
            localSkipTasks: null,
            arrTodoFilter: [],
            reminderTodoValue: ""
        }
    };

    async componentWillMount() {
        this.setState({loading: true});
        console.log(this.props.navigation.state.params.dataSchedule)
        await this._getCategoryInfo();
        await this._getRepeatTypes();
        const dataSchedule = this.props.navigation.state.params && this.props.navigation.state.params.dataSchedule;
        const dataProvider = this.props.navigation.state.params && this.props.navigation.state.params.dataProvider;
        if(dataSchedule){
            let reminderDateTime = dataSchedule.reminderDateTime ? dataSchedule.reminderDateTime.replace(' ', 'T') : null;
            await this.setState({
                reminderTodo: dataSchedule.reminderTodo && dataHelper.capitalizeFirstLetter(dataSchedule.reminderTodo),
                reminderRepeatType: dataSchedule.reminderRepeatType || 'One Time',
                reminderDate: reminderDateTime ? dateHelper.convertDate(reminderDateTime) : null,
                reminderTime: reminderDateTime ? dateHelper.convertTime(reminderDateTime) : null,
                pushNotification: dataSchedule.reminderPushNotification,
                syncToCalendar: dataSchedule.reminderSyncCalendar,
                isPushNotification: dataSchedule.reminderPushNotification === 'Y' ? true : false,
                isSyncToCalendar: dataSchedule.reminderSyncCalendar === 'Y' ? true : false,
                reminderDescription: dataSchedule.reminderDescription,
                reminderTodoValue: dataSchedule.reminderTodo ? dataSchedule.reminderTodo : ""
            }, () => {
                if(dataSchedule.reminderCategory !== 'care provider'){
                    this._handleReminderCategory(dataSchedule.reminderCategory);
                }
            });
            if(dataSchedule.reminderImageOneUpdateDate || dataSchedule.reminderImageTwoUpdateDate)
                this._getReminderImage();
        }
        if(dataProvider)
            await this.setState({
                reminderCategory: 'care provider'
            })
        this._getPets();
        await AsyncStorage.multiGet(['localReminder', 'localCompleteTasks', 'localSkipTasks'], (err, stores) => {
            this.setState({
                localReminder: JSON.parse(stores[0][1]),
                localCompleteTasks: JSON.parse(stores[1][1]),
                localSkipTasks: JSON.parse(stores[2][1])
            });
        })
    }

    render () {
        const {
            arrCategory, 
            arrRepeat, 
            reminderDate, 
            reminderTime, 
            reminderTodo, 
            reminderDescription,
            hideResults,
            imageReminder1,
            imageReminder2,
            modalVisible,
            titleNotification,
            descriptionNotification,
            isNegative,
            arrResultTodo,
            loading,
            reminderRepeatType,
            modalVisibleDelete,
            descriptionDelete,
            reminderTodoValue
        } = this.state;

        const dataSchedule = this.props.navigation.state.params && this.props.navigation.state.params.dataSchedule;
        const dataProvider = this.props.navigation.state.params && this.props.navigation.state.params.dataProvider;
        // let arrResult = [];

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
                                <TouchableOpacity 
                                    style={styles.button_back} 
                                    onPress={() => this.props.navigation.goBack()}
                                >
                                    <Image style={{width: 12, height: 21}} source={require('../../../assets/images/icon-back.png')}/>
                                </TouchableOpacity>
                                {
                                    dataSchedule
                                    ? 
                                        <Text style={[styles.title_head, {alignSelf: 'center'}]}>View Schedule</Text>
                                    :
                                        <Text style={[styles.title_head, {alignSelf: 'center'}]}>Add a Schedule</Text>
                                }
                            </View>

                            <View style={[styles.container_form, {marginBottom: 21}]}>
                            {
                                this._renderInformationPets()
                            }
                            </View>

                            <View style={[styles.container_form, {marginBottom: 26}]}>
                                <View style={[styles.form_group, {justifyContent: 'flex-start', alignItems: 'center'}]}>
                                    <View style={{width:'10%'}}>
                                        <FontAwesome name='folder-o' style={{fontSize:20,justifyContent: 'flex-start', alignItems: 'center',textAlign:'left',marginLeft:'1%', paddingBottom: 15}}></FontAwesome>
                                    </View>

                                    <View style={{width: '27%'}}>
                                        <Text style={[styles.form_label, {justifyContent: 'flex-start', alignItems: 'center',textAlign:'left',marginLeft:'1%', paddingBottom: 10 }]}>Category</Text>
                                    </View>
                                    
                                    <View style={{width: '63%'}}>
                                        {dataSchedule ?
                                            <Text style={[styles.title_container, {marginBottom: 15, textTransform: 'capitalize'}]}>
                                                {dataSchedule.providerName ? dataSchedule.providerName : dataSchedule.reminderCategory}
                                            </Text> :
                                            (
                                                dataProvider ? 
                                                <Text style={[styles.title_container, {marginBottom: 15}]}>
                                                    {dataProvider.cpLongName}
                                                </Text> :
                                                <Dropdown
                                                    data={arrCategory}
                                                    labelFontSize={16}
                                                    dropdownOffset={{top: 0, left: 0}}
                                                    inputContainerStyle={[styles.form_dropdown, {marginBottom: 6}]}
                                                    rippleInsets={{top: 0, bottom: -4 }}
                                                    onChangeText={(value) => {this._handleReminderCategory(value)}}
                                                    itemTextStyle={{textTransform: 'capitalize'}}
                                                />
                                            )
                                        }
                                    </View>
                                </View>
                                <View style={[styles.form_group, {justifyContent: 'flex-start', alignItems: 'center',marginBottom: 15}]}>
                                    <View style={{width:'10%'}}>
                                        <EvilIcons name='bell' style={{fontSize:25,textAlign:'left', marginTop: '-10%', paddingBottom: 9}}></EvilIcons>
                                    </View>

                                    <View style={{width: '27%'}}>
                                        <Text style={[styles.form_label, {justifyContent: 'flex-start', alignItems: 'center',textAlign:'left',marginLeft:'1%',marginTop:2}]}>Todo</Text>
                                    </View>

                                    <View style={{width: '63%'}}>
                                        <Dropdown
                                            data={this.state.arrTodoFilter}
                                            labelFontSize={16}
                                            value={reminderTodoValue}
                                            dropdownOffset={{top: 0, left: 0}}
                                            inputContainerStyle={[styles.form_dropdown, {marginBottom: 6}]}
                                            rippleInsets={{top: 0, bottom: -4 }}
                                            onChangeText={(value) => {this._handleReminderTodo(value)}}
                                            itemTextStyle={{textTransform: 'capitalize'}}
                                        />
                                    </View>
                                </View>
                                <View style={styles.form_group}>
                                    <View style={{width:'10%'}}>
                                        <AntDesign name='retweet' style={{fontSize:20,justifyContent: 'flex-start', alignItems: 'center',textAlign:'left',marginLeft:'1%',paddingBottom: 8}}></AntDesign>
                                    </View>

                                    <View style={{width: '27%',}}>
                                        <Text style={[styles.form_label, {justifyContent: 'flex-start', alignItems: 'center',textAlign:'left',marginLeft:'1%',paddingBottom: 0 }]}>Repeat</Text>
                                    </View>

                                    <View style={{width: '63%'}}>
                                        <Dropdown
                                            data={arrRepeat}
                                            value={reminderRepeatType}
                                            labelFontSize={16}
                                            dropdownOffset={{top: 0, left: 0}}
                                            inputContainerStyle={styles.form_dropdown}
                                            rippleInsets={{top: 0, bottom: -4 }}
                                            onChangeText={(value) => {this._handleChangeRepeat(value)}}
                                        />
                                    </View>
                                </View>
                                <View style={styles.form_group}>
                                    <View style={{width:'10%'}}>
                                        <FontAwesome name='calendar-check-o' style={{fontSize:20,textAlign:'left', paddingBottom: 10}}></FontAwesome>
                                    </View>
                                <View style={{width: '27%',}}>
                                    <Text style={[styles.form_label,{justifyContent: 'flex-start', alignItems: 'center',textAlign:'left',marginLeft:'1%', paddingTop: 5}]}>Date</Text>
                                </View>
                                    <View style={[styles.form_datepicker, {marginVertical: 10, width: '63%'}]}>
                                        <DatePicker
                                            style={{width: '100%'}}
                                            date={reminderDate}
                                            mode="date"
                                            placeholder="  /   /"
                                            format="MM/DD/YYYY"
                                            minDate={reminderDate}
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
                                            onDateChange={(reminderDate) => {this.setState({reminderDate: reminderDate})}}
                                        />
                                    </View>
                                </View>
                                <View style={styles.form_group}>
                                    <View style={{width:'10%'}}>
                                        <MaterialIcons name='access-time' style={{fontSize:20,textAlign:'left', paddingBottom: 10}} />
                                    </View>

                                    <View style={{width: '27%',}}>
                                        <Text style={[styles.form_label,{justifyContent: 'flex-start', alignItems: 'center',textAlign:'left',marginLeft:'1%', paddingTop: 5}]}>Time</Text>
                                    </View>

                                    <View style={[styles.form_datepicker, {marginVertical: 10, width: '63%'}]}>
                                        <DatePicker
                                            style={{width: '100%'}}
                                            date={reminderTime}
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
                                                    style={{width: 15, height: 16, marginRight: 20}}
                                                    source={require('../../../assets/images/icon-clock.png')}
                                                />
                                            }
                                            onDateChange={(reminderTime) => {this.setState({reminderTime})}}
                                        />
                                    </View>
                                </View>
                                <View style={[styles.form_group]}>
                                    <View style={{width:'10%'}}>
                                        <FontAwesome name='bullhorn' style={{fontSize:20,textAlign:'left', paddingBottom: 10}} />
                                    </View>

                                    <View style={{width: '65%',}}>
                                        <Text style={[styles.form_label,{justifyContent: 'flex-start', alignItems: 'center',textAlign:'left',marginLeft:'1%', paddingTop: 10 }]}>Enable Push Reminder?</Text>
                                    </View>

                                    <View style={{width: '25%'}}>
                                        <Switch
                                            value={ this.state.isPushNotification }
                                            onValueChange={this._togglePushNotification}
                                            trackColor="#14c498"
                                        />
                                    </View>
                                
                                    <View style={styles.form_group}>
                                        <View style={{width:'10%',marginTop:'3%'}}>
                                            <AntDesign name='calendar' style={{fontSize:20,textAlign:'left', paddingBottom: 10}}/>
                                        </View>
                                        <View style={{width: '65%',marginTop:'3%'}}>
                                            <Text style={[styles.form_label,{justifyContent: 'flex-start', alignItems: 'center',textAlign:'left',marginLeft:'1%', paddingTop: 5 }]}>
                                                Sync with Calendar
                                            </Text>
                                        </View>
                                        
                                        <View style={{width: '25%',marginTop:'3%'}}>
                                            <Switch
                                                value={ this.state.isSyncToCalendar }
                                                onValueChange={this._toggleSyncToCalendar}
                                                trackColor="#14c498"
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={[ styles.form_group, { marginTop: 10 } ]}>
                                    <View style={{flexDirection:'row'}}>
                                        <View style={{width:'10%'}}>
                                            <AntDesign name='filetext1' style={{fontSize:20,textAlign:'left'}}></AntDesign>
                                        </View>

                                        <View style={{width: '90%',}}>
                                            <Text style={[styles.form_label,{justifyContent: 'flex-start', alignItems: 'center',textAlign:'left',marginLeft:'1%'}]}>
                                                Description
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View >
                                    <TextInput
                                        style={[styles.form_input, {height: 82, width: '100%'}]}
                                        editable = {true}
                                        maxHeight = {82}
                                        multiline = {true}
                                        value={reminderDescription}
                                        onChangeText={(reminderDescription) => this.setState({reminderDescription})}
                                    />
                                </View>

                                <View style={[styles.form_group,{marginTop:20}]}>
                                    <View style={{flexDirection:'row'}}>
                                        <View style={{width:'10%'}}>
                                            <MaterialIcons name='photo-camera' style={{fontSize:20,textAlign:'left'}}></MaterialIcons>
                                        </View>

                                        <View style={{width: '90%',}}>
                                            <Text style={[styles.form_label,{justifyContent: 'flex-start', alignItems: 'center',textAlign:'left',marginLeft:'1%'}]}>
                                                Photos
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={{flexDirection:'row',width:'100%'}}>
                                    <View style={{width:'50%'}}>
                                        <TouchableOpacity style={{flex: 0.5, paddingRight: 5}} onPress={() => this._chooseOption('formDataImage1', 'imageReminder1')}>                    
                                            <Image 
                                                style={{width: '100%', height: 90}} 
                                                source={imageReminder1 ? {uri: imageReminder1} : require('../../../assets/images/img-default.png')}
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{width:'50%'}}>
                                        <TouchableOpacity style={{flex: 0.5, paddingLeft: 5}} onPress={() => this._chooseOption('formDataImage2', 'imageReminder2')}>                    
                                            <Image 
                                                style={{width: '100%', height: 90}} 
                                                source={imageReminder2 ? {uri: imageReminder2} : require('../../../assets/images/img-default.png')}
                                            />
                                        </TouchableOpacity>  
                                    </View>
                                </View>

                                <View style={{marginBottom: 16,marginTop:20,width:'100%'}}>
                                {
                                    this.state.formDataImage1 && !this.state.formDataImage2
                                    ?
                                        <TouchableOpacity onPress={() => this._chooseOption('formDataImage2', 'imageReminder2')}>
                                            <View style={format.group_upload}>
                                                <Image style={{width: 40, height: 32}} source={require('../../../assets/images/icon-camera.png')}/>
                                                <Text style={format.text_upload}>Add new photo</Text>
                                            </View>
                                        </TouchableOpacity>
                                    :
                                        this.state.formDataImage1 && this.state.formDataImage2
                                        ?
                                            <TouchableOpacity onPress={() => this._chooseOption('formDataImage1', 'imageReminder1')}>
                                                <View style={format.group_upload}>
                                                    <Image style={{width: 40, height: 32}} source={require('../../../assets/images/icon-camera.png')}/>
                                                    <Text style={format.text_upload}>Add new photo</Text>
                                                </View>
                                            </TouchableOpacity>
                                        :
                                            <TouchableOpacity onPress={() => this._chooseOption('formDataImage1', 'imageReminder1')}>
                                                <View style={format.group_upload}>
                                                    <Image style={{width: 40, height: 32}} source={require('../../../assets/images/icon-camera.png')}/>
                                                    <Text style={format.text_upload}>Add new photo</Text>
                                                </View>
                                            </TouchableOpacity>
                                }
                                </View>
                                {/* <View style={{marginBottom: 16}}>
                                    <Text style={[styles.form_label, {marginBottom: 10}]}>Labels:</Text>
                                    <TextInput
                                        style={[styles.form_input, {height: 82, flex: 1}]}
                                        editable = {true}
                                        maxHeight = {82}
                                        multiline = {true}
                                        value={valueLabel}
                                    />
                                    {dataSchedule ?
                                        <View style={{alignItems: 'center'}}>
                                            <TouchableOpacity onPress={() => this.setState(prevState => ({showActivity : !prevState.showActivity}))}>
                                            {   
                                                this.state.showActivity ?
                                                <MaterialIcons size={50} color="#ee7a23" name="arrow-drop-up" style={{textAlign: 'center'}}/>
                                                : <MaterialIcons size={50} color="#ee7a23" name="arrow-drop-down" style={{textAlign: 'center'}}/>
                                            }
                                            </TouchableOpacity>
                                            {
                                                showActivity ? 
                                                <PetActivity 
                                                    disabled={false} 
                                                /> 
                                                : null
                                            }
                                        </View>
                                        : null
                                    }
                                </View> */}
                            </View>
                            {
                                dataSchedule?
                                <View>
                                    <TouchableOpacity 
                                        style={styles.form_button}
                                        onPress={this._updateReminder}
                                    >
                                        <Text style={styles.button_text}>Save</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[styles.form_button, {backgroundColor: 'red'}]}
                                        onPress={this._confirmDeleteReminder}
                                    >
                                        <Text style={styles.button_text}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                <TouchableOpacity 
                                    style={styles.form_button}
                                    onPress={this._createReminder}
                                >
                                    <Text style={styles.button_text}>Save</Text>
                                </TouchableOpacity>
                            }

                            <PopupConfirm
                                visible={modalVisibleDelete}
                                buttonText1={'Cancel'}
                                buttonText2={'Delete'}
                                title={'Meow. Delete a Reminder?'}
                                description={descriptionDelete}
                                handleButton1={() => this.setState({modalVisibleDelete: false})}
                                handleButton2={this._deleteReminder}
                                isNegative={true}
                            />

                            <PopupNotification 
                                visible={modalVisible} 
                                buttonText={'Ok'} 
                                closeDisplay={() => this._closeNotification()}
                                title={titleNotification}
                                description={descriptionNotification}
                                isNegative={isNegative}
                            />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        )
    }

    _handleChangeRepeat = async(value) => {
        await this.setState({reminderRepeatType: value})
    }

    // Func get Obj-key on API result to find body key
    _handleReminderCategory = async(value) => {
        await this.setState({
            reminderCategory: value,
            arrTodo: value ? await this.props.getCategoryInfo.data[`${value.toLowerCase()}`] : [],
            arrTodoFilter: []
        });

        let itemTodo = [];
        await this.state.arrTodo && this.state.arrTodo.map((item) => {
            let obj = {};
            // convert item string => item obj
            obj.value = item;
            itemTodo.push(obj);
        })

        // setState again
        await this.setState({arrTodoFilter: itemTodo})
    }

    _handleReminderTodo = async(value) => {
        await this.setState({
            reminderTodo: value
        });
        console.log('reminderTodo =>>>>>>>>>>>>>', this.state.reminderTodo);
    }

    _togglePushNotification = async(value) =>{
        await this.setState({isPushNotification: value})
        if(value)
            this.setState({pushNotification: 'Y'});
        else this.setState({pushNotification: 'N'});
    }

    _toggleSyncToCalendar = async(value) =>{
        await this.setState({isSyncToCalendar: value});
        if(value)
            await this.setState({syncToCalendar: 'Y'});
        else await this.setState({syncToCalendar: 'N'});
    }

    _getCategoryInfo = async() => {
        if(this.props.getCategoryInfo.data){
            console.log(this.props.getCategoryInfo.data);
            let arr = Object.keys(this.props.getCategoryInfo.data).map((key) => dataHelper.capitalizeFirstLetter(key));
            arr = arr.map(item => {
                var obj = {};
                obj.value = item;
                return obj;
            })
            await this.setState({ arrCategory: arr });
        }
    }

    _getRepeatTypes = () => {
        if(this.props.getRepeatTypes.data){
            let arrRepeat = JSON.stringify(this.props.getRepeatTypes.data);
            arrRepeat = JSON.parse(arrRepeat);
            arrRepeat = arrRepeat.map(item => {
                var obj = {};
                obj.value = item;
                return obj;
            })
            this.setState({arrRepeat});
        }
    }

    _renderInformationPets() {
        const petDetail = this.props.navigation.state.params && this.props.navigation.state.params.petDetail;
        const dataSchedule = this.props.navigation.state.params && this.props.navigation.state.params.dataSchedule;
        if(petDetail){
            return (
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{minHeight: 60}}>
                    <TouchableOpacity 
                        style={{position: 'relative', paddingRight: 6, height: 60, marginRight: 18}}
                        disabled={true}
                    >
                        <Image 
                            style={[styles.image_circle, format.image_pet, {borderColor: '#fb8f8f'}]} 
                            source={petDetail.petPortraitURL ? {uri: petDetail.petPortraitURL} : require('../../../assets/images/img-pet-default.png')}
                        />
                        <Image 
                            style={format.icon_check} 
                            source={require('../../../assets/images/icon-check.png')}
                        />
                    </TouchableOpacity> 
                </ScrollView>
            )
        }

        const {arrPet} = this.state;
        return (
            <View>
                {
                    arrPet && arrPet.length > 0
                    ?
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{minHeight: 60}}>
                        {
                            arrPet.length > 1 ?
                            <TouchableOpacity 
                                style={format.button_check} 
                                activeOpacity={1}
                                onPress={() => this._checkAllPet()}
                                key={'check-all'}
                            >
                            {
                                this.state.checkAll ? 
                                <MaterialIcons name="check" size={30} color="#14c498" />
                                : null
                            }
                            </TouchableOpacity>
                            : null
                        }
                        {
                            arrPet.map((item, index) => {
                                return (
                                    <TouchableOpacity 
                                        style={{position: 'relative', paddingRight: 6, height: 60, marginRight: 18}}
                                        onPress={() => this._toggleCheck(item, index)}
                                        key={'pet' + item.petID}
                                    >
                                        <Image 
                                            style={[styles.image_circle, format.image_pet, {borderColor: '#fb8f8f'}]} 
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
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('AddNewPet')}>
                            <Ionicons name='md-add-circle-outline' size={30} style={{paddingTop: 5}}/>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        )
    }

    _checkAllPet = async() => {
        await this.setState({checkAll: !this.state.checkAll}, () => {
            let arrPet = [...this.state.arrPet];
            arrPet.forEach(item => {
                item.isCheck = this.state.checkAll;
            });
            this.setState({arrPet});
        });
    }

    _toggleCheck = (item, index) => {
        let arrPet = [...this.state.arrPet];
        arrPet[index].isCheck = !item.isCheck;
        this.setState({arrPet}, () => {
            let result = this.state.arrPet.filter(item => !item.isCheck);
            if(!result.length){
                this.setState({checkAll: true});
            }
            else if(result.length === 1) this.setState({checkAll: false});
        });
    }

    _getPets = () => {
        const dataSchedule = this.props.navigation.state.params && this.props.navigation.state.params.dataSchedule;
        let listPet = JSON.stringify(this.props.getPetsByOwner.list);
        listPet = JSON.parse(listPet);
        let arrPet = [];
        if(dataSchedule)
            arrPet = listPet.filter(pet => dataSchedule.petID === pet.petID ); 
        else arrPet = listPet;
        arrPet.forEach(item => {
            item.isCheck = true;
        });
        this.setState({arrPet, loading: false});
        // console.log('this.props.getPetsByOwner', this.props.getPetsByOwner);
    }

    _autoReminderTodo(text) {
        this.setState({ reminderTodo: text, hideResults: false }, () => {
            let arrResultTodo = [...this.state.arrResultTodo];
            if(this.state.reminderTodo){
                arrResultTodo = this.state.arrTodo.filter(item => item.includes(this.state.reminderTodo.toLowerCase()));
                this.setState({arrResultTodo});
            }
            else this.setState({hideResults:true });
        })
    };

    _getReminderImage = async() => {
        const dataSchedule = this.props.navigation.state.params && this.props.navigation.state.params.dataSchedule;
        await this.props.getReminderImageAction(dataSchedule.reminderID);
        if(this.props.getReminderImage.data && this.props.getReminderImage.data.length){
            let reminderImages = this.props.getReminderImage.data;
            reminderImages.forEach(item => {
                item.url = item.imagePath ? item.imagePath + `?time_stamp=${item.timeStamp ? item.timeStamp.replace(' ','') : ''}` : null;
            });
            let imageReminder1 = this.props.getReminderImage.data.find(item => item.imagePath && item.imagePath.includes(1));
            let imageReminder2 = this.props.getReminderImage.data.find(item => item.imagePath && item.imagePath.includes(2));
            this.setState({
                imageReminder1: imageReminder1 ? imageReminder1.url : null,
                imageReminder2: imageReminder2 ? imageReminder2.url : null
            });
        }
    }

    _createReminder = async() => {
        this.setState({loading: true});
        let arrPetID = [];
        let createReminders = [];
        const petDetail = this.props.navigation.state.params && this.props.navigation.state.params.petDetail;
        const dataProvider = this.props.navigation.state.params && this.props.navigation.state.params.dataProvider;
        const {
            arrPet, 
            reminderCategory, 
            reminderDate, 
            reminderTime, 
            reminderDescription, 
            formDataImage1,
            formDataImage2,
            pushNotification,
            syncToCalendar,
            reminderRepeatType,
            reminderTodo
        } = this.state;
        let {localReminder} = this.state;

        if(!reminderCategory){
            this.setState({
                loading: false,
                isNegative: true,
                titleNotification: "Oop~ The category cannot be empty",
                descriptionNotification: "",
                modalVisible: true
            });
            return;
        }

        if(petDetail)
            arrPetID = arrPetID.push(petDetail.petID);
        else arrPetID = arrPet.filter(item => item.isCheck).map(item => item.petID);

        let data = {
            ownerID: this.props.userSession.user.userID,
            petID: null,
            reminderCreatedBy: "owner",
            reminderCategory: reminderCategory && reminderCategory.toLowerCase(),
            reminderDateTime: dateHelper.convertDateUtcDateTime(`${reminderDate} ${reminderTime}`),
            reminderDescription: reminderDescription,
            reminderPushNotification: pushNotification,
            reminderSyncCalendar: syncToCalendar,
            reminderRepeatType: reminderRepeatType || 'One Time',
            reminderTodo: reminderTodo && reminderTodo.toLowerCase(),
            reminderTypeRelateTableID: dataProvider ? dataProvider.cpID : 0,
            reminderOnceOnly: reminderRepeatType === 'One Time' ? 'N' : 'Y'
        }

        arrPetID.forEach(item => {
            let dataReminder = {...data};
            dataReminder.petID = item;
            createReminders.push(dataReminder);
        });


        await this.props.createMultipleReminderAction(createReminders);

        if(this.props.createMultipleReminder.error){
            await this.setState({
                loading: false,
                isNegative: true,
                titleNotification: "Error",
                descriptionNotification: "Something's wrong!. Please try again.",
                modalVisible: true
            });
            return;
        }

        if(this.props.createMultipleReminder.data){
            let createReminderIDs = this.props.createMultipleReminder.data.map(item => item.reminderID);
            if(formDataImage1)
                Promise.all(createReminderIDs.map(item => this.uploadImage1(item)));
            if(formDataImage2)
                Promise.all(createReminderIDs.map(item => this.uploadImage2(item)));

            let result = this.props.createMultipleReminder.data.map(item =>{
                let reminder = {
                    reminder: {...item},
                    petInformation: arrPet.find(item => item.petID === item.petID),
                    tasks: this._createReminderTask(item, null, null)
                };
                return reminder;
            });
            console.log('=>>>>>>>>>>>>>>>>>>>>>>>>> localReminder', localReminder);
            // localReminder = [...localReminder, ...result];
            localReminder = [...result];
            // await AsyncStorage.setItem('localReminder', JSON.stringify(localReminder));
            await this.props.getReminderByOwnerAction(this.props.userSession.user.userID);
        }

        await this.setState({
            loading: false,
            isNegative: false,
            titleNotification: "Yepi! Successfully Created.",
            descriptionNotification: "",
            modalVisible: true
        });
    }

    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
    };

    _pickImage = async (choose, formDataImage, avatarSource) => {
        console.log('upload image');

        await this.askPermissionsAsync();

        // Display the camera to the user and wait for them to take a photo or to cancel
        // the action
        let result;

        if(choose !== 'Library')
            result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 4],
            });
        else    
            result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 4],
            });
        if (result.cancelled) {
            return;
        }
        let resizedUri = await new Promise((resolve, reject) => {
            ImageEditor.cropImage(result.uri,
                {
                offset: { x: 0, y: 0 },
                size: { width: result.width, height: result.height},
                displaySize: { width: 600, height: 600 },
                resizeMode: 'contain',
                },
                (uri) => resolve(uri),
                () => reject(),
            );
        });

        await this.setState({ [avatarSource]: resizedUri });

        let localUri = resizedUri;
        let filename = localUri.split('/').pop();

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        // Upload the image using the fetch and FormData APIs
        let formData = new FormData();
        // Assume "photo" is the name of the form field the server expects
        await formData.append('file', { uri: localUri, name: filename, type });

        await this.setState({[formDataImage]: formData}, () => {
            console.log(`formDataImage =>>>>>>>>>>> ${formDataImage}`, this.state[formDataImage])
        });
        // return formData;
    };

    _chooseOption(formDataImage, avatarSource) {
        Alert.alert(
            'Upload Image',
            'Please choose option',
            [
                {text: 'From Camera', onPress: () => this._pickImage('Camera', formDataImage, avatarSource)},
                {text: 'From Library', onPress: () => this._pickImage('Library', formDataImage, avatarSource)},
                {text: 'Cancel', onPress: () =>  console.log("Cancel Pressed") , style: 'cancel'}
            ]
        )
    };

    async uploadImage1(reminderID) {
        return await new Promise((resolve, reject) => {
            this.props.uploadReminderImageAction(reminderID, 1, this.state.formDataImage1);
        }).catch(err=> {
            console.log(reminderID, err);
        });
    };

    async uploadImage2(reminderID) {
        return await new Promise((resolve, reject) => {
            this.props.uploadReminderImageAction(reminderID,  2, this.state.formDataImage2);
        }).catch(err=> {
            console.log(reminderID, err);
        });
    };

    async _closeNotification() {
        await this.setState({modalVisible: false}, async() => {
            if(!this.state.isNegative)
                await this.props.navigation.goBack();
        })
    };

    _updateReminder = async() => {
        const {dataSchedule} = this.props.navigation.state.params;
        console.log('dataSchedule', dataSchedule);
        const {
            reminderTodo, 
            reminderRepeatType, 
            reminderDate, 
            reminderTime, 
            reminderDescription,
            syncToCalendar,
            pushNotification,
            formDataImage1,
            formDataImage2
        } = this.state;
        let data = dataSchedule;
        console.log('reminderRepeatType', reminderRepeatType);
        data.reminderTodo = reminderTodo && reminderTodo.toLowerCase();
        data.reminderRepeatType = reminderRepeatType;
        data.reminderDateTime = dateHelper.convertDateUtcDateTime(`${reminderDate} ${reminderTime}`);
        data.reminderDescription = reminderDescription;
        data.reminderSyncCalendar = syncToCalendar;
        data.reminderPushNotification = pushNotification;
        await this.props.updateReminderAction(data);
        if(this.props.updateReminder.error){
            await this.setState({
                loading: false,
                isNegative: true,
                titleNotification: "Error",
                descriptionNotification: "Something's wrong!. Please try again.",
                modalVisible: true
            });
            return;
        }
        if(this.props.updateReminder.data){
            if(formDataImage1)
                await this.props.uploadReminderImageAction(dataSchedule.reminderID, 1, formDataImage1);
            if(formDataImage2)
                await this.props.uploadReminderImageAction(dataSchedule.reminderID, 2, formDataImage2);
        }
        
        await this.setState({
            loading: false,
            isNegative: false,
            titleNotification: "Yepi! Successfully Updated.",
            descriptionNotification: "",
            modalVisible: true
        });
    }

    _confirmDeleteReminder = async() => {
        const {dataSchedule} = this.props.navigation.state.params;
        await this.setState({
            descriptionDelete: `Warning: This will permanently delete ${dataSchedule.reminderCategory} from reminder list.`,
            modalVisibleDelete: true
        })
    }

    _deleteReminder = async() => {
        const {dataSchedule} = this.props.navigation.state.params;
        const {localReminder, localCompleteTasks, localSkipTasks} = this.state;
        let reminders = localReminder;
        let completeTasks = localCompleteTasks;
        let skipTasks = localSkipTasks;
        await this.setState({modalVisibleDelete: false, loading: true}, async() => {
            let result = await this.props.deleteReminderAction(dataSchedule.reminderID);
            if(result){
                let arrSet = [];
                await this.props.getReminderByOwnerAction(this.props.userSession.user.userID);
                if(reminders)
                    reminders = reminders.filter(item => item.reminder.reminderID !== dataSchedule.reminderID);
                if(completeTasks)
                    completeTasks = completeTasks.filter(item => item.reminder.reminderID !== dataSchedule.reminderID);
                if(skipTasks)
                    skipTasks = skipTasks.filter(item => item.reminder.reminderID !== dataSchedule.reminderID);

                arrSet.push(['localReminder', JSON.stringify(reminders)], ['localCompleteTasks', JSON.stringify(completeTasks)], ['localSkipTasks', JSON.stringify(skipTasks)]);
                await AsyncStorage.multiSet(arrSet, () => {
                    this.setState({loading: false});
                    this.props.navigation.goBack();
                })
                
            }
            else
                this.setState({
                    loading: false,
                    isNegative: true,
                    titleNotification: "Error",
                    descriptionNotification: "Something's wrong!. Please try again.",
                    modalVisible: true
                })
        })
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
            tasks = tasks.filter(item => !skipTask.tasks.find(skip => item.completeTaskDateTime === skip.completeTaskDateTime));

        // console.log('List Pet state =>>>>>>>>>>>>>>>', this.state.arrPet);
        
        objReminder = {
            reminder: reminder,
            tasks: tasks,
            petInformation: this.state.arrPet.find(pet => pet.isCheck && pet.petID === reminder.petID)
        }
        return objReminder;
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
}

const mapStateToProps = state => ({
    getCategoryInfo: state.getCategoryInfo,
    getRepeatTypes: state.getRepeatTypes,
    getPetsByOwner: state.getPetsByOwner,
    createReminder: state.createReminder,
    userSession: state.userSession,
    uploadReminderImage: state.uploadReminderImage,
    getReminderImage: state.getReminderImage,
    createMultipleReminder: state.createMultipleReminder,
    updateReminder: state.updateReminder,
    deleteReminder: state.deleteReminder,
    getReminderByOwner: state.getReminderByOwner
});

const mapDispatchToProps = {
    getCategoryInfoAction,
    getRepeatTypesAction,
    createReminderAction,
    uploadReminderImageAction,
    getReminderImageAction,
    createMultipleReminderAction,
    updateReminderAction,
    deleteReminderAction,
    getReminderByOwnerAction
}

export default connect(mapStateToProps, mapDispatchToProps)(dataScheduleScreen);

const format = StyleSheet.create({
    icon_style: {
        width: 24,
        height: 24,
        position: 'absolute',
        marginTop: 10
    },
    group_relative: {
        position: 'relative',
        paddingLeft: 34
    },
    title_big: {
        color: '#202c3c',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 18
    },
    title_small: {
        color: '#202c3c',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 9
    },
    text_normal: {
        color: 'rgba(32, 44, 60,0.4)',
        fontSize: 15,
        fontWeight: '400',
        marginBottom: 18

    },
    icon_dot: {
        position: 'absolute',
        left: 0,
        top: 9
    },
    btn_icon: {
        height: 30,
        width: 30,
        position: 'absolute',
        right: 0
    },
    group_upload: {
        alignItems: 'center',
        padding: 18, 
        borderWidth: 1, 
        borderStyle: 'dashed', 
        borderColor: '#e0e0e0',
        flex: 1
    },
    text_upload: {
        color: '#4e94b2', 
        fontSize: 15, 
        fontWeight: '500', 
        marginTop: 5
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
        fontSize: 16,
        fontWeight: '400',
        fontStyle: 'italic',
        color: '#202c3c'
    }
});