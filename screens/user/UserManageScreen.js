import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Image,
    ScrollView,
    AsyncStorage,
} from 'react-native';
import {connect} from 'react-redux';
import styles from '../../constants/Form.style';
import { EvilIcons, MaterialIcons } from '@expo/vector-icons';
import PetItem from '../../components/PetItem';
import getPetsByOwnerAction from '../../src/apiActions/pet/getPetsByOwner';
import Menu from '../../components/Menu';
import Spinner from 'react-native-loading-spinner-overlay';
import getAvatarAction from '../../src/apiActions/user/getAvatar';
import userSessionAction from '../../src/apiActions/user/userSession';
import PushNotification from '../../components/PushNotification';
import PopupNotification from '../../components/PopupNotification';
import {persistor} from '../../src/store';
import {dataHelper} from '../../src/helpers';
import { iOS } from '../../src/common';

class UserManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenMenu: false,
            modalVisible: false,
            visibleNotification: false,
            isConnected: false,
            list: [],
            loading: false,
            test: '',
            user: null,
            userAvatar: null,
            textNotify: ''
        }
    }

    async componentWillMount(){
        // if(!this.props.userSession.user)
        //     this._signOutAsync();
        this.setState({loading: true});
    }

    async componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = await navigation.addListener("didFocus", async () => {
            await this.props.userSessionAction(this.props.login.token);
            if(!this.props.userSession.user)
                this._signOutAsync();
            else this._loadData();
        });
    }

    async componentWillUnmount() {
        await this.focusListener.remove();
    }

    render() {
        const {navigate} = this.props.navigation;
        const {user, userAvatar} = this.state;

        return (
            <SafeAreaView style={styles.safeArea}>
                <Menu openMenu={this.state.isOpenMenu} 
                    navigation={this.props.navigation} 
                    closeMenu={() => this.setState({isOpenMenu: false})}
                />
                <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                    <Spinner
                        visible={this.state.loading}
                    />
                    <View style={styles.container}>
                        <View style={{position:'relative', paddingBottom: 25, paddingTop: 25, justifyContent: 'center'}}>
                            <TouchableOpacity style={styles.button_back} onPress={() => this.setState({isOpenMenu: true})}>
                                <MaterialIcons name="menu" color="#000" size={30} />
                            </TouchableOpacity>
                            <Text onPress={this._signOutAsync} style={[styles.title_head, {alignSelf: 'center'}]}> YepiPet </Text>
                            {/* <TouchableOpacity style={[styles.button_back, {right: 0}]}>
                                <Icon name="search" color="#000" size={20} />
                            </TouchableOpacity> */}
                        </View>
                        {
                            user ?
                            <View style={[styles.container_form, styles.form_group]}>
                                <View style={{flex: 0.3, paddingRight: 18}}>                    
                                    <Image style={[styles.image_circle, {marginTop: 15}]} source={ userAvatar ? {uri: userAvatar} : require('../../assets/images/default-avatar.jpg')}/>
                                </View>   
                                <View style={{flex: 0.7}}>
                                    <View style={{position: 'relative'}}>
                                        <Text style={format.user_name}>{user && user.userFirstName} {user && user.userLastName}</Text>
                                        <TouchableOpacity style={format.button_edit} onPress={() => navigate('UserProfile')}>
                                            <Image style={{justifyContent: 'center', height: 27, width: 27}} source={require('../../assets/images/icon-edit.png')}/>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={format.user_email}>{user && user.userEmail}</Text>
                                    <Text style={format.user_phone}>
                                        {user && dataHelper.formatPhone(user.userPhone.toString())}
                                    </Text>
                                    {/* <TouchableOpacity onPress={this._signOutAsync} style={[styles.button_logout, {right: 0, bottom: -10}]}>
                                        <IconAntDesign name="logout" color="#000" size={27} />
                                    </TouchableOpacity> */}
                                </View>
                            </View>
                            : null
                        }
                        {/* -------List Pet------ */}
                        {this._getPetItem()}
                        {/* -------List Pet------ */}
                        <View>
                            <Image style={format.image_style} source={require('../../assets/images/img-dog.png')}/>
                            <TouchableOpacity style={format.button_add} onPress={() => navigate('AddNewPet')}>
                                <Text style={format.button_text_big}>Add new Pet</Text>
                                <Text style={format.button_text_normal}>Tap here to add a new Pet </Text>
                                <Text style={format.button_text_normal}>and create a proﬁle</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <PushNotification 
                            visible={this.state.modalVisible}
                            title={"YepiPet Care Reminder"}
                            description={"Visit Dr. Jeff Chang for annual check up. "}
                            closeDisplay={() => this.setState({modalVisible: false})}
                        />
                        <PopupNotification 
                            visible={this.state.visibleNotification} 
                            buttonText={'Ok'} 
                            closeDisplay={() => this._closeNotification()}
                            title={'Yepi! Successfully Registered.'}
                            description={this.state.textNotify}
                            titleColor={'#14c498'}
                            isNegative={false}
                        />

                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // _signOutAsync = async () => {
    //     await AsyncStorage.clear();
    //     this.props.navigation.navigate('Auth');
    // }

    _signOutAsync = async() => {
        await AsyncStorage.clear();
        persistor.purge();
        this.props.navigation.navigate('Auth');
    }

    _getPetItem = () => {
        const {list} = this.state;
        if(list && list.length){
            return (
                <View>
                    {list.map((pet) => 
                        <PetItem navigation={this.props.navigation} data={pet} key={pet.petID} type={pet.petType}/>
                    )}
                </View>
            );
        }
        return <View></View>;
    }

    _getPetByOwner = async() => {
        // this.setState({loading: true});
        let isConnected = await AsyncStorage.getItem('isConnected', (err, result) => {
            console.log('isConnected', result);
        });
        if(isConnected && !JSON.parse(isConnected)){
            let localStorage = await AsyncStorage.getItem('localStorage');
            let getPetsByOwner = JSON.parse(localStorage).getPetsByOwner;
            let listPet = JSON.parse(getPetsByOwner).list;
            this.setState({list: listPet}, () => {
                setTimeout(() => {
                    this.setState({loading: false})
                }, 300);
            });
            return;
        }
        if(this.props.userSession.user){
            if(this.props.getPetsByOwner.list)
                this.setState({list: this.props.getPetsByOwner.list});
            
            setTimeout(() => {
                this.setState({loading: false})
            }, 100);
        }
    }

    _closeNotification = () => {
        this.setState({visibleNotification: false}, () => {
            this._getPetByOwner();
            this.props.navigation.setParams({petCreated: null});
        })
    }

    _getUser = async() =>{
        let isConnected = await AsyncStorage.getItem('isConnected');
        let user = null;
        let userAvatar = null;
        if(isConnected && !JSON.parse(isConnected)){
            let localStorage = await AsyncStorage.getItem('localStorage');
            localStorage = JSON.parse(localStorage);
            if(localStorage){
                localStorage.userSession = JSON.parse(localStorage.userSession);
                localStorage.getAvatar = JSON.parse(localStorage.getAvatar);
                user = localStorage.userSession.user;
                userAvatar = localStorage.getAvatar.url;
                console.log('localStorage.userSession.user', localStorage.userSession.user);
            }
        }
        else {
            user = this.props.userSession.user;
            userAvatar = this.props.getAvatar.url;
        }
        if(user || userAvatar)
            this.setState({user: user, userAvatar: userAvatar});
    }

    _loadData = () => {
        this.setState({loading: true});
        this._getUser();
        if(this.props.navigation.state.params && this.props.navigation.state.params.petCreated){
            setTimeout(() => {
                this.setState({
                    loading: false,
                    textNotify: this.props.navigation.state.params.petCreated.petName+"'s profile has been successfully added to your account.", 
                    visibleNotification: true});
            }, 300) 
        }
        else this._getPetByOwner();
    }
}

const mapStateToProps = state => ({
    userSession: state.userSession,
    getAvatar: state.getAvatar,
    getPetsByOwner: state.getPetsByOwner,
    getAvatarPet: state.getAvatarPet,
    network: state.network,
    login: state.login
});

const mapDispatchToProps = {
    getPetsByOwnerAction,
    getAvatarAction,
    userSessionAction
}

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);

const format = StyleSheet.create({
    user_name: {
        fontSize: iOS ? 20 : 23,
        fontWeight: '700',
        color: '#ee7a23',
        textTransform: 'capitalize',
        marginBottom: 4,
        paddingRight: 30
    },
    user_email: {
        fontWeight: '400',
        color: '#000000',
        fontSize: iOS ? 11 : 14,
        marginBottom: 7
    },
    user_phone: {
        fontSize: iOS ? 13 : 16,
        fontWeight: '700',
        color: '#000'
    },
    button_edit: {
        position:'absolute',
        zIndex: 1,
        right: 0,
        borderWidth: 1, 
        borderColor: '#f0f0f0',
        borderRadius: 30/2,
    },
    button_add: {
        backgroundColor: '#ee7a23',
        paddingVertical: 10,
        borderRadius: 101/2
    },
    button_text_big: {
        fontWeight: '700',
        fontSize: iOS ? 17 : 20,
        color: '#fff',
        textAlign: 'center'
    },
    button_text_normal: {
        fontWeight: '500',
        color: '#fff',
        fontSize: iOS ? 12 : 15,
        textAlign: 'center'
    },
    image_style: {
        alignSelf: 'center',
        marginBottom: -11,
        position: 'relative',
        zIndex: 1,
        width: 111,
        height: 63
    }
});