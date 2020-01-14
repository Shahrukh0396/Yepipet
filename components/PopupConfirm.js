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

export default class PopupConfirm extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         modalVisible: false,
    //     }
    // }

    static propTypes = {
        visible: PropTypes.bool,
        buttonText1: PropTypes.string,
        buttonText2: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        isNegative: PropTypes.bool,
        backgroundButton1: PropTypes.string,
        backgroundButton2: PropTypes.string,
        data: PropTypes.object
    }

    static defaultProps = {
        visible: false,
        buttonText1: 'Cancel',
        buttonText2: 'Confirm',
        isNegative: false
    }

    //Close Popup
    handleButton1(){
        if(this.props.handleButton1){
            this.props.handleButton1();
        }
    }

    handleButton2(){
        if(this.props.handleButton2){
            this.props.handleButton2(this.props.data);
        }
    }

    render() {
        const {
            visible, 
            buttonText1, 
            buttonText2, 
            title, 
            description, 
            isNegative, 
            backgroundButton1, 
            backgroundButton2
        } = this.props;
        
        return (
            <Modal
                onRequestClose={()=>{}}
                animationType="fade"
                transparent={true}
                visible={visible}
            >
                <View style={format.popup_backdrop}>
                    <View style={format.popup_container}>
                        {/* <ScrollView scrollEnabled={true} scrollEventThrottle={200}> */}
                            <View style={{alignItems: 'center', marginBottom: 16}}>
                            {
                                isNegative? 
                                <Image style={{width: 145, height: 122}} source={require('../assets/images/img-dog-negative.png')}/>
                                : <Image style={{width: 145, height: 107}} source={require('../assets/images/img-dog-confirm.png')}/>
                            }
                            </View>
                            <Text style={format.text_title}>{title}</Text>
                            <Text style={format.text_description}>{description}</Text>
                            <View style={styles.form_group}>
                                <TouchableOpacity
                                    onPress={() => this.handleButton1()}
                                    style={[
                                        styles.form_button, 
                                        {flex: 0.5, marginRight: 5},
                                        backgroundButton1 ? {backgroundColor: backgroundButton1} : format.form_button1
                                    ]}
                                >
                                    <Text style={[styles.button_text, {color: '#000000'}]}>{buttonText1}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.handleButton2()}
                                    style={[
                                        styles.form_button, 
                                        {flex: 0.5, marginLeft: 5},
                                        backgroundButton2 ? {backgroundColor: backgroundButton2} : {}, 
                                    ]}
                                >
                                    <Text style={styles.button_text}>{buttonText2}</Text>
                                </TouchableOpacity>
                            </View>
                        {/* </ScrollView> */}
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
        // alignItems: 'center'
        textAlign: 'center'
    },
    text_title: {
        color: '#000000',
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
    form_button1:{
        backgroundColor: '#ebebf1'
    }
});