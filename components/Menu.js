import React, {Component} from 'react';
import { 
    View, 
    Text, 
    Image, 
    TouchableOpacity, 
    StyleSheet, 
    ScrollView, 
    Dimensions, 
    Animated, 
    Easing,
    AsyncStorage 
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styles from '../constants/Form.style';
import { MaterialIcons } from '@expo/vector-icons';
const {width: viewWidth, height: viewHeight} = Dimensions.get('window');
import {persistor} from '../src/store';

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leftAnim: new Animated.Value(-viewWidth),
            zIndexView: new Animated.Value(-1),
            opacityView: new Animated.Value(0),
            isOpen: false,
        }
    }

    static propTypes = {
        openMenu: PropTypes.bool
    }

    static defaultProps = {
        openMenu: false
    }

    // componentWillMount(){
    //     if(!this.props.userSession.user)
    //         this._signOutAsync();
    // }


    render() {
        const {navigate} = this.props.navigation;
        const {user} = this.props.userSession;
        const {leftAnim, zIndexView, opacityView, isOpen} = this.state;

        return (
            <Animated.View 
                style={[
                    format.safe_area, 
                    {left: leftAnim, zIndex: zIndexView, opacity: opacityView}
                ]}
            >
            <View style={{position: 'relative'}}>
                <View style={format.overlay}>
                    <TouchableOpacity 
                        style={{position: 'absolute', right: 0, top: 56, width: 40}}
                        onPress={this._closeMenu}
                        disabled={!isOpen}
                    >
                        <MaterialIcons name="menu" color="#fff" size={30}/>
                    </TouchableOpacity>
                </View>
                <View style={{padding: 13, width: viewWidth - 56, backgroundColor: '#fff', height: viewHeight - 40}}>
                    <View style={[styles.form_group, format.group_border]}>
                        <View style={{flex: 0.3, paddingRight: 18}}>                    
                            <Image style={styles.image_circle} source={ (this.props.getAvatar && this.props.getAvatar.url) ? {uri: this.props.getAvatar.url} : require('../assets/images/default-avatar.jpg')}/>
                        </View>   
                        <View style={{flex: 0.7}}>
                            <View style={{position: 'relative'}}>
                                <Text style={format.user_name}>{user && user.userFirstName} {user && user.userLastName}</Text>
                            </View>
                            <Text style={format.user_email}>{user && user.userEmail}</Text>
                            <Text style={format.user_phone}>{user && user.userPhone}</Text>
                        </View>
                    </View>
                    <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                        <View style={format.menu_item}>
                            <Image style={format.menu_icon} source={require('../assets/images/icon-setting.png')}/>
                            <Text style={format.menu_text}>SETTING</Text>
                        </View>
                        <View style={format.menu_item}>
                            <Image style={format.menu_icon} source={require('../assets/images/icon-help-center.png')}/>
                            <Text style={format.menu_text}>HELP CENTER</Text>
                        </View>
                        <View style={format.menu_item}>
                            <Image style={format.menu_icon} source={require('../assets/images/icon-rate-us.png')}/>
                            <Text style={format.menu_text}>RATE US</Text>
                        </View>
                        <View style={format.menu_item}>
                            <Image style={format.menu_icon} source={require('../assets/images/icon-share.png')}/>
                            <Text style={format.menu_text}>TELL A FRIEND</Text>
                        </View>
                        <View style={format.menu_item}>
                            <Image style={format.menu_icon} source={require('../assets/images/icon-term.png')}/>
                            <Text style={format.menu_text}>TERM OF USE</Text>
                        </View>
                        <View style={format.menu_item}>
                            <Image style={format.menu_icon} source={require('../assets/images/icon-backup.png')}/>
                            <Text style={format.menu_text}>BACKUP & RESTORE </Text>
                        </View>
                        <View style={format.menu_item}>
                            <Image style={format.menu_icon} source={require('../assets/images/icon-contact.png')}/>
                            <Text style={format.menu_text}>CONTACT US</Text>
                        </View>
                        <View style={[format.menu_item, {paddingBottom: 40}]}>
                            <Image style={format.menu_icon} source={require('../assets/images/icon-logout.png')}/>
                            <Text style={format.menu_text} onPress={this._signOutAsync}>LOG OUT</Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
            </Animated.View>
        )
    }

    componentWillReceiveProps(nextProps){
        this.setState({ isOpen: nextProps.openMenu });
        setTimeout(() => {
            if(this.state.isOpen){
                Animated.parallel([
                    Animated.timing(
                        this.state.opacityView,
                        {
                            duration: 10,
                            toValue: 1,
                            easing: Easing.linear
                        }
                    ),
                    Animated.timing(
                        this.state.zIndexView,
                        {
                            duration: 10,
                            toValue: 10,
                            easing: Easing.linear
                        }
                    ),
                    Animated.timing(    
                        this.state.leftAnim,
                        {
                            delay: 10,
                            duration: 500,
                            toValue: 0,
                            easing: Easing.linear
                        }
                    )
                ]).start();
            }
        })
    }

    componentDidUpdate(prevProps) {
        // this.setState({isOpen: prevProps.openMenu}); 
        // if(prevProps.openMenu !== this.props.openMenu){
            // this.setState({          
            //     changedProp: this.props.changedProp
            // });
            // console.log('ssssssssssssssss', this.props.openMenu);
        // }
        // if(this.state.isOpen){
        //     Animated.timing(    
        //         this.state.leftAnim,
        //         {
        //             duration: 1000,
        //             toValue: 0,
        //             easing: Easing.linear
        //         }
        //     ).start();
        // }
    }

    _closeMenu = () => {
        if(this.props.closeMenu){
            this.props.closeMenu();
            this.setState({
                isOpen: false,
                leftAnim: new Animated.Value(0),
                zIndex: new Animated.Value(10),
                opacityView: new Animated.Value(1),
            }); 
            setTimeout(() => {
                Animated.parallel([
                    Animated.timing(    
                        this.state.leftAnim,
                        {
                            duration: 500,
                            toValue: -viewWidth,
                            easing: Easing.linear
                        }
                    ),
                    Animated.timing(
                        this.state.zIndexView,
                        {
                            delay: 500,
                            duration: 10,
                            toValue: -1,
                            easing: Easing.linear
                        }
                    ),
                    Animated.timing(
                        this.state.opacityView,
                        {
                            delay: 500,
                            duration: 200,
                            toValue: 0,
                            easing: Easing.linear
                        }
                    ),
                ]).start();
            })
        }
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
}

const mapStateToProps = state => ({
    userSession: state.userSession,
    getAvatar: state.getAvatar
});

export default connect(mapStateToProps)(Menu);

const format = StyleSheet.create({
    safe_area: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },  
    group_border: {
        borderBottomColor: '#e9e5e1',
        borderBottomWidth: 1,
        paddingVertical: 22,
        marginBottom: 0
    },
    menu_item: {
        marginTop: 30,
        position: 'relative',
        paddingLeft: 34
    },
    menu_icon: {
        width: 20,
        height: 20,
        position: 'absolute',
        left: 0
    },
    menu_text: {
        color: '#202c3c',
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
        backgroundColor: 'transparent'
    },
    user_name: {
        fontSize: 23,
        fontWeight: '700',
        color: '#ee7a23',
        textTransform: 'capitalize',
        marginBottom: 4,
        paddingRight: 30
    },
    user_email: {
        fontWeight: '400',
        color: '#000000',
        fontSize: 14,
        marginBottom: 7
    },
    user_phone: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000'
    }
})