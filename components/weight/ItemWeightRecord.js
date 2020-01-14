import React, {Component} from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import styles from '../../constants/Form.style';
import { EvilIcons } from '@expo/vector-icons';
import Swipeout from 'react-native-swipeout';
import {dateHelper, dataHelper} from '../../src/helpers';
import {WeightType} from '../../src/common';

export default class ItemVaccineRecord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            petWeightDate: null,
            petWeightTime: null
        }
    };
    static propTypes = {
        pet: PropTypes.object,
        data: PropTypes.object,
        dataBefore: PropTypes.object,
        isLastChild: PropTypes.bool
    }

    static defaultProps = {
        isLastChild: false
    }

    componentWillMount() {
        this._loadDataWeight();
    }

    componentDidUpdate(prevProps){
        if(JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data))
            this._loadDataWeight();
    }

    render () {
        const {isLastChild, data, pet, dataBefore} = this.props;
        const {navigate} = this.props.navigation;
        const {petWeightDate, petWeightTime} = this.state;

        return (
            <View 
                style={[
                    format.record_group, 
                    isLastChild ? {borderBottomWidth: 0, paddingBottom: 0} : null
                ]}
            >
                <Swipeout 
                    right={[
                        this._swipDelete('abc'), 
                    ]} 
                    backgroundColor={'transparent'}
                    buttonWidth={110}
                    sensitivity={100}
                >
                    <View style={{position: 'relative', paddingRight: 50, justifyContent: 'center'}}>
                        {   dataBefore ? 
                            <Text style={format.text_normal}>
                                ({petWeightDate}) Update {pet.petName}'s 'Weight' from&nbsp;
                                <Text style={format.color_green}> 
                                    {pet.petWeightUnit === WeightType.Lb ? dataHelper.convertWeightToLb(dataBefore.petWeightValue) : dataBefore.petWeightValue}
                                    &nbsp;{pet.petWeightUnit}&nbsp;
                                </Text>
                                to&nbsp;
                                <Text style={format.color_green}>
                                    {pet.petWeightUnit === WeightType.Lb ? dataHelper.convertWeightToLb(data.petWeightValue) : data.petWeightValue}
                                    &nbsp;{pet.petWeightUnit}&nbsp;
                                </Text>
                                ({petWeightTime})
                            </Text>
                            :
                            <Text style={format.text_normal}>
                                ({petWeightDate}) {pet.petName}'s 'Weight' is&nbsp;
                                <Text style={format.color_green}> 
                                    {pet.petWeightUnit === WeightType.Lb ? dataHelper.convertWeightToLb(data.petWeightValue) : data.petWeightValue}
                                    &nbsp;{pet.petWeightUnit}&nbsp;
                                </Text>
                                ({petWeightTime})
                            </Text>
                        }
                        <TouchableOpacity 
                            style={format.button_next}
                            onPress={() => navigate('EditWeight', {petWeight: data, petDetail: pet})}
                        >
                            <EvilIcons name="chevron-right" color="#000" size={40} />
                        </TouchableOpacity>
                    </View>
                </Swipeout>
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
                    this.props.onDelete();
                // console.log("Delete", item)
            },
        }
    }

    _convertUTCToDateTime = (value) => {
        if(value)
            return new Date(value.replace('+0000', 'Z'));
        return null;
    }    

    _loadDataWeight = () => {
        const {data} = this.props;
        let dateTime = this._convertUTCToDateTime(data.petWeightDate);
        this.setState({
            petWeightDate: dateTime && dateHelper.convertDate(dateTime),
            petWeightTime: dateTime && dateHelper.convertTime(dateTime)
        })
    }
}

const format = StyleSheet.create({
    record_group: {
        paddingVertical: 20,
        borderBottomColor: '#e7e7e8',
        borderBottomWidth: 1
    },
    color_green: {
        color: '#14c498'
    },
    button_next: {
        position: 'absolute',
        right: 0
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