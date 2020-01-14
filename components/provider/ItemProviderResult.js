import React, {Component} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';
import styles from '../../constants/Form.style';
import { MaterialIcons, EvilIcons } from '@expo/vector-icons';

class ItemProviderResult extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        data: PropTypes.object
    }

    render() {
        const {data} = this.props;
        const {navigate} = this.props.navigation;

        return (
            <View style={[styles.container_form, {marginBottom: 20}]}>
                <View style={[format.group_relative, , {minHeight: 100}]}>
                    <View style={{position: "absolute", left: 0, width: 40, top: 0}}>
                            <Image 
                                style={{width: 40, height: 40}}
                                source={require('../../assets/images/activity-vet.png')}
                            />
                        {
                            data.opening_hours && data.opening_hours.open_now ?
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
                    <View>
                        <Text style={format.title_group}>
                            {data.name}
                        </Text>
                        <Text style={format.text_normal}>
                            {data.formatted_address}
                        </Text>
                    </View>
                    <TouchableOpacity 
                        style={format.button_add}
                        onPress={() => this._onCreate()}
                        activeOpacity={data.isExisted ? 0.1 : 1}
                        disabled={data.isExisted}
                    >
                    {
                        data.isExisted?
                        <MaterialIcons name="add-circle" color="rgba(134, 222, 201, 0.5)" size={24} />
                        :
                        <MaterialIcons name="add-circle" color="#86dec9" size={24} />
                    }
                    </TouchableOpacity>
                </View>
                
                <View style={[styles.form_group, {paddingTop: 15}]}>
                    <View style={{width: '33.333333%', justifyContent: 'center'}}>
                        <TouchableOpacity 
                            style={format.button_icon}
                            onPress={() => this._onCall()}
                        >
                            <MaterialIcons name="call" color="#ee7a23" size={30} />
                        </TouchableOpacity>
                        <Text style={format.text_icon}>Call</Text>
                    </View>
                    <View style={{width: '33.333333%', justifyContent: 'center'}}>
                        <TouchableOpacity 
                            style={format.button_icon}
                            onPress={() => this._onWebsite()}
                        >
                            <MaterialIcons name="desktop-windows" color="#ee7a23" size={30} />
                        </TouchableOpacity>
                        <Text style={format.text_icon}>Website</Text>
                    </View>
                    <View style={{width: '33.333333%', justifyContent: 'center'}}>
                        <TouchableOpacity 
                            style={format.button_icon}
                            onPress={() => this._onMap()}
                        >
                            <MaterialIcons name="map" color="#ee7a23" size={30} />
                        </TouchableOpacity>
                        <Text style={format.text_icon}>Map</Text>
                    </View>
                </View>
            </View>
        )
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

    _onCreate() {
        if(this.props.onCreate)
            this.props.onCreate(this.props.data);
    }
}

export default ItemProviderResult;

const format = StyleSheet.create({
    icon_status: {
        // position: "absolute",
        // left: 0
    },
    group_relative: {
        position: "relative",
        paddingLeft: 54,
        paddingRight: 30,
        alignItems: 'center',
        justifyContent: 'center',
    }, 
    title_group: {
        fontSize: Platform.OS === 'ios' ? 15 : 18,
        fontWeight: '700',
        color: '#4e94b2',
        marginBottom: 10
    },
    button_add: {
        position:'absolute',
        zIndex: 1,
        right: 0,
        top: 20
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
    color_orange: {
        color: '#ee7a23'
    }
});