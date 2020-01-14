import React, {Component} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Platform } from 'react-native';
import PropTypes from 'prop-types';
import styles from '../../constants/Form.style';
import { MaterialIcons, EvilIcons } from '@expo/vector-icons';
import Swipeout from 'react-native-swipeout';
import {dateHelper} from '../../src/helpers';

class ItemProvider extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        data: PropTypes.object,
        isClose: PropTypes.bool
    }

    static defaultProps = {
        isClose: false
    }

    render() {
        const {data, isClose} = this.props;
        const {navigate} = this.props.navigation;

        return (
            <View style={[styles.container_form, {marginBottom: 20}]}>
                <Swipeout
                    right={[
                        this._swipDelete(data), 
                    ]} 
                    backgroundColor={'transparent'}
                    buttonWidth={92}
                    sensitivity={100}
                    close={isClose}
                >
                    <View style={[format.group_relative, {minHeight: 120, alignItems:'flex-start'}]}>
                        <View style={{position: "absolute", left: 0, width: 60, top: 0}}>
                            <Image 
                                style={{width: 60, height: 60}}
                                source={require('../../assets/images/activity-vet.png')}
                            />
                            {
                                data.openNow ?
                                <View style={{position: 'relative', alignItems: 'center', justifyContent: 'center', marginTop: 5}}>
                                    <MaterialIcons name="access-time" color="#14c498" size={20} style={format.icon_status}/>
                                    <Text style={format.text_status}>Open</Text>
                                </View>
                                : 
                                <View style={{position: 'relative', alignItems: 'center', justifyContent: 'center', marginTop: 5}}>
                                    <MaterialIcons name="access-time" color="#ee7a23" size={20} style={format.icon_status}/>
                                    <Text style={[format.text_status, format.color_orange]}>Close</Text>
                                </View>
                            }
                        </View>
                        <View style={{justifyContent: 'flex-start'}}>
                            <Text style={format.title_group}>
                                {data.cpLongName}
                            </Text>
                            <Text style={format.text_normal}>
                                {data.cpAddress}
                            </Text>
                        </View>
                        <TouchableOpacity 
                            style={format.button_next}
                            onPress={() => navigate('CareProviderDetail', {dataProvider: data})}
                        >
                            <EvilIcons name="chevron-right" color="#000" size={40} />
                        </TouchableOpacity>
                    </View>
                </Swipeout>
                
                <View style={[styles.form_group, {paddingTop: 20}]}>
                    <View style={{width: '25%', justifyContent: 'center'}}>
                        <TouchableOpacity 
                            style={format.button_icon}
                            onPress={() => navigate('ScheduleDetail', {dataProvider: data})}
                        >
                            <MaterialIcons name="event-note" color="#ee7a23" size={30} />
                        </TouchableOpacity>
                        <Text style={format.text_icon}>Schedule</Text>
                    </View>
                    <View style={{width: '25%', justifyContent: 'center'}}>
                        <TouchableOpacity 
                            style={format.button_icon}
                            onPress={() => this._onCall()}
                        >
                            <MaterialIcons name="call" color="#ee7a23" size={30} />
                        </TouchableOpacity>
                        <Text style={format.text_icon}>Call</Text>
                    </View>
                    <View style={{width: '25%', justifyContent: 'center'}}>
                        <TouchableOpacity 
                            style={format.button_icon}
                            onPress={() => this._onWebsite()}
                        >
                            <MaterialIcons name="desktop-windows" color="#ee7a23" size={30} />
                        </TouchableOpacity>
                        <Text style={format.text_icon}>Website</Text>
                    </View>
                    <View style={{width: '25%', justifyContent: 'center'}}>
                        <TouchableOpacity 
                            style={format.button_icon}
                            onPress={() => this._onMap()}
                        >
                            <MaterialIcons name="map" color="#ee7a23" size={30} />
                        </TouchableOpacity>
                        <Text style={format.text_icon}>Map</Text>
                    </View>
                </View>
                {/* List Reminder */}
                <View>
                    <FlatList
                        data={data.reminders}
                        renderItem={({ item, index }) => (
                            <View style={[format.group_relative, format.group_item]}>
                                <View style={format.group_avatar}>
                                    <Image 
                                        style={[styles.image_circle, format.pet_image]} 
                                        source={item.petInformation && item.petInformation.petPortraitURL ? {uri: item.petInformation.petPortraitURL} : require('../../assets/images/img-pet-default.png')}
                                    />
                                    <Text style={format.pet_name}>{item.petInformation.petName}</Text>
                                </View>
                                <View>
                                    <Text style={format.pet_reminder}>{item.reminderTodo}</Text>
                                    <Text style={format.text_normal}>Repeat: {item.reminderRepeatType}</Text>
                                    <Text style={format.text_normal}>Upcoming: {this._convertLongDateTime(item.reminderDateTime)}</Text>
                                </View>
                                <TouchableOpacity style={[format.button_next, {right: -15}]}>
                                    <EvilIcons name="chevron-right" color="#000" size={40} onPress={() => navigate('ScheduleDetail', {dataSchedule: item})}/>
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={(item, index) => item.reminderID.toString()}
                    />
                </View>
            </View>
        )
    }

    _swipDelete = (item) => {
        return {
            component: (
                <View
                    style={{
                    flex: 1,
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    }}
                >
                    <View style={format.button_swip}>
                        <Text style={format.text_swip}>Delete</Text>
                    </View>
                </View>
            ),
            backgroundColor: "transparent",
            onPress: () => {
                if(this.props.onDelete)
                    this.props.onDelete(item);
            },
        }
    }

    _onCall(){
        if(this.props.onCall)
            this.props.onCall(this.props.data);
    }

    _onWebsite(){
        if(this.props.onWebsite)
            this.props.onWebsite(this.props.data);
    }

    _onMap(){
        if(this.props.onMap)
            this.props.onMap(this.props.data);
    }

    _convertLongDateTime(data) {
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        data = data.replace(' ', 'T');
        let reminderDate = new Date(data); 
        return `${dateHelper.convertTime(reminderDate)}, ${days[reminderDate.getDay()]}, ${months[reminderDate.getMonth()]} ${reminderDate.getDate()}, ${reminderDate.getFullYear()}`;
    }
}

export default ItemProvider;

const format = StyleSheet.create({
    icon_status: {
        // position: "absolute",
        // left: 0
    },
    group_relative: {
        position: "relative",
        paddingLeft: 84,
        paddingRight: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    group_item: {
        borderTopWidth: 1, 
        borderTopColor: '#e0e0e0', 
        paddingLeft: 64,
        paddingRight: 15,
        paddingTop: 20,
        marginTop: 10
    },  
    group_avatar: {
        position: "absolute", 
        top: 20, 
        left: 0, 
        width: 50
    },
    title_group: {
        fontSize: Platform.OS === 'ios' ? 17 : 20,
        fontWeight: '700',
        color: '#4e94b2',
        marginBottom: 10
    },
    button_next: {
        position:'absolute',
        zIndex: 1,
        right: 0
    },
    button_icon: {
        alignSelf: 'center'
    },  
    text_normal: {
        fontSize: Platform.OS === 'ios' ? 12 : 15,
        fontWeight: '400',
        marginBottom: 7,
        color: '#202c3c'
    },
    text_icon: {
        textAlign: 'center',
        fontSize: Platform.OS === 'ios' ? 11 : 14,
        fontWeight: '400',
        color: '#202c3c',
        marginTop: 5
    },
    text_status: {
        fontSize: Platform.OS === 'ios' ? 11 : 14,
        fontWeight: '500',
        color: '#14c498'
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
        fontSize: Platform.OS === 'ios' ? 10 : 13,
        textAlign: 'center'
    },
    pet_image: {
        width: 50,
        height: 50,
        borderRadius: 50/2
    },
    pet_name: {
        fontSize: Platform.OS === 'ios' ? 12 : 15,
        fontWeight: '500',
        color: '#ee7a23',
        textAlign: 'center'
    },
    pet_reminder: {
        fontSize: Platform.OS === 'ios' ? 15 : 18,
        fontWeight: '700',
        color: '#202c3c',
        marginBottom: 5,
        textTransform: 'capitalize'
    },
    color_orange: {
        color: '#ee7a23'
    }
});