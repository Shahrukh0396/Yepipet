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
    AsyncStorage
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import {connect} from 'react-redux';
import loginAction from '../../src/apiActions/user/login';
import userSessionAction from '../../src/apiActions/user/userSession';
import getAvatarAction from '../../src/apiActions/user/getAvatar';
import resendConfirmEmailAction from '../../src/apiActions/user/resendConfirmEmail';
import styles from '../../constants/Form.style';
import PopupNotification from '../../components/PopupNotification';
import PopupConfirm from '../../components/PopupConfirm';
import getPetsByOwnerAction from '../../src/apiActions/pet/getPetsByOwner';
import getProvidersByOwnerAction from '../../src/apiActions/provider/getProvidersByOwner';
import suggestedSearchListAction from '../../src/apiActions/provider/suggestedSearchList';
import getReminderByOwnerAction from '../../src/apiActions/reminder/getReminderByOwner';
import getRepeatTypesAction from '../../src/apiActions/reminder/getRepeatTypes';
import getCategoryInfoAction from '../../src/apiActions/reminder/getCategoryInfo';

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userEmail: '',
            userPass: '',
            visibleNotification: false,
            errorText: '',
            errorTitle: '',
            visibleConfirm: false,
            isVerification: false,
            isErrorVerification: false,
            descriptionConfirm: '',
            loading: false,
            showPass: false
        }
    }
    render() {
        const {navigate} = this.props.navigation;
        const {visibleNotification, visibleConfirm} = this.state;

        return (
            <SafeAreaView style={styles.safeArea}>
                <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                    <Spinner
                        visible={this.state.loading}
                    />
                    <View style={styles.container}>
                        <View style={{position:'relative', paddingBottom: 22, paddingTop: 25, justifyContent: 'center'}}>
                            <TouchableOpacity style={styles.button_back} onPress={()=>navigate('Home')}>
                                <Image style={{width: 12, height: 21}} source={require('../../assets/images/icon-back.png')}/>
                            </TouchableOpacity>
                            <Text style={styles.title_head}> Sign In </Text>
                        </View>
                        
                        <View style={styles.container_form}>                        
                            <View style={styles.form_group}>
                                <Text style={styles.form_label}>Email:</Text>
                                <TextInput 
                                    style={styles.form_input}
                                    placeholder="*This field is required!"
                                    value={this.state.userEmail}
                                    onChangeText={(userEmail) => this.setState({userEmail})}
                                />
                            </View>
                            <View style={styles.form_group}>
                                <Text style={styles.form_label}>Password:</Text>
                                <TextInput 
                                    secureTextEntry={!this.state.showPass}
                                    style={styles.form_input}
                                    placeholder="*This field is required!"
                                    value={this.state.userPass}
                                    onChangeText={(userPass) => this.setState({userPass})}
                                />
                                <Text style={format.iconEye} onPress={()=> this.setState(previousState => ({showPass: !previousState.showPass}))}>
                                    {this.state.showPass ? (<FontAwesome name="eye" color="#ddd" size={20} />) : (<FontAwesome name="eye-slash" color="#ddd" size={20} />)}    
                                </Text> 
                            </View>
                            {this.showVerifyEmail()}
                            {/* {this.state.isVerification ? 
                                <Text style={format.text_verification}>A verification e-mail is sent to your e-mail.</Text>
                                : <Text style={format.text_verification}>A verification e-mail is sent to your e-mail.</Text>
                            } */}
                            <TouchableOpacity style={styles.form_button} onPress={this._signInAsync}>
                                {/* <Text style={styles.button_text}>Sign In {this.props.login}</Text> */}
                                <Text style={styles.button_text}>Sign In</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.form_button, styles.button_blue]} onPress={() => navigate('ForgotPassword')}>
                                <Text style={styles.button_text}>Forgot your Password?</Text>
                            </TouchableOpacity>
                        </View>

                        <PopupNotification 
                            visible={visibleNotification} 
                            buttonText={'Ok'} 
                            closeDisplay={() => this.setState({visibleNotification: false})}
                            title={this.state.errorTitle}
                            description={this.state.errorText}
                            isNegative={true}
                        />

                        <PopupConfirm
                            visible={visibleConfirm}
                            buttonText1={'Cancel'}
                            buttonText2={'Ok'}
                            title={'Meow~ Your e-Mail not yet verified.'}
                            description={this.state.descriptionConfirm}
                            handleButton1={() => this.setState({visibleConfirm: false})}
                            handleButton2={this._resendConfirmEmailAsync}
                        />

                    </View>
                </ScrollView>
        </SafeAreaView>
        );
    }

    _signInAsync = async () => {
        const {userEmail, userPass} = this.state;
        // let userEmail = 'qroot@qualityroot.com';
        // let userPass = 'Pass2019';
        if(!userEmail || !userPass){
           this.setState({
               errorTitle: "Oops. Something's missing!",
               errorText: "Please enter valid username and password to sign in to your account.",
               visibleNotification: true
           }) //Show popup message error
           return;
        }

        const format = /^[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]*$/
        if (userEmail.match(format)) {
            this.setState({
                errorTitle: "Oops. Email wrong!",
                errorText: "Email field contains an invalid character.",
                visibleNotification: true
            }) //Show popup message error
            return;
        }

        this.setState({loading: true});
        
        await this.props.loginAction(userEmail, userPass);

        if (this.props.login.token) {
            await AsyncStorage.setItem('userToken', this.props.login.token);
            let result = await this.props.userSessionAction(this.props.login.token);

            if(result) {
                // await this.props.getAvatarAction(this.props.userSession.user.userID);
                // await AsyncStorage.setItem('userID', this.props.userSession.user.userID.toString());
                // await this.props.getPetsByOwnerAction(this.props.userSession.user.userID);
                let getAvatar = this.props.getAvatarAction(result.userID);
                let getProvider = this.props.getProvidersByOwnerAction(result.userID);
                let getReminder = this.props.getReminderByOwnerAction(result.userID);
                let getRepeatTypes = this.props.getRepeatTypesAction();
                let getCategory = this.props.getCategoryInfoAction()
                let getPetsByOwner = this.props.getPetsByOwnerAction(result.userID);
                let suggestedSearchList = this.props.suggestedSearchListAction();
                
                Promise.all([getAvatar, getProvider, getReminder, getRepeatTypes, getCategory, getPetsByOwner, suggestedSearchList])
                        .then(() => {
                            this.setState({loading: false});
                            this.props.navigation.navigate('UserManage');
                        })
                        .catch(error => console.log(`Error in promises ${error}`))
            }
        }
        if(this.props.login.error) {
            this.setState({loading: false});
            if(this.props.login.error.toString().includes('status code 400'))
                this.setState({descriptionConfirm: 'Would you like us to resend another verification e-mail?!', visibleConfirm: true})
            else this.setState({
                errorTitle: "Oops. Something's wrong!",
                errorText: 'Username or password is incorrect!',
                visibleNotification: true
            })
        }
    }

    showVerifyEmail(){
        if(this.state.isErrorVerification)
            return <Text style={format.text_error}>Error!</Text>
        else if(this.state.isVerification)
            return <Text style={format.text_verification}>A verification e-mail is sent to your e-mail.</Text>
        else return;
    }

    _resendConfirmEmailAsync = async () => {
        const {userEmail} = this.state;

        await this.props.resendConfirmEmailAction(userEmail);

        if(this.props.confirmEmail.error)
            this.setState({isVerification: false, isErrorVerification: true});
        
        if (this.props.confirmEmail.status)
            this.setState({isVerification: true, isErrorVerification: false});

        this.setState({visibleConfirm: false});
    }
}

const mapStateToProps = state => ({
    login: state.login,
    userSession: state.userSession,
    confirmEmail: state.resendConfirmEmail
});

const mapDispatchToProps = {
    loginAction,
    userSessionAction,
    getAvatarAction,
    resendConfirmEmailAction,
    getPetsByOwnerAction,
    getProvidersByOwnerAction,
    getReminderByOwnerAction,
    getRepeatTypesAction,
    getCategoryInfoAction,
    suggestedSearchListAction
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);

const format = StyleSheet.create({
    text_verification: {
        fontStyle: 'italic',
        paddingVertical: 5,
        color: '#14c498'
    },

    text_error: {
        color: '#f95454',
        paddingVertical: 5
    },

    iconEye : {
        position: 'absolute',
        right: 6,
        top: 12
    }
});