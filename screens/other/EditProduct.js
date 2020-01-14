import React, { Component } from "react";
import { Alert, View, Text, DatePickerAndroid, StyleSheet, ScrollView, SafeAreaView, Dimensions, TextInput, Image, Picker, Switch, PickerIOS, Platform } from "react-native";
import { AntDesign, FontAwesome, Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import NotFound from "../../assets/imagenotfound.png";
import { TouchableOpacity } from "react-native-gesture-handler";
import styles from '../../constants/Form.style';
import Edit_Pet_Info from '../../src/apiActions/pet/createPet'
import Amazon from "../../assets/Amazon.jpg";
import Petsmart from "../../assets/petsmart-logo.jpeg";
import Costco from "../../assets/costco-logo.png";
import Walmart from "../../assets/Walmart.jpg";
import { baseURL } from "../../src/apiActions";
import { connect } from 'react-redux';
import PantryModal from '../../components/pantry/modal/PantryModal'
import ModalComponent from '../../components/pantry/modal/Modal';
import userSessionAction from '../../src/apiActions/user/userSession';


const { fontScale } = Dimensions.get("screen")

class EditProduct extends Component {

    constructor() {
        super();
        this.state = {
            inventory: false,
            pricewatch: false,
            RefillNotification: false,
            Switchpricewatch: false,
            currentQTY: 0,
            getID: null,
            itemBrand: " ",
            itemName: " ",
            itemLocation: " ",
            itemQuantity: null,
            itemCategory: " ",
            priceWatchCurrentPrice: "",
            modalVisibleDelete: false,
            descriptionDelete: null,
            descriptionSave: null,
            descriptionDeleted:null,
            descriptionSaved:null,
            isNegative: false,
            titleNotification: null,
            descriptionNotification: null,
            modalVisible: false,
            EditProduct: false,
            pentryModal: false,
        }
    }



    incrementQTY = () => {
        this.setState({ currentQTY: ++this.state.currentQTY });
    }

    decrementQTY = () => {
        if (this.state.currentQTY === 0) return;
        else this.setState({ currentQTY: --this.state.currentQTY });
    }
    saveItem = async () => {
        // Alert.alert(
        //     'Meow.save an Item?',
        //     'save Super clean soap from your Pantry',
        //     [
        //         {
        //             text: 'Cancel',
        //             onPress: () => console.log('Cancel Pressed'),
        //             style: 'cancel',
        //         },
        //         {
        //             text: 'Save', onPress: async () => {
        //                 await this.saveProduct();
        //                 this.props.navigation.navigate("pentry");
        //                 Alert.alert(
        //                     'Hoot! Successfully Added',
        //                     'Super Clean Soap is successfully Added to your pantry. Ok',
        //                     [
        //                         { text: "OK", style: 'cancel' }
        //                     ],
        //                     { cancelable: true },
        //                 );


        //             }
        //         },
        //     ],
        //     { cancelable: true },
        // );
        const { EditProduct } = this.props.navigation.state.params

        await this.setState({
            descriptionSave: ` This will update  ${this.state.itemBrand} in Pantry list.`,
            modalVisibleDelete: true
        })
    }


    saveProduct = async () => {
        try {
            let watchList = [];
            if (this.state.isAmazonSelected) watchList.push("amazonUS");
            else if (this.state.isCostcoSelected) watchList.push("costcoUS")
            else if (this.state.isPetsmartSelected) watchList.push("petSmartUS")
            else if (this.state.isWalmartSelected) watchList.push("walmartUS")
            const response = await fetch(`${baseURL}/pantry/update`, {
                method: "POST",
                body: JSON.stringify({
                    "collectionID": this.state.collectionID,
                    "customItem": true,
                    "itemBrand": this.state.itemBrand,
                    "itemID": this.state.itemID,
                    "itemCategory": this.state.itemCategory,
                    "itemLocation": this.state.itemLocation,
                    "itemName": this.state.itemName,
                    "itemQuantity": this.state.itemQuantity,
                    "itemRefillNotification": this.state.RefillNotification,
                    "itemRefillTimeUnit": this.state.Every,
                    "itemRefillTimeValue": this.state.everydt,
                    "priceWatchCurrentPrice": this.state.currentPrice,
                    "priceWatchEnabled": this.state.Switchpricewatch,
                    "priceWatchPricePoint": this.state.price,
                    "priceWatchSalesEventAvailable": true,
                    "priceWatchSalesEventEndDate": "",
                    "priceWatchSiteList": watchList,
                    "priceWatchUsualPrice": this.state.normalPrice,
                    "userID": this.props.userSession.user.userID
                }),
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json"
                }
            })
            const parsedJSON = await response.json()
            console.log(parsedJSON, "parsedJSON")
        } catch (error) {
            console.log(error);

        }
        this.props.navigation.navigate("pentry")
        this.setState({
            EditProduct: false,
            pentryModal: true
        })
    }


    deleteItem = async () => {
        const { EditProduct } = this.props.navigation.state.params

        await this.setState({
            descriptionDelete: `Warning: This will permanently delete ${this.state.itemBrand} from Pantry list.`,
            modalVisibleDelete: true
        })
    }

    deletePantry = async (data) => {
        console.log('deletePantry -------------------')
        // const {EditProduct} = this.props.navigation.state.params
        try {
            console.log(this.state.itemID, "item IDDD")
            const response = await fetch(`${baseURL}/pantry/delete/${this.state.itemID}`, {
                method: "GET",
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json"
                }
            })
            console.log("response");
            const delID = await response.json();
            console.log(delID);
            this.setState({ delID: delID[0] })
        }
        catch (error) {
            console.log(error, "error")
        }
        this.props.navigation.navigate("pentry")
        this.setState({
            EditProduct: false,
            pentryModal: true
        })
    }

    componentWillMount() {

        this.setState({
            itemID: this.props.data.createPet.data.data.itemID,
            itemBrand: this.props.data.createPet.data.data.itemBrand,
            itemQuantity: this.props.data.createPet.data.data.itemQuantity,
            itemCategory: this.props.data.createPet.data.data.itemCategory,
            itemLocation: this.props.data.createPet.data.data.itemLocation,
            itemName: this.props.data.createPet.data.data.itemName,


        })
        // this.setState({...this.props.data.createPet.data.data})
    }

    render() {
        const { navigate } = this.props.navigation;
        console.log(this.state, "statee");
        console.log(this.props.data.createPet.data.data, "ediiiiit");
        const {
            modalVisibleDelete,
            descriptionDelete,
            descriptionSave,
            descriptionDeleted,
            descriptionSaved,
            isNegative,
            modalVisible,
            titleNotification,
            descriptionNotification,
        } = this.state;

        const EditProduct = this.props.navigation.state.params && this.props.navigation.state.params.EditProduct;


        return (
            <SafeAreaView style={Styles.safeArea}>
                <ScrollView>

                    <View>
                        <View style={Styles.header}>
                            <View>
                                <AntDesign onPress={() => navigate("pentry")} name="left" size={25} />
                            </View>
                            <View>
                                <Text style={Styles.heading}>Edit Product</Text>
                            </View>
                        </View>
                        <View style={{
                            backgroundColor: 'white', borderColor: 'lightgray', borderWidth: 1, marginTop: 20,
                            paddingBottom: 30, width: "90%", alignSelf: "center", borderRadius: 20
                        }}>
                            <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: fontScale * 18 }}>Product</Text>
                            </View>
                            <View style={{ justifyContent: 'center', marginLeft: 10 }}>

                                <View style={{ paddingHorizontal: 20, marginTop: 15, marginLeft: 5 }}>
                                    <Text style={{ color: "rgb(200,200,200)", fontSize: 12, paddingBottom: 5 }}>
                                        Category
                                    </Text>
                                    <TextInput
                                        value={this.state.itemCategory}
                                        onChangeText={(val) => this.setState({ itemCategory: val })}
                                        style={{ borderWidth: 0.5, borderRadius: 5, justifyContent: 'center', backgroundColor: 'rgb(252,252,252)', height: 37.5, width: "98%" }} />
                                </View>
                                <View style={{ paddingHorizontal: 20, marginTop: 15, marginLeft: 5 }}>
                                    <Text style={{ color: "rgb(200,200,200)", fontSize: 12, paddingBottom: 5 }}>
                                        Brand
                                    </Text>
                                    <TextInput
                                        value={this.state.itemBrand}
                                        onChangeText={(val) => this.setState({ itemBrand: val })}
                                        style={{ borderWidth: 0.5, borderRadius: 5, justifyContent: 'center', backgroundColor: 'rgb(252,252,252)', height: 37.5, width: "98%" }} />
                                </View>
                                <View style={{ paddingHorizontal: 20, marginTop: 15, marginLeft: 5 }}>
                                    <Text style={{ color: "rgb(200,200,200)", fontSize: 12, paddingBottom: 5 }}>
                                        Product
                                    </Text>
                                    <TextInput
                                        value={this.state.itemName}
                                        onChangeText={(val) => this.setState({ itemName: val })}
                                        style={{ borderWidth: 0.5, borderRadius: 5, justifyContent: 'center', backgroundColor: 'rgb(252,252,252)', height: 37.5, width: "98%" }} />
                                </View>
                                <View style={{ paddingHorizontal: 20, marginTop: 15, marginLeft: 5 }}>
                                    <Text style={{ color: "rgb(200,200,200)", fontSize: 12, paddingBottom: 5 }}>
                                        Location
                                    </Text>
                                    <TextInput
                                        value={this.state.itemLocation}
                                        onChangeText={(val) => this.setState({ itemLocaltion: val })}
                                        style={{ borderWidth: 0.5, borderRadius: 5, justifyContent: 'center', backgroundColor: 'rgb(252,252,252)', height: 37.5, width: "98%" }} />
                                </View>
                                <View style={{ paddingHorizontal: 20, marginTop: 15, marginLeft: 5 }}>
                                    <Text style={{ color: "rgb(200,200,200)", fontSize: 12, paddingBottom: 5 }}>
                                        Quantity
                                    </Text>
                                    <TextInput
                                        value={this.state.itemQuantity.toString()}
                                        onChangeText={(val) => this.setState({ itemQuantity: val })}
                                        style={{
                                            borderWidth: 0.5, borderRadius: 5, justifyContent: 'center',
                                            backgroundColor: 'rgb(252,252,252)', height: 37.5, width: "98%"
                                        }} />
                                </View>
                            </View>


                            <View style={{ paddingHorizontal: 20, marginTop: 15, paddingVertical: 2 }}>
                                <Text style={{ fontSize: fontScale * 20, fontWeight: "700" }}>Price Watch & Store</Text>
                            </View>

                            <View style={{ paddingHorizontal: 20, marginTop: 15, paddingVertical: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: "#14c498", fontSize: 12 }}>Push Notification</Text>
                                <View style={{ borderRadius: 50, paddingVertical: 2, paddingHorizontal: 20 }}>
                                    <Switch value={this.state.RefillNotification} style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                                        value={this.state.priceWatchEnabled}
                                        onValueChange={(val) => this.setState({ RefillNotification: val })}
                                    />
                                </View>

                            </View>

                            <View style={{
                                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly',
                                paddingHorizontal: 18, paddingBottom: 15, marginTop: 20, width: '100%', alignSelf: 'center'
                            }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Ionicons name="ios-pricetag" color="rgb(238,122,35)" size={25} />
                                    <Text style={{ fontSize: 12, marginLeft: 5 }}>Price</Text>
                                </View>
                                <View style={{ borderWidth: 0.25, height: 40, width: Dimensions.get("window").width * 0.6, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 4, borderRadius: 7.5 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 10 }}>
                                        <Text>$</Text>
                                        <TextInput
                                            style={{ height: 40, width: Dimensions.get("window").width * 0.65 }}
                                            value={this.state.priceWatchCurrentPrice.toString()}
                                            onChangeText={(val) => this.setState({ priceWatchCurrentPrice: val })} />
                                    </View>
                                </View>
                            </View>

                            <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30, paddingBottom: 15, marginTop: 20, flexDirection: 'row', width: '90%', alignSelf: 'center' }}>

                                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                    <TouchableOpacity onPress={() => this.setState({ isAmazonSelected: !this.state.isAmazonSelected })} style={{ borderWidth: 0.25, marginHorizontal: 20, marginVertical: 5, height: 100 }}>
                                        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 5 }}>
                                            {
                                                this.state.isAmazonSelected &&
                                                <AntDesign name="checkcircle" size={20} color="rgb(20,196,152)" style={{ position: 'absolute', right: 0, top: 0, zIndex: 100 }} />
                                            }
                                            <Image style={{ width: 110, height: 90 }} source={Amazon} />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => this.setState({ isCostcoSelected: !this.state.isCostcoSelected })}
                                        style={{ borderWidth: 0.25, marginHorizontal: 20, marginVertical: 5, height: 100 }}>
                                        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 5 }}>

                                            {
                                                this.state.isCostcoSelected &&
                                                <AntDesign name="checkcircle" size={20} color="rgb(20,196,152)" style={{ position: 'absolute', right: 0, top: 0, zIndex: 100 }} />
                                            }
                                            <Image style={{ width: 110, height: 90 }} source={Costco} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', }}>
                                    <TouchableOpacity
                                        onPress={() => this.setState({ isPetsmartSelected: !this.state.isPetsmartSelected })}
                                        style={{ borderWidth: 0.25, marginHorizontal: 20, marginVertical: 5, height: 100 }}>

                                        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 5 }}>
                                            {
                                                this.state.isPetsmartSelected &&
                                                <AntDesign name="checkcircle" size={20} color="rgb(20,196,152)" style={{ position: 'absolute', right: 0, top: 0, zIndex: 100 }} />
                                            }
                                            <Image style={{ width: 110, height: 90 }} source={Petsmart} />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => this.setState({ isWalmartSelected: !this.state.isWalmartSelected })}

                                        style={{ borderWidth: 0.25, marginHorizontal: 20, marginVertical: 5, height: 100 }}>

                                        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 5 }}>
                                            {
                                                this.state.isWalmartSelected &&
                                                <AntDesign name="checkcircle" size={20} color="rgb(20,196,152)" style={{ position: 'absolute', right: 0, top: 0, zIndex: 100 }} />
                                            }
                                            <Image style={{ width: 110, height: 90, zIndex: 1 }} source={Walmart} />
                                        </View>
                                    </TouchableOpacity>

                                </View>
                            </View>

                            <View style={{ paddingHorizontal: 20, marginTop: 15, paddingVertical: 2 }}>
                                <Text style={{ fontSize: fontScale * 20, fontWeight: '700' }}>Pet & Instructions</Text>
                            </View>

                            <View style={{
                                width: "88%", alignSelf: "center", flexDirection: "row", alignItems: "center", height: 80,
                                justifyContent: "space-around", marginTop: 10, borderRadius: 10, borderWidth: 1, borderColor: 'lightgrey'
                            }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity style={{ position: 'relative', paddingRight: 6, height: 60, marginRight: 18, paddingLeft: 5 }}>
                                        <Image
                                            style={[Styles.image_circle, { borderColor: 'orange', borderWidth: 0.5 }]}
                                            source={require('../../assets/images/img-pet-default.png')}
                                        />
                                    </TouchableOpacity>
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontSize: fontScale * 20 }}>Juno</Text>
                                            <Text style={{ fontSize: fontScale * 10, backgroundColor: 'rgb(234,251,247)', marginLeft: 10, paddingHorizontal: 2 }}>2 Year</Text>
                                        </View>
                                        <Text style={{ fontSize: fontScale * 10 }}>Give 2 cup twice deaily</Text>
                                    </View>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={() => navigate("UsageAmount")}>
                                        <Entypo name="chevron-thin-right" size={20} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{
                                width: "88%", alignSelf: "center", flexDirection: "row", alignItems: "center", height: 80,
                                justifyContent: "space-around", marginTop: 15, borderRadius: 10, borderWidth: 1, borderColor: 'lightgrey'
                            }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity style={{ position: 'relative', paddingRight: 6, height: 60, marginRight: 18, paddingLeft: 5 }}>
                                        <Image
                                            style={[Styles.image_circle, { borderColor: 'orange', borderWidth: 0.5 }]}
                                            source={require('../../assets/images/img-pet-default.png')}
                                        />
                                    </TouchableOpacity>
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontSize: fontScale * 20 }}>Juno</Text>
                                            <Text style={{ fontSize: fontScale * 10, backgroundColor: 'rgb(234,251,247)', marginLeft: 10, paddingHorizontal: 2 }}>2 Year</Text>
                                        </View>
                                        <Text style={{ fontSize: fontScale * 10 }}>Give 2 cup twice deaily</Text>
                                    </View>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={() => navigate("UsageAmount")}>
                                        <Entypo name="chevron-thin-right" size={20} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View>
                            
                                <TouchableOpacity
                                    style={styles.form_button}
                                    onPress={() => this.setState({ EditProduct: !this.state.EditProduct })}
                                >
                                    <Text style={styles.button_text}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.form_button, { backgroundColor: 'red' }]}
                                    onPress={() => this.setState({ EditProduct: !this.state.EditProduct })}
                                >
                                    <Text style={styles.button_text}>Delete</Text>
                                </TouchableOpacity>
                            
                            </View>

{/* // {TODO: delete props has to be pass} */}

                            {this.state.EditProduct ?
                                <ModalComponent
                                    visible={this.state.EditProduct}
                                    buttonText1={'Cancel'}
                                    buttonText2={'Save'}
                                    title={'Meow. Save an Item?'}
                                    description={descriptionSave}
                                    handleButton1={() => this.setState({ EditProduct: false })}
                                    handleButton2={this.saveProduct}
                                    isNegative={true}
                                />

                                :
                                <ModalComponent
                                    visible={this.state.EditProduct}
                                    buttonText1={'Cancel'}
                                    buttonText2={'Delete'}
                                    title={'Meow. Delete an Item?'}
                                    description={descriptionDelete}
                                    handleButton1={() => this.setState({ EditProduct: false })}
                                    handleButton2={this.deletePantry}
                                    isNegative={true}
                                />
                            }

                            {
                                this.state.pentryModal ?
                                <PantryModal
                                    visible={this.state.pentryModal}
                                    buttonText1={'Okay'}
                                    title={'Hoot! Successfully Added'}
                                    description={descriptionSaved}
                                    handleButton1={() => this.setState({ pentryModal: false})}
                                    isNegative={true}
                                />
                                :
                                <PantryModal 
                                    visible={this.state.pentryModal}
                                    buttonText1={'Okay'}
                                    title={descriptionDeleted}
                                    handleButton1={() => this.setState({pentryModal: false})}
                                    isNegative={true}
                                />
                            }

                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}



const Category = [
    "Food",
    "Medication",
    "Cleaning",
    "Health",
    "Supplement",
    "Toy",
    "Treat",
    "clothes",
    "Training",
    "Walk",
    "Potty"
]
const Every = [
    "Day",
    "Week",
    "Month",
    "Year"
]
const Location = [
    "Garage",
    "Kitchen",
    "Pantry",
    "Freezer",
    "Fridge",
    "Storage"
]

const mapStateToProps = state => ({
    userSession: state.userSession,
    data: state
});

const mapDispatchToProps = {
    userSessionAction,
};



export default connect(mapStateToProps, mapDispatchToProps)(EditProduct);



const Styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fcfcfc',
        paddingTop: 20,
        position: 'relative'
    },
    header: {
        paddingTop: 20,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    heading: {
        fontSize: fontScale * 18,
        fontWeight: "bold",
        marginRight: 150
    },
    Search: {
        alignSelf: "center",
        width: "90%",
        borderWidth: 1,
        borderColor: "grey",
        height: 80,
        marginTop: 10
    },
    SearchText: {
        fontSize: fontScale * 22,
        paddingLeft: 10,
        textDecorationLine: "underline"
    },
    image_circle: {
        width: 60,
        height: 60,
        borderRadius: 60 / 2
    },
})



//                                