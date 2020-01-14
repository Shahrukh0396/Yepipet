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
    Dimensions,
    Linking,
    Platform
} from 'react-native';
import styles from '../../constants/Form.style';
import { MaterialIcons, EvilIcons } from '@expo/vector-icons';
import MapView from 'react-native-maps'
import PopupConfirm from '../../components/PopupConfirm';
import PopupNotification from '../../components/PopupNotification';
import getDetailProviderAction from '../../src/apiActions/provider/getDetailProvider';
import { dateHelper } from '../../src/helpers';
const { width, height } = Dimensions.get('window');

class CareProviderDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrSchedule: [
                {name: 'Regular health check', repeat: 'One, Every Two Month', date: '6:00PM, tonight'},
                {name: 'Dental cleaning', repeat: 'One, Every Two Month', date: '6:00PM, Friday'},
                {name: 'Neuter operation', repeat: 'One Time', date: '6:00PM, Sunday, August 1st'}
            ],
            visibleConfirm: false,
            textButtonConfirm: 'Open',
            descriptionConfirm: '',
            titleConfirm: '',
            statusConfirm: null,
            visibleNotify: false,
            titleNotify: '',
            descriptionNotify: '',
            isNegativeNotify: false,
            detailProvider: null,
            loading: false,
            listReminder: []
        }
    }

    componentWillMount(){
        this._getDetailProvider();
    }

    render() {
        const {dataProvider} = this.props.navigation.state.params;
        const result = this.props.getDetailProvider.data && this.props.getDetailProvider.data.result;
        const {
            visibleConfirm, 
            textButtonConfirm, 
            descriptionConfirm, 
            titleConfirm,
            visibleNotify,
            titleNotify,
            descriptionNotify,
            isNegativeNotify,
            detailProvider,
            loading
        } = this.state;
        const {navigate} = this.props.navigation;

        return (    
            <SafeAreaView style={styles.safeArea}>
                <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                    <Spinner visible={loading}/>
                    <View style={styles.container}>
                        <View style={{position:'relative', paddingBottom: 22, paddingTop: 25, justifyContent: 'center'}}>
                            <TouchableOpacity style={styles.button_back} onPress={() => this.props.navigation.goBack()}>
                                <Image style={{width: 12, height: 21}} source={require('../../assets/images/icon-back.png')}/>
                            </TouchableOpacity>
                            <Text style={[styles.title_head, {alignSelf: 'center'}]}>View Care Provider</Text>
                        </View>

                        <View style={[styles.container_form, {marginBottom: 20}]}>
                            <View style={[format.group_relative, {paddingLeft: 84, alignItems:'flex-start'}]}>
                                <View style={{position: "absolute", left: 0, top: 0, width: 60}}>
                                    <Image 
                                        style={{width: 60, height: 60}}
                                        source={require('../../assets/images/activity-vet.png')}
                                    />
                                    <View style={[format.group_relative, { marginTop: 5, flex: 1 }]}>
                                        <MaterialIcons name="access-time" color="#14c498" size={20} style={format.icon_status}/>
                                        <Text style={format.text_status}>Open</Text>
                                    </View>
                                </View>
                                <View style={{position: 'relative', paddingRight: 30}}>
                                    <Text style={format.title_group}>
                                        {dataProvider.cpLongName}
                                    </Text>
                                </View>
                                <Text style={format.text_normal}>
                                    {dataProvider.cpAddress}
                                </Text>
                                <TouchableOpacity style={format.button_edit} onPress={() => navigate('EditProvider', {dataProvider: dataProvider, photosProvider: detailProvider.photos})}>
                                    <Image style={{justifyContent: 'center', height: 27, width: 27}} source={require('../../assets/images/icon-edit.png')}/>
                                </TouchableOpacity>
                            </View>

                            <View style={[styles.form_group, {paddingTop: 20, marginBottom: 0}]}>
                                <View style={{width: '25%', justifyContent: 'center'}}>
                                    <TouchableOpacity 
                                        style={format.button_icon}
                                        onPress={() => navigate('ScheduleDetail', {dataProvider: dataProvider})}
                                    >
                                        <MaterialIcons name="event-note" color="#ee7a23" size={30} />
                                    </TouchableOpacity>
                                    <Text style={format.text_icon}>Schedule</Text>
                                </View>
                                <View style={{width: '25%', justifyContent: 'center'}}>
                                    <TouchableOpacity 
                                        style={format.button_icon}
                                        onPress={() => this._onCall()}
                                    >
                                        <MaterialIcons name="call" color="#ee7a23" size={30} />
                                    </TouchableOpacity>
                                    <Text style={format.text_icon}>Call</Text>
                                </View>
                                <View style={{width: '25%', justifyContent: 'center'}}>
                                    <TouchableOpacity 
                                        style={format.button_icon}
                                        onPress={() => this._onWebsite()}
                                    >
                                        <MaterialIcons name="desktop-windows" color="#ee7a23" size={30} />
                                    </TouchableOpacity>
                                    <Text style={format.text_icon}>Website</Text>
                                </View>
                                <View style={{width: '25%', justifyContent: 'center'}}>
                                    <TouchableOpacity 
                                        style={format.button_icon}
                                        onPress={() => this._onMap()}
                                    >
                                        <MaterialIcons name="map" color="#ee7a23" size={30} />
                                    </TouchableOpacity>
                                    <Text style={format.text_icon}>Map</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{flex: 1, position: 'relative', minHeight: 300, marginBottom: 20}}>
                            { this._renderMap()}
                        </View>
                        {
                            this.state.listReminder && this.state.listReminder.length ?
                            <View style={styles.container_form}>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                    {this.state.listReminder.map((item, index) => {
                                        return(
                                            <TouchableOpacity 
                                                key={item.petInformation.petID} 
                                                style={{position: 'relative', paddingRight: 6, height: 60, marginRight: 18}}
                                                onPress={() => this._toggleCheck(item, index)}
                                            >
                                                <Image 
                                                    style={[styles.image_circle, format.image_circle, {borderColor: '#fb8f8f'}]} 
                                                    source={item.petPortraitURL ? {uri: item.petInformation.petPortraitURL} : require('../../assets/images/img-pet-default.png')}
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
                                    })}
                                </ScrollView>

                                <FlatList 
                                    data={this.state.listReminder}
                                    renderItem={({item}) => (
                                        item.isCheck ?
                                        <View style={[format.group_relative, format.group_item]}>
                                            <View style={{position: 'absolute', left: 0, top: 20}}>
                                                <Image 
                                                    style={[styles.image_circle, format.pet_image]} 
                                                    source={item.petInformation && item.petInformation.petPortraitURL ? {uri: item.petInformation.petPortraitURL} : require('../../assets/images/img-pet-default.png')}
                                                />
                                                <Text style={format.pet_name}>{item.petInformation.petName}</Text>
                                            </View>
                                            <View>
                                                <Text style={format.pet_reminder}>{item.reminderTodo}</Text>
                                                <Text style={format.text_normal}>Repeat: {item.reminderRepeatType}</Text>
                                                <Text style={format.text_normal}>Upcoming: {this._convertLongDateTime(item.reminderDateTime)}</Text>
                                            </View>
                                            <TouchableOpacity style={[format.button_next, {right: -15}]}>
                                                <EvilIcons name="chevron-right" color="#000" size={40} />
                                            </TouchableOpacity>
                                        </View>
                                        : null
                                    )}
                                    keyExtractor={(item, index) => 'reminder' + index.toString()}
                                />
                            </View>
                            : null
                        }

                        <PopupConfirm
                            visible={visibleConfirm}
                            buttonText1={'Cancel'}
                            buttonText2={textButtonConfirm}
                            title={titleConfirm}
                            description={descriptionConfirm}
                            handleButton1={() => this.setState({visibleConfirm: false})}
                            handleButton2={this._handleConfirm}
                        />

                        <PopupNotification
                            visible={visibleNotify}
                            title={titleNotify}
                            description={descriptionNotify}
                            buttonText={'Ok'} 
                            closeDisplay={() => this.setState({visibleNotify: false})}
                            isNegative={isNegativeNotify}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }

    _renderMap() {
        const {detailProvider} = this.state;
        const {dataProvider} = this.props.navigation.state.params;
        if(!detailProvider)
            return null;
        let geometry = detailProvider.geometry;
        const ASPECT_RATIO = (width - 32) / 300;
        const latDelta = (geometry.viewport.northeast.lat - geometry.viewport.southwest.lat) / 2;
        const lngDelta = latDelta * ASPECT_RATIO;
        let region = {
            latitude: geometry.location.lat,
            longitude: geometry.location.lng,
            latitudeDelta: latDelta,
            longitudeDelta: lngDelta
        };
        return (
            <MapView 
                dataProvider="google"
                style={StyleSheet.absoluteFillObject}
                region={region}
                onRegionChangeComplete={() => { this.mark.showCallout(); }}
            >
            <MapView.Marker
                ref={ref => { this.mark = ref; }}
                coordinate={{latitude: detailProvider.geometry.location.lat, longitude: detailProvider.geometry.location.lng}}
            />
            </MapView>
        )
    }

    _onCall = () => {
        const {dataProvider} = this.props.navigation.state.params;
        this.setState({
            titleConfirm: `Call ${dataProvider.cpLongName}?`,
            descriptionConfirm: dataProvider.cpPhone,
            textButtonConfirm: 'Call',
            statusConfirm: 'call',
            visibleConfirm: true
        })
    }

    _onWebsite = () => {
        const {dataProvider} = this.props.navigation.state.params;
        this.setState({
            titleConfirm: 'Open browser?',
            descriptionConfirm: dataProvider.cpWebsite,
            textButtonConfirm: 'Open',
            statusConfirm: 'web',
            visibleConfirm: true
        })
    }

    _onMap = () => {
        const {dataProvider} = this.props.navigation.state.params;
        this.setState({
            titleConfirm: `Open ${dataProvider.cpLongName} in Map?`,
            descriptionConfirm: `${dataProvider.cpLongName}`,
            textButtonConfirm: 'Open',
            statusConfirm: 'map',
            visibleConfirm: true
        })
    }

    _handleConfirm = () => {
        const {dataProvider} = this.props.navigation.state.params;
        const {detailProvider} = this.state;
        const {statusConfirm} = this.state;
        this.setState({
            visibleConfirm: false
        },() => {
            let notify = null;
            if (statusConfirm === 'call'){
                if(dataProvider.cpTelephone)
                    Linking.openURL(`tel:${dataProvider.cpTelephone}`);
                else notify = 'Phone';
            }
            else if(statusConfirm === 'web'){
                if(dataProvider.cpWebsite)
                    Linking.openURL(dataProvider.cpWebsite);
                else notify = 'Website';
            }
            else if(statusConfirm === 'map') {
                if(detailProvider){
                    const latLng = `${detailProvider.geometry.location.lat},${detailProvider.geometry.location.lng}`;
                    const label = dataProvider.cpAddress;
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
            if(notify)
                this.setState({
                    titleNotify: `Oop~ ${notify}'s missing`,
                    descriptionNotify: 'Please try later.',
                    isNegativeNotify: true,
                    visibleNotify: true
                })
        })
    }

    _getDetailProvider = async() => {
        this.setState({loading: true});
        const {dataProvider} = this.props.navigation.state.params;
        let listReminder = [];
        if(dataProvider.reminders && dataProvider.reminders.length){
            listReminder = dataProvider.reminders.map(item => {
                let obj = {...item};
                obj.isCheck = true;
                return obj;
            });;
        }
        await this.props.getDetailProviderAction(dataProvider.cpGoogleMapID);
        if(this.props.getDetailProvider.data){
            this.setState({detailProvider: this.props.getDetailProvider.data.result});
        }
        setTimeout(() => {
            this.setState({listReminder, loading: false})
        }, 300);
    }

    _toggleCheck(item, index){
        let listReminder = [...this.state.listReminder];
        listReminder[index].isCheck = !item.isCheck;
        this.setState({listReminder});
    }

    _convertLongDateTime(data) {
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        data = data.replace(' ', 'T');
        let reminderDate = new Date(data); 
        return `${dateHelper.convertTime(reminderDate)}, ${days[reminderDate.getDay()]}, ${months[reminderDate.getMonth()]} ${reminderDate.getDate()}, ${reminderDate.getFullYear()}`;
    }
}

const mapStateToProps = state =>({
    getDetailProvider: state.getDetailProvider
})

const mapDispatchToProps = {
    getDetailProviderAction
}

export default connect(mapStateToProps, mapDispatchToProps)(CareProviderDetail);

const format = StyleSheet.create({
    group_relative: {
        position: "relative",
        alignItems: 'center',
        justifyContent: 'center',
    },
    group_item: {
        borderTopWidth: 1, 
        borderTopColor: '#e0e0e0', 
        paddingLeft: 64,
        paddingRight: 15,
        paddingTop: 20,
        marginTop: 20
    },  
    icon_status: {
        
    },
    text_status: {
        fontSize: Platform.OS === 'ios' ? 11 : 14,
        fontWeight: '500',
        color: '#14c498'
    },
    title_group: {
        fontSize: Platform.OS === 'ios' ? 17 : 20,
        fontWeight: '700',
        color: '#4e94b2',
        marginBottom: 10
    },
    text_normal: {
        fontSize: Platform.OS === 'ios' ? 12 : 15,
        fontWeight: '400',
        marginBottom: 7,
        color: '#202c3c'
    },
    button_edit: {
        position:'absolute',
        zIndex: 1,
        right: 0,
        borderWidth: 1, 
        borderColor: '#f0f0f0',
        borderRadius: 30/2,
        top: 0
    },
    button_icon: {
        alignSelf: 'center'
    },  
    button_next: {
        position:'absolute',
        zIndex: 1,
        right: 0
    },
    text_icon: {
        textAlign: 'center',
        fontSize: Platform.OS === 'ios' ? 11 : 14,
        fontWeight: '400',
        color: '#202c3c',
        marginTop: 5
    },
    image_circle: {
        width: 60,
        height: 60,
        borderRadius: 60/2
    },
    pet_image: {
        width: 50,
        height: 50,
        borderRadius: 50/2
    },
    pet_name: {
        fontSize: Platform.OS === 'ios' ? 12 : 15,
        fontWeight: '500',
        color: '#ee7a23',
        textAlign: 'center'
    },
    pet_reminder: {
        fontSize: Platform.OS === 'ios' ? 15 : 18,
        fontWeight: '700',
        color: '#202c3c',
        marginBottom: 5,
        textTransform: 'capitalize'
    },
    icon_check: {
        width: 24,
        height: 24,
        position: 'absolute',
        right: 0,
        bottom: 0
    },
});