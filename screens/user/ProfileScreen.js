import React from 'react';
import {Alert, ImageEditor} from 'react-native';
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
    KeyboardAvoidingView,
    AsyncStorage
} from 'react-native';
import {connect} from 'react-redux';
import { FileSystem } from 'expo';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import updateProfileAction from '../../src/apiActions/user/updateProfile';
import uploadAvatarAction from '../../src/apiActions/user/uploadAvatar';
import getAvatarAction from '../../src/apiActions/user/getAvatar';
import userSessionAction from '../../src/apiActions/user/userSession';
import PopupNotification from '../../components/PopupNotification';
import DatePicker from 'react-native-datepicker';
import {dataHelper, dateHelper} from '../../src/helpers'
import styles from '../../constants/Form.style';
import general from '../../constants/General.style';
import { offlineActionTypes } from 'react-native-offline';
import { iOS } from '../../src/common';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            optionGender: [{name: 'Male', value: 'M'}, {name: 'Female', value: 'F'}],
            userGender: 'M',
            userBirthdate: '',
            userFirstName: '',
            userLastName: '',
            userEmail: '',
            userPassword: '',
            userPhone: '',
            userZipCode: '',
            avatarSource: null,
            formDataImage: null,
            visibleNotification: false,
            notifyTitle: '',
            NotifyText: '',
            isSubmit: false,
            test: '',
            test2: '',
            loading: false
        }
    }

    componentWillMount() {
        // this.setState({ ...this.state, ...this.props.userSession.user});
        // this.setState({avatarSource: this.props.getAvatar.url});
        // console.log('this.state', this.props.getAvatar);
        this._getUser();
        console.log('Profile');
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {
            // this._getUser();
        });
    }

    render() {
        const {navigate} = this.props.navigation;
        const {optionGender, photo, loading} = this.state;
        const {user} = this.props.userSession;

        return (
            <KeyboardAvoidingView 
                behavior="padding"
                enabled 
                style={{ flex: 1 }}
            >
                <SafeAreaView style={styles.safeArea}>
                    <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                        <Spinner
                            visible={loading}
                        />
                        <View style={styles.container}>
                            <View style={{position:'relative', paddingBottom: 22, paddingTop: 25, justifyContent: 'center'}}>
                                <TouchableOpacity style={styles.button_back} onPress={() => this.props.navigation.goBack()}>
                                    <Image style={{width: 12, height: 21}} source={require('../../assets/images/icon-back.png')}/>
                                </TouchableOpacity>
                                <Text style={styles.title_head}> {this.state.isEdit ? 'Update Profile' : 'User Profile'} </Text>
                            </View>
                            {this.state.isEdit ? (
                                <View style={styles.container_form}>
                                    <Text style={styles.title_form}>Profile</Text>
                                    <TouchableOpacity onPress={this._chooseOption}>
                                        <Image style={styles.image_circle} source={ this.state.avatarSource ? {uri: this.state.avatarSource} : require('../../assets/images/default-avatar.jpg')}/>
                                        <Text style={format.button_changeAvatar}>Tap to change photo</Text>                                    
                                    </TouchableOpacity>
                                    <View style={styles.form_group}>
                                        <Text style={styles.form_label}>First Name:</Text>
                                        <TextInput style={[styles.form_input, ((!dataHelper.validateLength(this.state.userFirstName) || dataHelper.checkSpecial(this.state.userFirstName)) && this.state.isSubmit) ? styles.input_required : '']}
                                            placeholder="*This field is required!"
                                            onChangeText={(userFirstName) => this.setState({userFirstName})}
                                            value={this.state.userFirstName}
                                        />
                                    </View>
                                    <View style={styles.form_group}>
                                        <Text style={styles.form_label}>Last Name:</Text>
                                        <TextInput style={[styles.form_input, ((!dataHelper.validateLength(this.state.userLastName) || dataHelper.checkSpecial(this.state.userLastName)) && this.state.isSubmit) ? styles.input_required : '']}
                                            placeholder="*This field is required!"
                                            onChangeText={(userLastName) => this.setState({userLastName})}
                                            value={this.state.userLastName}
                                        />
                                    </View>
                                    <View style={styles.form_group}>
                                        <Text style={styles.form_label}>Phone:</Text>
                                        <TextInput style={[styles.form_input, (!dataHelper.validatePhone(this.state.userPhone) && this.state.isSubmit) ? styles.input_required : '']}
                                            placeholder=""
                                            onChangeText={(userPhone) => this.setState({userPhone})}
                                            value={this.state.userPhone}
                                        />
                                    </View>
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
                                                        <Text style={ this.state.userGender == data.value ? format.text_genderChoose : format.text_genderNoChoose }>{data.name}</Text>
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
                                                date={dateHelper.convertDate(this.state.userBirthdate)}
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
                                    <View style={styles.form_group}>
                                        <Text style={styles.form_label}>Zip Code:</Text>
                                        <TextInput style={[styles.form_input, ((!dataHelper.validateLength(this.state.userZipCode) || !dataHelper.validateZipCode(this.state.userZipCode)) && this.state.isSubmit) ? styles.input_required : '']}
                                            placeholder="*This field is required!"
                                            onChangeText={(userZipCode) => this.setState({userZipCode})}
                                            value={this.state.userZipCode}
                                        />
                                    </View>
                                    <TouchableOpacity style={styles.form_button} onPress={this._updateProfileAsync}>
                                        <Text style={format.button_save}>Save</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.form_button, styles.button_blue]} onPress={() => navigate('ChangePassword')}>
                                        <Text style={styles.button_text}>Change Password</Text>
                                    </TouchableOpacity>
                                </View>
                        ) : (
                            <View style={styles.container_form}>
                                <Text style={styles.title_form}>
                                    Profile {this.state.isEdit}
                                </Text>
                                <TouchableOpacity style={{position: 'absolute', right: 10, top: 10, borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 30/2,}} onPress={()=> this.setState({isEdit: true})}>
                                    <Image style={{justifyContent: 'center', height: 27, width: 27}} source={require('../../assets/images/icon-edit.png')}/>
                                </TouchableOpacity>
                                <Image style={[styles.image_circle, general.mb30]} source={ this.state.avatarSource ? {uri: this.state.avatarSource} : require('../../assets/images/default-avatar.jpg')}/>
                                {/* <TouchableOpacity style={{backgroundColor: 'transparent', alignSelf: 'center', marginBottom: 20}} onPress={() => navigate('Home')}>
                                    <Text style={{fontSize: 13, color: '#000', fontStyle: 'italic'}}>Tap to change photo</Text>
                                </TouchableOpacity> */}
                                <View style={styles.form_group}>
                                    <Text style={styles.form_label}>First Name:</Text>
                                    <Text style={styles.form_value}>{user.userFirstName}</Text>
                                </View>
                                <View style={styles.form_group}>
                                    <Text style={styles.form_label}>Last Name:</Text>
                                    <Text style={styles.form_value}>{user.userLastName}</Text>
                                </View>
                                <View style={styles.form_group}>
                                    <Text style={styles.form_label}>E-Mail:</Text>
                                    <Text style={styles.form_value}>{user.userEmail}</Text>
                                </View>
                                <View style={styles.form_group}>
                                    <Text style={styles.form_label}>Phone:</Text>
                                    <Text style={styles.form_value}>{user.userPhone}</Text>
                                </View>
                                <View style={styles.form_group}>
                                    <Text style={styles.form_label}>Gender:</Text>
                                    <Text style={styles.form_value}>{this._renderGender(user.userGender)}</Text>
                                </View>
                                <View style={styles.form_group}>
                                    <Text style={styles.form_label}>Birthday:</Text>
                                    <Text style={styles.form_value}>{dateHelper.convertDate(user.userBirthdate)}</Text>
                                </View>
                                <View style={styles.form_group}>
                                    <Text style={styles.form_label}>Zip Code:</Text>
                                    <Text style={styles.form_value}>{user.userZipCode}</Text>
                                </View>
                                <TouchableOpacity style={[styles.form_button, styles.button_blue]} onPress={() => navigate('ChangePassword')}>
                                    <Text style={styles.button_text}>Change Password</Text>
                                </TouchableOpacity>
                            </View>
                            )
                            } 
                            <PopupNotification 
                                visible={this.state.visibleNotification} 
                                buttonText={'Ok'} 
                                closeDisplay={() => { 
                                    this.setState({visibleNotification: false});
                                }}
                                title={this.state.notifyTitle}
                                description={this.state.NotifyText}
                            />
                        </View>
                    </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
        );
    }

    _renderGender(value) {
        return this.state.optionGender.find(item=>item.value === value).name;
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
        console.log('formData', formData);
        this.setState({formDataImage: formData});
    };

    _updateProfileAsync = async () => {
        this.setState({isSubmit: true});
        let data = this.props.userSession.user;
        data.userID = this.state.userID;
        data.userEmail = this.state.userEmail;
        data.userFirstName = this.state.userFirstName;
        data.userLastName = this.state.userLastName;
        data.userPhone = this.state.userPhone;
        data.userGender = this.state.userGender;
        data.userBirthdate = dateHelper.convertDateSendApi(this.state.userBirthdate);
        data.userZipCode = this.state.userZipCode;

        if(!dateHelper.checkDate(data.userBirthdate))
         this.setState({notifyTitle: "Oops. Something's missing!" , NotifyText: 'Select date not later than current date', visibleNotification: true})
        
        if( dataHelper.checkSpecial(data.userFirstName) 
            || dataHelper.checkSpecial(data.userLastName)
            || !dataHelper.validateEmail(data.userEmail)
            || !dataHelper.validateLength(data.userFirstName)
            || !dataHelper.validateLength(data.userLastName)
            || !dataHelper.validateLength(data.userEmail)
            || !dataHelper.validateLength(data.userZipCode)
            || !dataHelper.validateZipCode(data.userZipCode)
            || !dataHelper.validatePhone(data.userPhone)
            || !dateHelper.checkDate(data.userBirthdate)
        ) {
            console.log('err', dateHelper.checkDate(data.userBirthdate));
            return;
        }
        this.setState({loading: true});
        await this.props.updateProfileAction(data);
        await this.props.userSessionAction(this.props.login.token);
        if(this.state.formDataImage){
            await this.props.uploadAvatarAction(this.state.userID, this.state.formDataImage);
            await this.props.getAvatarAction(this.state.userID);
            console.log('this.state.formDataImage', this.state.formDataImage);
        }
            

        let isConnected = await AsyncStorage.getItem('isConnected');

        if(isConnected && !JSON.parse(isConnected)){

            let localStorage = await AsyncStorage.getItem('localStorage');
            localStorage = JSON.parse(localStorage);
            
            localStorage.userSession = JSON.parse(localStorage.userSession);
            let user = localStorage.userSession.user;

            user.userEmail = data.userEmail;
            user.userFirstName = data.userFirstName;
            user.userLastName = data.userLastName;
            user.userPhone = data.userPhone;
            user.userGender = data.userGender;
            user.userBirthdate = data.userBirthdate;
            user.userZipCode = data.userZipCode;

            if(this.state.formDataImage) {
                localStorage.getAvatar = JSON.parse(localStorage.getAvatar);
                localStorage.getAvatar.url = this.state.avatarSource;
                this.props.getAvatar.url = this.state.avatarSource;
                localStorage.getAvatar = JSON.stringify(localStorage.getAvatar);
            }

            localStorage.userSession.user = user;
            this.props.userSession.user = user;
            localStorage.userSession = JSON.stringify(localStorage.userSession);
            await AsyncStorage.setItem('localStorage', JSON.stringify(localStorage));
            // let abc = await AsyncStorage.getItem('persist:root');
            // this.setState({test: abc});
        }
        else {
            if(this.props.updateProfile.error){
                this.setState({loading: false, notifyTitle: "Oops. Something's missing!" , NotifyText: 'Update error. Please try again.', visibleNotification: true})
                return;
            }
        }

        this.setState({loading: false, notifyTitle: 'Bow-Wow! Profile Updated.' , NotifyText: 'Your profile was successfully updated.', visibleNotification: true, isEdit: false})
    }

    _getUser = async() =>{
        this.setState({loading: true});
        let isConnected = await AsyncStorage.getItem('isConnected');
        let user = null;
        let userAvatar = null;
        if(isConnected && !JSON.parse(isConnected)){
            let localStorage = await AsyncStorage.getItem('localStorage');
            localStorage = JSON.parse(localStorage);
            localStorage.userSession = JSON.parse(localStorage.userSession);
            localStorage.getAvatar = JSON.parse(localStorage.getAvatar);
            user = localStorage.userSession.user;
            userAvatar = localStorage.getAvatar.url;
        }
        else {
            // await this.props.userSessionAction(this.props.login.token)
            // if(this.props.userSession && this.props.userSession.user){
            //     user = this.props.userSession.user;
            //     await this.props.getAvatarAction(this.props.userSession.user.userID);
            //     if(this.props.getAvatar.url)
            //         userAvatar = this.props.getAvatar.url;
            // }
            user = this.props.userSession.user;
            userAvatar = this.props.getAvatar.url;
        }
        this.setState({ ...this.state, ...user});
        this.setState({avatarSource: userAvatar, loading: false});
    }
}

const format = StyleSheet.create({
    text_genderChoose: {
        textAlign: 'center',
        fontSize: iOS ? 13 : 16,
        color: '#fff'
    },
    text_genderNoChoose: {
        textAlign: 'center',
        fontSize: iOS ? 13 : 16,
        color: '#000'
    },
    button_save: {
        color: '#fff', 
        fontWeight: '700', 
        fontSize: iOS ? 10 : 13, 
        textAlign: 'center'
    },
    button_changeAvatar: {
        fontSize: iOS ? 10 : 13,
        color: '#000', 
        fontStyle: 'italic', 
        backgroundColor: 'transparent', 
        alignSelf: 'center', 
        marginBottom: 20
    }
})

const mapStateToProps = state => ({
    userSession: state.userSession,
    updateProfile: state.updateProfile,
    uploadAvatar: state.uploadAvatar,
    getAvatar: state.getAvatar,
    userSession: state.userSession,
    login: state.login
});

const mapDispatchToProps = {
    updateProfileAction,
    uploadAvatarAction,
    getAvatarAction,
    userSessionAction
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
