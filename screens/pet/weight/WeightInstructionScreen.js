import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import styles from '../../../constants/Form.style';
import { EvilIcons } from '@expo/vector-icons';
import updatePetAction from '../../../src/apiActions/pet/updatePet';
import getPetsByOwnerAction from '../../../src/apiActions/pet/getPetsByOwner';
import {connect} from 'react-redux';
import PopupNotification from '../../../components/PopupNotification';

class WeightInstruction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            weightNote: null,
            visibleNotification: false,
            titleNotification: '',
            descriptionNotification: '',
            isNegative: false
        }
    };

    componentWillMount() {
        const {petDetail} = this.props.navigation.state.params;
        if(petDetail)
            this.setState({weightNote: petDetail.petWeightNote});
    }

    render () {
        const {visibleNotification, titleNotification, descriptionNotification, isNegative, weightNote} = this.state;

        return (
            <KeyboardAvoidingView
                behavior="padding"
                enabled 
                style={{ flex: 1 }}
            >
                <SafeAreaView style={styles.safeArea}>
                    <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                        <View style={styles.container}>
                            <View style={{position:'relative', paddingBottom: 22, paddingTop: 25, justifyContent: 'center'}}>
                                <TouchableOpacity 
                                    style={styles.button_back} 
                                    onPress={() => this.props.navigation.goBack()}
                                >
                                    <Image style={{width: 12, height: 21}} source={require('../../../assets/images/icon-back.png')}/>
                                </TouchableOpacity>
                                <Text style={[styles.title_head, {alignSelf: 'center'}]}>Weighing Instructions</Text>
                            </View>

                            <View style={styles.container_form}>
                                <Text style={[styles.title_container, {paddingRight: 40, fontWeight: '700'}]}>
                                    Weighing Instructions
                                </Text>
                                <TextInput
                                    placeholder="This is an example of text areafor notes "
                                    style={[styles.form_input, {height: 82}]}
                                    value={weightNote}
                                    editable = {true}
                                    maxHeight = {82}
                                    multiline = {true}
                                    onChangeText={(weightNote) => this.setState({weightNote})}
                                />
                                <TouchableOpacity 
                                    style={styles.form_button}
                                    onPress={this._updateWeighingInstruction}
                                >
                                    <Text style={styles.button_text}>Save</Text>
                                </TouchableOpacity>
                            </View>
                            <PopupNotification 
                                visible={visibleNotification} 
                                buttonText={'Ok'} 
                                closeDisplay={() => this.setState({visibleNotification: false})}
                                title={titleNotification}
                                description={descriptionNotification}
                                isNegative={isNegative}
                            />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        )
    }

    _updateWeighingInstruction = async () => {
        const {petDetail} = this.props.navigation.state.params;
        const {weightNote} = this.state;

        if(petDetail.petWeightNote !== weightNote){
            let data = petDetail;
            data.petWeightNote = weightNote;
            await this.props.updatePetAction(data);
            if(this.props.updatePet.data)
                this.props.navigation.navigate('WeightGrowth', {petDetail: this.props.updatePet.data});

            if(this.props.updatePet.error){
                this.setState({
                    titleNotification: 'Update failed!',
                    descriptionNotification: 'Please try again.',
                    visibleNotification: true
                });
                return;
            }
            await this.props.getPetsByOwnerAction(petDetail.userID);
        }

        this.props.navigation.navigate('WeightGrowth', {petDetail: petDetail});
    }

}   

const mapStateToProps = state => ({
    updatePet: state.updatePet
});

const mapDispatchToProps = {
    updatePetAction,
    getPetsByOwnerAction
};

export default connect(mapStateToProps, mapDispatchToProps)(WeightInstruction);

const format = StyleSheet.create({

});