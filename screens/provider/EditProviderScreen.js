import React from 'react';
import {connect} from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Image,
    ScrollView,
    FlatList,
    KeyboardAvoidingView,
    TextInput
} from 'react-native';
import styles from '../../constants/Form.style';
import { MaterialIcons, EvilIcons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-material-dropdown';
import {GMapAPIKey} from '../../src/common'
import updateProviderAction from '../../src/apiActions/provider/updateProvider';
import getProvidersByOwnerAction from '../../src/apiActions/provider/getProvidersByOwner';
import PopupNotification from '../../components/PopupNotification';
import {dataHelper} from '../../src/helpers';

class EditProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrPrefix: [
                {value: 'Dr.'},
                {value: 'Ms.'},
                {value: 'Miss.'},
                {value: 'Mrs.'},
                {value: 'Mr.'}
            ],
            cpType: null,
            cpLongName: null,
            cpPrefix: null,
            cpOrganization: null,
            cpTelephone: null,
            cpAddress: null,
            cpEmail: null,
            linkPhoto: null,
            loading: false,
            visibleNotify: false,
            titleNotify: '',
            textNotify: '',
            isNegative: false,
            errLongName: null,
            errTelephone: null,
            errAddress: null,
            errEmail: null,
            data: null
        }
    }

    componentWillMount() {
        const {dataProvider} = this.props.navigation.state.params;
        this.setState({
            cpLongName: dataProvider.cpLongName,
            cpPrefix: null,
            cpOrganization: null,
            cpTelephone: dataProvider.cpTelephone,
            cpAddress: dataProvider.cpAddress,
            cpEmail: dataProvider.cpEmail,
            data: {...dataProvider}
        });
        this._getPhotoProvider();
    }

    render() {
        const {dataProvider, photosProvider} = this.props.navigation.state.params;
        const {
            cpLongName,
            cpPrefix,
            cpOrganization,
            cpTelephone,
            cpAddress,
            cpEmail,
            linkPhoto,
            arrPrefix,
            loading,
            visibleNotify,
            titleNotify,
            textNotify,
            isNegative,
            errLongName,
            errAddress,
            errEmail,
            errTelephone
        } = this.state;

        return (
            <KeyboardAvoidingView
                behavior="padding"
                enabled 
                style={{ flex: 1 }}
            >
                <SafeAreaView style={styles.safeArea}>
                    <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                        <Spinner visible={loading}/>
                        <View style={styles.container}>
                            <View style={{position:'relative', paddingBottom: 22, paddingTop: 25, justifyContent: 'center'}}>
                                <TouchableOpacity style={styles.button_back} onPress={() => this.props.navigation.goBack()}>
                                    <Image style={{width: 12, height: 21}} source={require('../../assets/images/icon-back.png')}/>
                                </TouchableOpacity>
                                <Text style={[styles.title_head, {alignSelf: 'center'}]}>Edit Provider</Text>
                            </View>

                            <View style={[styles.container_form, {marginBottom: 21}]}>
                                <View style={{marginBottom: 20, justifyContent: 'center', alignItems: 'center'}}>
                                    <Image 
                                        style={{width: 200, height: 150}}
                                        source={{uri: linkPhoto}}
                                        resizeMode="cover"
                                    />
                                </View>
                                <Text style={[styles.title_container, {textDecorationLine: 'underline'}]}>Provider:</Text>
                                <View style={{marginBottom: 20}}>
                                    <Text style={styles.form_label_small}>Name</Text>
                                    <TextInput 
                                        style={[styles.form_input, errLongName ? styles.form_input_error : null]} 
                                        value={cpLongName}
                                        onChangeText={(cpLongName) => this.setState({cpLongName})}
                                    />
                                </View>
                                {errLongName ? <Text style={styles.form_label_error}>{errLongName}</Text> : null}
                                {/* <View style={{marginBottom: 20}}>
                                    <Text style={[styles.form_label, {flex: 1,width: '25%'}]}>Prefix</Text>
                                    <View style={{width: '75%'}}>
                                        <Dropdown
                                            data={arrPrefix}
                                            labelFontSize={16}
                                            dropdownOffset={{top: 0, left: 0}}
                                            inputContainerStyle={styles.form_dropdown}
                                            rippleInsets={{top: 0, bottom: -4 }}
                                            onChangeText={(value) => {this._handleChangePrefix(value)}}
                                        />
                                    </View>
                                </View> */}
                                {/* <View style={{marginBottom: 20}}>
                                    <Text style={[styles.form_label, {flex: 1,width: '25%'}]}>Organization</Text>
                                    <View style={{width: '75%'}}>
                                        <TextInput 
                                            style={styles.form_input} 
                                            value={providerOrganization}
                                            onChangeText={() => this.setState({providerOrganization})}
                                        />
                                    </View>
                                </View> */}
                                <View style={{marginBottom: 20}}>
                                    <Text style={styles.form_label_small}>Telephone</Text>
                                    <TextInput 
                                        keyboardType='numeric'
                                        style={[styles.form_input, errTelephone ? styles.form_input_error : null]} 
                                        value={cpTelephone}
                                        maxLength={15}
                                        onChangeText={(cpTelephone) => this.setState({cpTelephone})}
                                    />
                                </View>
                                {errTelephone ? <Text style={styles.form_label_error}>{errTelephone}</Text> : null}
                                <View style={{marginBottom: 20}}>
                                    <Text style={styles.form_label_small}>Address</Text>
                                    <TextInput 
                                        style={[styles.form_input, errAddress ? styles.form_input_error : null]} 
                                        value={cpAddress}
                                        onChangeText={(cpAddress) => this.setState({cpAddress})}
                                    />
                                </View>
                                {errAddress ? <Text style={styles.form_label_error}>{errAddress}</Text> : null}
                                <View style={{marginBottom: 20}}>
                                    <Text style={styles.form_label_small}>E-Mail</Text>
                                    <TextInput 
                                        style={[styles.form_input, errEmail ? styles.form_input_error : null]} 
                                        value={cpEmail}
                                        onChangeText={(cpEmail) => this.setState({cpEmail})}
                                    />
                                </View>
                                    {errEmail ? <Text style={styles.form_label_error}>{errEmail}</Text> : null}
                            </View>
                            <TouchableOpacity style={styles.form_button} onPress={this._save}>
                                <Text style={styles.button_text}>Save</Text>
                            </TouchableOpacity>

                            <PopupNotification 
                                visible={visibleNotify} 
                                buttonText={'Ok'} 
                                closeDisplay={this._closeNotification}
                                title={titleNotify}
                                description={textNotify}
                                isNegative={isNegative}
                            />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        )
    }

    _handleChangeType(value) {
        this.setState({
            providerType: value
        })
    }

    _handleChangePrefix(value) {
        this.setState({
            providerPrefix: value
        })
    }

    _getPhotoProvider = () => {
        const {photosProvider} = this.props.navigation.state.params;
        if(photosProvider)
            this.setState({
                linkPhoto: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=${photosProvider[0].photo_reference}&key=${GMapAPIKey}`
            })
    }

    _save = () => {
        this.setState({loading: true} , async() => {
            if(!this._validateData()){
                this.setState({loading: false});
                console.log('validate');    
                return;
            }
            const {dataProvider} = this.props.navigation.state.params;
            const {cpLongName, cpTelephone, cpEmail, cpAddress} = this.state;
            let dataUpdate = {...dataProvider};
            dataUpdate.cpLongName = cpLongName;
            dataUpdate.cpTelephone = cpTelephone;
            dataUpdate.cpAddress = cpAddress;
            dataUpdate.cpEmail = cpEmail;
            await this.props.updateProviderAction(dataUpdate);
            if(this.props.updateProvider.error){
                this.setState({
                    loading: false,
                    isNegative: true,
                    titleNotify: 'Error',
                    textNotify: "Something's wrong!. Please try again.",
                    visibleNotify: true
                });
                return;
            }
            if(this.props.updateProvider.data){
                await this.props.getProvidersByOwnerAction(this.props.userSession.user.userID);
                this.setState({
                    data: dataUpdate,
                    loading: false,
                    isNegative: false,
                    titleNotify: 'Yepi! Successfully Updated.',
                    textNotify: "",
                    visibleNotify: true
                });
            }
        })
    }

    _validateData = () => {
        const {cpLongName, cpTelephone, cpEmail, cpAddress} = this.state;
        let errLongName = null;
        let errAddress = null;
        let errTelephone = null;
        let errEmail = null;

        if(!cpLongName)
            errLongName = 'Name cannot be empty';
        else if(cpLongName.trim() == "")
            errLongName = 'Name cannot has only spaces ';
        else if(cpLongName.toString().length > 500 )
            errLongName = 'Name cannot have more than 500 characters';
        else errLongName = '';

        if(!cpTelephone)
            errTelephone = 'Telephone cannot be empty';
        else if (cpTelephone.length < 10)
            errTelephone = 'Telephone must be 10 character or higher';
        else if (cpTelephone.length > 15)
            errTelephone = 'Telephone must between 10 - 15 character';
        else if(cpTelephone.trim() == "")
            errTelephone = 'Telephone cannot has only spaces.';
        else errTelephone = '';

        if(!cpAddress)
            errAddress = 'Address name cannot be empty';
        else if(cpAddress.trim() == "")
            errAddress = 'Address cannot has only spaces ';
        else if(cpAddress.toString().length > 500 )
            errAddress = 'Address cannot have more than 500 characters';
        else errAddress = '';

        if(!dataHelper.validateLength(cpEmail))
            errEmail = 'Email cannot be empty and have more than 50 characters';
        else if(!dataHelper.validateEmail(cpEmail))
            errEmail = 'Email format is incorrect.';
        else errEmail = '';
        this.setState({errLongName, errAddress, errTelephone, errEmail});
        if(!errLongName && !errAddress && !errTelephone && !errEmail)
            return true;
        else return false;
    }

    _closeNotification = () => {
        this.setState({visibleNotify: false});
        if(!this.state.isNegative){
            this.props.navigation.navigate('CareProviderDetail', {dataProvider: this.state.data});
            console.log('!this.state.isNegative', this.state.isNegative)
        }
    }
}
const mapStateToProps = state =>({
    updateProvider: state.updateProvider,
    userSession: state.userSession,
})

const mapDispatchToProps = {
    updateProviderAction,
    getProvidersByOwnerAction
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProvider);