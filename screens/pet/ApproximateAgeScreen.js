import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
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
import styles from '../../constants/Form.style';
import { Dropdown } from 'react-native-material-dropdown';
import updatePetAction from '../../src/apiActions/pet/updatePet';
import getPetsByOwnerAction from '../../src/apiActions/pet/getPetsByOwner';
import {connect} from 'react-redux';
import PopupNotification from '../../components/PopupNotification';
import {dateHelper} from '../../src/helpers';

class ApproximateAge extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            age: null,
            titleNotification: '',
            descriptionNotification: '',
            visibleNotification: false,
            isNegative: false,
            petUpdate: null,
            avatar: null
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", async () => {
            if(this.props.navigation.state.params)
                this.setState({petUpdate: this.props.navigation.state.params.data, avatar: this.props.navigation.state.params.avatar});
        });
    }
    
    componentWillUnmount() {
        this.focusListener.remove();
    }

    render() {
        const {petUpdate, avatar} = this.state;
        console.log('avatar', avatar);
        return (
            <KeyboardAvoidingView 
                behavior="padding"
                enabled 
                style={{ flex: 1 }}
            >
                <SafeAreaView style={styles.safeArea}>
                    <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                        <View style={styles.container}>
                            <View style={{position:'relative', paddingBottom: 22,justifyContent: 'center'}}>
                                    <TouchableOpacity 
                                        style={styles.button_back} 
                                        onPress={() => this.props.navigation.navigate('AddNewPet', {petUpdate: petUpdate, avatar: avatar})}
                                    >
                                        <Image style={{width: 12, height: 21}} source={require('../../assets/images/icon-back.png')}/>
                                    </TouchableOpacity>
                                <Text style={[styles.title_head, {alignSelf: 'center'}]}>Approximate Age</Text>
                                {
                                    petUpdate && petUpdate.petBirthdate ?
                                    null
                                    :
                                    <Text 
                                        style={[
                                            styles.text_skip,
                                            {position: 'absolute', right: 0, top: 4}
                                        ]} 
                                        onPress={() => this.props.navigation.navigate('CareSchedule', {petDetail: petUpdate, isStep: true})}
                                    >
                                        Skip
                                    </Text>
                                }
                            </View>
                            <View style={styles.group_avatar}>
                                <View style={{alignItems: 'center'}}>
                                    <Image 
                                        style={[styles.image_circle, {borderColor: '#4e94b2'}]} 
                                        source={avatar ? {uri: avatar} : require('../../assets/images/img-pet-default.png')}
                                    />
                                    <View style={{flexDirection:'row', flexWrap:'wrap', marginBottom: 8, alignItems: 'stretch'}}>
                                        <Text style={styles.pet_name}>{petUpdate && petUpdate.petName}</Text>
                                    </View>
                                    <Text style={format.text_description}>
                                        Can you please tell us {petUpdate && petUpdate.petName}'s approximate age? This will help us 
                                        to create vaccination reminder for {petUpdate && petUpdate.petName}'s immunization. 
                                    </Text>
                                </View>
                            </View>
                            <View style={[styles.container_form, {marginBottom: 26}]}>
                                <View style={styles.form_group}>
                                    <Text style={styles.form_label}>Age:</Text>
                                    <TextInput 
                                        keyboardType={'number-pad'} 
                                        style={styles.form_input} 
                                        value={this.state.age}
                                        placeholder="" 
                                        onChangeText={(age) => this.setState({age})} 
                                    />
                                </View>
                            </View>
                            <TouchableOpacity style={styles.form_button} onPress={this._saveAge}>
                                <Text style={styles.button_text}>Save</Text>
                            </TouchableOpacity>
                            <PopupNotification 
                                visible={this.state.visibleNotification} 
                                buttonText={'Ok'} 
                                closeDisplay={() => this.setState({visibleNotification: false})}
                                title={this.state.titleNotification}
                                description={this.state.descriptionNotification}
                                isNegative={this.state.isNegative}
                            />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        )
    }

    _saveAge = async () => {
        const {data} = this.props.navigation.state.params;
        if(!this.state.age){
            this.props.navigation.navigate('CareSchedule', {petDetail: data, isStep: true});
            return;
        }

        let dateCurrent = new Date();
        data.petBirthdate  = dateHelper.convertDateSendApi(new Date(dateCurrent.getFullYear() - Number(this.state.age), 0, 1));
 
        await this.props.updatePetAction(data);

        if(this.props.updatePet.data){
            this.setState({
                petUpdate: this.props.updatePet.data
            });
            await this.props.getPetsByOwnerAction(this.props.userSession.user.userID);
            this.props.navigation.navigate('VaccineRecord', {data: this.props.updatePet.data, isStepAge: true, avatar: this.state.avatar, ageMonth: this._calculateMonthWithoutYears(this.props.updatePet.data.ageInDaysWithoutYears)});
        }

        if(this.props.updatePet.error){
            this.setState({
                titleNotification: "Error",
                descriptionNotification: "Something is wrong. Please try again.",
                isNegative: true,
                visibleNotification: true
            });
            return;
        }
    }

    _calculateMonthWithoutYears = (day) => {
        if(day)
            return Math.round(day /30);
        return 0;
    }
}

const  mapStateToProps = state => ({
    updatePet: state.updatePet,
    userSession: state.userSession
});

const mapDispatchToProps = {
    updatePetAction,
    getPetsByOwnerAction
};

export default connect(mapStateToProps, mapDispatchToProps)(ApproximateAge);

const format = StyleSheet.create({
    text_description: {
        fontSize: 14,
        fontWeight: '400',
        color: 'rgba(32, 44, 60,0.4)',
        fontStyle: 'italic',
        marginTop: 6,
        textAlign: 'center'
    }
})

