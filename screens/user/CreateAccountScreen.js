import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import { colors } from '../../constants/Colors';
import {dataHelper, dateHelper} from '../../src/helpers';
import {Alert, ImageEditor} from 'react-native';
import {connect} from 'react-redux';
import createAccountAction from '../../src/apiActions/user/createAccount';
import uploadAvatarAction from '../../src/apiActions/user/uploadAvatar';
import PopupNotification from '../../components/PopupNotification';
import {
  StyleSheet,
  View,
  Button,
  Dimensions,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DatePicker from 'react-native-datepicker';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions'

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
class CreateAccountScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            optionGender: [{name: 'Male', value: 'M'}, {name: 'Female', value: 'F'}],
            userGender: 'M',
            userBirthdate: '',
            userFirstName: '',
            userLastName: '',
            userEmail: '',
            userPassword: '',
            userPhone: '',
            userZipCode: '',
            visibleNotification: false,
            notifyTitle: '',
            NotifyText: '',
            isSubmit: false,
            avatarSource: null,
            formDataImage: null,
            returnHome: false,
            isNegativeNotification: false,
            errFirstName: '',
            errLastName: '',
            errEmail: '',
            errPassword: '',
            errZipCode: '',
            errPhone: '',
            errBirthday: '',
            showPass: false
        };
    }

    render() {
        const {navigate} = this.props.navigation;
        const {optionGender, errFirstName, errLastName, errEmail, errPassword, errZipCode, errPhone, errBirthday} = this.state;

        return (
            <KeyboardAvoidingView 
                behavior="padding"
                enabled 
                style={{ flex: 1 }}
            >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                    <Spinner
                        visible={this.props.createAccount.loading || this.props.uploadAvatar.loading}
                    />
                    <View style={styles.container}>
                        <View style={{position:'relative', paddingBottom: 22, paddingTop: 25, justifyContent: 'center'}}>
                            <TouchableOpacity style={styles.button_back} onPress={() => navigate('Home')}>
                                <Image style={{width: 12, height: 21}} source={require('../../assets/images/icon-back.png')}/>
                            </TouchableOpacity>
                            <Text style={styles.title_head}>Create Account</Text>
                        </View>
                        <View style={styles.container_form}>
                            <Text style={styles.title_form}>Profile</Text>
                            <TouchableOpacity onPress={this._chooseOption}>
                                <Image style={{width: 70, height: 70, borderRadius: 70/2, alignSelf: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#f0f0f0'}} source={ this.state.avatarSource ? {uri: this.state.avatarSource} : require('../../assets/images/default-avatar.jpg')}/>
                                <Text style={{fontSize: 13, color: '#000', fontStyle: 'italic', backgroundColor: 'transparent', alignSelf: 'center', marginBottom: 20}}>Tap to change photo</Text>
                            </TouchableOpacity>
                            <View style={styles.form_group}>
                                <Text style={styles.form_label}>First Name:</Text>
                                <TextInput style={[styles.form_input, ((!dataHelper.validateLength(this.state.userFirstName) || dataHelper.checkSpecial(this.state.userFirstName)) && this.state.isSubmit) ? styles.input_required : '']} 
                                    placeholder="*This field is required!"
                                    onChangeText={(userFirstName) => this.setState({userFirstName})}
                                    value={this.state.userFirstName}
                                />
                            </View>
                            {/* {(this.state.isSubmit && dataHelper.checkSpecial(this.state.userFirstName)) ? (<Text style={styles.form_label_error}>First Name is invalid!</Text>) : null} */}
                            {/* {this.state.isSubmit && errFirstName ? <Text style={styles.form_label_error}>{errFirstName}</Text> : null} */}
                            <View style={styles.form_group}>
                                <Text style={styles.form_label}>Last Name:</Text>
                                <TextInput style={[styles.form_input, ((!dataHelper.validateLength(this.state.userLastName) || dataHelper.checkSpecial(this.state.userLastName)) && this.state.isSubmit) ? styles.input_required : '']}
                                    placeholder="*This field is required!"
                                    onChangeText={(userLastName) => this.setState({userLastName})}
                                    value={this.state.userLastName}
                                />
                            </View>
                            {/* {(this.state.isSubmit && dataHelper.checkSpecial(this.state.userLastName)) ? (<Text style={styles.form_label_error}>Last Name is invalid!</Text>) : null} */}
                            {/* {this.state.isSubmit && errLastName ? <Text style={styles.form_label_error}>{errLastName}</Text> : null} */}
                            <View style={styles.form_group}>
                                <Text style={styles.form_label}>E-Mail:</Text>
                                <TextInput style={[styles.form_input, ((!dataHelper.validateLength(this.state.userEmail) || !dataHelper.validateEmail(this.state.userEmail)) && this.state.isSubmit) ? styles.input_required : '']} keyboardType={'email-address'}
                                    placeholder="*This field is required!"
                                    onChangeText={(userEmail) => this.setState({userEmail})}
                                    value={this.state.userEmail}
                                />
                            </View>
                            {/* {(this.state.isSubmit && !dataHelper.validateEmail(this.state.userEmail)) ? (<Text style={styles.form_label_error}>Email is invalid!</Text>) : null} */}
                            {/* {this.state.isSubmit && errEmail ? <Text style={styles.form_label_error}>{errEmail}</Text> : null} */}
                            <View style={styles.form_group}>
                                <Text style={styles.form_label}>Password:</Text>
                                <TextInput 
                                    style={[styles.form_input, ((!dataHelper.validateLength(this.state.userPassword) || this.state.userPassword.length < 8) && this.state.isSubmit) ? styles.input_required : '']} 
                                    secureTextEntry={!this.state.showPass}
                                    placeholder="*This field is required!"
                                    onChangeText={(userPassword) => this.setState({userPassword})}
                                    value={this.state.userPassword}
                                />
                                <Text style={styles.iconEye} onPress={()=> this.setState(previousState => ({showPass: !previousState.showPass}))}>
                                    {this.state.showPass ? (<FontAwesome name="eye" color="#ddd" size={20} />) : (<FontAwesome name="eye-slash" color="#ddd" size={20} />)}    
                                </Text> 
                            </View>
                            {/* {(this.state.isSubmit && this.state.userPassword.length < 4) ? (<Text style={styles.form_label_error}>Password should be at least 4 characters</Text>) : null} */}
                            {/* {this.state.isSubmit && errPassword ? <Text style={styles.form_label_error}>{errPassword}</Text> : null} */}
                            <View style={styles.form_group}>
                                <Text style={styles.form_label}>Phone:</Text>
                                <TextInput style={[styles.form_input, (!dataHelper.validatePhone(this.state.userPhone) && this.state.isSubmit) ? styles.input_required : '']}
                                    placeholder=""
                                    onChangeText={(userPhone) => this.setState({userPhone})}
                                    value={this.state.userPhone}
                                    />
                            </View>
                            {/* {this.state.isSubmit && errPhone ? <Text style={styles.form_label_error}>{errPhone}</Text> : null} */}
                            <View style={styles.form_group}>
                                <Text style={styles.form_label}>Gender:</Text>
                                <View style={styles.group_radio}>
                                    {optionGender.map((data, i) => {
                                        return(
                                            <TouchableOpacity 
                                                key={data.value} 
                                                style={[
                                                    styles.btn_radio,
                                                    this.state.userGender == data.value ? styles.btn_radio_active : {},
                                                    {flex: 1/(optionGender.length)},
                                                    i === 0 ? styles.btn_radio_noborder : {}
                                                ]}
                                                onPress={()=>{this.setState({userGender: data.value})}}
                                            >
                                                <Text style={{color: this.state.userGender == data.value ? '#fff' : '#000', textAlign: 'center', fontSize: 16}}>{data.name}</Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                            </View>
                            <View style={styles.form_group}>
                                <Text style={styles.form_label}>Birthday:</Text>
                                <View style={[styles.group_radio, {backgroundColor:'#fcfcfc'}]} >
                                    <DatePicker
                                        style={{width: '100%'}}
                                        date={this.state.userBirthdate}
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
                                                source={require('../../assets/images/icon-date.png')}
                                            />
                                        }
                                        onDateChange={(date) => {this.setState({userBirthdate: date})}}
                                    />
                                </View>
                            </View>
                            {/* {this.state.isSubmit && errBirthday ? <Text style={styles.form_label_error}>{errBirthday}</Text> : null} */}
                            <View style={styles.form_group}>
                                <Text style={styles.form_label}>Zip Code:</Text>
                                <TextInput style={[styles.form_input, ((!dataHelper.validateLength(this.state.userZipCode) || !dataHelper.validateZipCode(this.state.userZipCode)) && this.state.isSubmit) ? styles.input_required : '']}
                                    placeholder="*This field is required!"
                                    onChangeText={(userZipCode) => this.setState({userZipCode})}
                                    value={this.state.userZipCode}
                                />
                            </View>
                            {/* {this.state.isSubmit && errBirthday ? <Text style={styles.form_label_error}>{errBirthday}</Text> : null} */}
                            <TouchableOpacity style={styles.form_button} onPress={this._signUpAsync}>
                                <Text style={{color: '#fff', fontWeight: '700', fontSize: 13, textAlign: 'center'}}>Save</Text>
                            </TouchableOpacity>
                        </View>
                        <PopupNotification 
                            visible={this.state.visibleNotification} 
                            buttonText={'Ok'} 
                            closeDisplay={() => { 
                                this.setState({visibleNotification: false});
                                if(this.state.returnHome)
                                    navigate('Home');
                            }}
                            title={this.state.notifyTitle}
                            description={this.state.NotifyText}
                            isNegative={this.state.isNegativeNotification}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
            </KeyboardAvoidingView>
        );
    }

    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
    };

    _chooseOption = async () => {
        Alert.alert(
            'Upload Avatar',
            'Please choose option',
            [
              {text: 'From Camera', onPress: () => this._pickImage('Camera')},
              {text: 'From Library', onPress: () => this._pickImage('Library')},
              {text: 'Cancel', onPress: () =>  console.log("Cancel Pressed") , style: 'cancel'},
            ]
        )
    };

    _pickImage = async (choose) => {
        console.log('upload image');

        await this.askPermissionsAsync();

        // Display the camera to the user and wait for them to take a photo or to cancel
        // the action
        let result;

        if(choose !== 'Library')
            result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 4],
            });
        else    
            result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 4],
            });
      
        if (result.cancelled) {
            return;
        }
        let resizedUri = await new Promise((resolve, reject) => {
            ImageEditor.cropImage(result.uri,
              {
                offset: { x: 0, y: 0 },
                size: { width: result.width, height: result.height},
                displaySize: { width: 600, height: 600 },
                resizeMode: 'contain',
              },
              (uri) => resolve(uri),
              () => reject(),
            );
        });

        this.setState({ avatarSource: resizedUri });

        let localUri = resizedUri;
        let filename = localUri.split('/').pop();

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        // Upload the image using the fetch and FormData APIs
        let formData = new FormData();
        // Assume "photo" is the name of the form field the server expects
        formData.append('file', { uri: localUri, name: filename, type });

        this.setState({formDataImage: formData});
    };

    _signUpAsync = async () => {
        this.setState({isSubmit: true});
        let data = {
            userFirstName: this.state.userFirstName,
            userLastName: this.state.userLastName,
            userEmail: this.state.userEmail,
            userPassword: this.state.userPassword,
            userPhone: this.state.userPhone,
            userGender: this.state.userGender,
            userBirthdate: dateHelper.convertDateSendApi(this.state.userBirthdate),
            userZipCode: this.state.userZipCode,
        }
        let errFirstName = '';
        let errLastName = '';
        let errEmail = '';
        let errPassword = '';
        let errPhone = '';
        let errBirthday = '';
        let errZipCode = '';

        if(!dateHelper.checkDate(data.userBirthdate))
            this.setState({isNegativeNotification: true,notifyTitle: "Oops. Something's missing!" , NotifyText: 'Select date not later than current date', visibleNotification: true})
        if( dataHelper.checkSpecial(data.userFirstName) 
            || dataHelper.checkSpecial(data.userLastName)
            || !dataHelper.validateEmail(data.userEmail)
            || !dataHelper.validateLength(data.userFirstName)
            || !dataHelper.validateLength(data.userLastName)
            || !dataHelper.validateLength(data.userEmail)
            || !dataHelper.validateLength(data.userPassword)
            || data.userPassword.length < 8
            || !dataHelper.validateLength(data.userZipCode)
            || !dataHelper.validateZipCode(data.userZipCode)
            || !dataHelper.validatePhone(data.userPhone)
            || !dateHelper.checkDate(data.userBirthdate)
        )
        {
            if(dataHelper.checkSpecial(data.userFirstName)) {
                errFirstName = 'The first name is invalid.';
                this.setState({isNegativeNotification: true,notifyTitle: "Oops. Something's wrong!" , NotifyText: 'The first name is invalid', visibleNotification: true});
            }
            else if(!dataHelper.validateLength(data.userFirstName))
            {
                errFirstName = 'Please check the first name and no more than 50 characters';
                this.setState({isNegativeNotification: true,notifyTitle: "Oops. Something's wrong!" , NotifyText: 'Please check the first name and no more than 50 characters', visibleNotification: true});
            }
            else errFirstName = '';
            
            if(dataHelper.checkSpecial(data.userLastName))
                errLastName = 'The last name is invalid.';
            else if(!dataHelper.validateLength(data.userLastName))
            {
                errLastName = 'Please check the last name and no more than 50 characters';
                this.setState({isNegativeNotification: true,notifyTitle: "Oops. Something's wrong!" , NotifyText: 'Please check the last name and no more than 50 characters', visibleNotification: true});
            }
            else errLastName = '';

            if(!dataHelper.validateLength(data.userEmail))
            {
                errEmail = 'Please check the email and no more than 50 characters';
                this.setState({isNegativeNotification: true,notifyTitle: "Oops. Something's wrong!" , NotifyText: 'Please check the email and no more than 50 characters', visibleNotification: true});
            }
            else if(!dataHelper.validateEmail(data.userEmail))
            {
                errEmail = 'The email is invalid.';
                this.setState({isNegativeNotification: true,notifyTitle: "Oops. Something's wrong!" , NotifyText: 'The email is invalid', visibleNotification: true});
            }
            else errEmail = '';

            if(data.userPassword.length < 8)
            {
                errPassword = 'Password should be at least 8 characters';
                this.setState({isNegativeNotification: true,notifyTitle: "Oops. Something's wrong!" , NotifyText: 'Password should be at least 8 characters', visibleNotification: true});
            }
            else if(!dataHelper.validateLength(data.userPassword))
            {
                errPassword = 'Please check the password and no more than 50 characters.';
                this.setState({isNegativeNotification: true,notifyTitle: "Oops. Something's wrong!" , NotifyText: 'Please check the password and no more than 50 characters.', visibleNotification: true});
            }
            else errPassword = '';

            if(!dataHelper.validateLength(data.userZipCode))
            {
                errZipCode = 'Please check the zip code and no more than 50 characters.';
                this.setState({isNegativeNotification: true,notifyTitle: "Oops. Something's wrong!" , NotifyText: 'Please check the zip code and no more than 50 characters.', visibleNotification: true});
            }
            else if(!dataHelper.validateZipCode(data.userZipCode))
            {
                errZipCode = 'The zip code is invalid.';
                this.setState({isNegativeNotification: true,notifyTitle: "Oops. Something's wrong!" , NotifyText: 'The zip code is invalid', visibleNotification: true});
            }
            else errZipCode = '';

            if(!dataHelper.validatePhone(data.userPhone))
            {
                errPhone = 'The phone is invalid.';
                this.setState({isNegativeNotification: true,notifyTitle: "Oops. Something's wrong!" , NotifyText: 'The phone is invalid', visibleNotification: true});
            }
            else errPhone = '';

            if(!dateHelper.checkDate(data.userBirthdate))
            {
                errBirthday = 'The birthday is invalid.';
                this.setState({isNegativeNotification: true,notifyTitle: "Oops. Something's wrong!" , NotifyText: 'The birthday is invalid', visibleNotification: true});
            }
            else errBirthday = '';

            this.setState({
                errBirthday, errFirstName, errLastName, errPhone, errPassword, errZipCode, errEmail
            });

            if(errBirthday || errFirstName || errLastName || errPhone || errPassword || errZipCode || errEmail)
                return;

        }
        // return this.setState({isNegativeNotification: true,notifyTitle: "Oops. Something's wrong!" , NotifyText: 'Please check all your information', visibleNotification: true})

        
        await this.props.createAccountAction(data);
        console.log('this.props.createAccount', this.props.createAccount);

        if(this.props.createAccount.error) {
            if(this.props.createAccount.error.toString().includes('status code 409'))
                this.setState({isNegativeNotification: true,notifyTitle: "Oops. Something's missing!" , NotifyText: 'Email alreay exists!', visibleNotification: true})
            else this.setState({isNegativeNotification: true,notifyTitle: "Oops. Something's missing!" , NotifyText: 'Create error. Please try again.', visibleNotification: true})
        }

        if(this.props.createAccount.userID) {
            if(this.state.formDataImage) {
                await this.props.uploadAvatarAction(this.props.createAccount.userID, this.state.formDataImage);
                console.log('this.props.uploadAvatar.url', this.props.uploadAvatar.url);
            }
            this.setState({isNegativeNotification: false,notifyTitle: 'Yepi! Successfully Registered!' , NotifyText: 'An activation e-mail was sent to you. Please verify your e-mail to start using the Yepi Pet app. ', visibleNotification: true, returnHome: true})
        }

    }
}

const mapStateToProps = state => ({
    createAccount: state.createAccount,
    uploadAvatar: state.uploadAvatar,
});

const mapDispatchToProps = {
    createAccountAction,
    uploadAvatarAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccountScreen);

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fcfcfc',
        paddingTop: 20
    },
    container: {
        flex: 1,
        backgroundColor: '#fcfcfc',
        padding: 16
    },
    button_style: {
        borderRadius: 10,
        width: viewportWidth*0.8,
        height: 40
    },
    title_head: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000'
    },
    button_back: {
        backgroundColor: 'transparent',
        width: 20,
        height: 21,
        color: '#000',
        borderRadius: 0,
        position:'absolute',
        zIndex: 1
    },
    container_form: {
        borderWidth: 1, 
        borderColor: '#e0e0e0', 
        padding: 20, 
        backgroundColor: '#fff',
        borderRadius: 16
    },
    title_form: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 10,
        textAlign: 'center'
    },
    form_group: {
        flexDirection:'row', 
        flexWrap:'wrap',
        alignItems: 'center',
        marginBottom: 15
    },
    form_label: {
        fontSize: 16,
        fontWeight: 'normal',
        flex: 0.3,
    },
    form_label_error: {
        fontSize: 12,
        fontWeight: 'normal',
        color: 'red',
        position: 'relative',
        top: -10,
        right: 0,
        width: '100%',
        textAlign: 'right'
    },
    form_input: {
        height: 44,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        backgroundColor: '#fcfcfc',
        borderRadius: 4,
        fontSize: 15,
        fontWeight: '500',
        flex: 0.7,
        fontWeight: 'normal',
        padding: 12,
    },
    form_button: {
        height: 44,
        borderRadius: 44,
        backgroundColor: '#ee7a23',
        padding: 12,
        marginTop: 20
    },
    group_radio: {
        flex: 0.8,
        flexDirection:'row',
        flexWrap:'wrap',
        borderWidth: 1, 
        borderColor: '#e0e0e0',
        borderRadius: 4,
        marginLeft: 0
    },
    btn_radio: {
        height: 44,
        flex: 0.5,
        padding: 12,
    },
    btn_radio_active: {
        backgroundColor: '#ee7a23'
    },
    input_required: {
        borderWidth: 1,
        borderColor: 'red'
    },
    
    iconEye : {
        position: 'absolute',
        right: 6,
        top: 12
    }
});