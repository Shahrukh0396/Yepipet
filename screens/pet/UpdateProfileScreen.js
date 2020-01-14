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
    KeyboardAvoidingView,
    Alert,
    ImageEditor,
    AsyncStorage,
    Platform
} from 'react-native';
import {connect} from 'react-redux';
import styles from '../../constants/Form.style';
import { MaterialIcons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-material-dropdown';
import Autocomplete from 'react-native-autocomplete-input';
import DatePicker from 'react-native-datepicker';
import {PetTypes, CatBreeds, DogBreeds, WeightTypes} from '../../static/pets';
import {WeightType} from '../../src/common';
import { dateHelper, dataHelper } from '../../src/helpers';
import PopupNotification from '../../components/PopupNotification';
import updatePetAction from '../../src/apiActions/pet/updatePet';
import uploadAvatarPetAction from '../../src/apiActions/pet/uploadAvatarPet';
import getAvatarPetAction from '../../src/apiActions/pet/getAvatarPet';
import createPetWeightAction from '../../src/apiActions/pet/createPetWeight';
import getPetsByOwnerAction from '../../src/apiActions/pet/getPetsByOwner';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions'
import { iOS } from '../../src/common';

class UpdateProfileScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrGender: [{name: 'Male', value: 'M'}, {name: 'Female', value: 'F'}, {name: 'Unknown', value: 'U'}],
            arrNeutered: [{name: 'Yes', value: 'Y'}, {name: 'No', value: 'N'}, {name: 'Unknown', value: 'U'}],
            arrWeight: WeightTypes,
            arrBreed: [],
            avatarSource: null,
            petID: null,
            petName: null,
            petType: '',
            petBreed: '',
            petGender: '',
            petBirthDate: null,
            petNeutered: '',
            petWeight: null,
            petWeightUnit: '',
            petMixBreedOne: '', 
            petMixBreedTwo: '', 
            petCustomType: '',
            hideResults: true,
            hideResultsOne: true,
            hideResultsTwo: true,
            visibleNotification: false,
            errorText: '',
            titleNotification: '',
            isNegative: false,
            formDataImage: null,
            loading: false
        }
    }

    componentWillMount() {
        const {petDetail, petWeight} = this.props.navigation.state.params;
        if(petDetail)
            this.setState({
                petID: petDetail.petID,
                petName: petDetail.petName,
                petType: petDetail.petType,
                petGender: petDetail.petGender,
                petBirthDate: dateHelper.convertDate(petDetail.petBirthdate),
                petNeutered: petDetail.petNeutered,
                petWeight: petWeight || '0.00',
                petWeightUnit: petDetail.petWeightUnit,
                avatarSource: petDetail.petPortraitURL
            }, () =>{
                if(this.state.petType)
                    this._handleChangePetType(this.state.petType);
            })
    }

    render() {
        const {
            petName, 
            petType, 
            petGender, 
            petBirthDate,
            petNeutered, 
            petWeight, 
            petWeightUnit,
            arrWeight,
            arrGender,
            arrNeutered,
            visibleNotification,
            isNegative,
            avatarSource,
            loading
        } = this.state;

        const {navigate} = this.props.navigation;
        const {petDetail} = this.props.navigation.state.params;
        let ageMonth = this._calculateMonthWithoutYears(petDetail.ageInDaysWithoutYears);

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
                            <View style={{position:'relative', paddingBottom: 22,justifyContent: 'center', alignContent: 'center'}}>
                                <TouchableOpacity style={styles.button_back} onPress={() => navigate('PetManagement')}>
                                    <Image style={{width: 12, height: 21}} source={require('../../assets/images/icon-back.png')}/>
                                </TouchableOpacity>
                                <Text style={[styles.title_head, {alignSelf: 'center'}]}> Update Profile </Text>
                            </View>
                            <View style={styles.group_avatar}>
                                <View style={{alignItems: 'center'}}>
                                    <Image 
                                        style={styles.image_circle} 
                                        source={avatarSource ? {uri: avatarSource} : require('../../assets/images/img-pet-default.png')}
                                    />
                                    <View style={{flexDirection:'row', flexWrap:'wrap', marginBottom: 8, alignItems: 'stretch'}}>
                                        <Text style={styles.pet_name}>{petDetail.petName}</Text>
                                        <Text style={styles.pet_info}>
                                            {petDetail && petDetail.ageInYears} {petDetail.ageInYears > 1 ? `Years` : `Year`} { petDetail.ageMonth ? petDetail.ageMonth > 1 ? `${petDetail.ageMonth} Months` : `${petDetail.ageMonth} Month` : null }
                                        </Text>
                                    </View>
                                    <Text 
                                        style={[format.text_uppercase, {marginTop: 20}]}
                                        onPress={this._chooseOption}
                                    >   
                                        Tap to change photo
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.container_form}>
                                <View style={{marginBottom: 20}}>
                                    <Text style={styles.form_label_small}>Pet name</Text>
                                    <TextInput 
                                        style={styles.form_input} 
                                        placeholder="" 
                                        value={petName}
                                        onChangeText={(petName) => this.setState({petName})}
                                    />
                                </View>
                                <View style={{marginBottom: 20}}>
                                    <Text style={styles.form_label_small}>Type</Text>
                                    <Dropdown
                                        data={PetTypes}
                                        value={petType}
                                        labelFontSize={16}
                                        dropdownOffset={{top: 0, left: 0}}
                                        inputContainerStyle={styles.form_dropdown}
                                        rippleInsets={{top: 0, bottom: -4 }}
                                        onChangeText={(value) => {this._handleChangePetType(value)}}
                                    />
                                </View>
                                {this._renderComponentBreed()}
                                <View style={{marginBottom: 20}}>
                                    <Text style={styles.form_label_small}>Gender</Text>
                                    <View style={styles.group_radio}>
                                        {arrGender.map((data, i) => {
                                            return(
                                                <TouchableOpacity 
                                                    key={data.value} 
                                                    style={[
                                                        styles.btn_radio,
                                                        petGender == data.value ? styles.btn_radio_active : {},
                                                        {flex: 1/(arrGender.length)},
                                                        i === 0 ? styles.btn_radio_noborder : {}
                                                    ]}
                                                    onPress={()=>{this.setState({petGender: data.value})}}
                                                >
                                                    <Text style={petGender === data.value ? format.text_Choose : format.text_NoChoose}>{data.name}</Text>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </View>
                                <View style={{marginBottom: 20}}>
                                    <Text style={styles.form_label_small}>Birthdate</Text>
                                    <View style={styles.form_datepicker} >
                                        <DatePicker
                                            style={{width: '100%'}}
                                            date={petBirthDate}
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
                                            onDateChange={(date) => {this.setState({petBirthDate: date})}}
                                        />
                                    </View>
                                </View>
                                <View style={{marginBottom: 20}}>
                                    <Text style={styles.form_label_small}>Neutered</Text>
                                    <View style={styles.group_radio}>
                                        {arrNeutered.map((data, i) => {
                                            return(
                                                <TouchableOpacity 
                                                    key={data.value} 
                                                    style={[
                                                        styles.btn_radio,
                                                        petNeutered == data.value ? styles.btn_radio_active : {},
                                                        {flex: 1/(arrNeutered.length)},
                                                        i === 0 ? styles.btn_radio_noborder : {}
                                                    ]}
                                                    onPress={()=>{this.setState({petNeutered: data.value})}}
                                                >
                                                    <Text style={petNeutered === data.value ? format.text_Choose : format.text_NoChoose}>{data.name}</Text>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </View>
                                <View>
                                    <Text style={styles.form_label_small}>Weight</Text>
                                    <View style={styles.form_group}>
                                        <TextInput 
                                            contextMenuHidden={true}
                                            keyboardType={'numeric'} 
                                            style={[styles.form_input, {flex: 0.6, marginRight: 16}]} 
                                            value={petWeight}
                                            onChangeText={(petWeight) => this.setState({petWeight: petWeight.replace(',', '.')})}
                                        />
                                        <View style={[styles.group_radio, {flex: 0.4}]}>
                                            {arrWeight.map((data, i) => {
                                                return(
                                                    <TouchableOpacity 
                                                        key={data.value} 
                                                        style={[
                                                            styles.btn_radio,
                                                            petWeightUnit === data.value ? styles.btn_radio_active : {},
                                                            {flex: 1/(arrWeight.length)},
                                                            i === 0 ? styles.btn_radio_noborder : {}
                                                        ]}
                                                        onPress={()=> this._convertWeight(data.value)}
                                                        disabled={petWeightUnit === data.value}
                                                    >
                                                        <Text style={petWeightUnit === data.value ? format.text_Choose : format.text_NoChoose}>{data.name}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })}
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.form_button} onPress={this._updatePet}>
                                <Text style={styles.button_text}>Save</Text>
                            </TouchableOpacity>

                            <PopupNotification 
                                visible={visibleNotification} 
                                buttonText={'Ok'} 
                                closeDisplay={this._closeNotification}
                                title={this.state.titleNotification}
                                description={this.state.errorText}
                                isNegative={isNegative}
                            />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        );
    }

    _handleChangePetType = (value) => {
        const {petDetail} = this.props.navigation.state.params;
        this.setState({petType: value});
        if(this.state.petType === 'Cat')
            this.setState({arrBreed: CatBreeds, petCustomType: '', petBreed: '', petMixBreedOne: '', petMixBreedTwo: ''});
        else if(this.state.petType === 'Dog')
            this.setState({arrBreed: DogBreeds, petCustomType: '', petBreed: ''});
        else this.setState({arrBreed: [], petBreed: '', petMixBreedOne: '', petMixBreedTwo: ''});

        if(this.state.petType === petDetail.petType)
            this.setState({
                petCustomType: petDetail.petCustomType,
                petBreed: petDetail.petBreed,
                petMixBreedOne: petDetail.petMixBreedOne,
                petMixBreedTwo: petDetail.petMixBreedTwo
            })
    }

    _renderComponentBreed() {
        const {petType, arrBreed, petBreed, petMixBreedOne, petMixBreedTwo, hideResults, hideResultsOne, hideResultsTwo} = this.state;
        let arrResult = [];
        let arrResultOne = [];
        let arrResultTwo = [];
        let arrBreedChild = arrBreed.slice(3);

        if (petBreed)
            arrResult = arrBreed.filter(item => item.value.includes(petBreed));

        if (petMixBreedOne)
            arrResultOne = arrBreedChild.filter(item => item.value.includes(petMixBreedOne));

        if (petMixBreedTwo)
            arrResultTwo = arrBreedChild.filter(item => item.value.includes(petMixBreedTwo)); 
            
        if(petType !== 'Others')
            return(
                <View>
                    <View style={{marginBottom: 20}}>
                        <Text style={styles.form_label_small}>Breed</Text>
                        <Autocomplete
                            data={arrResult}
                            defaultValue={petBreed}
                            onChangeText={text => this.setState({ petBreed: text, hideResults: false })}
                            inputContainerStyle={styles.autocompleteInput}
                            hideResults={hideResults}
                            listStyle={styles.autocompletelistStyle}
                            renderItem={({ item, i }) => (
                            <TouchableOpacity style={styles.autocompleteItem} key={i} onPress={() => {this.setState({ petBreed: item.value, petMixBreedOne: '', petMixBreedTwo: '', hideResults: true })}}>
                                <Text>{item.value}</Text>
                            </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    {(petBreed.includes('Mixed') && hideResults) ? (
                        <View>
                        <View style={{marginBottom: 20}}>
                            <Text style={styles.form_label_small}>Breed(1)</Text>
                            <Autocomplete
                                data={arrResultOne}
                                defaultValue={petMixBreedOne}
                                onChangeText={text => this.setState({ petMixBreedOne: text, hideResultsOne: false })}
                                inputContainerStyle={styles.autocompleteInput}
                                hideResults={hideResultsOne}
                                listStyle={styles.autocompletelistStyle}
                                renderItem={({ item, i }) => (
                                <TouchableOpacity style={styles.autocompleteItem} key={i} onPress={() => {this.setState({ petMixBreedOne: item.value, hideResultsOne: true })}}>
                                    <Text>{item.value}</Text>
                                </TouchableOpacity>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                        <View style={{marginBottom: 20}}>
                            <Text style={styles.form_label_small}>Breed(2)</Text>
                            <Autocomplete
                                data={arrResultTwo}
                                defaultValue={petMixBreedTwo}
                                onChangeText={text => this.setState({ petMixBreedTwo: text, hideResultsTwo: false })}
                                inputContainerStyle={styles.autocompleteInput}
                                hideResults={hideResultsTwo}
                                listStyle={styles.autocompletelistStyle}
                                renderItem={({ item, i }) => (
                                <TouchableOpacity style={styles.autocompleteItem} key={i} onPress={() => {this.setState({ petMixBreedTwo: item.value, hideResultsTwo: true })}}>
                                    <Text>{item.value}</Text>
                                </TouchableOpacity>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </View>
                    ) : (null)}
                </View>
            )
        else
            return(
                <View style={{marginBottom: 20}}>
                    <Text style={styles.form_label_small}>Breed</Text>
                    <TextInput 
                        style={styles.form_input} 
                        placeholder="" 
                        onChangeText={(petCustomType) => this.setState({petCustomType})}
                    />
                </View>
            )
    }

    _calculateMonthWithoutYears = (day) => {
        if(day)
            return Math.round(day /30);
        return 0;
    }

    _convertWeight(value) {
        let weight = 0;
        let petWeight = this.state.petWeight;
        this.setState({petWeightUnit: value}, () => {
            if(this.state.petWeightUnit === WeightType.Lb)
                weight = dataHelper.convertWeightToLb_n(petWeight);
            else weight = dataHelper.convertWeightToKg_n(petWeight);
            this.setState({petWeight: weight});
        }); 
    }

    _updatePet = async () =>{
        // this.setState({loading: true});
        const {params} = this.props.navigation.state;
        const {petDetail} = this.props.navigation.state.params;
        const {
            petName, 
            petCustomType, 
            petType, 
            petBreed, 
            petMixBreedOne, 
            petMixBreedTwo, 
            petGender, 
            petBirthDate, 
            petNeutered,
            petWeight, 
            petWeightUnit,
            petID
        } = this.state;
        if(!petName.trim()){
            this.setState({
                titleNotification: 'Oops, ~ Pet name cannot be empty.',
                isNegative: true,
                visibleNotification: true
            });
            return;
        }
        if(!petBreed.trim()){
            this.setState({
                titleNotification: 'Oops, ~ Pet breed cannot be empty.',
                isNegative: true,
                visibleNotification: true
            });
            return;
        }
        if(!dateHelper.checkDate(petBirthDate)){
            this.setState({
                titleNotification: 'Oops~ Please enter a valid birth date.',
                isNegative: true,
                visibleNotification: true
            });
            return;
        }
        let data = {...petDetail};
        data.userID = this.props.userSession.user.userID;
        data.petID = petID;
        data.petName = petName;
        data.petCustomType = petCustomType;
        data.petType = petType;
        data.petBreed = petBreed;
        data.petMixBreedOne = petMixBreedOne;
        data.petMixBreedTwo = petMixBreedTwo;
        data.petGender = petGender;
        data.petBirthdate = dateHelper.convertDateSendApi(petBirthDate);
        data.petNeutered = petNeutered;
        data.petWeightUnit = petWeightUnit;

        let isConnected = await AsyncStorage.getItem('isConnected');
        if(isConnected && !JSON.parse(isConnected)){
            let persist = await AsyncStorage.getItem('persist:root');
            persist = JSON.parse(persist);
            persist.getPetsByOwner = JSON.parse(persist.getPetsByOwner);
            let listPet = persist.getPetsByOwner.list;
            console.log('listPet',  typeof listPet);
            listPet.forEach(item => {
                if(item.petID === data.petID){
                    item.petName = data.petName;
                    item.petCustomType = data.petCustomType;
                    item.petType = data.petType;
                    item.petBreed = data.petBreed;
                    item.petMixBreedOne = data.petMixBreedOne;
                    item.petMixBreedTwo = data.petMixBreedTwo;
                    item.petGender = data.petGender;
                    item.petBirthDate = data.petBirthDate;
                    item.petNeutered = data.petNeutered;
                    item.petWeightUnit = data.petWeightUnit;
                    return;
                }
            });
            persist.getPetsByOwner.list = listPet;
            persist.getPetsByOwner = JSON.stringify(persist.getPetsByOwner);
            await AsyncStorage.setItem('persist:root', JSON.stringify(persist));
        }
        else {
            await this.props.updatePetAction(data);

            if(this.props.updatePet.error){
                this.setState({
                    isNegative: true,
                    titleNotification: "Error",
                    errorText: "Update Pet failed. Please try again.",
                    visibleNotification: true
                });
                return;
            }

            if(this.props.updatePet.data){
                if(this.state.formDataImage) {
                    await this.props.uploadAvatarPetAction(petID, this.state.formDataImage);

                    if(this.props.uploadAvatarPet.url) {
                        await this.props.getAvatarPetAction(petID);

                        if(this.props.getAvatarPet.url)
                            this.setState({ avatarSource: this.props.getAvatarPet.url });
                    }
                }

                if(params.petWeight && Number(params.petWeight) !== Number(petWeight)){
                    let dataWeight = {
                        petID: petID,
                        petWeightDate: new Date().toUTCString(),
                        petWeightEnteredBy: this.props.userSession.user.userID,
                        petWeightValue: petWeightUnit === WeightType.Lb ? Number(dataHelper.convertWeightToKg(petWeight)) : Number(petWeight)
                    };
                    await this.props.createPetWeightAction(dataWeight);
                }
                await this.props.getPetsByOwnerAction(this.props.userSession.user.userID);
            }
        }

        this.setState({
            loading: false,
            isNegative: false,
            titleNotification: "Yepi! Pet Profile Updated.",
            errorText: `${petName}'s profile has been successfully updated.`,
            visibleNotification: true
        });
    }

    _closeNotification = () =>{
        this.setState({visibleNotification: false});
        if(!this.state.isNegative)
            this.props.navigation.navigate('PetManagement', {petDetail: this.props.updatePet.data, petWeight: this.state.petWeight});
    }

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

    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
    };

    _pickImage = async (choose) => {

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
        console.log('avatarSource', this.state.avatarSource);
    };
}

const mapStateToProps = state => ({
    updatePet: state.updatePet,
    userSession: state.userSession,
    getAvatarPet: state.getAvatarPet,
    uploadAvatarPet: state.uploadAvatarPet,
    createPetWeight: state.createPetWeight
});

const mapDispatchToProps = {
    updatePetAction,
    uploadAvatarPetAction,
    getAvatarPetAction,
    createPetWeightAction,
    getPetsByOwnerAction
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfileScreen);

const format = StyleSheet.create({
    text_uppercase: {
        textTransform: 'uppercase',
        fontSize: Platform.OS === 'ios' ? 10 : 13,
        fontWeight: '600',
        color: '#4e94b2'
    },

    text_NoChoose: {
        textAlign: 'center', 
        fontSize: iOS ? 13 : 16,
        color: '#000'
    },
    text_Choose: {
        textAlign: 'center',
        fontSize: iOS ? 13 : 16,
        color: '#fff'
    },
});