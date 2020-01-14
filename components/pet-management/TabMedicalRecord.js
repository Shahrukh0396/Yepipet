import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styles from '../../constants/Form.style';
import { MaterialIcons, EvilIcons } from '@expo/vector-icons';
import Swipeout from 'react-native-swipeout';

export default class TabMedicalRecord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrType: [
                {name: 'Allergies', icon: require('../../assets/images/icon-allergy.png')},
                {name: 'Medical Conditions', icon: require('../../assets/images/icon-medical-condition.png')},
                {name: 'Medications', icon: require('../../assets/images/icon-medication.png')}
            ],
            inactiveAllergy: false,
            inactiveMedical: false,
            inactiveMedication: false,
        }
    };
    static propTypes = {
        data: PropTypes.object
    }
    
    render () {
        const {arrType} = this.state;

        // _renderSwipRightAllergy = (id) => {
        //     return [
        //         {
        //             component: (
        //                 <View style={[format.button_swip, {backgroundColor: '#286c89'}]}>
        //                     <Text style={format.text_swip}>Observatio</Text>
        //                 </View>
        //             ),
        //             backgroundColor: "transparent",
        //             // underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        //             onPress: () => {
        //                 console.log("Observatio Item", id);
        //             },
        //         },
        //         {
        //             component: (
        //                 <View style={[format.button_swip, {backgroundColor: '#fea701'}]}>
        //                     <Text style={format.text_swip}>Deactivate</Text>
        //                 </View>
        //             ),
        //             backgroundColor: "transparent",
        //             // underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        //             onPress: () => {
        //                 console.log("Deactivate Item", id);
        //             },
        //         },
        //         {
        //             component: (
        //                 <View style={[format.button_swip, {backgroundColor: '#04bd8e'}]}>
        //                     <Text style={format.text_swip}>Deactivate</Text>
        //                 </View>
        //             ),
        //             backgroundColor: "transparent",
        //             // underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        //             onPress: () => {
        //                 console.log("Deactivate Item", id);
        //             },
        //         }
        //     ]
        // }

        return (
            <View style={format.container_horizontal}>
                {/*------------- Allergies ----------------*/}
                <View style={format.box_record}>
                    <View style={format.box_container}>
                        <Image style={format.box_icon} source={require('../../assets/images/icon-allergy.png')}/>
                        <View style={format.box_title}>
                            <Text style={[format.title_box, {color: '#694f87'}]}>Allergies</Text>
                            <TouchableOpacity style={format.button_add} activeOpacity={1}>
                                <MaterialIcons name="add" color="#000" size={18} />
                            </TouchableOpacity>
                        </View>
                        <View style={format.box_list}>
                            <View style={format.box_item}>
                                <Swipeout 
                                    right={[
                                        this._swipObservation('abc'), 
                                        this._swipDeactivateAllergy('abc')
                                    ]} 
                                    backgroundColor={'transparent'}
                                    buttonWidth={92}
                                    sensitivity={100}
                                >
                                    <View style={format.swip_content}>
                                        <TouchableOpacity 
                                            style={format.button_next} 
                                        >
                                            <EvilIcons name="chevron-right" color="#000" size={40} />
                                        </TouchableOpacity>
                                        <Text style={format.title_swip}>Dark Cholocolate</Text>
                                        <Text style={format.text_normal}>
                                            <Text style={format.text_bold}>Onset: </Text>
                                            01/01/2017
                                        </Text>
                                        <Text style={format.text_normal}>
                                            (<Text style={[format.text_bold, format.color_red]}>Sever</Text>)
                                            Voimit, Hyper Active
                                        </Text>
                                    </View>
                                </Swipeout>
                            </View> 
                        </View>
                    </View>
                    <Text 
                        style={format.text_link} 
                        onPress={() => this.setState(prevState => ({
                            inactiveAllergy: !prevState.inactiveAllergy
                        }))}
                    >
                        Show Inactive Allergies >
                    </Text>
                    {
                        this.state.inactiveAllergy ? 
                        <View style={{paddingTop: 10}}>
                            <View style={format.box_item}>
                                <Swipeout 
                                    right={[
                                        this._swipObservation('abc'), 
                                        this._swipDeactivateAllergy('abc')
                                    ]} 
                                    backgroundColor={'transparent'}
                                    buttonWidth={92}
                                    sensitivity={100}
                                >
                                    <View style={format.swip_content}>
                                        <TouchableOpacity 
                                            style={format.button_next} 
                                        >
                                            <EvilIcons name="chevron-right" color="#000" size={40} />
                                        </TouchableOpacity>
                                        <Text style={format.title_swip}>Dark Cholocolate</Text>
                                        <Text style={format.text_normal}>
                                            <Text style={format.text_bold}>Onset: </Text>
                                            01/01/2017
                                        </Text>
                                        <Text style={format.text_normal}>
                                            (<Text style={[format.text_bold, format.color_red]}>Sever</Text>)
                                            Voimit, Hyper Active
                                        </Text>
                                    </View>
                                </Swipeout>
                            </View> 
                        </View>
                        : null
                    }
                </View>

                {/*------------- Medical Conditions ----------------*/}
                <View style={format.box_record}>
                    <View style={format.box_container}>
                        <Image style={format.box_icon} source={require('../../assets/images/icon-medical-condition.png')}/>
                        <View style={format.box_title}>
                            <Text style={[format.title_box, {color: '#14c498'}]}>Medical Conditions</Text>
                            <TouchableOpacity style={format.button_add} activeOpacity={1}>
                                <MaterialIcons name="add" color="#000" size={18} />
                            </TouchableOpacity>
                        </View>
                        <View style={format.box_list}>
                            <View style={format.box_item}>
                                <Swipeout 
                                    right={[
                                        this._swipObservation('abc'), 
                                        this._swipDeactivateMedicalConditions('abc'),
                                        this._swipResolve('abc')
                                    ]} 
                                    backgroundColor={'transparent'}
                                    buttonWidth={92}
                                    sensitivity={100}
                                >
                                    <View style={format.swip_content}>
                                        <TouchableOpacity 
                                            style={format.button_next} 
                                        >
                                            <EvilIcons name="chevron-right" color="#000" size={40} />
                                        </TouchableOpacity>
                                        <Text style={format.title_swip}>Extreme high blood pressure</Text>
                                        <Text style={format.text_normal}>
                                            <Text style={format.text_bold}>Onset Date: </Text>
                                            01/01/2017
                                        </Text>
                                    </View>
                                </Swipeout>
                            </View> 
                        </View>
                    </View>
                    <Text style={format.text_link}>Show Inactive Medical Conditions ></Text>
                </View>
                
                {/*------------- Medications ----------------*/}
                <View style={format.box_record}>
                    <View style={format.box_container}>
                        <Image style={format.box_icon} source={require('../../assets/images/icon-medication.png')}/>
                        <View style={format.box_title}>
                            <Text style={[format.title_box, {color: '#ed5151'}]}>Medications</Text>
                            <TouchableOpacity style={format.button_add} activeOpacity={1}>
                                <MaterialIcons name="add" color="#000" size={18} />
                            </TouchableOpacity>
                        </View>
                        <View style={format.box_list}>
                            <View style={format.box_item}>
                                <Swipeout 
                                    right={[
                                        this._swipObservation('abc'), 
                                        this._swipDeactivateAllergy('abc')
                                    ]} 
                                    backgroundColor={'transparent'}
                                    buttonWidth={92}
                                    sensitivity={100}
                                >
                                    <View style={format.swip_content}>
                                        <TouchableOpacity 
                                            style={format.button_next} 
                                        >
                                            <EvilIcons name="chevron-right" color="#000" size={40} />
                                        </TouchableOpacity>
                                        <Text style={format.title_swip}>Amoxcilling 10 mg tablet</Text>
                                        <Text style={format.text_normal}>
                                            Take 1 tablet one a day
                                        </Text>
                                        <Text style={format.text_normal}>
                                            <Text style={format.text_bold}>Start Date: </Text>
                                            03/01/2018
                                        </Text>
                                    </View>
                                </Swipeout>
                            </View> 
                            <View style={format.box_item}>
                                <Swipeout 
                                    right={[
                                        this._swipObservation('abc'), 
                                        this._swipDeactivateMedications('abc')
                                    ]} 
                                    backgroundColor={'transparent'}
                                    buttonWidth={92}
                                    sensitivity={100}
                                >
                                    <View style={format.swip_content}>
                                        <TouchableOpacity 
                                            style={format.button_next} 
                                        >
                                            <EvilIcons name="chevron-right" color="#000" size={40} />
                                        </TouchableOpacity>
                                        <Text style={format.title_swip}>Amoxcilling 125 mg tablet</Text>
                                        <Text style={format.text_normal}>
                                            Take 1 tablet by mouth one a day
                                        </Text>
                                        <Text style={format.text_normal}>
                                            <Text style={format.text_bold}>Duration: </Text>
                                            03/01/2018
                                        </Text>
                                        <Text style={format.text_normal}>
                                            <Text style={format.text_bold}>Qty: </Text>
                                            30
                                        </Text>
                                        <Text style={format.text_normal}>
                                            <Text style={format.text_bold}>Start Date: </Text>
                                            03/01/2018
                                        </Text>
                                    </View>
                                </Swipeout>
                            </View> 
                        </View>
                    </View>
                    <Text style={format.text_link}>Show Inactive Medications ></Text>
                </View>
            </View>
        );
    }

    _renderSwip = (value, color) => {
        return (
            <View
                style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                }}
            >
                <View style={[format.button_swip, {backgroundColor: color}]}>
                    <Text style={format.text_swip}>{value}</Text>
                </View>
            </View>
        )
    }

    _swipObservation = (item) => {
        return {
            component: this._renderSwip('Observation', '#286c89'),
            backgroundColor: "transparent",
            // underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
            onPress: () => {
                console.log("actionObservation", item)
            },
        }
    }

    _swipDeactivateAllergy = (item) => {
        return {
            component: this._renderSwip('Deactivate', '#fea701'),
            backgroundColor: "transparent",
            // underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
            onPress: () => {
                console.log("DeactivateAllergy ", item)
            },
        }
    }

    _swipDeactivateMedicalConditions = (item) => {
        return {
            component: this._renderSwip('Deactivate', '#fea701'),
            backgroundColor: "transparent",
            // underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
            onPress: () => {
                console.log("DeactivateMedicalConditions ", item)
            },
        }
    }

    _swipDeactivateMedications = (item) => {
        return {
            component: this._renderSwip('Deactivate', '#fea701'),
            backgroundColor: "transparent",
            // underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
            onPress: () => {
                console.log("DeactivateMedications ", item)
            },
        }
    }

    _swipResolve = (item) => {
        return {
            component: this._renderSwip('Resolve', '#04bd8e'),
            backgroundColor: "transparent",
            // underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
            onPress: () => {
                console.log("Resolve", item)
            },
        }
    }
}

const format = StyleSheet.create({
    container_horizontal: {
        marginHorizontal: -16,
        borderBottomWidth: 1,
        borderColor: '#e3e3e3'
    },
    box_record: {
        borderTopWidth: 1,
        borderColor: '#e3e3e3',
        padding: 16
    },
    box_container: {
        position: 'relative',
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#e3e3e3'
    },  
    box_icon: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 30,
        height: 30
    },
    box_title: {
        position: 'relative',
        paddingLeft: 40,
        paddingRight: 30,
        marginBottom: 16
    },
    box_list: {
        marginHorizontal: -16
    },  
    button_add: {
        height: 22,
        width: 22,
        backgroundColor: 'rgba(78, 148, 178, 0.08)',
        borderRadius: 22/2,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        top: 0,
        padding: 2
    },
    title_box: {
        color: '#202c3c',
        fontSize: 22,
        fontWeight: '700'
    },
    title_swip: {
        color: '#4e94b2',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 6
    },
    swip_content: {
        paddingLeft: 56,
        paddingRight: 20,
        position: 'relative',
        justifyContent: 'center',
        textAlign: 'left'
    },
    text_normal: {
        color: '#202c3c',
        fontSize: 15,
        fontWeight: '400',
        marginBottom: 7
    },
    text_bold: {
        fontWeight: '700'
    },
    text_swip: {
        color: '#fff',
        fontWeight: '300',
        fontSize: 13,
        textAlign: 'center'
    },
    text_link: {
        color: '#4e94b2',
        fontSize: 15,
        fontWeight: '600',
        paddingHorizontal: 16,
        paddingTop: 16,
        textAlign: 'center'
    },
    color_red: {
        color: '#ff1413'
    },
    button_next: {
        position: 'absolute',
        right: 16
    },
    button_swip:{
       paddingVertical: 6,
       height: 44,
       width: 92,
       textAlign: 'center',
       justifyContent: 'center'
    }
});

