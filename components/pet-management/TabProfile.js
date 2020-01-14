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
import { MaterialIcons } from '@expo/vector-icons';
import PopupConfirm from '../PopupConfirm';
import PopupNotification from '../PopupNotification';
import deletePetAction from '../../src/apiActions/pet/deletePet';
import getPetsByOwnerAction from '../../src/apiActions/pet/getPetsByOwner';
import {dateHelper} from '../../src/helpers';
import { iOS } from '../../src/common';

class TabProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gender: {
                'M': 'Male', 
                'F': 'Female', 
                'U': 'Unknown'
            },
            neutered: {'Y': 'Yes','N': 'No', 'U': 'Unknown'},
            visibleConfirm: false,
            visibleNotification: false,
            titleNotify: '',
            descriptionNotify: ''
        }
    };
    static propTypes = {
        data: PropTypes.object,
        petWeight: PropTypes.string
    }

    render () {
        const {gender, neutered, visibleConfirm, visibleNotification} = this.state;
        const {navigate} = this.props.navigation;
        const {data, petWeight} = this.props;
        console.log(data)

        return (
            <View>
                <View style={{position: 'relative', marginBottom: 10}}>
                    <Text style={format.title}>{data.petName}'s Profile</Text>
                    <TouchableOpacity style={format.button_edit} onPress={() => navigate('UpdateProfile', {petDetail: data,petWeight: petWeight})}>
                        <Image style={{justifyContent: 'center', height: 27, width: 27}} source={require('../../assets/images/icon-edit.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.container_form}>
                    <View style={styles.form_group}>
                        <Text style={styles.form_label}>Name:</Text>
                        <Text style={[format.text, styles.form_value]}>{data && data.petName}</Text>
                    </View>
                    <View style={styles.form_group}>
                        <Text style={styles.form_label}>Type:</Text>
                        <Text style={[format.text, styles.form_value]}>{data.petType}</Text>
                    </View>
                    <View style={styles.form_group}>
                        <Text style={styles.form_label}>Breed:</Text>
                        <Text style={[format.text, styles.form_value]}>
                            {
                                data.petCustomType ? data.petCustomType
                                : data.petBreed.includes('Mixed') ? 
                                        `${data.petBreed} - (${data.petMixBreedOne}, ${data.petMixBreedTwo})`
                                    : `${data.petBreed}`
                            }
                        </Text>
                    </View>
                    <View style={styles.form_group}>
                        <Text style={styles.form_label}>Gender:</Text>
                        <Text style={[format.text, styles.form_value]}>{gender[`${data.petGender}`]}</Text>
                    </View>
                    <View style={styles.form_group}>
                        <Text style={styles.form_label}>Birthday:</Text>
                        <Text style={[format.text, styles.form_value]}>
                            {dateHelper.convertDate(data.petBirthdate)}
                        </Text>
                    </View>
                    <View style={styles.form_group}>
                        <Text style={styles.form_label}>Neutered:</Text>
                        <Text style={[format.text, styles.form_value]}>{neutered[`${data.petNeutered}`]}</Text>
                    </View>
                    <View style={styles.form_group}>
                        <Text style={styles.form_label}>Weight:</Text>
                        <Text style={[format.text, styles.form_value]}>
                            {petWeight || 0} {data.petWeightUnit}
                        </Text>
                    </View>
                    <View style={styles.form_group}>
                        <Text style={styles.form_label}>Tag:</Text>
                        <Text style={[format.text, styles.form_value]}>
                            {data.petTagID}
                        </Text>
                    </View>
                    <View style={styles.form_group}>
                        <Text style={styles.form_label}>Insurance provider:</Text>
                        <Text style={[format.text, styles.form_value]}>
                            {data.petInsuranceCompany}
                        </Text>
                    </View>
                    <View style={styles.form_group}>
                        <Text style={styles.form_label}>Policy number:</Text>
                        <Text style={[format.text, styles.form_value]}>
                            {data.petInsuranceNumber}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity 
                    style={[styles.form_button, {backgroundColor: '#ff0000'}]}
                    onPress={() => this.setState({visibleConfirm: true})}
                >
                    <Text style={styles.button_text}>Remove pet</Text>
                </TouchableOpacity>

                <PopupNotification 
                    visible={visibleNotification} 
                    buttonText={'Ok'} 
                    closeDisplay={this._closeNotification}
                    title={"Hoot! Successfully Removed"}
                    description={`${data.petName} profile has been successfully deleted.`}
                />
                <PopupConfirm
                    visible={visibleConfirm}
                    buttonText1={'Cancel'}
                    buttonText2={'Ok, Remove'}
                    title={`Meow. Remove ${data.petName}?`}
                    description={`Warning: This will delete all data from YepiPet for ${data.petName}.`}
                    handleButton1={() => this.setState({visibleConfirm: false})}
                    handleButton2={this._removePet}
                    backgroundButton2={'#ff0000'}
                    isNegative={true}
                />
            </View>
        );
    }

    _removePet = async() => {
        await this.props.deletePetAction(this.props.data.petID);
        if(this.props.deletePet.error){
            this.setState({
                visibleConfirm: false,
                titleNotify: "Oops. Something's missing!",
                descriptionNotify: "Delete pet failed.",
                visibleNotification: true
            });
            return;
        }

        if(this.props.deletePet.status){
            await this.props.getPetsByOwnerAction(this.props.userSession.user.userID);
            this.setState({
                titleNotify: "Hoot! Successfully Removed",
                descriptionNotify: `${this.props.data.petName}'s profile has been successfully deleted.`,
                visibleConfirm: false, 
                visibleNotification: true
            });
        }
    }

    _closeNotification = () =>{
        this.setState({visibleNotification: false});
        this.props.navigation.navigate('UserManage');
    }

}

const mapStateToProps = state => ({
    deletePet: state.deletePet,
    userSession: state.userSession
});

const mapDispatchToProps = {
    deletePetAction,
    getPetsByOwnerAction
}

export default connect(mapStateToProps, mapDispatchToProps)(TabProfile);

const format = StyleSheet.create({
    button_edit: {
        position:'absolute',
        zIndex: 1,
        right: 0,
        borderWidth: 1, 
        borderColor: '#f0f0f0',
        borderRadius: 30/2,
    },
    title: {
        color: '#202c3c',
        fontSize: iOS ? 19 : 22,
        fontWeight: 'bold',
        paddingRight: 30
    },
    text: {
        color: '#202c3c',
        fontSize: iOS ? 13 : 16,
        fontWeight: 'bold'
    }
});

