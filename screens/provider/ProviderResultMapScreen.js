import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import {connect} from 'react-redux';
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
    Dimensions,
    Linking,
    Platform
} from 'react-native';
import styles from '../../constants/Form.style';
import { MaterialIcons, EvilIcons } from '@expo/vector-icons';
import ItemProviderResult from '../../components/provider/ItemProviderResult';
import MapView from 'react-native-maps'
const { width, height } = Dimensions.get('window');
import PopupConfirm from '../../components/PopupConfirm';
import PopupNotification from '../../components/PopupNotification';
import getDetailProviderAction from '../../src/apiActions/provider/getDetailProvider';
import createProviderAction from '../../src/apiActions/provider/createProvider';
import getProvidersByOwnerAction from '../../src/apiActions/provider/getProvidersByOwner';

class ProviderResultMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: -33.871811,
                longitude: 151.2075846,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            provider: null,
            visibleConfirm: false,
            textButtonConfirm: 'Open',
            descriptionConfirm: '',
            titleConfirm: '',
            statusConfirm: null,
            visibleNotification: false,
            titleNotify: '',
            descriptionNotify: '',
            isNegative: false,
            loading: false,
            valueSearch: '',
            list: []
        }
    }

    async componentWillMount() {
        const {list} = await this.props.navigation.state.params;
        await this.setState({ provider: list[0], list: list}, async() => {
            await this._renderMap(this.state.provider);
        });
        this.timer = null;
    }

    render() {
        const {
            region, 
            listMarker, 
            provider, 
            visibleConfirm, 
            textButtonConfirm, 
            descriptionConfirm, 
            titleConfirm,
            visibleNotification,
            titleNotify,
            descriptionNotify,
            isNegative,
            loading,
            valueSearch
        } = this.state;

        const {list} = this.state;

        return (
            <SafeAreaView style={styles.safeArea}>
                <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                    <Spinner visible={loading}/>
                    <View style={styles.container}>
                        <View style={{position:'relative', paddingBottom: 22, paddingTop: 25, justifyContent: 'center'}}>
                            <TouchableOpacity style={styles.button_back} onPress={() => this.props.navigation.goBack()}>
                                <Image style={{width: 12, height: 21}} source={require('../../assets/images/icon-back.png')}/>
                            </TouchableOpacity>
                            <Text style={[styles.title_head, {alignSelf: 'center'}]}>Veterinary Map</Text>
                            <TouchableOpacity 
                                style={[styles.button_back, {right: 0, width: 30, height: 30}]}
                            >
                                <MaterialIcons name="list" color="#000" size={30} />
                            </TouchableOpacity>
                        </View>

                        <View style={format.form_search}>
                            <EvilIcons name="search" size={30} color="#000" style={format.icon_search}/>
                            <TextInput 
                                style={format.input_search} 
                                placeholder="Provider Name, Vet, Store Name"
                                value={valueSearch}
                                onChangeText={(valueSearch) => this._handleSearch(valueSearch)}
                            />
                        </View>

                        <View style={{flex: 1, position: 'relative', minHeight: 300, marginBottom: 20}}>
                            <MapView 
                                provider="google"
                                style={StyleSheet.absoluteFillObject}
                                region={region}
                            >
                                {list.map((marker, index) => (
                                    <MapView.Marker
                                        coordinate={{latitude: marker.geometry.location.lat, longitude: marker.geometry.location.lng}}
                                        pinColor={provider.place_id === marker.place_id ? '#14c498' : 'red'}
                                        onPress={() => this._selectProvider(marker)}
                                        key={index}
                                    />
                                ))}
                            </MapView>
                        </View>
                        {
                            provider ?
                            <ItemProviderResult
                                data={provider}
                                onCall={this._onCall}
                                onWebsite={this._onWebsite}
                                onMap={this._onMap}
                                onCreate={() => this._createProvider()}
                                navigation={this.props.navigation}
                            />
                            : null
                        }

                        <PopupConfirm
                            data={provider}
                            visible={visibleConfirm}
                            buttonText1={'Cancel'}
                            buttonText2={textButtonConfirm}
                            title={titleConfirm}
                            description={descriptionConfirm}
                            handleButton1={() => this.setState({visibleConfirm: false})}
                            handleButton2={this._handleConfirm}
                        />

                        <PopupNotification
                            visible={visibleNotification}
                            title={titleNotify}
                            description={descriptionNotify}
                            buttonText={'Ok'} 
                            closeDisplay={this._closeNofification}
                            isNegative={isNegative}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }

    _renderMap = async(region) => {
        let geometry = await region.geometry;
        const ASPECT_RATIO = (width - 32) / 300;
        const latDelta = (geometry.viewport.northeast.lat - geometry.viewport.southwest.lat) * 24;
        const lngDelta = latDelta * ASPECT_RATIO;
        await this.setState({
            region: {
                latitude: geometry.location.lat,
                longitude: geometry.location.lng,
                latitudeDelta: latDelta,
                longitudeDelta: lngDelta
            }
        }) 
    }

    async _selectProvider(data) {
        await this.setState({provider: data}, async() => {
            await this._renderMap(data);
        })
    }

    _onCall = async(data) => {
        await this.setState({
            titleConfirm: `Call ${data.name}?`,
            descriptionConfirm: '',
            textButtonConfirm: 'Call',
            statusConfirm: 'call',
            visibleConfirm: true
        })
    }

    _onWebsite = async(data) => {
        await this.setState({
            titleConfirm: 'Open browser?',
            descriptionConfirm: '',
            textButtonConfirm: 'Open',
            statusConfirm: 'web',
            visibleConfirm: true
        })
    }

    _onMap = async(data) => {
        await this.setState({
            titleConfirm:  `Open ${data.name} in Map?`,
            descriptionConfirm: data.name,
            textButtonConfirm: 'Open',
            statusConfirm: 'map',
            visibleConfirm: true
        })
    }

    _handleConfirm = async(data) => {
        const {statusConfirm} = this.state;
        await this.setState({
            visibleConfirm: false
        },async() => {
            await this.props.getDetailProviderAction(data.place_id);
            let notify = null;
            if(this.props.getDetailProvider.data && this.props.getDetailProvider.data.result){
                let detail = this.props.getDetailProvider.data.result;
                if (statusConfirm === 'call'){
                    if(detail.international_phone_number) 
                        Linking.openURL(`tel:${detail.international_phone_number}`);
                    else notify = 'Phone';
                }
                else if(statusConfirm === 'web'){
                    if(detail.website) Linking.openURL(detail.website);
                    else notify = 'Website';
                }
                else if(statusConfirm === 'map') {
                    let latLng = `${data.geometry.location.lat},${data.geometry.location.lng}`;
                    let label = data.formatted_address; //Name address - (formatted_address)
                    let url = Platform.select({
                        ios: `maps:0,0?q=${label}@${latLng}`,
                        android: `geo:0,0?q=${label}`,
                    });
                    Linking.canOpenURL(url).then(supported => {
                        if (supported)
                            Linking.openURL(url); 
                        else
                            Linking.openURL(`https://www.google.com/maps/place/${label}/@${lat},${lng}z`)
                    })
                    return;
                }
            }
            if(notify)
                this.setState({
                    titleNotify: `Oop~ ${notify}'s missing`,
                    descriptionNotify: 'Please try later.',
                    isNegative: true,
                    visibleNotification: true
                })
        })
    }

    _createProvider = async() => {
        this.setState({loading: true});
        const {provider} = this.state;
        // await this.props.getProvidersByOwnerAction(this.props.userSession.user.userID);
        if(this.props.getProvidersByOwner.data && this.props.getProvidersByOwner.data.length){
            let checkProvider = await this.props.getProvidersByOwner.data.find(item => item.cpGoogleMapID === provider.place_id)
            if(checkProvider){
                this.setState({
                    loading: false,
                    isNegative: true,
                    titleNotify: 'Oop~, Something is wrong',
                    descriptionNotify: 'This Provider already exists in your Care Provider list.',
                    visibleNotification: true
                });
                return;
            }
        }
        
        await this.props.getDetailProviderAction(provider.place_id);

        if(this.props.getDetailProvider.data){
            const {result} = this.props.getDetailProvider.data;
            let dataCreate = {
                cpAddress: result.formatted_address,
                cpEmail: '',
                cpGoogleMapID: result.place_id,
                cpLongName: result.name,
                cpOpenHours: result.opening_hours.weekday_text,
                cpTelephone: result.international_phone_number,
                cpTypes: result.types,
                cpWebsite: result.website || '',
                petIDs: [],
                userID: this.props.userSession.user.userID
            }
            await this.props.createProviderAction(dataCreate);

            if(this.props.createProvider.data){
                await this.props.getProvidersByOwnerAction(this.props.userSession.user.userID);
                this.setState({
                    isNegative: false,
                    titleNotify: 'Yepi! Successfully Added.',
                    descriptionNotify: `${provider.name} is successfully added to your provider list`,
                    loading: false,
                    visibleNotification: true
                }, () => {
                    this.props.navigation.navigate('Provider');
                });
                return;
            }
        }
        await this.setState({
            isNegative: true,
            titleNotify: 'Error',
            descriptionNotify: 'Failed. Please try again',
            loading: false,
            visibleNotification: true
        });
    }
    _closeNofification = async() => {
        await this.setState({titleNotify: '',descriptionNotify: '', isNegative: false, visibleNotification: false});
    }

    async _handleSearch(value) {
        //test.toLowerCase().includes('d'.toLowerCase());
        const {list} = await this.props.navigation.state.params;
        await this.setState({valueSearch: value}, async() => {
            let arr = [];
            arr = await list.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
            await this.setState({list: arr, provider: arr[0]}, async() => {
                if(arr[0])
                    await this._renderMap(arr[0]);
            });
        })
    }
}

const mapStateToProps = state =>({
    getDetailProvider: state.getDetailProvider,
    userSession: state.userSession,
    createProvider: state.createProvider,
    getProvidersByOwner: state.getProvidersByOwner
})

const mapDispatchToProps = {
    getDetailProviderAction,
    createProviderAction,
    getProvidersByOwnerAction
}

export default connect(mapStateToProps, mapDispatchToProps)(ProviderResultMap);

const format = StyleSheet.create({
    form_search: {
        position: 'relative',
        paddingLeft: 50,
        paddingRight: 13,
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        backgroundColor: '#fcfcfc',
        borderRadius: 4,
        marginBottom: 20
    },
    icon_search: {
        position: 'absolute',
        left: 13
    },
    input_search: {
        padding: 0,
        borderWidth: 0,
        fontSize: Platform.OS === 'ios' ? 13 : 16,
        fontWeight: '500',
        textAlign: 'left',
        width: '100%'
    }
});