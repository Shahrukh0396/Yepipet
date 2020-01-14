import React, {Component} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';
import styles from '../constants/Form.style';
import { EvilIcons } from '@expo/vector-icons';
import PetActivity from '../components/PetActivity';
import PopupConfirm from '../components/PopupConfirm';
import {connect} from 'react-redux';
import getAvatarPetAction from '../src/apiActions/pet/getAvatarPet';
import getObservationByPetAction from '../src/apiActions/observation/getObservationByPet';

class PetItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowActivity: false,
            visibleConfirm: false,
            descriptionConfirm: '',
            listObservation: []
        }
    };
    static propTypes = {
        data: PropTypes.object
    }

    async componentWillMount(){
    }

    async componentDidUpdate(prevProps){
    }

    async handlePress(){
        await this.props.navigation.navigate('PetManagement', {petDetail: this.props.data});
    }

    render () {
        const { 
            data: { 
                owner,
                petID,
                petName, 
                ageInYears, 
                ageInFullDays, 
                ageInDaysWithoutYears, 
                petType, 
                petBreed, 
                petMixBreedOne, 
                petMixBreedTwo,
                petPortraitURL,
                vaccineStatus,
                petHasSetSuggestedReminders
            }
        } = this.props;

        const petIcon = {
            "Cat": require('../assets/images/icon-cat.png'),
            "Dog": require('../assets/images/icon-dog.png')
        };
        const {isShowActivity} = this.state;
        const {navigate} = this.props.navigation;

        let ageMonth = this._calculateMonthWithoutYears(ageInDaysWithoutYears);

        return (
            <View style={[styles.container_form, styles.form_group, {alignItems: 'flex-start'}]}>
                <View style={{flex: 0.3, paddingRight: 18}}>                    
                    <Image style={format.pet_image} 
                        source={petPortraitURL ? {uri: petPortraitURL}: require('../assets/images/img-pet-default.png')}
                    />
                    <Text style={[format.text_owner]}>
                        <Text style={{color: '#000', fontWeight: '400'}}>Owner: </Text>
                        <Text style={{color: '#ee7a23', fontWeight: '600'}}>Me</Text>
                    </Text>
                </View>   
                <View style={{flex: 0.7}}>
                    <View style={format.group_border}>
                        <View style={{flexDirection:'row', flexWrap:'wrap', marginBottom: 8, alignItems: 'stretch'}}>
                            <Text style={styles.pet_name}>
                                {petName}
                            </Text>
                            <Text style={styles.pet_info}>
                                {ageInYears} {ageInYears > 1 ? `Years` : `Year`} { ageMonth ? ageMonth > 1 ? `${ageMonth} Months` : `${ageMonth} Month` : null }
                            </Text>
                        </View>
                        <View style={{position: 'relative'}}>
                            <Image style={[format.icon_style, {width: 18}]} source={petIcon[`${petType}`]}/>
                            <Text style={format.pet_type}> {petBreed.toString().includes('Mixed') ? `${petMixBreedOne} ${petMixBreedTwo}` : petBreed}</Text>
                        </View>
                        <TouchableOpacity style={format.button_next} onPress={() => this.handlePress()}>
                            <EvilIcons name="chevron-right" color="#000" size={40} />
                        </TouchableOpacity>
                    </View>
                    {/* {
                        vaccineStatus === 'up to date' && petHasSetSuggestedReminders == 'Y' 
                        ?
                        <View style={{position: 'relative'}}>
                            <Image style={format.icon_style} source={require('../assets/images/icon-care-up.png')}/>
                            <Text style={[format.text_style, format.green]}>Care up to date</Text>
                        </View>
                        : */}
                        <View>
                            <TouchableOpacity 
                                style={{position: 'relative'}} 
                                activeOpacity={1}
                                onPress={() => navigate('VaccineRecord', {data: this.props.data, ageMonth: ageMonth, iStepAdd: false})}
                            >
                                <Image style={format.icon_style} source={require('../assets/images/icon-vaccine.png')}/>
                                <Text 
                                    style={[
                                        format.text_style, 
                                        vaccineStatus === 'severely due' ? format.red : null,
                                        vaccineStatus === 'mildly due' ? format.orange : null,
                                        vaccineStatus === 'up to date' ? format.green : null,
                                        {textTransform: 'capitalize'}
                                    ]}
                                >
                                    {vaccineStatus}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{position: 'relative'}} 
                                activeOpacity={1}
                                onPress={() => navigate('CareSchedule', {petDetail: this.props.data, ageMonth: ageMonth})}
                            >
                                <Image style={format.icon_style} source={require('../assets/images/icon-schedule.png')}/>
                                {
                                    petHasSetSuggestedReminders === 'N'?
                                    <Text style={[format.text_style, format.red]}>
                                        No Care Schedule
                                    </Text> 
                                    :
                                    <Text style={[format.text_style, format.green]}>
                                        Reminder
                                    </Text> 
                                }
                            </TouchableOpacity>
                        </View>
                    {/* } */}
                    {/* <TouchableOpacity style={format.button_more} onPress={this._showActivity}>
                        <Image 
                            style={{width: 54, height: 16}} 
                            source={
                                isShowActivity ? 
                                require('../assets/images/icon-show-more.png') 
                                : require('../assets/images/icon-dots.png')
                            }
                        />
                    </TouchableOpacity> */}
                </View>
                {/* {   
                    isShowActivity ?
                    <View style={{flexBasis: '100%'}}>
                        <View>
                            <PetActivity 
                                type={petType} 
                                isNoteObservation={true}
                                navigation={this.props.navigation}
                                listObservation={this.state.listObservation}
                            />
                        </View>
                        <TouchableOpacity 
                            style={[
                                styles.form_button, 
                                {justifyContent: 'flex-start'}
                            ]}
                            onPress={() => navigate('AddObservation', {petDetail: this.props.data, ageMonth: ageMonth})}
                        >
                            <Text style={styles.button_text}>Log Observation</Text>
                        </TouchableOpacity>
                    </View>
                    : null
                } */}
                {/* <PopupConfirm
                    visible={this.state.visibleConfirm}
                    buttonText1={'Cancel'}
                    buttonText2={'Confirm'}
                    title={'Woof! Activity Logged'}
                    description={this.state.descriptionConfirm}
                    handleButton1={() => this.setState({visibleConfirm: false})}
                    handleButton2={this._confirmLogActivity}
                /> */}
            </View>
        );
    }

    _showActivity = () => {
        this.setState(prevState => ({
            isShowActivity: !prevState.isShowActivity
        }), async () => {
            if(this.state.isShowActivity)
                this._getObservationByPet();
        });

    }

    // _showConfirmLogActivity = () => {
    //     this.setState({
    //         descriptionConfirm: 'Please confirm you walked Juno at 18:32 PM',
    //         visibleConfirm: true
    //     });
    // }

    // _confirmLogActivity = () =>{
    //     this.setState({visibleConfirm: false});
    // }

    _calculateMonthWithoutYears = (day) => {
        if(day)
            return Math.round(day /30);
        return 0;
    }

    _viewVaccine = () => {
        this.props.navigation.navigate('VaccineRecord', {data: this.props.data, ageMonth: this._calculateMonthWithoutYears(data.ageInDaysWithoutYears)});
    }

    _getObservationByPet = async() => {
        await this.props.getObservationByPetAction(this.props.data.petID);
        if(this.props.getObservationByPet.data)
            this.setState({listObservation: this.props.getObservationByPet.data}, () => {
                console.log('this.state.listObservation', this.state.listObservation);
            });
        if(this.props.getObservationByPet.error)
            return ;
    }
}

const mapStateToProps = state => ({
    getAvatarPet: state.getAvatarPet,
    getObservationByPet: state.getObservationByPet
});

const mapDispatchToProps = {
    getAvatarPetAction,
    getObservationByPetAction
}

export default connect(mapStateToProps, mapDispatchToProps)(PetItem);

const format = StyleSheet.create({
    button_next: {
        position:'absolute',
        zIndex: 1,
        right: -20,
        top: 0,
        bottom: 0,
        justifyContent: 'center'
    },
    button_more: {
        backgroundColor: '#f5f5f5',
        borderRadius: 16,
        marginTop: 10,
        width: 54,
        textAlign: 'center'
    },  
    group_border: {
        borderBottomWidth: 1,
        borderColor: '#f0f0f0',
        position: 'relative',
        paddingRight: 20,
        paddingBottom: 9,
        marginBottom: 10,
        justifyContent: 'center'
    },
    pet_image: {
        width: 60, 
        height: 60, 
        borderRadius: 60/2, 
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#f95454',
        resizeMode: 'cover'
    },
    pet_name: {
        fontSize: Platform.OS === 'ios' ? 19 : 22,
        fontWeight: '700',
        color: '#000',
        paddingRight: 14
    },
    pet_info: {
        backgroundColor: '#eafbf7',
        borderRadius: 16,
        fontSize: Platform.OS === 'ios' ? 9 : 12,
        color: '#000',
        height: 16,
        alignSelf: 'center',
        paddingHorizontal: 7,
        borderRadius: 16/2,
        overflow: 'hidden'
    },
    pet_type: {
        color: '#4e94b2',
        fontWeight: '500',
        fontSize: Platform.OS === 'ios' ? 12 : 15,
        paddingLeft: 28
    },
    text_style: {
        fontSize: Platform.OS === 'ios' ? 12 : 15,
        fontWeight: '400',
        paddingLeft: 26
    },
    red: {
        color: '#f95454'
    },
    green: {
        color: '#14c498'
    },
    orange: {
        color: '#ee7a23'
    },  
    icon_style: {
        marginRight: 10,
        position: 'absolute',
        width: 16,
        height: 16
    },
    box_activity_hide: {
        height: 0
    },
    box_activity_show: {
        height: '100%',
    },
    text_owner: {
        fontSize: Platform.OS === 'ios' ? 12 : 15,
        paddingTop: 5
    }
});