import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Image,
    ScrollView,
    FlatList,
    TextInput,
    Alert,
    Platform
} from 'react-native';
import styles from '../../constants/Form.style';
import { MaterialIcons, EvilIcons } from '@expo/vector-icons';
import suggestedSearchListAction from '../../src/apiActions/provider/suggestedSearchList';
import {connect} from 'react-redux';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import {GMapAPIKey} from '../../src/common';
import PopupNotification from '../../components/PopupNotification';
import { dataHelper } from '../../src/helpers';

class SearchProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            suggetedSearchs: [],
            currentLocation: null,
            keyword: '',
            validateKeyword: false,
            validateLocation: false,
            modalVisible: false,
            titleNotification: '',
            descriptionNotification: '',
            isNegative: false
        }
    }

    async componentWillMount(){
        await this._suggestedSearchList();
    }

    async componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = await navigation.addListener("didFocus", () => {
            // this._askPermissionsAsync();
        });
    }
    
    async componentWillUnmount() {
        await this.focusListener.remove();
    }

    render() {
        const {
            suggetedSearchs, 
            keyword, 
            validateKeyword,
            modalVisible,
            titleNotification,
            descriptionNotification,
            isNegative,
            validateLocation
        } = this.state;

        return (
            <SafeAreaView style={styles.safeArea}>
                <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                    <View style={styles.container}>
                        <View style={{position:'relative', paddingBottom: 22, paddingTop: 25, justifyContent: 'center'}}>
                            <TouchableOpacity style={styles.button_back} onPress={() => this.props.navigation.navigate('Provider')}>
                                <Image style={{width: 12, height: 21}} source={require('../../assets/images/icon-back.png')}/>
                            </TouchableOpacity>
                            <Text style={[styles.title_head, {alignSelf: 'center'}]}>Search Provider</Text>
                            {/* <TouchableOpacity 
                                style={[styles.button_back, {right: 0, width: 30, height: 30}]}
                            >
                                < name="add-circle-outline" color="#000" size={30} />
                            </TouchableOpacity> */}
                        </View>
            
                        <View>
                            <Text style={[styles.title_container, format.title_container]}>Enter what you are looking for - </Text>
                            <View style={{position: 'relative', marginBottom: 20}}>
                                <EvilIcons name="search" size={30} color="#000" style={format.icon_search}/>
                                <TextInput 
                                    style={format.input_search} 
                                    placeholder="Provider Name, Vet, Store Name" 
                                    placeholderTextColor="rgba(32, 44, 60, 0.4)"
                                    value={keyword}
                                    onChangeText={(keyword) => this.setState({keyword})}
                                />
                            </View>
                            {validateKeyword ? <Text style={styles.form_label_error}>Oops, ~ Keyword cannot be empty.</Text> : null}
                            <View style={{position: 'relative', marginBottom: 20}}>
                                <EvilIcons name="search" size={30} color="#000" style={format.icon_search}/>
                                <GooglePlacesAutocomplete
                                    placeholder='Current Location'
                                    minLength={2} // minimum length of text to search
                                    autoFocus={false}
                                    listViewDisplayed={false} 
                                    fetchDetails={true}
                                    onPress={(data, details) => { 
                                        this.setState({currentLocation: details});
                                    }}
                                    query={{
                                        key: GMapAPIKey,
                                        language: 'en',
                                    }}
                                    nearbyPlacesAPI='GooglePlacesSearch'
                                    debounce={200}
                                    enablePoweredByContainer={false}
                                    styles={{
                                        textInputContainer: {
                                            width: '100%',
                                            backgroundColor: 'transparent',
                                            borderTopWidth: 0,
                                            borderBottomWidth: 0,
                                            height: 44
                                        },
                                        description: {
                                            fontWeight: '500',
                                            color: '#202c3c'
                                        },
                                        textInput: format.input_search,
                                        listView: {
                                            borderWidth: 1,
                                            borderColor: '#e0e0e0'
                                        }
                                    }}
                                    textInputProps={{
                                        onChangeText: (text) => { 
                                            if(!text)
                                                this.setState({currentLocation: null, validateLocation: false});
                                            else if(dataHelper.validateAddress(text))
                                                this.setState({validateLocation: true});
                                        }
                                    }}
                                />
                            </View>
                            {validateLocation ? <Text style={styles.form_label_error}>Oops, ~ Location is invalid.</Text> : null}
                            <View style={{alignItems: 'flex-end', marginBottom: 30}}>
                                <TouchableOpacity 
                                    style={[styles.form_button, {width: 100, marginTop: 0}]}
                                    onPress={() => this._searchProvider()}
                                >
                                    <Text style={styles.button_text}>Search</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                        </View>


                        <Text style={[styles.title_container, format.title_container]}>Suggested Search</Text>
                        <View style={[styles.container_form, {paddingTop: 0, paddingBottom: 0}]}>
                            <FlatList
                                data={suggetedSearchs}
                                renderItem={({item, index}) => (
                                    <View 
                                        style={[
                                            format.group_item,
                                            index === suggetedSearchs.length - 1 ? {borderBottomWidth: 0} : null
                                        ]}
                                    >
                                        <Text style={format.text_item}>{item.value}</Text>
                                        <TouchableOpacity 
                                            style={format.button_next} 
                                            onPress={() => this._searchProvider(item.value)} >
                                            <EvilIcons name="chevron-right" color="#000" size={40} />
                                        </TouchableOpacity>
                                    </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                        <PopupNotification
                            visible={modalVisible} 
                            buttonText={'Ok'} 
                            closeDisplay={() => this.setState({modalVisible: false})}
                            title={titleNotification}
                            description={descriptionNotification}
                            isNegative={isNegative}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }

    _suggestedSearchList = async() => {
        if(this.props.suggestedSearchList.data)
            await this.setState({suggetedSearchs: this.props.suggestedSearchList.data});
    }

    _askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.LOCATION);
        // if (status !== 'granted') {
        //   this.setState({
        //     errorMessage: 'Permission to access location was denied',
        //   });
        // }
        console.log("status", status);
        // let location = await Location.getCurrentPositionAsync({});
    }

    _searchProvider = async(query) => {
        const {keyword, currentLocation} = this.state;
        if(!keyword && !query){
            this.setState({validateKeyword: true});
            return;
        }
        if(keyword.trim() == "" && !query){
            this.setState({validateKeyword: true});
            return;
        }
        let location = null;
        if(!currentLocation){
            if(this.state.validateLocation)
                return;

            const { status } = await Permissions.askAsync(Permissions.LOCATION);
            if(status !== 'granted'){
                Alert.alert(
                    'Permission to access location was denied',
                    'Please enable it from the app settings or enter current location.',
                    [
                        {text: 'Close', onPress: () =>  console.log("Close") , style: 'cancel'}
                    ]
                )
                return;
            }
            else {
                let current = await Location.getCurrentPositionAsync({});
                location = {
                    lat: current.coords.latitude,
                    lng: current.coords.longitude
                }
            }
        }
        else {
            location = await currentLocation.geometry.location;
        }

        await this.setState({validateKeyword: false, validateLocation: false});
        await this.props.navigation.navigate('ProviderResultList', {titleList: query ? query : 'Result', location: location, query: query ? query : keyword})
    }


}

const mapStateToProps = state => ({
    suggestedSearchList: state.suggestedSearchList
});

const mapDispatchToProps = {
    suggestedSearchListAction
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchProvider);

const format = StyleSheet.create({
    icon_search: {
        position: 'absolute',
        left: 13,
        top: 8,
        zIndex: 1
    },
    input_search: {
        borderColor: '#e0e0e0',
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: '#fcfcfc',
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        paddingLeft: 50,
        paddingRight: 10,
        height: 44,
        fontSize: Platform.OS === 'ios' ? 13 : 16,
        fontWeight: '500',
        color: '#202c3c'
    },
    group_item: {
        position: 'relative',
        paddingRight: 50,
        justifyContent: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0'
    },
    text_item: {
        fontSize: Platform.OS === 'ios' ? 12 : 15,
        fontWeight: '500',
        color: '#202c3c',
        textAlign: 'left',
        textTransform: 'capitalize'
    },
    button_next: {
        position: 'absolute',
        right: -13,
        zIndex: 1
    },
    title_container: {
        color: '#4e94b2',
        marginBottom: 15,
        fontWeight: '700'
    },
    
});