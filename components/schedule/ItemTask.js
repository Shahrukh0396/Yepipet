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
import { dateHelper } from '../../src/helpers';
import {connect} from 'react-redux';

class ItemSchedule extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            check: false,
        }
    }

    static propsTypes = {
        data: PropTypes.object,
        isLast: PropTypes.bool,
        isPastDue: PropTypes.bool,
        isClose: PropTypes.bool,
        isSkip: PropTypes.bool
    }

    static defaultProps = {
        isLast: false,
        isPastDue: false,
        isClose: false,
        isSkip: false
    }

    componentWillMount() {
    }

    render() {
        const {isLast, data, isSkip, isPastDue, isClose} = this.props;
        const {navigate} = this.props.navigation;

        return (
            <View style={[
                format.group_reminder,
                isLast ? {marginBottom: 0, borderBottomWidth: 0, paddingBottom: 0} : null]}
            >
                <View style={format.box_item}>
                    <View style={format.swip_content}>
                        {
                            isSkip ?
                            <TouchableOpacity 
                                style={[format.button_checkbox]} 
                                activeOpacity={1}
                                onPress={this._undo}
                            >
                                <Image 
                                    style={[
                                        {width: 22, height: 22},
                                    ]} 
                                    source={require('../../assets/images/icon-block.png')}
                                />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity 
                                style={[format.button_checkbox, data.isCheck ? format.button_checkbox_active : null ]} 
                                activeOpacity={1}
                                onPress={this._undo}
                            >
                                <Image 
                                    style={[
                                        {width: 22, height: 22}, 
                                        {opacity: data.isCheck ? 1 : 0}
                                    ]} 
                                    source={require('../../assets/images/icon-check.png')}
                                />
                            </TouchableOpacity>
                        }
                        <Text style={format.title_normal}>
                            {data.reminder.reminderCategory}
                            {
                                isPastDue && data.tasks && data.tasks.length > 1 ? ` (${data.tasks.length})` : null
                            }
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
                </View> 
            </View>
        );
    }


    _undo = () => {
        if(this.props.onUndo){
            this.props.onUndo();
        }
    }

    _convertLongDateTime(data) {
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let reminderDate = new Date(data); 
        return `${dateHelper.convertTime(reminderDate)}, ${days[reminderDate.getDay()]}, ${months[reminderDate.getMonth()]} ${reminderDate.getDate()}, ${reminderDate.getFullYear()}`;
    }

}

export default (ItemSchedule);

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
        right: -14
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
       paddingVertical: 6,
       height: 44,
       width: 92,
       textAlign: 'center',
       justifyContent: 'center',
       backgroundColor: '#ff0000'
    },
    text_swip: {
        color: '#fff',
        fontWeight: '300',
        fontSize: 13,
        textAlign: 'center'
    }
});