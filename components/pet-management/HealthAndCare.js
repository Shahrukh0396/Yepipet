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
import { LinearGradient } from 'expo-linear-gradient';
import PetActivity from '../../components/PetActivity';
import {WeightType, iOS} from '../../src/common';
import {dataHelper} from '../../src/helpers';

class HealthAndCare extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    };

    static propTypes = {
        data: PropTypes.object,
        ageMonth: PropTypes.number,
        petWeight: PropTypes.string
    }

    render() {
        const {navigate} = this.props.navigation;
        const {data, ageMonth, petWeight} = this.props;

        return(
            <View>
                <Text style={format.title}>Health & Care</Text>
                <View style={styles.form_group}>
                    <View style={{width: '50%'}}>
                        <TouchableOpacity 
                            style={[
                                format.button_radius, 
                                {marginRight: 3},
                            ]}
                            disabled={data.vaccineStatus === 'up to date'}
                            onPress={() => navigate('VaccineRecord', {data: data, ageMonth: ageMonth})}
                        >
                            <LinearGradient
                                colors={this._renderColorVaccineStatus(data.vaccineStatus)}
                                start={[0.0, 0.5]} end={[1.0, 0.5]} 
                                locations={[0.0, 1.0]}
                                style={format.linear_gradient}
                            />
                            <Image style={format.icon_button} source={require('../../assets/images/img-vaccine.png')} />
                            {
                                data.vaccineStatus === 'up to date' ? 
                                <Text style={format.button_text}>8/10</Text>
                                : <Text style={[format.button_text, {color: '#fff'}]}>?</Text>
                            }
                            
                        </TouchableOpacity>
                    </View>
                    <View style={{width: '50%'}}>
                        <TouchableOpacity 
                            style={[format.button_radius, {marginLeft: 3}]}
                            onPress={() => navigate('WeightGrowth', {petDetail: data})}
                        >
                            <LinearGradient
                                colors={['#ff8267', '#fcb216']}
                                start={[0.0, 0.5]} end={[1.0, 0.5]} 
                                locations={[0.0, 1.0]}
                                style={format.linear_gradient}
                            />
                            <Image style={format.icon_button} source={require('../../assets/images/img-weight.png')} />
                            <Text style={format.button_text}>
                                {petWeight || 0} {data.petWeightUnit}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {
                        data.petHasSetSuggestedReminders === 'N' ?
                        <View style={{width: '100%', marginTop: 20}}>
                            <TouchableOpacity 
                                style={[format.button_radius, {marginRight: 3}]}
                                onPress={() => navigate('CareSchedule', {petDetail: data, ageMonth: ageMonth})}
                            >
                                <LinearGradient
                                    colors={['#fff', '#fff']}
                                    start={[0.0, 0.5]} end={[1.0, 0.5]} 
                                    locations={[0.0, 1.0]}
                                    style={[format.linear_gradient, {borderWidth: 1, borderColor: '#ff0000'}]}
                                />
                                <MaterialIcons name="notifications" size={36} color="#ff0000" style={[format.icon_button, {left: 10, top: 7}]}/>
                                <Text style={[format.button_text, {color: '#ff0000'}]}>Recommend Care</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                    }
                </View>

                <View style={[styles.container_form, {marginBottom: 15}]}>
                    <View style={{alignItems: "center", marginBottom: 20}}>
                        <Image source={require('../../assets/images/img-dog-health.png')} />
                    </View>
                    <TouchableOpacity style={[styles.form_button, {marginHorizontal: 22, marginBottom: 20}]}>
                        <Text style={styles.button_text}>Exam Body Condition</Text>
                    </TouchableOpacity>

                    <PetActivity />
                </View>

                <View style={styles.container_form}>
                    <Text style={format.title}>Helpful Contents</Text>
                    <View>
                        <View style={format.group_helpful}>
                            <Image style={format.img_corner} source={require('../../assets/images/img-helpful1.png')}/>
                            <View style={{paddingBottom: 20, marginBottom: 14, borderBottomWidth: 1, borderBottomColor: '#f3f3f3'}}>
                                <Text style={format.text_normal}>
                                    5 Innovative Companies That Are All About Extending Pet Lives
                                </Text>
                            </View>
                        </View>
                        <View style={format.group_helpful}>
                            <Image style={format.img_corner} source={require('../../assets/images/img-helpful2.png')}/>
                            <View style={{paddingBottom: 20}}>
                                <Text style={format.text_normal}>
                                    You should not feed fast food to your pet
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    _renderColorVaccineStatus = (value) => {
        if(value === 'severely due')
            return ['#ff0000', '#fb5b18'];
        else if(value === 'mildly due')
            return ['#ef9451', '#fcb216'];
        else if(value === 'up to date')
            return ['#14c498', '#13c5a7'];
        else return ['#ff0000', '#fb5b18'];
    }
}

export default HealthAndCare;

const format = StyleSheet.create({
    title: {
        fontSize: iOS ? 19 : 22,
        fontWeight: '700',
        color: '#202c3c',
        marginBottom: 20,
        textAlign: 'center'
    },
    button_radius: {
        width: '100%',
        height: 52,
        borderRadius: 52/2,
        position: 'relative',
        paddingLeft: 65,
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon_button: {
        height: 46,
        width: 47,
        position: 'absolute',
        left: 3,
        // top: 3
    },
    button_text: {
        fontSize: iOS ? 13 : 16,
        fontWeight: '700',
        color: '#000',
        textAlign: 'left'
    },
    linear_gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 52,
        borderRadius: 52/2
    },
    group_helpful: {
        position: 'relative',
        paddingLeft: 73,
        flexDirection: 'row',
        alignItems: 'center'
    },
    img_corner: {
        width: 55,
        height: 55,
        borderRadius: 10,
        position: 'absolute',
        left: 0,
        top: 0,
        resizeMode: 'cover'
    },
    text_normal: {
        fontSize: iOS ? 12 : 15,
        fontWeight: '500'
    }
});