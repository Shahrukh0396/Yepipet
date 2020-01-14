import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    AsyncStorage,
    FlatList
} from 'react-native';
import {connect} from 'react-redux';
import styles from '../../constants/Form.style';
import { EvilIcons, MaterialIcons } from '@expo/vector-icons';
import TabMedicalRecord from '../../components/pet-management/TabMedicalRecord';
import TabProfile from '../../components/pet-management/TabProfile';
import Menu from '../../components/Menu';
import HealthAndCare from '../../components/pet-management/HealthAndCare';
import TabCareProvider from '../../components/pet-management/TabCareProvider';
import getPetWeightAction from '../../src/apiActions/pet/getPetWeight';
import {dataHelper} from '../../src/helpers';
import { iOS } from '../../src/common';

class PetManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrTab: [
                {name: 'Health & Care', value: 'Health', icon: require('../../assets/images/icon-health-care.png')},
                {name: 'Profile', value: 'Profile', icon: require('../../assets/images/icon-profile.png')},
                {name: 'Care Provider', value: 'Provider', icon: require('../../assets/images/icon-provider.png')},
                {name: 'Care Log', value: 'Log', icon: require('../../assets/images/icon-care-log.png')},
                {name: 'Medical Record', value: 'Medical', icon: require('../../assets/images/icon-medical-record.png')}
            ],
            typeTab: 'Health',
            isOpenMenu: false,
            petWeight: null
        }
    }

    async componentWillMount(){
        await this._getPetWeight();
    }

    async componentDidUpdate(prevProps){
        const {params} = await this.props.navigation.state;
        if(params && params.petWeight && params.petWeight !== prevProps.navigation.state.params.petWeight || params.petDetail.petWeightUnit !== prevProps.navigation.state.params.petDetail.petWeightUnit )
            await this.setState({petWeight: params.petDetail.petWeightUnit === 'lb' ? dataHelper.convertWeightToLb(params.petWeight) : params.petWeight});
    }

    _openMenu = () => {
        this.setState({isOpenMenu: true});
    }

    render() {
        const {arrTab, typeTab} = this.state;
        const {petDetail} = this.props.navigation.state.params;
        let ageMonth = this._calculateMonthWithoutYears(petDetail.ageInDaysWithoutYears);

        return (
            <SafeAreaView style={styles.safeArea}>
                <Menu openMenu={this.state.isOpenMenu} 
                    navigation={this.props.navigation} 
                    closeMenu={() => this.setState({isOpenMenu: false})}
                />
                <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                    <View style={styles.container}>
                        <View style={{position:'relative', paddingBottom: 22, paddingTop: 25, justifyContent: 'center'}}>
                            <TouchableOpacity style={styles.button_back} onPress={this._openMenu}>
                                <MaterialIcons name="menu" color="#000" size={30} />
                            </TouchableOpacity>
                            <Text style={[styles.title_head, {alignSelf: 'center'}]}> YepiPet </Text>
                            <TouchableOpacity style={[styles.button_back, {right: 0}]}>
                                <EvilIcons name="search" color="#000" size={30} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.group_avatar}>
                            <View style={{alignItems: 'center'}}>
                                <Image style={styles.image_circle} 
                                    source={petDetail.petPortraitURL ? {uri: petDetail.petPortraitURL} : require('../../assets/images/img-pet-default.png')}
                                />
                                <View style={{flexDirection:'row', flexWrap:'wrap', marginBottom: 8, alignItems: 'stretch'}}>
                                    <Text style={styles.pet_name}>{petDetail && petDetail.petName}</Text>
                                    <Text style={styles.pet_info}>
                                        {petDetail && petDetail.ageInYears} {petDetail.ageInYears > 1 ? `Years` : `Year`} { ageMonth ? ageMonth > 1 ? `${ageMonth} Months` : `${ageMonth} Month` : null }
                                    </Text>
                                </View>
                            </View>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                {
                                    arrTab.map((item) => {
                                        return (
                                            <TouchableOpacity 
                                                style={format.nav_btn}
                                                disabled={item.value === typeTab}
                                                onPress={() => this.setState({typeTab: item.value})}
                                                key={item.value}
                                            >
                                                <Image 
                                                    style={[
                                                        format.nav_icon, 
                                                        item.value === typeTab ? format.nav_icon_active : {}
                                                    ]} 
                                                    source={item.icon}
                                                />
                                                <Text style={format.nav_text}>{item.name}</Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                        <View>
                            {this._renderTab()}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }

    _renderTab() {
        const {petDetail} = this.props.navigation.state.params;
        const {petWeight} = this.state;
        let ageMonth = this._calculateMonthWithoutYears(petDetail.ageInDaysWithoutYears);
        if (this.state.typeTab === 'Profile')
            return <TabProfile navigation={this.props.navigation} data={petDetail} petWeight={petWeight && petWeight.toString()}/>
        else if (this.state.typeTab === 'Provider')
            return <TabCareProvider navigation={this.props.navigation} data={petDetail} />
        else if (this.state.typeTab === 'Log')
            return <TabMedicalRecord navigation={this.props.navigation} />
        else if (this.state.typeTab === 'Medical')
            return <TabMedicalRecord navigation={this.props.navigation} />
        else return <HealthAndCare navigation={this.props.navigation} data={petDetail} ageMonth={ageMonth} petWeight={petWeight && petWeight.toString()}/>;
    }

    _calculateMonthWithoutYears = (day) => {
        if(day)
            return Math.round(day /30);
        return 0;
    }

    _getPetWeight = async () => {
        const {petDetail} = this.props.navigation.state.params;
        await this.props.getPetWeightAction(petDetail.petID);
        if(this.props.getPetWeight.data && this.props.getPetWeight.data.length){
            let petWeight = this.props.getPetWeight.data[this.props.getPetWeight.data.length - 1].petWeightValue;
            this.setState({
                petWeight: petDetail.petWeightUnit === 'lb' ? dataHelper.convertWeightToLb(petWeight) : petWeight
            });
        }
        
        if(this.props.getPetWeight.error)
            return;
    }
}

const mapStateToProps = state => ({
    getPetWeight: state.getPetWeight
});

const mapDispatchToProps = {
    getPetWeightAction
}

export default connect(mapStateToProps, mapDispatchToProps)(PetManagement);

const format = StyleSheet.create({
    nav_btn: {
        alignItems: 'center',
        marginBottom: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.09,
        shadowRadius: 2,  
        elevation: 5,
        width: 80,
        paddingHorizontal: 10
    },  
    nav_icon: {
        width: 60,
        height: 60,
        borderRadius: 61/2,
        borderWidth: 1,
        borderColor: 'transparent',
        marginBottom: 12
    },
    nav_icon_active: {
        borderColor: '#ee7a23'
    },
    nav_text: {
        fontWeight: 'bold',
        fontSize: iOS ? 10 : 13,
        color: '#000',
        textAlign: 'center'
    }
})