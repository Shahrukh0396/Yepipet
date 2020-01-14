import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import styles from '../../../constants/Form.style';
import { EvilIcons } from '@expo/vector-icons';
import DatePicker from 'react-native-datepicker';
import {WeightTypes} from '../../../static/pets';
import {dateHelper} from '../../../src/helpers';
import {connect} from 'react-redux';
import updatePetWeightAction from '../../../src/apiActions/pet/updatePetWeight';
import PopupNotification from '../../../components/PopupNotification';

class EditWeight extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            petWeightDate: '2019-06-19', //convert date
            petWeightTime: '13:00 PM',
            petWeightValue: '9',
            petWeightUnit: 'kg',
            modalVisible: false,
            titleNotification: '',
            descriptionNotification: '',
            isNegative: false
        }
    };

    componentWillMount() {
        this._loadDataWeight();
            
    }

    render () {
        const {
            petWeightDate, 
            petWeightTime,
            petWeightValue,
            petWeightUnit,
            modalVisible,
            titleNotification,
            descriptionNotification,
            isNegative
        } = this.state;

        return (
            <KeyboardAvoidingView
                behavior="padding"
                enabled 
                style={{ flex: 1 }}
            >
                <SafeAreaView style={styles.safeArea}>
                    <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                        <View style={styles.container}>
                            <View style={{position:'relative', paddingBottom: 22, paddingTop: 25, justifyContent: 'center'}}>
                                <TouchableOpacity 
                                    style={styles.button_back} 
                                    onPress={() => this.props.navigation.goBack()}
                                >
                                    <Image style={{width: 12, height: 21}} source={require('../../../assets/images/icon-back.png')}/>
                                </TouchableOpacity>
                                <Text style={[styles.title_head, {alignSelf: 'center'}]}>Edit Weight Record</Text>
                            </View>

                            <View style={styles.container_form}>
                                <View style={{marginBottom: 16}}>
                                    <Text style={styles.form_label_small}>Date:</Text>
                                    <View style={styles.form_datepicker}>
                                        <DatePicker
                                            style={{width: '100%'}}
                                            date={petWeightDate}
                                            mode="date"
                                            placeholder="  /   /"
                                            format="MM/DD/YYYY"
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
                                                    source={require('../../../assets/images/icon-date.png')}
                                                />
                                            }
                                            onDateChange={(petWeightDate) => this.setState({petWeightDate})}
                                        />
                                    </View>
                                </View>

                                <View style={{marginBottom: 16}}>
                                    <Text style={styles.form_label_small}>Time</Text>
                                    <View style={styles.form_datepicker}>
                                        <DatePicker
                                            style={{width: '100%'}}
                                            date={petWeightTime}
                                            mode="time"
                                            placeholder="  /   /"
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
                                                    source={require('../../../assets/images/icon-clock.png')}
                                                />
                                            }
                                            onDateChange={(petWeightTime) => this.setState({petWeightTime})}
                                        />
                                    </View>
                                </View>

                                <View>
                                    <Text style={styles.form_label_small}>Weight</Text>
                                    <View style={styles.form_group}>
                                        <TextInput 
                                            contextMenuHidden={true}
                                            keyboardType={'numeric'} 
                                            style={[styles.form_input, {flex: 0.6, marginRight: 16}]} 
                                            value={petWeightValue}
                                            placeholder="Enter Weight"
                                            onChangeText={(petWeightValue) => this.setState({petWeightValue: petWeightValue.replace(',', '.')})}
                                        />
                                        <View style={[styles.group_radio, {flex: 0.4}]}>
                                            {WeightTypes.map((data, i) => {
                                                return(
                                                    <TouchableOpacity 
                                                        key={data.value} 
                                                        style={[
                                                            styles.btn_radio,
                                                            petWeightUnit === data.value ? styles.btn_radio_active : {},
                                                            {flex: 1/(WeightTypes.length)},
                                                            i === 0 ? styles.btn_radio_noborder : {}
                                                        ]}
                                                        disabled={true}
                                                    >
                                                        <Text style={{color: petWeightUnit === data.value ? '#fff' : '#000', textAlign: 'center', fontSize: 16}}>{data.name}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })}
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity 
                                    style={styles.form_button}
                                    onPress={this._updatePetWeight}
                                >
                                    <Text style={styles.button_text}>Save</Text>
                                </TouchableOpacity>
                            </View>

                            <PopupNotification 
                                visible={modalVisible} 
                                buttonText={'Ok'} 
                                closeDisplay={this._closeNotification}
                                title={titleNotification}
                                description={descriptionNotification}
                                titleColor={'#000'}
                                isNegative={isNegative}
                            />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        )
    }

    _convertUTCToDateTime = (value) => {
        if(value)
            return new Date(value.replace('+0000', 'Z'));
        return null;
    }    

    _loadDataWeight = () => {
        const {petWeight, petDetail} = this.props.navigation.state.params;
        let dateTime = this._convertUTCToDateTime(petWeight.petWeightDate);
        this.setState({
            petWeightDate: dateTime && dateHelper.convertDate(dateTime),
            petWeightTime: dateTime && dateHelper.convertTime(dateTime),
            petWeightValue: petWeight.petWeightValue.toString(),
            petWeightUnit: petDetail.petWeightUnit
        })
    }

    _updatePetWeight = async () => {
        const {petWeight, petDetail} = this.props.navigation.state.params;
        const {petWeightDate, petWeightTime, petWeightValue} = this.state;
        let time = petWeightTime.split(' ')[0];

        let data = {
            petID: petDetail.petID,
            petWeightID: petWeight.petWeightID,
            petWeightDate: new Date(`${petWeightDate} ${time}`).toUTCString(),
            petWeightEnteredBy: this.props.userSession.user.userID,
            petWeightValue: petWeightValue
        }

        await this.props.updatePetWeightAction(data);

        if(this.props.updatePetWeight.data){
            console.log('this.props.updatePetWeight', this.props.updatePetWeight);
            this.setState({
                isNegative: false,
                titleNotification: 'Yepi! Successfully Updated.',
                descriptionNotification: '',
                modalVisible: true
            })
        }

        if(this.props.updatePetWeight.error){
            this.setState({
                isNegative: true,
                titleNotification: 'Error',
                descriptionNotification: 'Update Weight failed. Please try again."',
                modalVisible: true
            });
            return;
        }

    }

    _closeNotification = () => {
        this.setState({modalVisible: false});
        if(this.props.updatePetWeight.data)
            this.props.navigation.navigate('WeightGrowth');
    }
}

const mapStateToProps = state => ({
    updatePetWeight: state.updatePetWeight,
    userSession: state.userSession
});

const mapDispatchToProps = {
    updatePetWeightAction
};

export default connect(mapStateToProps, mapDispatchToProps)(EditWeight);

const format = StyleSheet.create({
});