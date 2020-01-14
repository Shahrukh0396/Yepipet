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
    FlatList,
    KeyboardAvoidingView
} from 'react-native';
import styles from '../../../constants/Form.style';
import { EvilIcons } from '@expo/vector-icons';
import {connect} from 'react-redux';
import { Grid, XAxis, YAxis, LineChart } from 'react-native-svg-charts';
import {dataHelper, dateHelper} from '../../../src/helpers';
import createPetWeightAction from '../../../src/apiActions/pet/createPetWeight';
import PopupNotification from '../../../components/PopupNotification';
import PopupConfirm from '../../../components/PopupConfirm';
import ItemWeightRecord from '../../../components/weight/ItemWeightRecord';
import {WeightType} from '../../../src/common';
import {WeightTypes} from '../../../static/pets';
import getPetWeightAction from '../../../src/apiActions/pet/getPetWeight';
import deletePetWeightAction from '../../../src/apiActions/pet/deletePetWeight';
import Spinner from 'react-native-loading-spinner-overlay';

class WeightGrowth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterChart: [
                {value: 'WEEK'},
                {value: 'MONTH'},
                {value: 'YEAR'}
            ],
            filterValue: 'MONTH',
            petWeight: null,
            petWeightUnit: 'lb',
            arrWeightType: WeightTypes,
            dataChartWeight: [],
            dataDate: [],
            axesSvg: { fontSize: 10, fill: 'grey' },
            verticalContentInset: { top: 10, bottom: 10 },
            xAxisHeight: 30,
            visibleNotification: false,
            titleNotification: '',
            descriptionNotification: '',
            isNegative: false,
            arrPetWeight: [],
            loading: false,
            dataWeightCurrent: null,
            dataConfirm: null,
            descriptionConfirm: null,
            visibleConfirm: false,
            isDeleteSuccess: false,
            isCreateSuccess: false
        }
    };

    componentWillMount() {
        const {petDetail} = this.props.navigation.state.params;
        this.setState({
            petWeightUnit: petDetail.petWeightUnit
        });
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", async () => {
            if(this.props.navigation.state.params.petDetail)
                await this._getPetWeights();
        });
    }
    
    componentWillUnmount() {
        this.focusListener.remove();
    }

    render () {
        const {
            filterChart,
            filterValue,
            petWeight,
            dataChartWeight,
            dataDate,
            axesSvg,
            verticalContentInset,
            xAxisHeight,
            arrWeightType,
            petWeightUnit,
            visibleNotification,
            titleNotification,
            descriptionNotification,
            arrPetWeight,
            loading,
            dataWeightCurrent,
            dataConfirm,
            visibleConfirm,
            descriptionConfirm
        } = this.state;

        const {petDetail} = this.props.navigation.state.params;

        return (
            <KeyboardAvoidingView
                behavior="padding"
                enabled 
                style={{ flex: 1 }}
            >
                <SafeAreaView style={styles.safeArea}>
                    <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                        <Spinner visible={loading}/>
                        <View style={styles.container}>
                            <View style={{position:'relative', paddingBottom: 22, paddingTop: 25, justifyContent: 'center'}}>
                                <TouchableOpacity 
                                    style={styles.button_back} 
                                    onPress={() => this.props.navigation.goBack()}
                                >
                                    <Image style={{width: 12, height: 21}} source={require('../../../assets/images/icon-back.png')}/>
                                </TouchableOpacity>
                                <Text style={[styles.title_head, {alignSelf: 'center'}]}>Weight Growth</Text>
                            </View>

                            <View style={[styles.container_form, {position: 'relative', marginBottom: 20}]}>
                                <Text style={[styles.title_container, {paddingRight: 40, marginBottom: 10, fontWeight: '700'}]}>
                                    Weighing Instructions
                                </Text>
                                <TouchableOpacity 
                                    style={format.button_edit}
                                    onPress={() => this.props.navigation.navigate('WeightInstruction', {petDetail: petDetail})}
                                >
                                    <Image style={{justifyContent: 'center', height: 27, width: 27}} source={require('../../../assets/images/icon-edit.png')}/>
                                </TouchableOpacity>
                                <Text style={styles.text_normal}>
                                    {petDetail.petWeightNote}
                                </Text>
                            </View>
                            
                            <View style={[styles.container_form, {position: 'relative', marginBottom: 20}]}>
                                <Text style={[styles.title_container, {paddingRight: 40, fontWeight: '700'}]}>
                                    {petDetail.petName}'s current weight as of {dataWeightCurrent && dateHelper.convertUTCToDate(dataWeightCurrent.petWeightDate)}
                                </Text>
                                <Image style={format.icon_chart} source={require('../../../assets/images/icon-chart.png')}/>

                                {/* <View style={{marginBottom: 20}}>
                                    <View style={[styles.group_radio, {borderColor: '#f0f0f0'}]}>
                                        {filterChart.map((data, i) => {
                                            return(
                                                <TouchableOpacity 
                                                    key={data.value} 
                                                    style={[
                                                        styles.btn_radio, format.btn_radio,
                                                        filterValue == data.value ? {backgroundColor: '#14c498'} : {},
                                                        {flex: 1/(filterChart.length)},
                                                        i === 0 ? styles.btn_radio_noborder : {}
                                                    ]}
                                                    onPress={()=>{this.setState({filterValue: data.value})}}
                                                >
                                                    <Text style={format.btn_radio_text}>{data.value}</Text>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </View> */}
                                <View style={{alignItems: 'flex-end'}}>
                                    <TouchableOpacity style={format.info_weight}>
                                        <Text style={{color: '#fff', fontWeight: '700', color: '#fff', textAlign: 'center'}}>
                                            {petDetail.petWeightUnit === WeightType.Lb ? dataWeightCurrent && dataHelper.convertWeightToLb(dataWeightCurrent.petWeightValue) : dataWeightCurrent && dataWeightCurrent.petWeightValue || 0} 
                                            &nbsp;{petDetail.petWeightUnit}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {
                                    dataChartWeight.length > 1 && dataDate.length ? 
                                    <View style={{ height: 200, flexDirection: 'row' }}>
                                        <YAxis
                                            data={dataChartWeight}
                                            style={{ marginBottom: xAxisHeight }}
                                            contentInset={verticalContentInset}
                                            svg={axesSvg}
                                            formatLabel={ value => `${value} ${petDetail.petWeightUnit}` }
                                            min={0}
                                        />
                                        <View style={{ flex: 1, marginLeft: 10 }}>
                                            <LineChart
                                                style={{ flex: 1 }}
                                                data={dataChartWeight}
                                                contentInset={verticalContentInset}
                                                svg={{ stroke: '#14c498' }}
                                                gridMin={ 0 }
                                            >
                                                <Grid/>
                                            </LineChart>
                                            <XAxis
                                                style={{ marginHorizontal: -10, height: xAxisHeight, zIndex: 1 }}
                                                data={dataDate}
                                                formatLabel={(value, index) => `${dataDate[index]}`}
                                                contentInset={{ left: 20, right: 20 }}
                                                spacingInner={0.01}
                                                svg={axesSvg}
                                            />
                                        </View>
                                    </View>
                                    :
                                    null
                                }
                            </View>
                                

                            <View style={[styles.container_form, {marginBottom: 20}]}>
                                <Text style={[styles.title_container, {fontWeight: '700', marginBottom: 10}]}>
                                    Weight
                                </Text>
                                <View style={[styles.form_group, {marginBottom: 0}]}>
                                    <TextInput 
                                        contextMenuHidden={true}
                                        keyboardType={'numeric'} 
                                        style={[styles.form_input, {flex: 0.6, marginRight: 16}]} 
                                        value={petWeight}
                                        placeholder="Enter Weight"
                                        onChangeText={(petWeight) => this.setState({petWeight: petWeight.replace(',', '.')})}
                                    />
                                    <View style={[styles.group_radio, {flex: 0.4}]}>
                                        {arrWeightType.map((data, i) => {
                                            return(
                                                <TouchableOpacity 
                                                    key={data.value} 
                                                    style={[
                                                        styles.btn_radio,
                                                        petWeightUnit === data.value ? styles.btn_radio_active : {},
                                                        {flex: 1/(arrWeightType.length)},
                                                        i === 0 ? styles.btn_radio_noborder : {}
                                                    ]}
                                                    onPress={()=> this._convertWeight(data.value)}
                                                    disabled={petWeightUnit === data.value}
                                                >
                                                    <Text style={{color: petWeightUnit === data.value ? '#fff' : '#000', textAlign: 'center', fontSize: 16}}>{data.name}</Text>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </View>
                                <TouchableOpacity 
                                    style={styles.form_button}
                                    onPress={() => this._createPetWeight()}
                                >
                                    <Text style={styles.button_text}>Save</Text>
                                </TouchableOpacity>
                            </View>

                             <View style={styles.container_form}>
                                <Text style={[styles.title_container, {fontWeight: '700', marginBottom: 0}]}>
                                    Weigh records
                                </Text>
                                <View style={{maxHeight: 300}}>
                                    <FlatList
                                        data={arrPetWeight}
                                        renderItem={({item, index}) => (
                                            <ItemWeightRecord 
                                                pet={petDetail}
                                                dataBefore={arrPetWeight[index + 1]}
                                                data={item}
                                                isLastChild={index === arrPetWeight.length - 1}
                                                navigation={this.props.navigation}
                                                onDelete={() => this._confirmDeletePetWeight(item)}
                                            />
                                        )}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View>
                            </View>

                            <PopupNotification 
                                visible={visibleNotification} 
                                buttonText={'Ok'} 
                                closeDisplay={() => this._closeNotification()}
                                title={titleNotification}
                                description={descriptionNotification}
                                titleColor={'#000'}
                                isNegative={this.state.isNegative}
                            />

                             <PopupConfirm
                                data={dataConfirm}
                                visible={visibleConfirm}
                                buttonText1={'Cancel'}
                                buttonText2={'Delete'}
                                title={'Meow. Delete a Weight Record?'}
                                description={descriptionConfirm}
                                handleButton1={() => this.setState({visibleConfirm: false})}
                                handleButton2={this._deletePetWeight}
                                isNegative={true}
                            />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        )
    }

    _convertWeight(value) {
        let weight = 0;
        let petWeight = this.state.petWeight;
        this.setState({petWeightUnit: value}, () => {
            if(this.state.petWeightUnit === WeightType.Lb)
                weight = dataHelper.convertWeightToLb(petWeight);
            else weight = dataHelper.convertWeightToKg(petWeight);
            this.setState({petWeight: weight});
        }); 
    }

    _createPetWeight = async () => {
        this.setState({loading: true});
        const {petDetail} = this.props.navigation.state.params;
        const {petWeightUnit, petWeight} = this.state;
        if(!petWeight){
            this.setState({
                isNegative: true,
                titleNotification: "Oops. Something's missing!",
                descriptionNotification: 'Please enter weight.',
                visibleNotification: true
            });
            return;
        }

        let data = {
            petID: petDetail.petID,
            petWeightDate: new Date().toUTCString(),
            petWeightEnteredBy: this.props.userSession.user.userID,
            petWeightValue: petWeightUnit === WeightType.Lb ? Number(dataHelper.convertWeightToKg(petWeight)) : Number(petWeight)
        }
        await this.props.createPetWeightAction(data);
        if(this.props.createPetWeight.data)
            this.setState({
                loading: false,
                isCreateSuccess: true,
                isNegative: false,
                titleNotification: 'Yepi! Successfully Created.',
                descriptionNotification: '',
                visibleNotification: true
            });

        if(this.props.createPetWeight.error)
            this.setState({
                loading: false,
                isNegative: true,
                titleNotification: 'Error',
                descriptionNotification: 'Create weight record failed. Please try again."',
                visibleNotification: true
            });
    }

    _confirmDeletePetWeight(data) {
        const {petDetail} = this.props.navigation.state.params;
        let title = "";
        let weight = petDetail.petWeightUnit === WeightType.Lb ? dataHelper.convertWeightToLb(data.petWeightValue) : data.petWeightValue;
        let datetime = this._convertUTCToDateTime(data.petWeightDate);
        this.setState({
            dataConfirm: data,
            descriptionConfirm: `Warning: This will permanently delete weight record (${weight} ${petDetail.petWeightUnit}) entered at ${dateHelper.convertTime(datetime)}, ${dateHelper.convertDate(datetime)}`,
            visibleConfirm: true
        });
    }

    _deletePetWeight = (data) => {
        this.setState({visibleConfirm: false}, async() => {
            await this.props.deletePetWeightAction(data);

            if(this.props.deletePetWeight.data){
                this.setState({
                    isDeleteSuccess: true,
                    isNegative: false,
                    titleNotification: 'Yepi! Successfully Deleted.',
                    descriptionNotification: '',
                    visibleNotification: true
                });
            }
                
            if(this.props.deletePetWeight.error)
                this.setState({
                    isNegative: true,
                    titleNotification: 'Error',
                    descriptionNotification: 'Delete weight record failed. Please try again.',
                    visibleNotification: true
                })
        });
    }

    _closeNotification() {
        const {petDetail} = this.props.navigation.state.params;
        const {isCreateSuccess, isDeleteSuccess} = this.state; 
        this.setState({visibleNotification: false}, () => {
            if(isCreateSuccess || isDeleteSuccess){
                this.setState({
                    isDeleteSuccess: false,
                    isCreateSuccess: false,
                    petWeight: null,
                    petWeightUnit: petDetail.petWeightUnit
                });
                this._getPetWeights();
            }
        });
    }

    _getPetWeights = () => {
        this.setState({loading: true}, async () => {
            const {petDetail} = this.props.navigation.state.params;
            await this.props.getPetWeightAction(petDetail.petID);
            if(this.props.getPetWeight.data && this.props.getPetWeight.data.length){
                if(this.props.getPetWeight.data.length > 1){
                    let data = this.props.getPetWeight.data.filter(item => item.petWeightDeleted !== 'Y');
                    this._getDataChartWeight(data);
                    let dataSort = data.sort((item1, item2) => this._convertUTCToDateTime(item2.petWeightDate)-this._convertUTCToDateTime(item1.petWeightDate) || item2.petWeightID-item1.petWeightID);
                    this.setState({arrPetWeight: dataSort, dataWeightCurrent: dataSort[0], loading: false});
                }
                else this.setState({arrPetWeight: this.props.getPetWeight.data, dataWeightCurrent: this.props.getPetWeight.data[0], loading: false});
            }
            // console.log('ffffffffff');
            else this.setState({loading: false});
        });
    } 

    _getDataChartWeight = (data) => {
        const {petDetail} = this.props.navigation.state.params;
        let arrSlice = data.length > 7 ? data.slice(data.length - 7, data.length) : data;
        let dataChart = [];
        let dataDate = arrSlice.map(item => this._convertChartDate(item.petWeightDate));
        if(petDetail.petWeightUnit === WeightType.Lb)
            dataChart = arrSlice.map(item => Number(dataHelper.convertWeightToLb(item.petWeightValue)));
        else dataChart = arrSlice.map(item => item.petWeightValue);
        this.setState({
            dataDate: dataDate,
            dataChartWeight: dataChart
        }, () => {
            console.log('dataChartWeight', this.state.dataChartWeight);
            console.log('dataDate', this.state.dataDate);
        });
    }

    _convertUTCToDateTime(value) {
        if(value)
            return new Date(value.replace('+0000', 'Z'));
        return null;
    }

    _convertChartDate = (value) => {
        if(value){
            let datetime = new Date(this._convertUTCToDateTime(value));
            let date = datetime.getDate() < 10 ? ('0' + datetime.getDate()) : datetime.getDate();
            let month = (datetime.getMonth() + 1) < 10 ? ('0'+(datetime.getMonth() + 1))  : (datetime.getMonth() + 1) ;
            return month + '/' + date;
        }
        return '';
    }   
}


const mapStateToProps = state => ({
    createPetWeight: state.createPetWeight,
    userSession: state.userSession,
    getPetWeight: state.getPetWeight,
    deletePetWeight: state.deletePetWeight
});

const mapDispatchToProps = {
    createPetWeightAction,
    getPetWeightAction,
    deletePetWeightAction
};

export default connect(mapStateToProps, mapDispatchToProps)(WeightGrowth);

const format = StyleSheet.create({
    button_edit: {
        position:'absolute',
        zIndex: 1,
        right: 16,
        top: 16,
        borderWidth: 1, 
        borderColor: '#f0f0f0',
        borderRadius: 30/2,
    },
    text_normal: {
        color: '#202c3c',
        fontSize: 15,
        fontWeight: '500'
    },
    icon_chart: {
        position: 'absolute',
        right: 16,
        top: 20,
        width: 20,
        height: 16
    },
    btn_radio: {
        height: 20,
        paddingVertical: 5,
        backgroundColor: '#f0f0f0',
        borderColor: '#f0f0f0'
    },
    btn_radio_text: {
        color: '#202c3c', 
        textAlign: 'center', 
        fontSize: 9, 
        fontWeight: '600'
    },
    record_group: {
        position: 'relative',
        paddingRight: 50,
        paddingVertical: 20,
        borderBottomColor: '#e7e7e8',
        borderBottomWidth: 1,
        justifyContent: 'center'
    },
    color_green: {
        color: '#14c498'
    },
    button_next: {
        position: 'absolute',
        right: 0
    },
    info_weight: {
        height: 23, 
        borderRadius: 23/2,
        backgroundColor: '#14c498',
        paddingVertical: 3,
        paddingHorizontal: 8
    }
});