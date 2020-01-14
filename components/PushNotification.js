import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    ScrollView,
    Modal,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';
import styles from '../constants/Form.style';
import PropTypes from 'prop-types';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
import { EvilIcons } from '@expo/vector-icons';

export default class PopupNotification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrStatus: [
                {name: "Don't Remind Me", value: "Don't Remind Me"},
                {name: 'Complete', value: 'Complete'},
                {name: 'Reminder Later', value: 'Reminder Later'}
            ],
            status: "Don't Remind Me"
        }
    }

    static propTypes = {
        visible: PropTypes.bool,
        title: PropTypes.string,
        description: PropTypes.string
    }

    static defaultProps = {
        visible: false,
        titleColor: '#000'
    }

    //Close Popup
    close(){
        if(this.props.closeDisplay){
            this.props.closeDisplay();
        }
    }

    render() {
        const {visible, buttonText, title, description, titleColor, isNegative} = this.props;
        const {arrStatus} = this.state;
        
        return (
            <Modal 
                onRequestClose={()=>{}}
                animationType="fade"
                transparent={true}
                visible={visible}
            >
                <View style={format.popup_backdrop}>
                    <View style={format.popup_container}>
                        <TouchableOpacity 
                            style={format.button_close}
                            onPress={() => this.close()}
                        >
                            <EvilIcons name="close-o" size={40} color="#000000"/>
                        </TouchableOpacity>
                        <View style={{alignItems: 'center', marginBottom: 16}}>
                            <Image  style={{width: 145, height: 107}} source={require('../assets/images/img-dog-confirm.png')}/>
                        </View>
                        <Text style={format.text_title}>{title}</Text>
                        <Text style={format.text_description}>{description}</Text>
                        <View style={[styles.group_radio, {marginTop: 10, borderWidth: 0, paddingBottom: 60}]}>
                            {arrStatus.map((item, i) => {
                                return(
                                    <View key={item.value} style={{flex: 1/(arrStatus.length)}}>
                                        <TouchableOpacity
                                            style={[
                                                styles.btn_radio,
                                                {borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e0e0e0'},
                                                item.value === this.state.status ? styles.btn_radio_active : {},
                                                i === (arrStatus.length - 1) ? {borderRightWidth: 1} : {},
                                            ]}
                                           onPress={() => this.setState({status: item.value})}
                                        >
                                            <Text style={{color: item.value === this.state.status ? '#fff' : '#000', textAlign: 'center', fontSize: 16}}>{item.name}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const format = StyleSheet.create({
    popup_backdrop: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 16,
        paddingTop: 50,
        height: viewportHeight
    },
    popup_container: {
        borderRadius: 8,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 30,
        textAlign: 'center',
        position: 'relative'
    },
    text_title: {
        color: '#000',
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 15,
        textAlign: 'center'
    },
    text_description: {
        color: '#425159',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 20,
        textAlign: 'center',
    },
    button_close: {
        position: 'absolute',
        right: 15,
        top: 15
    }
});