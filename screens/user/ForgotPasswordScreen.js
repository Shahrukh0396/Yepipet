import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import {connect} from 'react-redux';
import forgotPasswordAction from '../../src/apiActions/user/forgotPassword';
import PopupNotification from '../../components/PopupNotification';
import {dataHelper} from '../../src/helpers';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView
} from 'react-native';
import styles from '../../constants/Form.style';
import stylesGeneral from '../../constants/General.style';

class ForgotPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userEmail: '',
            notifyTitle: '',
            notifyText: '',
            isSubmit: false,
            visibleNotification: false,
        }
    }
    render() {
        const {navigate} = this.props.navigation;

        return (
            <SafeAreaView style={styles.safeArea}>
                <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                    <Spinner
                        visible={this.props.forgotPassword.loading}
                    />
                    <View style={styles.container}>
                        <View style={{position:'relative', paddingBottom: 22, paddingTop: 25, justifyContent: 'center'}}>
                            <TouchableOpacity style={styles.button_back} onPress={() => navigate('SignIn')}>
                                <Image style={{width: 12, height: 21}} source={require('../../assets/images/icon-back.png')}/>
                            </TouchableOpacity>
                            <Text style={styles.title_head}> Forgot Password </Text>
                        </View>
                        
                        <View style={styles.container_form}>
                            <View>
                                <Text style={[stylesGeneral.bold, stylesGeneral.mb10]}>Forgot your password</Text>
                                <Text style={stylesGeneral.mb20}>Enter the e-mail address you used to register your YepiPet account and we will send you instructions to reset your password</Text>
                            </View>                        
                            <View style={styles.form_group}>
                                <Text style={styles.form_label}>E-mail:</Text>
                                <TextInput style={[styles.form_input, (!this.state.userEmail && this.state.isSubmit) ? styles.input_required : '']} 
                                    placeholder="*This field is required!"
                                    onChangeText={(userEmail)=>this.setState({userEmail})}
                                    value={this.state.userEmail}
                                />
                            </View>
                            {(this.state.isSubmit && !dataHelper.validateEmail(this.state.userEmail)) ? (<Text style={styles.form_label_error}>Email does not exists please confirm your email again.</Text>) : null}
                            <TouchableOpacity style={styles.form_button} onPress={this._forgotPasswordAsync}>
                                <Text style={styles.button_text}>Send</Text>
                            </TouchableOpacity>
                        </View>
                        <PopupNotification 
                            visible={this.state.visibleNotification} 
                            buttonText={'Ok'} 
                            closeDisplay={() => { 
                                this.setState({visibleNotification: false});
                            }}
                            title={this.state.notifyTitle}
                            description={this.state.notifyText}
                        />
                    </View>
                </ScrollView>
        </SafeAreaView>
        );
    }
    _forgotPasswordAsync = async () => {
        this.setState({isSubmit: true});
        if(!this.state.userEmail || !dataHelper.validateEmail(this.state.userEmail))
            return;

        await this.props.forgotPasswordAction(this.state.userEmail);

        if(this.props.forgotPassword.error)
            this.setState({notifyTitle: "Oops! Can't Find the E-Mail.", notifyText: "We couldn't find the e-mail address you entered in our system.", visibleNotification: true})
                
        if(this.props.forgotPassword.status) {
            this.setState({notifyTitle: "Woof! Recovery E-Mail Sent.", notifyText: "A password recovery e-mail was sent to your registered e-mail address. Please check for password recovery instructions. ", visibleNotification: true});
            setTimeout(() => {
                this.props.navigation.navigate('SignIn'); 
            }, 5000);
        }
    }
}

const mapStateToProps = state => ({
    forgotPassword: state.forgotPassword
});

const mapDispatchToProps = {
    forgotPasswordAction
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);