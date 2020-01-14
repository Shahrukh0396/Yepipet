import React, {Component} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Switch, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import styles from '../../constants/Form.style';
import { Feather, EvilIcons, FontAwesome, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-material-dropdown';
import DatePicker from 'react-native-datepicker';
import {dateHelper, dataHelper} from '../../src/helpers';
import Autocomplete from 'react-native-autocomplete-input';
import {connect} from 'react-redux';
import getCategoryInfoAction from '../../src/apiActions/reminder/getCategoryInfo';
import { iOS  } from '../../src/common';

class ItemCareScheduleRecord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrStatus: [
                {name: 'Not Needed', value: 'Not Needed', icon: 'not-interested', color: '#ee2323'},
                {name: 'Remind Me', value: 'Remind Me', icon: 'notifications', color: '#516bf0'}
            ],
            reminderStatus: 'Remind Me',
            reminderCategory: '',
            reminderDate: new Date(),
            isHide: false,
            reminderTime: "13:00",
            reminderRepeatType: "",
            isPushNotification: false,
            isSyncToCalendar: false,
            pushNotification: 'N',
            syncToCalendar: 'N',
            arrResultCategory: [],
            hideResults: true,
            arrTodo: [],
            arrTodoFilter: [],
            reminderTodo: null,
            reminderDescription: null,
            arrCategory: [],
            arrRepeat: []
        }
    };
    static propTypes = {
        data: PropTypes.object,
        isAdd: PropTypes.bool,
        arrRepeat: PropTypes.array,
        arrCategory: PropTypes.array
    }

    static defaultProps = {
        isAdd: false
    }

    async componentDidMount(){
        
    }

    async componentWillMount() {
        await this._loadDataReminder()
        await this._getCategoryInfo()
        await this.setState({
            arrRepeat: this.props.arrRepeat
        })
    }   

    async componentDidUpdate(prevProps){
        if(JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data))
            await this._loadDataReminder();
    }

    render () {
        const {
            arrStatus,
            arrCategory, 
            reminderDate, 
            reminderStatus, 
            isHide, 
            reminderTime,
            arrResultCategory,
            reminderCategory,
            hideResults,
            reminderTodo,
            arrTodoFilter,
            reminderRepeatType,
            reminderDescription,
            arrRepeat
        } = this.state;
        const { data } = this.props;
        const {navigate} = this.props.navigation;

        return (
            <View style={[styles.container_form, {position: 'relative', marginBottom: 26}]}>
                {
                    data.reminderCreatedDate ? 
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
                            <Image style={format.icon_style} 
                                source={require('../../assets/images/icon-reminder.png')}
                            />
                            <Text style={[styles.title_container, {marginBottom: 0, textTransform: 'capitalize'}]}>
                                {data.reminderCategory}
                            </Text>
                            {
                                isHide  ? null :
                                <View style={{marginTop: 15}}>
                                    <Text style={styles.form_label_small}>
                                        Repeat: {data.reminderRepeatType}
                                    </Text>
                                    <Text style={styles.form_label_small}>
                                        {data.reminderDateTime? `Upcoming: ${this._convertLongDateTime(data.reminderDateTime, data.reminderRepeatType)}` : null}
                                    </Text>
                                </View>
                            }
                        </View>
                        {
                            isHide ? null :
                            <View>
                                <View style={styles.form_group}>
                                    <Text style={[styles.form_label, {flex: 1, width: '75%'}]}>
                                        Enable Push Reminder?
                                    </Text>
                                    <View style={{width: '25%'}}>
                                        <Switch
                                            value={ this.state.isPushNotification }
                                            onValueChange={this._togglePushNotification}
                                            trackColor="#14c498"
                                            style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
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
                                            style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
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
                                                        item.value === reminderStatus ? styles.btn_radio_active : {},
                                                        i === (arrStatus.length - 1) ? {borderRightWidth: 1} : {},
                                                    ]}
                                                    onPress={() => this._handleChangeReminderStatus(item.value)}
                                                >
                                                    {/* <MaterialIcons name={`${data.icon}`} color={`${data.color}`} size={24} /> */}
                                                    <Text style={item.value === reminderStatus ? format.text_Choose : format.text_NoChoose}>{item.name}</Text>
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
                                    <Text style={format.text_link} onPress={() => navigate('ScheduleDetail', {dataSchedule: data})}>View detail ></Text>
                                </View>
                            </View>
                        }
                    </View>
                    :
                    <View>
                        <View style={{ position: 'relative', paddingBottom: 30 }}>
                            <TouchableOpacity style={format.button_del} onPress={ () => this._onDel() }>
                                <MaterialIcons name='clear' color='#fff' size={20} style={format.text_icon}></MaterialIcons>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.form_group, {justifyContent: 'flex-start', alignItems: 'center'}]}>
                            <View style={{width:'10%'}}>
                                <FontAwesome name='folder-o' style={{fontSize:20,justifyContent: 'flex-start', alignItems: 'center',textAlign:'left',marginLeft:'1%', paddingBottom: 15}}></FontAwesome>
                            </View>

                            <View style={{width: '27%'}}>
                                <Text style={[styles.form_label, {justifyContent: 'flex-start', alignItems: 'center',textAlign:'left',marginLeft:'1%'}]}>Category</Text>
                            </View>

                            <View style={{width: '63%'}}>
                                <Dropdown
                                    data={arrCategory}
                                    labelFontSize={16}
                                    dropdownOffset={{top: 0, left: 0}}
                                    inputContainerStyle={[styles.form_dropdown, {marginBottom: 6}]}
                                    rippleInsets={{top: 0, bottom: -4 }}
                                    onChangeText={(value) => {this._handleReminderCategory(value)}}
                                    itemTextStyle={{textTransform: 'capitalize'}}
                                    placeholder='Choose...'
                                />
                            </View>
                        </View>
                        {
                            (arrTodoFilter && arrTodoFilter.length)
                            ?
                                <View style={[styles.form_group, {justifyContent: 'flex-start', alignItems: 'center',marginBottom: 15}]}>
                                    <View style={{width:'10%'}}>
                                        <EvilIcons name='bell' style={{fontSize:25,textAlign:'left', marginTop: '-10%', paddingBottom: 9}}></EvilIcons>
                                    </View>

                                    <View style={{width: '27%'}}>
                                        <Text style={[styles.form_label, {justifyContent: 'flex-start', alignItems: 'center',textAlign:'left',marginLeft:'1%',marginTop:2}]}>Todo</Text>
                                    </View>

                                    <View style={{width: '63%'}}>
                                        <Dropdown
                                            data={arrTodoFilter}
                                            labelFontSize={16}
                                            dropdownOffset={{top: 0, left: 0}}
                                            inputContainerStyle={[styles.form_dropdown, {marginBottom: 6}]}
                                            rippleInsets={{top: 0, bottom: -4 }}
                                            onChangeText={(value) => {this._handleReminderTodo(value)}}
                                            itemTextStyle={{textTransform: 'capitalize'}}
                                            placeholder='Choose...'
                                        />
                                    </View>
                                </View>
                            : null
                        }
                        <View style={styles.form_group}>
                            <View style={{width:'10%'}}>
                                <AntDesign name='retweet' style={{fontSize:20,justifyContent: 'flex-start', alignItems: 'center',textAlign:'left',marginLeft:'1%',paddingBottom: 6}}></AntDesign>
                            </View>

                            <View style={{width: '27%',}}>
                                <Text style={[styles.form_label, {justifyContent: 'flex-start', alignItems: 'center',textAlign:'left',marginLeft:'1%',paddingTop: 5}]}>Repeat</Text>
                            </View>

                            <View style={{width: '63%'}}>
                                <Dropdown
                                    data={arrRepeat}
                                    labelFontSize={16}
                                    dropdownOffset={{top: 0, left: 0}}
                                    inputContainerStyle={styles.form_dropdown}
                                    rippleInsets={{top: 0, bottom: -4 }}
                                    onChangeText={(value) => {this._handleChangeRepeat(value)}}
                                    valueExtractor={(value) => value}
                                    placeholder='Choose...'
                                />
                            </View>
                        </View>

                        <View style={styles.form_group}>
                            <View style={{width:'10%'}}>
                                <FontAwesome name='calendar-check-o' style={{fontSize:20,textAlign:'left', paddingBottom: 7}}></FontAwesome>
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
                                            source={require('../../assets/images/icon-date.png')}
                                        />
                                    }
                                    onDateChange={(reminderDate) => this._handleChangeDate(reminderDate)}
                                />
                            </View>
                        </View>
                        
                        <View style={styles.form_group}>
                            <View style={{width:'10%'}}>
                                <MaterialIcons name='access-time' style={{fontSize:20,textAlign:'left', padding: 0}} />
                            </View>
                            
                            <View style={{width: '27%',}}>
                                <Text style={[styles.form_label,{justifyContent: 'flex-start', alignItems: 'center',textAlign:'left',marginLeft:'1%', paddingTop: 10}]}>Time</Text>
                            </View>

                            <View style={[styles.form_datepicker, {marginVertical: 10, width: '63%'}]}>
                                <DatePicker
                                    style={{width: '100%'}}
                                    date={reminderTime}
                                    mode="time"
                                    placeholder=""
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
                                    onDateChange={(reminderTime) => this._handleChangeTime(reminderTime)}
                                />
                            </View>
                        </View>

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
                        
                        <View style={styles.form_group}>
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
                                onChangeText={(reminderDescription) => this._handleChangeDesciption(reminderDescription)}
                            />
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
                                                item.value === reminderStatus ? styles.btn_radio_active : {},
                                                i === (arrStatus.length - 1) ? {borderRightWidth: 1} : {},
                                            ]}
                                            onPress={() => this._handleChangeReminderStatus(item.value)}
                                        >
                                            <Text style={item.value === reminderStatus ? format.text_Choose : format.text_NoChoose }>{item.name}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                        </View>
                        {/* <View 
                            style={{
                                borderTopWidth: 1,
                                borderTopColor: '#e0e0e0',
                                marginTop: 20,
                                marginHorizontal: -20
                            }}
                        >
                            <Text style={format.text_link} onPress={() => navigate('ScheduleDetail', {petDetail: data.petInformation})}>View detail ></Text>
                        </View> */}
                    </View>
                }
            </View>
        )
    }

    _handleChangeRepeat = (value) =>{
        this.setState({reminderRepeatType: value});
        this.props.onRepeat(value, this.props.index);
    }

    async _handleChangeCategory(value) {
        await this.setState({reminderCategory: value, hideResults: false}, async() => {
            let arrResultCategory = [...this.state.arrResultCategory];
            if(this.state.reminderCategory){
                arrResultCategory = await this.props.arrCategory.filter(item => item.includes(this.state.reminderCategory.toLowerCase()));
                this.setState({arrResultCategory});
            }
            else this.setState({hideResults:true });
        });
        await this.props.onCategory(value, this.props.index);
    }

    async _handleChangeTodo(value) {
        this.props.onTodo(value, this.props.index)
    }
    

    _onSelectAutoCategory = (value) => {
        this.setState({ reminderCategory: dataHelper.capitalizeFirstLetter(value), hideResults: true });
        this.props.onCategory(value, this.props.index);
    }

    _togglePushNotification = (value) =>{
        this.setState({isPushNotification: value})
        if(value)
            this.setState({pushNotification: 'Y'});
        else this.setState({pushNotification: 'N'});
        this.props.onPushNotification(value, this.props.index);
    }

    _toggleSyncToCalendar = async(value) =>{
        await this.setState({isSyncToCalendar: value})
        if(this.state.isSyncToCalendar)
            await this.setState({syncToCalendar: 'Y'});
        else this.setState({syncToCalendar: 'N'});
        await this.props.onSyncToCalendar(value, this.props.index);
    }

    _handleChangeDate = async(value) => {
        await this.setState({reminderDate: value});
        await this.props.onDate(value, this.props.index);
    }

    _handleChangeTime = async(value) => {
        await this.setState({reminderTime: value});
        await this.props.onTime(value, this.props.index);
    }

    _handleChangeReminderStatus = async(value) => {
        await this.setState({reminderStatus: value});
        await this.props.onStatus(value, this.props.index);
    }

    _handleChangeDesciption = async(value) => {
        await this.setState({reminderDescription: value})
        await this.props.onDescription(value, this.props.index)
    }

    _loadDataReminder = async() => {
        const {data} = await this.props;
        if(data)
            await this.setState({
                isPushNotification: data.reminderPushNotification === 'Y',
                pushNotification: data.reminderPushNotification,
                isSyncToCalendar: data.reminderSyncCalendar === 'Y',
                syncToCalendar: data.reminderSyncCalendar,
                reminderDate: data.reminderDate || null,
                reminderTime: data.reminderTime || null,
                reminderStatus: 'Remind Me'
            })
    }

    _convertLongDateTime(data, type) {
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        data = data.replace(' ', 'T');
        let reminderDate = new Date(data); 
        if(type === 'Daily')
            return dateHelper.convertTime(reminderDate);
        return `${dateHelper.convertTime(reminderDate)}, ${days[reminderDate.getDay()]}, ${months[reminderDate.getMonth()]} ${reminderDate.getDate()}, ${reminderDate.getFullYear()}`;
    }

    _getCategoryInfo = async() => {
        if(this.props.getCategoryInfo.data){
            console.log(this.props.getCategoryInfo.data);
            let arr = await Object.keys(this.props.getCategoryInfo.data).map((key) => dataHelper.capitalizeFirstLetter(key));
            arr = arr.map(item => {
                var obj = {};
                obj.value = item;
                return obj;
            })
            await this.setState({ arrCategory: arr });
            console.log('arr Category API', this.state.arrCategory);
        }
    }

    _handleReminderCategory = async(value) => {
        await this.setState((prevState) => {
            return {
                reminderCategory: value, arrTodo: value ? this.props.getCategoryInfo.data[`${value.toLowerCase()}`] : [],
                arrTodoFilter: []
            };
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
        await this._handleChangeCategory(value)
    }

    _handleReminderTodo = async(value) => {
        await this.setState({
            reminderTodo: value
        });

        await this._handleChangeTodo(value)
        console.log('reminderTodo =>>>>>>>>>>>>>', this.state.reminderTodo);
    }

    _onDel = () => {
        if(this.props.onDel)
            this.props.onDel(this.props.index)
    }
}

const mapStateToProps = state => ({
    getCategoryInfo: state.getCategoryInfo,
});

const mapDispatchToProps = {
    getCategoryInfoAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemCareScheduleRecord);

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
    text_undo: {
        color: '#4e94b2',
        backgroundColor: 'transparent',
        fontSize: iOS ? 12 : 15,
        fontWeight: '500',
        position: 'absolute',
        right: 0
    },

    button_del: {
        backgroundColor: 'red',
        height: 30,
        width: 30,
        top: -10,
        right: -10,
        position: 'absolute',
        borderRadius: 30/2
    },

    text_icon: {
        padding: 5,
        fontWeight: 'bold'
    }, 

    text_NoChoose: {
        color: '#000', 
        textAlign: 'center', 
        fontSize: iOS ? 11 : 16,
    },

    text_Choose: {
        color: '#fff', 
        textAlign: 'center', 
        fontSize: iOS ? 11 : 16,
    }
});