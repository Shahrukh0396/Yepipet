import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import {Alert, ImageEditor} from 'react-native';
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
    Platform
} from 'react-native';
import styles from '../../constants/Form.style';
import { EvilIcons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Dropdown } from 'react-native-material-dropdown';
import Autocomplete from 'react-native-autocomplete-input';
import DatePicker from 'react-native-datepicker';
import {dateHelper, dataHelper} from '../../src/helpers';
import PopupNotification from '../../components/PopupNotification';
import {connect} from 'react-redux';
import createPetAction from '../../src/apiActions/pet/createPet';
import getAvatarPetAction from '../../src/apiActions/pet/getAvatarPet';
import uploadAvatarPetAction from '../../src/apiActions/pet/uploadAvatarPet';
import createPetWeightAction from '../../src/apiActions/pet/createPetWeight';
import updatePetAction from '../../src/apiActions/pet/updatePet';
import getPetsByOwnerAction from '../../src/apiActions/pet/getPetsByOwner';
import {PetTypes, CatBreeds, DogBreeds, WeightTypes} from '../../static/pets';
import {WeightType, iOS} from '../../src/common';
class createPet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // arrType: PetTypes,
            avatarSource: null,
            arrGender: [{name: 'Male', value: 'M'}, {name: 'Female', value: 'F'}, {name: 'Unknown', value: 'U'}],
            arrNeutered: [{name: 'Yes', value: 'Y'}, {name: 'No', value: 'N'}, {name: 'Unknown', value: 'U'}],
            arrWeight: WeightTypes,
            arrProvider: [
                {value: 'Petplan'},
                {value: '24PetWatch'},
                {value: 'AKC'},
                {value: 'ASCPA'},
                {value: 'Embrace'},
                {value: 'Figo'},
                {value: 'Hartville'},
                {value: 'HealthPaws'},
                {value: 'Nationwide'},
                {value: 'PetFirst'},
                {value: 'PetPremium'},
                {value: 'PetBest'},
                {value: 'Trupanion'}
            ],
            arrBreed: [],
            arrBreedOne: [],
            arrBreedTwo: [],
            petType: '',
            petCustomType: '',
            petName: '',
            petGender: 'M',
            petBirthDate: '',
            petNeutered: 'Y',
            petWeight: '',
            petWeightUnit: 'lb',
            petTag: '',
            insuranceProvider: '',
            policyNumber: '',
            modalVisible: false,
            titleNotification: '',
            descriptionNotification: '',
            titleColor: '#000',
            petBreed: '',
            petMixBreedOne: '',
            petMixBreedTwo: '',
            hideResults: false,
            hideResultsOne: false,
            hideResultsTwo: false,
            formDataImage: null,
            isSubmit: false,
            isNegative: false
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", async () => {
            // console.log('this.props.navigation.state.params.petUpdat', this.props.navigation.state.params&&this.props.navigation.state.params.petUpdate);
            if(this.props.navigation.state.params && this.props.navigation.state.params.petUpdate){
                this.setState({
                    petBirthDate: dateHelper.convertDate(this.props.navigation.state.params.petUpdate.petBirthdate),
                    avatarSource: this.props.navigation.state.params.avatar
                }, () => {
                    console.log('petBirthDate', this.state.petBirthDate);
                });
                
            }
        });
    }
    
    componentWillUnmount() {
        this.focusListener.remove();
    }

    render() {
        const {navigate} = this.props.navigation;
        const {
            arrBreed,
            arrGender, 
            arrNeutered,
            arrWeight,
            arrProvider,
            modalVisible,
            petGender,
            petBirthDate,
            petNeutered,
            petWeightUnit,
            titleNotification,
            descriptionNotification,
            titleColor,
            petWeight,
            insuranceProvider
        }  = this.state;
        
        return (
            <KeyboardAvoidingView 
                behavior="padding"
                enabled 
                style={{ flex: 1 }}
            >
                <SafeAreaView style={styles.safeArea}>
                    <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                        <Spinner visible={this.props.createPet.loading || this.props.uploadAvatarPet.loading}/>
                        <View style={styles.container}>
                            <View style={{position:'relative', paddingBottom: 22,justifyContent: 'center', alignContent: 'center'}}>
                                <TouchableOpacity style={styles.button_back} onPress={() => navigate('UserManage', {petCreated: null})}>
                                    <Image style={{width: 12, height: 21}} source={require('../../assets/images/icon-back.png')}/>
                                </TouchableOpacity>
                                <Text style={[styles.title_head, {alignSelf: 'center'}]}> Add a Pet </Text>
                            </View>
                            <View style={styles.group_avatar}>
                                <TouchableOpacity onPress={this._chooseOption} style={{alignItems: 'center'}}>
                                    <Image style={format.pet_avatar} source={ this.state.avatarSource ? {uri: this.state.avatarSource} : require('../../assets/images/img-pet-default.png')}/>
                                    <Text style={[format.text_uppercase, {marginTop: 20}]}>Change photo</Text>                                
                                </TouchableOpacity>
                            </View>
                            <View style={{marginBottom: 20}}>
                                <Text style={styles.form_label_small}>Pet name</Text>
                                <TextInput 
                                    style={[styles.form_input, (!this.state.petName && this.state.isSubmit) ? styles.input_required : '']} 
                                    placeholder="" 
                                    onChangeText={(petName) => this.setState({petName})}
                                />
                            </View>
                            {(this.state.isSubmit && !this.state.petName) ? (<Text style={styles.form_label_error}>Oops, ~ Pet name cannot be empty.</Text>) : null}
                            <View style={{marginBottom: 20}}>
                                <Text style={styles.form_label_small}>Type</Text>
                                <Dropdown
                                    data={PetTypes}
                                    fontSize={iOS ? 13 : 16}
                                    // labelFontSize={iOS ? 13 : 16}
                                    dropdownOffset={{top: 0, left: 0}}
                                    inputContainerStyle={[styles.form_dropdown, (!this.state.petType && this.state.isSubmit) ? styles.dropdown_required : '']}
                                    rippleInsets={{top: 0, bottom: -4 }}
                                    onChangeText={(value) => {this.handleChangePetType(value)}}
                                    // containerStyle={{ top: 5 }}
                                />
                            </View>
                            {(this.state.isSubmit && !this.state.petType) ? (<Text style={styles.form_label_error}>Oops, ~ Pet type cannot be empty.</Text>) : null}

                            {/*  Render Auto Component Breed */}
                            {this._renderComponentBread()}   

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
                                                    i === 0 ? styles.btn_radio_noborder : {},
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
                                <View style={[ styles.form_datepicker ]} >
                                    <DatePicker
                                        date={petBirthDate}
                                        mode="date"
                                        placeholder="   /   /"
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
                                            padding: 9,
                                        }
                                        }}
                                        iconComponent={
                                            <Image 
                                                style={{width: 15, height: 16, marginRight: 20}}
                                                source={require('../../assets/images/icon-date.png')}
                                            />
                                        }
                                        onDateChange={(date) => {this.setState({petBirthDate: date})}}
                                        style={{ width: '100%' }}
                                    />
                                </View>
                            </View>
                            {/* {(this.state.isSubmit && !this.state.petBirthDate) ? (<Text style={styles.form_label_error}>Oops, ~ Brithday cannot be empty.</Text>) : null} */}
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
                            <View style={{marginBottom: 20}}>
                                <Text style={styles.form_label_small}>Weight</Text>
                                <View style={styles.form_group}>
                                    <TextInput 
                                        contextMenuHidden={true}
                                        keyboardType='numeric'
                                        style={[styles.form_input, {flex: 0.6, marginRight: 16}]} 
                                        placeholder="" 
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
                                                    onPress={()=>this._convertWeight(data.value)}
                                                >
                                                    <Text style={petWeightUnit === data.value ? format.text_Choose : format.text_NoChoose}>{data.name}</Text>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </View>
                            </View>
                            {/* {(this.state.isSubmit && !this.state.petWeight) ? (<Text style={styles.form_label_error}>Oops, ~ Weight cannot be empty.</Text>) : null} */}
                            <View style={{marginBottom: 10}}>
                                <Text style={styles.form_label_small}>Tag</Text>
                                <TextInput style={styles.form_input} placeholder="" onChangeText={(petTag) => this.setState({petTag})}/>
                            </View>
                            <Text style={format.text_policy}>Select your insurance provider & enter your Pet's policy 
                                number - 
                                <Text style={{fontWeight: '700'}} onPress={this._showInfomationOption}>Optional <MaterialIcons name="help" color="#000" size={30}/></Text>
                            </Text>
                            <View style={{marginBottom: 20}}>
                                <Text style={styles.form_label_small}>Insurance provider</Text>
                                <Dropdown
                                    data={arrProvider}
                                    fontSize={iOS ? 13 : 16}
                                    labelFontSize={iOS ? 13 : 16}
                                    dropdownOffset={{top: 0, left: 0}}
                                    inputContainerStyle={[styles.form_dropdown]}
                                    rippleInsets={{top: 0, bottom: -4 }}
                                    onChangeText={(value, index, arrProvider) =>{this.setState({insuranceProvider: value})}}
                                />
                            </View>
                            {/* {(this.state.isSubmit && !this.state.insuranceProvider) ? (<Text style={styles.form_label_error}>Oops, ~ Insurance provider cannot be empty.</Text>) : null} */}
                            <View style={{marginBottom: 10}}>
                                <Text style={styles.form_label_small}>Enter policy number</Text>
                                <TextInput 
                                    style={styles.form_input} 
                                    placeholder="" 
                                    onChangeText={(policyNumber) => this._handleChangePolicyNumber(policyNumber)}
                                    editable={insuranceProvider ? true : false}
                                    placeholder={ insuranceProvider ? null : 'Choose Insurance Provider' }
                                />
                            </View>
                            <TouchableOpacity style={styles.form_button} onPress={this._createNewPet}>
                                <Text style={styles.button_text}>Add Pet</Text>
                            </TouchableOpacity>
                    
                            <PopupNotification 
                                visible={modalVisible} 
                                buttonText={'Ok'} 
                                closeDisplay={this._closePopup}
                                title={titleNotification}
                                description={descriptionNotification}
                                titleColor={titleColor}
                                isNegative={this.state.isNegative}
                            />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        );
    }

    handleChangePetType(value){
        this.setState({petType: value})
        if(this.state.petType === 'Cat')
            this.setState({arrBreed: CatBreeds, petBreed: ''});
        else if(this.state.petType === 'Dog')
            this.setState({arrBreed: DogBreeds, petBreed: ''});
        else this.setState({arrBreed: []})
    }

    _renderComponentBread() {
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
                            autoCapitalize="none"
                            autoCorrect={false}
                            data={arrResult}
                            defaultValue={petBreed}
                            onChangeText={text => this.setState({ petBreed: text, hideResults: false })}
                            inputContainerStyle={[styles.autocompleteInput]}
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
                    {/* {(this.state.isSubmit && !this.state.petBreed) ? (<Text style={styles.form_label_error}>Oops, ~ Breed cannot be empty.</Text>) : null} */}
                    {(petBreed.includes('Mixed') && hideResults) ? (
                        <View>
                        <View style={{marginBottom: 20}}>
                            <Text style={styles.form_label_small}>Breed(1)</Text>
                            <Autocomplete
                                data={arrResultOne}
                                defaultValue={petMixBreedOne}
                                onChangeText={text => this.setState({ petMixBreedOne: text, hideResultsOne: false })}
                                inputContainerStyle={[styles.autocompleteInput, (!this.state.petMixBreedOne && this.state.isSubmit) ? styles.autocomplete_required : '']}
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
                                containerStyle={[(!this.state.petMixBreedTwo && this.state.isSubmit) ? styles.autocomplete_required : '']}
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

    _createNewPet = async () => {
        this.setState({isSubmit: true});
        const {petName, petType, petCustomType, petBreed, petMixBreedOne, petMixBreedTwo, petGender, petBirthDate, petNeutered, petWeight, petWeightUnit, petTag, insuranceProvider, policyNumber} = this.state;
        let data = {
            userID: this.props.userSession.user.userID,
            petName: petName,
            petType: petType,
            petCustomType: petCustomType,
            petBreed: petBreed,
            petMixBreedOne: petMixBreedOne,
            petMixBreedTwo: petMixBreedTwo,
            petGender: petGender,
            petBirthdate: dateHelper.convertDateSendApi(petBirthDate),
            petNeutered: petNeutered,
            // petWeightNote: petWeight + ' ' + petWeightUnit,
            petWeightUnit: petWeightUnit,
            petTagID: petTag,
            petInsuranceCompany: insuranceProvider,
            petInsuranceNumber: policyNumber,
            petHasSetSuggestedReminders: 'N'
        }

        let result = null;
        let petUpdate = this.props.navigation.state.params && this.props.navigation.state.params.petUpdate || null;

        if(!dateHelper.checkDate(data.petBirthdate))
            this.setState({titleNotification: "Oops. Something's missing!" , descriptionNotification: 'Select date not later than current date.', modalVisible: true})
        
        if(!data.petName.trim()){
            this.setState({titleNotification: "Oops. Something's wrong!" , descriptionNotification: 'Pet name is invalid', modalVisible: true})
            return
        }

        // if(!data.petBreed.trim()){
        //     this.setState({titleNotification: "Oops. Something's wrong!" , descriptionNotification: 'Pet breed is invalid', modalVisible: true})
        //     return
        // }

        if(data.petName && data.petName.length > 50){
            this.setState({titleNotification: "Oops. Something's wrong!" , descriptionNotification: 'Pet name cannot be more than 50 characters', modalVisible: true})
            return
        }

        if(data.petBreed && data.petBreed.length > 50){
            this.setState({titleNotification: "Oops. Something's wrong!" , descriptionNotification: 'Pet breed cannot be more than 50 characters', modalVisible: true})
            return
        }

        if(data.petTagID && data.petTagID.length > 50){
            this.setState({titleNotification: "Oops. Something's wrong!" , descriptionNotification: 'Pet tag cannot be more than 50 characters', modalVisible: true})
            return
        }

        if(data.petInsuranceNumber && data.petInsuranceNumber.length > 50){
            this.setState({titleNotification: "Oops. Something's wrong!" , descriptionNotification: 'Policy number cannot be more than 50 characters', modalVisible: true})
            return
        }

        if(!data.petName.trim() || !data.petType || !dateHelper.checkDate(data.petBirthdate))
            return;

        if(petUpdate){
            data.petID = petUpdate.petID;
            result = await this.props.updatePetAction(data);
        }
        else result = await this.props.createPetAction(data);

        if(result && result.petID) {
            if(this.state.formDataImage) {
                let resultAvatar = await this.props.uploadAvatarPetAction(result.petID, this.state.formDataImage);

                if(resultAvatar && this.props.uploadAvatarPet.url) {
                    this.setState({ avatarSource: this.props.uploadAvatarPet.url });
                    result.petPortraitLastUpdateDate = resultAvatar.timeStamp;
                    result.petPortraitURL = resultAvatar.imagePath;
                }
            }

            if(this.state.petWeight){
                let dataWeight = {
                    petID: this.props.createPet.data.petID,
                    petWeightDate: new Date().toUTCString(),
                    petWeightEnteredBy: this.props.userSession.user.userID,
                    petWeightValue:  petWeightUnit === WeightType.Lb ? Number(dataHelper.convertWeightToKg(petWeight)) : Number(petWeight)
                };
                await this.props.createPetWeightAction(dataWeight);
            }

            await this.props.getPetsByOwnerAction(this.props.userSession.user.userID);
            
            // this.setState({
            //     isNegative: false,
            //     titleNotification: "Yepi! Successfully Registered.",
            //     descriptionNotification: `${petName}'s profile has been successfully added to your account.`,
            //     titleColor: '#14c498',
            //     modalVisible: true
            // });
            console.log('result', result);
            if(!result.petBirthdate)
                setTimeout(()=>{  this.props.navigation.navigate('ApproximateAge', {data: result, avatar: this.state.avatarSource}); });
            else setTimeout(()=>{  this.props.navigation.navigate('VaccineRecord', {data: result, avatar: this.state.avatarSource, ageMonth: this._calculateMonthWithoutYears(result.ageInDaysWithoutYears), isStepAdd: true}); });
        }

        else {
            this.setState({
                isNegative: true,
                titleNotification: "Error",
                descriptionNotification: "Something's wrong!. Please try again.",
                titleColor: '#000',
                modalVisible: true
            });
            return;
        }
    }

    _showInfomationOption = () => {
        this.setState({
            isNegative: false,
            titleNotification: "Bark. Why is this information important?",
            descriptionNotification: "Depending on your insurance, you will access unique benefits. It is relevant for our experts, helping them offer you better advice. Additionally, you will have all your pet's information conveniently stored in one place. ",
            titleColor: '#000',
            modalVisible: true
        });
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


    // Close Popup and redirect UserManage
    _closePopup = () => {
        this.setState({modalVisible: false});
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

    _handleChangePolicyNumber = (policyNumber) => {
        this.setState({policyNumber})
    }
}

const mapStateToProps = state => ({
    createPet: state.createPet,
    userSession: state.userSession,
    uploadAvatarPet: state.uploadAvatarPet,
    getAvatarPet: state.getAvatarPet,
    createPetWeight: state.createPetWeight,
    updatePet: state.updatePet
});

const mapDispatchToProps = {
    createPetAction,
    getAvatarPetAction,
    uploadAvatarPetAction,
    createPetWeightAction,
    updatePetAction,
    getPetsByOwnerAction
};

export default connect(mapStateToProps, mapDispatchToProps)(createPet)

const format = StyleSheet.create({
    pet_avatar: {
        width: 70,
        height: 70,
        borderWidth: 1,
        resizeMode: 'cover',
        borderColor: '#4e94b2',
        borderRadius: 70/2
    },
    text_uppercase: {
        textTransform: 'uppercase',
        fontSize: iOS ? 10 : 13,
        fontWeight: '600',
        color: '#4e94b2'
    },
    text_policy: {
        fontSize: iOS ? 13 : 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 20
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
    }
});
