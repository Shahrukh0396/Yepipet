import React from 'react';
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
    Linking,
    Platform,
    AsyncStorage
} from 'react-native';
import styles from '../../constants/Form.style';
import { MaterialIcons } from '@expo/vector-icons';
import ItemProvider from '../../components/provider/ItemProvider';
import PopupConfirm from '../../components/PopupConfirm';
import PopupNotification from '../../components/PopupNotification';
import {connect} from 'react-redux';
import getProvidersByOwnerAction from '../../src/apiActions/provider/getProvidersByOwner';
import getDetailProviderAction from '../../src/apiActions/provider/getDetailProvider';
import deleteProviderAction from '../../src/apiActions/provider/deleteProvider';
import getReminderByOwnerAction from '../../src/apiActions/reminder/getReminderByOwner';
import {dateHelper} from '../../src/helpers';
import { Ionicons } from '@expo/vector-icons';
import { GMapAPIKey } from '../../src/common';

class CareProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkAll: true,
            visibleConfirm: false,
            textButtonConfirm: 'Open',
            descriptionConfirm: '',
            titleConfirm: '',
            statusConfirm: null,
            dataConfirm: null,
            isNegative: false,
            listPet: null,
            loading: false,
            visibleNotify: false,
            titleNotify: '',
            descriptionNotify: '',
            isNegativeNotify: false,
            closeSwipe: false,
            listProvider: []
        }
    }

    componentWillMount() {
        this._renderListPets();
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {
            if(this.props.userSession.user)
                this._getProviders();
        });
    }
    
    componentWillUnmount() {
        this.focusListener.remove();
    }

    render() {
        const {navigate} = this.props.navigation;
        const {
            checkAll, 
            visibleConfirm, 
            titleConfirm, 
            textButtonConfirm, 
            descriptionConfirm, 
            dataConfirm,
            isNegative,
            listPet,
            loading,
            visibleNotify,
            titleNotify,
            descriptionNotify,
            isNegativeNotify,
            closeSwipe,
            listProvider
        } = this.state;

        return (
            <SafeAreaView style={styles.safeArea}>
                <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                    <Spinner visible={loading}/>
                    <View style={styles.container}>
                        <View style={{position:'relative', paddingBottom: 22, paddingTop: 25, justifyContent: 'center'}}>
                            <TouchableOpacity style={styles.button_back} onPress={() => this.props.navigation.navigate('UserManage')}>
                                <Image style={{width: 12, height: 21}} source={require('../../assets/images/icon-back.png')}/>
                            </TouchableOpacity>
                            <Text style={[styles.title_head, {alignSelf: 'center'}]}>Care Providers</Text>
                            <TouchableOpacity 
                                style={[styles.button_back, {right: 0, width: 30, height: 30}]}
                                onPress={() => this.props.navigation.navigate('SearchProvider')}
                            >
                                <MaterialIcons name="add-circle-outline" color="#000" size={30} />
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.container_form, {marginBottom: 21}]}>
                            {
                                listPet && listPet.length > 0
                                ?
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                    <TouchableOpacity 
                                        style={format.button_check} 
                                        activeOpacity={1}
                                        onPress={this._checkAllPet}
                                    >
                                    {
                                        checkAll ? 
                                        <MaterialIcons name="check" size={30} color="#14c498" />
                                        : null
                                    }
                                    </TouchableOpacity>
                                    {
                                        listPet.map((item, index) => {
                                            return (
                                                <TouchableOpacity 
                                                    key={item.petID} 
                                                    style={{position: 'relative', paddingRight: 6, height: 60, marginRight: 18}}
                                                    onPress={() => this._toggleCheck(item, index)}
                                                >
                                                    <Image 
                                                        style={[styles.image_circle, format.image_circle, {borderColor: '#fb8f8f'}]} 
                                                        source={item.petPortraitURL ? {uri: item.petPortraitURL} : require('../../assets/images/img-pet-default.png')}
                                                    />
                                                    {
                                                        item.isCheck ? 
                                                        <Image 
                                                            style={format.icon_check} 
                                                            source={require('../../assets/images/icon-check.png')}
                                                        />
                                                        : null
                                                    }
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </ScrollView>
                                :
                                <View style={{flexDirection: 'column', alignItems: 'center' }}>
                                    <Text style={format.text_note}> You don't have any pets.</Text>
                                    <Text style={format.text_note}>Do you want add new pet ?</Text>
                                    <TouchableOpacity onPress={() => navigate('AddNewPet')}>
                                        <Ionicons name='md-add-circle-outline' size={30} style={{paddingTop: 5}}/>
                                    </TouchableOpacity>
                                </View>
                            }
                            </View>

                        <View>
                            <FlatList
                                extraData={this.state}
                                data={listProvider}
                                renderItem={({item}) => (
                                    <ItemProvider
                                        data={item}
                                        onCall={this._onCall}
                                        onWebsite={this._onWebsite}
                                        onMap={this._onMap}
                                        onDelete={this._deleteProvider}
                                        navigation={this.props.navigation}
                                        isClose={closeSwipe}
                                    />
                                )}
                                keyExtractor={(item, index) => item.cpID.toString()}
                            />
                            {
                                listProvider && listProvider.length ?
                                    null
                                :
                                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center"}}>
                                        <Text style={format.text_noprovider}>There is no care provider added.</Text>
                                    </View>
                            }
                        </View>
                        
                        <PopupConfirm
                            data={dataConfirm}
                            visible={visibleConfirm}
                            buttonText1={'Cancel'}
                            buttonText2={textButtonConfirm}
                            title={titleConfirm}
                            description={descriptionConfirm}
                            handleButton1={() => this.setState({visibleConfirm: false})}
                            handleButton2={this._handleConfirm}
                            isNegative={isNegative}
                        />

                        <PopupNotification
                            visible={visibleNotify}
                            title={titleNotify}
                            description={descriptionNotify}
                            buttonText={'Ok'} 
                            closeDisplay={this._closeNofification}
                            isNegative={isNegativeNotify}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    _checkAllPet = () =>{
        this.setState({checkAll: !this.state.checkAll}, () => {
            let listPet = [...this.state.listPet];
            listPet.forEach(item => {
                item.isCheck = this.state.checkAll;
            });
            this.setState({listPet}, () =>{
                this._getProviders();
            });
        });
    }

    _onCall = (data) => {
        this.setState({
            dataConfirm: data,
            titleConfirm: `Call ${data.cpLongName}?`,
            descriptionConfirm: data.cpTelephone,
            textButtonConfirm: 'Call',
            statusConfirm: 'call',
            isNegative: false,
            visibleConfirm: true
        }) 
    }

    _onWebsite = (data) => {
        this.setState({
            dataConfirm: data,
            titleConfirm: 'Open browser?',
            descriptionConfirm: data.cpWebsite,
            textButtonConfirm: 'Open',
            statusConfirm: 'web',
            isNegative: false,
            visibleConfirm: true
        })
    }

    _onMap = (data) => {
        this.setState({
            dataConfirm: data,
            titleConfirm: `Open ${data.cpLongName} in Map?`,
            descriptionConfirm: `${data.cpAddress}`,
            textButtonConfirm: 'Open',
            statusConfirm: 'map',
            isNegative: false,
            visibleConfirm: true
        })
    }

    _deleteProvider = (data) => {
        this.setState({
            dataConfirm: data,
            titleConfirm: 'Meow. Remove Provider?',
            descriptionConfirm: `Warning: This will permanently delete ${data.cpLongName} from your provider list AND all associated appointments and reminders.`,
            textButtonConfirm: 'Delete',
            statusConfirm: 'delete',
            isNegative: true,
            visibleConfirm: true
        });
    }

    _handleConfirm = (data) => {
        const {statusConfirm} = this.state;
        this.setState({
            visibleConfirm: false
        },async() => {
            let notify = null;
            if (statusConfirm === 'call'){
                if(data.cpTelephone)
                    Linking.openURL(`tel:${data.cpTelephone}`);
                else notify = 'Phone';
            }
            else if(statusConfirm === 'web'){
                if(data.cpWebsite)
                    Linking.openURL(data.cpWebsite);
                else notify = 'Website';
            }
            else if(statusConfirm === 'map') {
                await this.props.getDetailProviderAction(data.cpGoogleMapID);
                if(this.props.getDetailProvider.data && this.props.getDetailProvider.data.result){

                    const {result} = this.props.getDetailProvider.data;
                    const latLng = `${result.geometry.location.lat},${result.geometry.location.lng}`;
                    const label = data.cpAddress; //Name address - (formatted_address)
                    const url = Platform.select({
                        ios: `maps:0,0?q=${label}@${latLng}`,
                        android: `geo:0,0?q=${label}`,
                    });
                    Linking.canOpenURL(url).then(supported => {
                        if (supported)
                            Linking.openURL(url); 
                        else
                            Linking.openURL(`https://www.google.com/maps/place/${label}/@${lat},${lng}z`)
                    });
                    return;
                }
            }
            else if(statusConfirm === 'delete'){
                await this.props.deleteProviderAction(data.cpID);
                if(this.props.deleteProvider.data){
                    await this.props.getProvidersByOwnerAction(this.props.userSession.user.userID);
                    this.setState({
                        titleNotify: 'Yepi! Successfully Deleted.',
                        descriptionNotify: '',
                        isNegativeNotify: false,
                        closeSwipe: true,
                        visibleNotify: true
                    });
                    return;
                }
                if(this.props.deleteProvider.error){
                    this.setState({
                        titleNotify: 'Error',
                        descriptionNotify: 'Delete provider failed. Please try again.',
                        isNegativeNotify: true,
                        statusConfirm: null,
                        visibleNotify: true
                    });
                    return;
                }
            }
            if(notify)
                this.setState({
                    titleNotify: `Oop~ ${notify}'s missing`,
                    descriptionNotify: 'Please try later.',
                    isNegativeNotify: true,
                    visibleNotify: true
                })
        })
    }

    _renderListPets = () => {
        let arrPet = JSON.stringify(this.props.getPetsByOwner.list);
        arrPet = JSON.parse(arrPet);
        arrPet.forEach(item => {
            item.isCheck = true;
        });
        this.setState({listPet: arrPet});
    }

    _toggleCheck(item, index){
        let listPet = [...this.state.listPet];
        listPet[index].isCheck = !item.isCheck;
        this.setState({listPet}, () => {
            let result = this.state.listPet.filter(item => !item.isCheck);
            if(!result.length){
                this.setState({checkAll: true});
            }
            else if(result.length === 1)
                this.setState({checkAll: false});
            this._getProviders();
        });
    }

    _getProviders = async() => {
        this.setState({loading: true});
        let listReminder = [];
        let listProvider = [];
        let isConnected = await AsyncStorage.getItem('isConnected', (err, result) => {
            console.log('isConnected', result);
        });
        if(isConnected && !JSON.parse(isConnected)){
            let localStorage = await AsyncStorage.getItem('localStorage');
            // console.log('persist', JSON.parse(persist));
            localStorage = JSON.parse(localStorage);
            listProvider = JSON.parse(localStorage.getProvidersByOwner).data;
            listReminder = JSON.parse(localStorage.getReminderByOwner).data;
        }
        else {
            // listProvider = await this.props.getProvidersByOwnerAction(this.props.userSession.user.userID);
            listProvider = this.props.getProvidersByOwner.data;
            listReminder = JSON.stringify(this.props.getReminderByOwner.data);
            listReminder = JSON.parse(listReminder);
        }
        if(listProvider && listProvider.length){
            if(listReminder && listReminder.length){
                listReminder.forEach(item => {
                    item.petInformation = this.state.listPet.find(pet => pet.isCheck && pet.petID === item.petID);
                });
                listProvider.forEach(item => {
                    let arrReminder = listReminder.filter(reminder => reminder.petInformation && reminder.reminderTypeRelateTableID === item.cpID);
                    arrReminder.map(reminder => {
                        let obj = reminder;
                        obj.providerName = item.cpLongName;
                        return obj;
                    });
                    item.reminders = arrReminder;
                })
            }
            else 
                listProvider.forEach(item => {
                    item.reminders = [];
                })
            
            // console.log('listProvider =>>>>>>>>>>', listProvider);

            // Convert String to Json
            // await listProvider.forEach(item => {
            //     item.
            //     // console.log('item cpPeriods', item.cpPeriods);
            //     // item.cpPeriods = JSON.parse(item.cpPeriods)
            //     // return item
            //     // item.openNow = this._returnOpenNow(item.cpOpenHours);
            // })
            await this._returnOpenNow(listProvider)

            await this.setState({listProvider: listProvider}, () => {});
        }
        else this.setState({listProvider});
        setTimeout(() => {
            this.setState({loading: false})
        }, 300);
    }

    _closeNofification = () => {
        this.setState({visibleNotify: false}, () => {
            if(this.state.statusConfirm === 'delete')
                this._getProviders();
        })
    }

    _returnOpenNow = async(data) => {
        await data && data.forEach(async(e) => {
            await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${e.cpGoogleMapID}&key=${ GMapAPIKey }`)
            .then(res => res.json())
            .then(d => {
                e.openNow = (d.result.opening_hours && d.result.opening_hours.open_now) ? d.result.opening_hours.open_now : false
            })
            .catch(err => {
                console.log('Provider Error: ', err)
            })
            return e
        })
    }

    // _returnOpenNow(hours) {
    //     // let days = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
    //     let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    //     let date = new Date();
    //     // console.log('date ne ->>>>>>>>>>>>>>>>>>>>', typeof days[date.getDay()-1]);
    //     let check = hours.find(item => item.includes(days[date.getDay() - 1]));

    //     if(!check)
    //         return false;
    //     else if(check.includes('Open 24 hours'))
    //         return true;
    //     check = check.split(' ');
    //     console.log('=>>>>>>>>>', check);
    //     if(check[1] === 'Closed')
    //         return false;
    //     else {
    //         let open = new Date(`${dateHelper.convertDate(date)}, ${check[1]} ${check[2]}`);
    //         console.log('open la s ?', open);
    //         let close = new Date(`${dateHelper.convertDate(date)}, ${check[4]} ${check[5]}`);
    //         console.log('close la s ?', close);
    //         if(open < date && close > date)
    //             return true;
    //     }
    //     return false;
    // }
}

const mapStateToProps = state => ({
    getPetsByOwner: state.getPetsByOwner,
    getProvidersByOwner: state.getProvidersByOwner,
    userSession: state.userSession,
    getDetailProvider: state.getDetailProvider,
    deleteProvider: state.deleteProvider,
    getReminderByOwner: state.getReminderByOwner
});

const mapDispatchToProps = {
    getProvidersByOwnerAction,
    getDetailProviderAction,
    deleteProviderAction,
    getReminderByOwnerAction
};

export default connect(mapStateToProps, mapDispatchToProps)(CareProvider);

const format = StyleSheet.create({
    image_circle: {
        width: 60,
        height: 60,
        borderRadius: 60/2
    },
    icon_check: {
        width: 24,
        height: 24,
        position: 'absolute',
        right: 0,
        bottom: 0
    },
    text_note: {
        fontSize: Platform.OS === 'ios' ? 13 : 16,
        fontWeight: '400',
        fontStyle: 'italic',
        color: '#202c3c'
    },
    button_check: {
        width: 60,
        height: 60,
        borderWidth: 2,
        borderColor: '#14c498',
        borderRadius: 60/2,
        position: 'relative',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 18
    },

    text_noprovider: {
        fontSize: Platform.OS === 'ios' ? 17 : 20,
        paddingVertical: '50%',
        fontWeight: "600"
    }
});
