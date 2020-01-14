import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';
import styles from '../../constants/Form.style';
import { EvilIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import Swipeout from 'react-native-swipeout';
import { dateHelper } from '../../src/helpers';
import {connect} from 'react-redux';

export default class ItemSchedule extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            check: false,
            isClose: false
        }
    }

    static propsTypes = {
        data: PropTypes.object,
        isLast: PropTypes.bool,
        isPastDue: PropTypes.bool,
        isSkip: PropTypes.bool
    }
s
    static defaultProps = {
        isLast: false,
        isPastDue: false,
        isSkip: false
    }

    componentWillMount() {
    }

    render() {
        const {check,connvertDate, days, months,  isClose} = this.state;
        const {isLast, data, isSkip, isPastDue} = this.props;
        const {navigate} = this.props.navigation;

        return (
            data.tasks && data.tasks.length > 1 ?
            <View style={[
                format.group_reminder,
                isLast ? {marginBottom: 0, borderBottomWidth: 0, paddingBottom: 0} : null]}
            >
                <View>
                    <Swipeout 
                        right={
                            [
                                this._swipCompleteAll(), 
                                this._swipSkipAll(),
                                this._swipSnooze()
                            ]
                        } 
                        autoClose={true}
                        backgroundColor={'transparent'}
                        buttonWidth={70}
                    >
                        <View style={format.swip_content}>
                            <TouchableOpacity 
                                style={[format.button_checkbox, data.isCheck || data.isCompletedAll ? format.button_checkbox_active : null ]} 
                                activeOpacity={1}
                                onPress={this._checkComplete}
                            >
                                <Image 
                                    style={[
                                        {width: 22, height: 22}, 
                                        {opacity: data.isCheck || data.isCompletedAll ? 1 : 0}
                                    ]} 
                                    source={require('../../assets/images/icon-check.png')}
                                />
                            </TouchableOpacity>
                            <Text style={format.title_normal}>
                                {data.reminder.reminderCategory} ({data.tasks.length})
                            </Text>
                            <Text style={format.text_normal}>
                                For: {data.petInformation.petName}
                            </Text>
                            <Text style={[format.text_normal, isPastDue ? {color: '#ff0000'} : null]}>
                                {/* Due: {this._convertLongDateTime(data.dueDate)}. */}
                                Due: {this._convertLongDateTime(data.tasks[0].completeTaskDateTime)}.
                            </Text>

                            <TouchableOpacity 
                                style={format.button_view}
                                onPress={() => navigate('ScheduleDetail', {dataSchedule: data.reminder})}
                            >
                                <EvilIcons name="chevron-right" color="#000" size={40} />
                            </TouchableOpacity>
                        </View>
                    </Swipeout>
                </View> 
            </View>
            :
            <View style={[
                format.group_reminder,
                isLast ? {marginBottom: 0, borderBottomWidth: 0, paddingBottom: 0} : null]}
            >
                <View style={format.box_item}>
                    <Swipeout 
                        right={[this._swipSkip(), this._swipSnooze()]} 
                        autoClose={true}
                        backgroundColor={'transparent'}
                        buttonWidth={70}
                    >
                        <View style={format.swip_content}>
                            <TouchableOpacity 
                                style={[format.button_checkbox, data.isCheck || data.isCompletedAll ? format.button_checkbox_active : null ]} 
                                activeOpacity={1}
                                onPress={this._checkComplete}
                            >
                                <Image 
                                    style={[
                                        {width: 22, height: 22}, 
                                        {opacity: data.isCheck || data.isCompletedAll ? 1 : 0}
                                    ]} 
                                    source={require('../../assets/images/icon-check.png')}
                                />
                            </TouchableOpacity>
                            <Text style={format.title_normal}>
                                {data.reminder.reminderCategory}
                            </Text>
                            <Text style={format.text_normal}>
                                For: {data.petInformation.petName}
                            </Text>
                            <Text style={[format.text_normal, isPastDue ? {color: '#ff0000'} : null]}>
                                {/* Due: {this._convertLongDateTime(data.dueDate)}. */}
                                Due: {this._convertLongDateTime(data.tasks[0].completeTaskDateTime)}.
                            </Text>

                            <TouchableOpacity 
                                style={format.button_view}
                                onPress={() => navigate('ScheduleDetail', {dataSchedule: data.reminder})}
                            >
                                <EvilIcons name="chevron-right" color="#000" size={40} />
                            </TouchableOpacity>
                        </View>
                    </Swipeout>
                </View> 
            </View>
        );
    }

    _checkComplete = () => {
        // this.setState({check: !this.state.check});
        // setTimeout(() => {
        //     if(this.state.check && this.props.check){
        //         this.props.check(this.props.data);
        //     }
        // })
        if(!this.props.data.isCompletedAll && this.props.check){
            this.setState({check: true});
            this.props.check();
        }
    }

    _swipCompleteAll = () => {
        return {
            component: (
                <View
                    style={{
                    flex: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // flexDirection: 'column',
                    // width: 70
                    }}
                >
                    <View style={[format.button_swip, {backgroundColor: '#14c498'}]}>
                        <Text style={format.text_swip}>Complete</Text>
                        <Text style={format.text_swip}>All</Text>
                    </View>
                </View>
            ),
            backgroundColor: "transparent",
            onPress: () => {
                this.props.onCompleteAll();
            },
        }
    }

    _swipSkipAll = () => {
        return {
            component: (
                <View
                    style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // flexDirection: 'column',
                    // width: 70
                    }}
                >
                    <View style={[format.button_swip, {backgroundColor: '#616161'}]}>
                        <Text style={format.text_swip}>Skip</Text>
                        <Text style={format.text_swip}>All</Text>
                    </View>
                </View>
            ),
            backgroundColor: "transparent",
            onPress: () => {
                this.props.onSkipAll();
            },
        }
    }

    _swipSkip = () => {
        return {
            component: (
                <View
                    style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // flexDirection: 'column',
                    // width: 70
                    }}
                >
                    <View style={[format.button_swip, {backgroundColor: '#616161'}]}>
                        <Text style={format.text_swip}>Skip</Text>
                    </View>
                </View>
            ),
            backgroundColor: "transparent",
            onPress: () => {
                this.props.onSkip();
            },
        }
    }

    _swipSnooze = () => {
        return {
            component: (
                <View
                    style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // flexDirection: 'column',
                    // width: 70
                    }}
                >
                    <View style={[format.button_swip, {backgroundColor: '#d08a00'}]}> 
                        <Text style={format.text_swip}>Snooze</Text>
                    </View>
                </View>
            ),
            backgroundColor: "transparent",
            onPress: () => {
                this.props.onSnooze();
            },
        }
    }

    _convertLongDateTime(data) {
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let reminderDate = new Date(data); 
        return `${dateHelper.convertTime(reminderDate)}, ${days[reminderDate.getDay()]}, ${months[reminderDate.getMonth()]} ${reminderDate.getDate()}, ${reminderDate.getFullYear()}`;
    }

}

const format = StyleSheet.create({
    title_normal: {
        color: '#202c3c',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
        textTransform: 'capitalize'
    },
    group_reminder: {
        paddingBottom: 20,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e7e7e8'
    },
    button_checkbox: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 24,
        height: 24,
        borderRadius: 26/2,
        borderWidth: 1,
        borderColor: '#a2a2a2'
    },
    button_checkbox_active: {
        backgroundColor: '#14c498',
        borderColor: '#14c498'
    },
    button_view: {
        position: 'absolute',
        right: -14,
        paddingRight: 10,
    },
    text_normal: {
        fontSize: 15,
        fontWeight: '500',
        color: '#202c3c',
        marginBottom: 2
    },
    color_red: {
        color: '#ff0000'
    },
    swip_content: {
        position: 'relative',
        paddingLeft: 40,
        paddingRight: 25,
        justifyContent: 'center'
    },
    button_swip:{
       paddingVertical: 4,
       height: 44,
       width: 70,
       textAlign: 'center',
       justifyContent: 'center',
       backgroundColor: '#ff0000',
       alignItems: 'center'
    },
    text_swip: {
        color: '#fff',
        fontWeight: '300',
        fontSize: 13,
        textAlign: 'center'
    }
});