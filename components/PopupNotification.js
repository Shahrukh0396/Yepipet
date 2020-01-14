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

export default class PopupNotification extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         modalVisible: false,
    //     }
    // }

    static propTypes = {
        visible: PropTypes.bool,
        buttonText: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        titleColor: PropTypes.string,
        isNegative: PropTypes.bool
    }

    static defaultProps = {
        visible: false,
        buttonText: 'Ok',
        titleColor: '#000',
        isNegative: false
    }

    //Close Popup
    close() {
        if(this.props.closeDisplay){
            this.props.closeDisplay();
        }
    }

    render() {
        const {visible, buttonText, title, description, titleColor, isNegative} = this.props;
        
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
                                <Image  style={{width: 145, height: 122}} source={require('../assets/images/img-dog-negative.png')}/>
                                : <Image  style={{width: 145, height: 107}} source={require('../assets/images/img-dog-confirm.png')}/>
                            }
                            </View>
                            <Text style={[format.text_title, {color: titleColor}]}>{title}</Text>
                            <Text style={format.text_description}>{description}</Text>
                            <TouchableOpacity
                                onPress={() => this.close()}
                                style={styles.form_button}
                            >
                                <Text style={styles.button_text}>{buttonText}</Text>
                            </TouchableOpacity>
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
    }
});