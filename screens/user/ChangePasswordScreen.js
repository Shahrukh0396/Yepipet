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
import {connect} from 'react-redux';
import styles from '../../constants/Form.style';
import { FontAwesome } from '@expo/vector-icons';
import changePasswordAction from '../../src/apiActions/user/changePassword';
import PopupNotification from '../../components/PopupNotification';

class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPass: false,
            showPassOld: false,
            newPass: '',
            oldPass: '',
            visibleNotification: false,
            titleNotification: '',
            descriptionNotification: '',
            errorOldPass: false,
            errorNewPass: false
        }
    }
    render() {
        const {navigate} = this.props.navigation;

        return (
            <SafeAreaView style={styles.safeArea}>
                <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                    <Spinner
                        visible={this.props.changePassword.loading}
                    />
                    <View style={styles.container}>
                        <View style={{position:'relative', paddingBottom: 22, paddingTop: 25, justifyContent: 'center'}}>
                            <TouchableOpacity style={styles.button_back} onPress={() => navigate('UserProfile')}>
                                <Image style={{width: 12, height: 21}} source={require('../../assets/images/icon-back.png')}/>
                            </TouchableOpacity>
                            <Text style={styles.title_head}> Change Password </Text>
                        </View>
                        
                        <View style={styles.container_form}>                        
                            <View style={styles.form_group}>
                                <Text style={styles.form_label}>Old Password:</Text>
                                <TextInput 
                                    style={[styles.form_input, this.state.errorOldPass ? styles.form_input_error : {}]} 
                                    secureTextEntry={!this.state.showPass}
                                    placeholder="*This field is required!"
                                    value={this.state.oldPass}
                                    onChangeText={(oldPass)=> this.setState({oldPass})}
                                />
                                <Text style={stylesScreen.iconEye} onPress={()=> this.setState(previousState => ({showPass: !previousState.showPass}))}>
                                    {this.state.showPass ? (<FontAwesome name="eye" color="#ddd" size={20} />) : (<FontAwesome name="eye-slash" color="#ddd" size={20} />)}    
                                </Text>
                            </View>
                            <View style={styles.form_group}>
                                <Text style={styles.form_label}>New Password:</Text>
                                <TextInput 
                                    style={[styles.form_input, this.state.errorNewPass ? styles.form_input_error : {}]} 
                                    secureTextEntry={!this.state.showPassOld}
                                    placeholder="*This field is required!"
                                    value={this.state.newPass}
                                    onChangeText={(newPass)=> this.setState({newPass})}
                                />
                                <Text style={stylesScreen.iconEye} onPress={()=> this.setState(previousState => ({showPassOld: !previousState.showPassOld}))}>
                                    {this.state.showPassOld ? (<FontAwesome name="eye" color="#ddd" size={20} />) : (<FontAwesome name="eye-slash" color="#ddd" size={20} />)}    
                                </Text> 
                            </View>
                            <TouchableOpacity style={styles.form_button} onPress={this._changePassword}>
                                <Text style={styles.button_text}>Save</Text>
                            </TouchableOpacity>
                        </View>

                        <PopupNotification 
                            visible={this.state.visibleNotification} 
                            buttonText={'Ok'} 
                            closeDisplay={this._closeNotification}
                            title={this.state.titleNotification}
                            description={this.state.descriptionNotification}
                        />
                    </View>
                </ScrollView>
        </SafeAreaView>
        );
    }

    _changePassword = async () => {
        console.log('test this =>>>>>>>>>>>>>', this.props.userSession.user);
        if (!this.state.oldPass || !this.state.newPass){
            this.setState({
                titleNotification: "Opps! Something is wrong.",
                descriptionNotification: "Please enter your current password and new password.",
                visibleNotification: true
            });
            return;
        }
        else if (this.props.userSession.user.userPassword != this.state.oldPass) {
            this.setState({
                titleNotification: "Opps! Old password is wrong.",
                descriptionNotification: "Please enter correct old password.",
                visibleNotification: true
            });
            return;
        } 
        else if (this.state.oldPass.length < 8 || this.state.newPass.length < 8) {
            this.setState({
                titleNotification: "Opps! Something is wrong.",
                descriptionNotification: "Your password should have between 8 and 15 characters.",
                visibleNotification: true
            });
            return;
        }
        else if (this.state.oldPass.length > 15 || this.state.newPass.length > 15) {
            this.setState({
                titleNotification: "Opps! Something is wrong.",
                descriptionNotification: "Your password should have between 8 and 15 characters.",
                visibleNotification: true
            });
            return;
        }
        else if (this.props.userSession.user.userPassword === this.state.newPass){
            this.setState({
                titleNotification: "Oops. Password Not Matched.",
                descriptionNotification: "New Password and Old password can't be same.",
                visibleNotification: true,
                errorNewPass: true,
            });
            return;
        }

        this.setState({errorOldPass: false});

        let data = {
            userID: this.props.userSession.user.userID,
            newPassword: this.state.newPass,
            oldPassword: this.state.oldPass
        };

        let result = await this.props.changePasswordAction(data);

        if(this.props.changePassword.error) {
            this.setState({
                titleNotification: "Oops. Something's missing!",
                descriptionNotification: 'Password change failed!',
                visibleNotification: true
            });
            return;
        }

        if (this.props.changePassword.status) {
            this.setState({
                titleNotification: "Meow! Password change successful!",
                descriptionNotification: 'Your new password is now effective!',
                visibleNotification: true
            });
        }
        // console.log('this.props.userSession', this.props.userSession);
        // console.log('this.props.login', this.props.login);
        // this.props.navigation.navigate('UserProfile');
    }
    
    _closeNotification = async () =>{
        this.setState({visibleNotification: false});
        if(this.props.changePassword.status){
            await AsyncStorage.clear();
            this.props.navigation.navigate('SignIn');
        }
    }
}

const mapStateToProps = state => ({
    changePassword: state.changePassword,
    userSession: state.userSession
});

const mapDispatchToProps = {
    changePasswordAction
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);

const stylesScreen = StyleSheet.create({
    iconEye : {
        position: 'absolute',
        right: 6,
        top: 12
    }
});