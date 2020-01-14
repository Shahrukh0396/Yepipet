import React, {Component} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import styles from '../constants/Form.style';
import { MaterialIcons } from '@expo/vector-icons';
import { iOS } from '../src/common';

export default class PetActivity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDog: [
                {name: 'Feeding', value: "feeding", icon: require('../assets/images/activity-feed.png'), isCheck: false},
                {name: "Treat", value: "treat", icon: require('../assets/images/activity-treat.png'), isCheck: false},
                {name: "Play", value: "play", icon: require('../assets/images/activity-play.png'), isCheck: false},
                {name: "Potty", value: "potty", icon: require('../assets/images/activity-potty.png'), isCheck: false},
                {name: "Walk", value: "walk", icon: require('../assets/images/activity-walk.png'), isCheck: false},
                {name: "Bath", value: "bath", icon: require('../assets/images/activity-bath.png'), isCheck: false},
                {name: "Parasite", value: "parasite", icon: require('../assets/images/activity-parasite.png'), isCheck: false},
                {name: "Teeth", value: "teeth", icon: require('../assets/images/activity-teeth.png'), isCheck: false},
                {name: "Training", value: "training", icon: require('../assets/images/activity-train.png'), isCheck: false},
                {name: "Grooming", value: "grooming", icon: require('../assets/images/activity-groom.png'), isCheck: false},
                {name: "Ears", value: "ears", icon: require('../assets/images/activity-ear.png'), isCheck: false},
                {name: "Vet", value: "vet", icon: require('../assets/images/activity-vet.png'), isCheck: false}
            ],
            arrCat: [
                {name: "Feeding", value: "feeding", icon: require('../assets/images/activity-feed.png'), isCheck: false},
                {name: "Play", value: "pay", icon: require('../assets/images/activity-play.png'), isCheck: false},
                {name: "Brushing", value: "brushing", icon: require('../assets/images/activity-brush.png'), isCheck: false},
                {name: "Litter", value: "litter", icon: require('../assets/images/activity-litter.png'), isCheck: false},
                {name: "Nails", value: "nails", icon: require('../assets/images/activity-nail.png'), isCheck: false},
                {name: "Parasite", value: "parasite", icon: require('../assets/images/activity-parasite.png'), isCheck: false},
                {name: "Vet", value: "vet", icon: require('../assets/images/activity-vet.png'), isCheck: false}
            ],
            arrCheck: []
        }
    }

    static propTypes = {
        type: PropTypes.string,
        disabled: PropTypes.bool,
        isNoteObservation: PropTypes.bool,
        listObservation: PropTypes.array
    }

    static defaultProps = {
        type: "Dog",
        disabled: false,
        isNoteObservation: false,
        listObservation: []
    }

    componentWillMount() {
        console.log('listObservation', this.props.listObservation);
    }

    componentDidUpdate(prevProps) {
        if(JSON.stringify(prevProps.listObservation) !== JSON.stringify(this.props.listObservation))
            console.log('listObservation1', this.props.listObservation);
    }

    render () {
        const {arrCat, arrDog} = this.state;
        const {disabled} = this.props;
        let arr = this.props.type === "Dog" ? arrDog : arrCat;

        return (
            <View style={format.box_style}>
                {
                    arr.map((item, index) =>{
                        return (
                            <View 
                                style={[
                                    format.item_arr,
                                    this.props.type === "Cat" ? {width: "33.33333%"} : {}
                                ]} 
                                key={item.value}
                            >
                                <TouchableOpacity 
                                    style={format.item_btn} 
                                    onPress={() => this._handleItem(item)}
                                    disabled={disabled}
                                >
                                    {
                                        item.isCheck ?
                                        <Image 
                                            style={format.icon_check} 
                                            source={require('../assets/images/icon-check.png')}
                                        />
                                        : null
                                    }
                                    <Image 
                                        style={[
                                            format.item_image,
                                            // index === 4 ? format.overdue_hour : {},
                                            // index === 5 ? format.overdue_day : {}
                                        ]} 
                                        source={item.icon}
                                    />
                                </TouchableOpacity>
                                <Text style={format.item_text}>{item.name}</Text>
                            </View>
                        )
                    })
                }
            </View>
        );
    }

    _handleItem(item) {
        if(this.props.isNoteObservation)
            this.props.navigation.navigate('NoteObservation', {activity: item});
        else console.log('Activity Item', item);
    }

}

const format = StyleSheet.create({
    box_style: {
        // flexWrap: 'wrap',
        // display: 'flex',
        flexDirection:'row', 
        flexWrap:'wrap',
        flex: 1,
        marginHorizontal: -3,
        justifyContent: 'center'
    },  
    item_arr: {
        width: '25%',
        paddingHorizontal: 3,
        paddingTop: 23
    },
    icon_check: {
        position: 'absolute',
        top: -4,
        right: -6,
        height: 24,
        width: 24,
        zIndex: 1
    },
    item_btn: {
        position: 'relative',
        alignItems: 'center'
    },
    item_image: {
        width: 60,
        height: 60,
        borderRadius: 61/2,
        borderWidth: 1,
        borderColor: '#f1f8fb'
    },
    item_text: { 
        fontSize: iOS ? 10 : 13,
        fontWeight: 'bold',
        color: '#000000',
        paddingTop: 8,
        textAlign: 'center'
    },
    overdue_hour: {
        borderColor: '#ee7a23'
    },
    overdue_day: {
        borderColor: '#f95454'
    },
});