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
    Linking,
    Platform
} from 'react-native';
import styles from '../../constants/Form.style';
import { MaterialIcons, EvilIcons } from '@expo/vector-icons';
import ItemProviderResult from '../../components/provider/ItemProviderResult';
import PopupConfirm from '../../components/PopupConfirm';
import PopupNotification from '../../components/PopupNotification';
import searchProviderAction from '../../src/apiActions/provider/searchProvider';
import getDetailProviderAction from '../../src/apiActions/provider/getDetailProvider';
import createProviderAction from '../../src/apiActions/provider/createProvider';
import getProvidersByOwnerAction from '../../src/apiActions/provider/getProvidersByOwner';

class ProviderResultList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            visibleConfirm: false,
            textButtonConfirm: 'Open',
            descriptionConfirm: '',
            titleConfirm: '',
            statusConfirm: null,
            dataConfirm: null,
            visibleNotification: false,
            titleNotify: '',
            descriptionNotify: '',
            isNegative: false,
            nextPage: null,
            loading: false,
        }
    }

    async componentWillMount() {
        if(this.props.navigation.state.params)
            await this._getResultList();
    }

    // componentDidMount() {
    //     const { navigation } = this.props;
    //     this.focusListener = navigation.addListener("didFocus", () => {
    //         if(this.props.navigation.state.params)
    //             this._getResultList();
    //     });
    // }
    
    // componentWillUnmount() {
    //     // Remove the event listener
    //     this.focusListener.remove();
    // }

    render() {
        const {
            list, 
            dataConfirm, 
            visibleConfirm, 
            titleConfirm, 
            descriptionConfirm, 
            textButtonConfirm,
            visibleNotification,
            titleNotify,
            descriptionNotify,
            isNegative,
            nextPage,
            loading
        } = this.state;

        const {titleList, location} = this.props.navigation.state.params;

        return (
            <SafeAreaView style={styles.safeArea}>
                <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                    <Spinner visible={loading}/>
                    <View style={styles.container}>
                        <View style={{position:'relative', paddingBottom: 22, paddingTop: 25, justifyContent: 'center'}}>
                            <TouchableOpacity style={styles.button_back} onPress={() => this.props.navigation.goBack()}>
                                <Image style={{width: 12, height: 21}} source={require('../../assets/images/icon-back.png')}/>
                            </TouchableOpacity>
                            <Text style={[styles.title_head, {alignSelf: 'center', textTransform: 'capitalize'}]}>{titleList} List</Text>
                            <TouchableOpacity 
                                style={[styles.button_back, {right: 0, width: 30, height: 30}]}
                                onPress={() => this.props.navigation.navigate('ProviderResultMap', {list: list})}
                            >
                                <MaterialIcons name="map" color="#000" size={30} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.container_form}>
                            <Text style={styles.title_container}>Search Result within 20 mi of Current Location</Text>
                            {
                                list && list.length ?
                                <FlatList
                                    data={list}
                                    renderItem={({item})=>(
                                        <ItemProviderResult 
                                            data={item} 
                                            onCall={this._onCall}
                                            onWebsite={this._onWebsite}
                                            onMap={this._onMap}
                                            onCreate={this._createProvider}
                                            navigation={this.props.navigation}
                                        />
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                                : <Text style={{fontStyle: 'italic', fontSize: 15}}>No result.</Text>
                            }
                        </View>
                        {
                            nextPage ?
                            <TouchableOpacity style={styles.form_button} onPress={this._showMore}>
                                <Text style={styles.button_text}>Show More</Text>
                            </TouchableOpacity>
                            : null
                        }

                        <PopupConfirm
                            data={dataConfirm}
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

    _onCall = async(data) => {
        await this.setState({
            dataConfirm: data,
            titleConfirm: `Call ${data.name}?`,
            descriptionConfirm: '',
            textButtonConfirm: 'Call',
            statusConfirm: 'call',
            visibleConfirm: true
        })
    }

    _onWebsite = async(data) => {
        await this.setState({
            dataConfirm: data,
            titleConfirm: 'Open browser?',
            descriptionConfirm: '',
            textButtonConfirm: 'Open',
            statusConfirm: 'web',
            visibleConfirm: true
        })
    }

    _onMap = async(data) => {
        await this.setState({
            dataConfirm: data,
            titleConfirm: `Open ${data.name} in Map?`,
            descriptionConfirm: `${data.formatted_address}`,
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
                let detail = await this.props.getDetailProvider.data.result;
                if (statusConfirm === 'call'){
                    if(detail.international_phone_number) 
                        await Linking.openURL(`tel:${detail.international_phone_number}`);
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
                    await Linking.canOpenURL(url).then(supported => {
                        if (supported)
                            Linking.openURL(url); 
                        else
                            Linking.openURL(`https://www.google.com/maps/place/${label}/@${lat},${lng}z`)
                    })
                    return;
                }
            }
            if(notify)
                await this.setState({
                    titleNotify: `Oop~ ${notify}'s missing`,
                    descriptionNotify: 'Please try later.',
                    isNegative: true,
                    visibleNotification: true
                })
        })
    }

    _createProvider = async(data) => {
        this.setState({loading: true})
        // await this.props.getProvidersByOwnerAction(this.props.userSession.user.userID);
        if(this.props.getProvidersByOwner.data && this.props.getProvidersByOwner.data.length){
            let checkProvider = this.props.getProvidersByOwner.data.find(item => item.cpGoogleMapID === data.place_id)
            if(checkProvider){
                this.setState({
                    isNegative: true,
                    titleNotify: 'Oop~, Something is wrong',
                    descriptionNotify: 'This Provider already exists in your Care Provider list',
                    loading: false,
                    visibleNotification: true
                });
                return;
            }
        }

        
        await this.props.getDetailProviderAction(data.place_id);

        if(this.props.getDetailProvider.data){
            const {result} = this.props.getDetailProvider.data;
            let dataCreate = {
                cpAddress: result.formatted_address,
                cpEmail: '',
                cpGoogleMapID: result.place_id,
                cpLongName: result.name,
                cpOpenHours: (result.opening_hours && result.opening_hours.weekday_text) ? result.opening_hours.weekday_text : [],
                cpTelephone: result.international_phone_number,
                cpTypes: result.types,
                cpWebsite: result.website || '',
                utc_offset: String(result.utc_offset),
                cpPeriods: (result.opening_hours && result.opening_hours.periods) ? JSON.stringify(result.opening_hours.periods) : '',
                userID: this.props.userSession.user.userID
            }
            await this.props.createProviderAction(dataCreate);

            if(this.props.createProvider.data){
                await this.props.getProvidersByOwnerAction(this.props.userSession.user.userID);
                this.setState({
                    isNegative: false,
                    titleNotify: 'Yepi! Successfully Added.',
                    descriptionNotify: `${data.name} is successfully added to your provider list`,
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

    _closeNofification = () => {
        this.setState({titleNotify: '',descriptionNotify: '', isNegative: false, visibleNotification: false});
    }

    _getResultList = async() => {
        await this.setState({loading: true});
        const {location, query} = this.props.navigation.state.params;
        let data = {
            location: location,
            query: query,
            pagetoken: ''
        }
        await this.props.searchProviderAction(data);
        if(this.props.searchProvider.data){
            let list = await this.props.searchProvider.data.results;
            if(list && list.length){
                list = list.map(item => {
                    let obj = {...item};
                    if(this.props.getProvidersByOwner.data.find(data => data.cpGoogleMapID === item.place_id))
                        obj.isExisted = true; 
                    return obj;
                })
            }
            await this.setState({
                list,
                nextPage: this.props.searchProvider.data.next_page_token || null
            }, () => {console.log('abc =>>>>>>>>>>>>>>>>>>>>>>', list);});
        }

        setTimeout(() => {
            this.setState({loading: false})
        }, 300);
    }

    _showMore = async() => {
        if(this.state.nextPage){
            this.setState({loading: true});
            let data = {
                location: {lat: '', lng: ''},
                query: '',
                pagetoken: this.state.nextPage
            }
            await this.props.searchProviderAction(data);
            if(this.props.searchProvider.data){
                let list = [...this.state.list, ...this.props.searchProvider.data.results];
                this.setState({list, nextPage: this.props.searchProvider.data.next_page_token});
            }
            if(this.props.searchProvider.error){
                this.setState({nextPage: null});
            }
            setTimeout(() => {
                this.setState({loading: false})
            }, 300);
        }
    }
}

const mapStateToProps = state =>({
    searchProvider: state.searchProvider,
    getDetailProvider: state.getDetailProvider,
    userSession: state.userSession,
    createProvider: state.createProvider,
    getProvidersByOwner: state.getProvidersByOwner
})

const mapDispatchToProps = {
    searchProviderAction,
    getDetailProviderAction,
    createProviderAction,
    getProvidersByOwnerAction
}

export default connect(mapStateToProps, mapDispatchToProps)(ProviderResultList);

const format = StyleSheet.create({
    
});