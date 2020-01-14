import React, { Component } from "react";
import { connect } from "react-redux";
import { Alert, View, Text, ImageBackground, DatePickerAndroid, StyleSheet, ScrollView, SafeAreaView, Dimensions, TextInput, Image, Picker, Switch, PickerIOS, Platform } from "react-native"
import { AntDesign, FontAwesome, Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import NotFound from "../../assets/imagenotfound.png"
import { TouchableOpacity } from "react-native-gesture-handler";
import Amazon from "../../assets/Amazon.jpg";
import Petsmart from "../../assets/petsmart-logo.jpeg";
import Costco from "../../assets/costco-logo.png";
import Walmart from "../../assets/Walmart.jpg";
import { baseURL } from "../../src/apiActions";
import {Dropdown} from "react-native-material-dropdown";
import userSessionAction from '../../src/apiActions/user/userSession';
import Editpet from '../../src/apiActions/pet/editPet';
import Modal from '../../components/pantry/modal/Modal'


const { fontScale } = Dimensions.get("screen")

class AddProduct extends Component {

    constructor() {
        super();
        this.state = {
            inventory: false,
            pricewatch: false,
            isAmazonSelected: false,
            isPetsmartSelected: false,
            isCostcoSelected: false,
            isWalmartSelected: false,
            RefillNotification: false,
            // pricewatch: false,
            weightType: 'lb',
            currentQTY: 0,
            searchQuery: "",
            queriedData: null,
            everydt: null,
            Category: Category[0],
            Location: Location[0],
            Every: Every[0],
            price: "",
            // priceWatchSiteList:[],
            SiteList: SiteList[0]
        }
    }


    setSearchQuery = (searchQuery) => this.setState({ searchQuery })

    incrementQTY = () => {
        this.setState({ currentQTY: ++this.state.currentQTY });
    }

    decrementQTY = () => {
        if (this.state.currentQTY === 0) return;
        else this.setState({ currentQTY: --this.state.currentQTY });
    }

    executeSearchQuery = async () => {
        try {
            const response = await fetch(`${baseURL}/pantry/Collection/Search/${this.state.searchQuery}`, {
                method: "GET",
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json"
                }
            })
            console.log("response");
            const queriedData = await response.json();
            console.log(queriedData,"Queried Dataaaa");
            this.setState({ queriedData: queriedData[0] });
        } catch (error) {
            console.log("error");
            console.log(error);

        }
    }
    saveItem = () => {
        Alert.alert(
            'Meow.save an Item?',
            'save Super clean soap from your Pantry',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Save', onPress: async () => {
                        await this.saveProduct();
                        this.props.navigation.navigate("pentry");
                        Alert.alert(
                            'Hoot! Successfully Added',
                            'Super Clean Soap is successfully Added to your pantry. Ok',
                            [
                                { text: "OK", style: 'cancel' }
                            ],
                            { cancelable: true },
                        );


                    }
                },
            ],
            { cancelable: true },
        );
    }


    saveProduct = async () => {
        try {
            let watchList = [];
            if (this.state.isAmazonSelected) watchList.push("amazonUS");
            else if (this.state.isCostcoSelected) watchList.push("costcoUS")
            else if (this.state.isPetsmartSelected) watchList.push("petSmartUS")
            else if (this.state.isWalmartSelected) watchList.push("walmartUS")
            const response = await fetch(`${baseURL}/pantry/create`, {
                method: "POST",
                body: JSON.stringify({
                    "collectionID": this.state.queriedData.collectionID,
                    "customItem": true,
                    "itemBrand": this.state.queriedData.itemBrand,
                    "itemID": 0,
                    "itemCategory": this.state.Category,
                    "itemLocation": this.state.Location,
                    "itemName": this.state.queriedData.itemName,
                    "itemQuantity": this.state.currentQTY,
                    "itemRefillNotification": this.state.RefillNotification,
                    "itemRefillTimeUnit": this.state.Every,
                    "itemRefillTimeValue": this.state.everydt,
                    "priceWatchCurrentPrice": this.state.queriedData.currentPrice,
                    "priceWatchEnabled": this.state.Switchpricewatch,
                    "priceWatchPricePoint": this.state.price,
                    "priceWatchSalesEventAvailable": true,
                    "priceWatchSalesEventEndDate": "",
                    "priceWatchSiteList": watchList,
                    "priceWatchUsualPrice": this.state.queriedData.normalPrice,
                    "userID": this.props.userSession.user.userID
                }),
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json"
                }
            })
            const parsedJSON = await response.json()
        } catch (error) {
            console.log(error);

        }
    }

    render() {
        const { navigate } = this.props.navigation;
        console.log(this.executeSearchQuery,"data query")
        
        return (
            <SafeAreaView style={Styles.safeArea}>
                <ScrollView>
                    <View>
                        <View style={Styles.header}>
                            <View>
                                <AntDesign onPress={() => navigate("pentry")} name="left" size={25} />
                            </View>
                            <View>
                                <Text style={Styles.heading}>Add Product</Text>
                            </View>
                        </View>

                        <View style={{backgroundColor:'white',borderColor:'lightgray',borderWidth:1,marginTop:20,
                        paddingBottom:30,width:"90%",alignSelf:"center",borderRadius:20}}>
                        <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: fontScale * 18 }}>Search</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingBottom: 15, marginTop: 5 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => navigate("BarcodeScanner")}>
                                    <MaterialCommunityIcons name="barcode-scan" color="rgb(78,148,178)" size={30} />
                                </TouchableOpacity>
                                <Text style={{ fontWeight: 'bold', marginLeft: 8 }}>UPC</Text>

                            </View>
                            <View style={{ borderWidth: 0.25, height: 40, width: Dimensions.get("window").width * 0.55, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 5, borderRadius: 7.5, marginRight: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',width:'90%' }}>
                                    <View style={{ width: 30 }}>
                                        <AntDesign name="search1" color="grey" size={20} />
                                    </View>
                                    <View>
                                        <TextInput
                                            style={{  width: Dimensions.get("window").width * 0.65, alignItems:'center',paddingTop:1 }}
                                            placeholder="Search"
                                            onChangeText={this.setSearchQuery}
                                            onSubmitEditing={this.executeSearchQuery} />
                                    </View>
                                </View>
                                <View style={{ marginRight: 5,position:'relative' }}>
                                    <Ionicons name="ios-mic" size={20} color="black" />
                                </View>
                            </View>
                        </View>

                        <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: fontScale * 18 }}>Product</Text>
                        </View>

                        <View style={{ paddingHorizontal: 24, marginTop: 15 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                <View style={{ marginHorizontal: 5 ,width:"45%" }}>
                                    <Text style={{ color: "rgb(200,200,200)", fontSize: 12, paddingBottom: 5 }}>Category</Text>
                                    <View style={{ borderWidth: 0.5, borderRadius: 5,height:38, padding: 0 }}>
                                        
                                        <Dropdown 
                                        
                                        labelFontSize={8} itemTextStyle={{fontSize:10}}
                                        pickerStyle={{marginTop:50,width:'36%',alignItems:'center',alignSelf:'center',marginHorizontal:18}} 
                                        inputContainerStyle={{borderBottomWidth:0 ,width:'90%',alignSelf:'center'}}
                                         dropdownOffset={{top: 8, left: 0}}    data={Category}
                                        
                                         onChangeText={(val) => this.setState({Category : val})}
                                         
                                         />
                                        {/* <Picker selectedValue={Category[0]} style={{ height: 25, opacity: Platform.OS === "ios" ? 0 : 1, width: 175 }} >
                                            {
                                                Category.map(itm =>
                                                    <Picker.Item label={itm} value={itm} key={itm} />
                                                )
                                            }
                                        </Picker> */}
                                    </View>
                                </View>
                                <View style={{ marginHorizontal: 5 }}>
                                    <Text style={{ color: "rgb(200,200,200)", fontSize: 12, paddingBottom: 5 }}>Brand</Text>
                                    <View style={{ borderWidth: 0.5, borderRadius: 5, backgroundColor: 'rgb(252,252,252)', 
                                    height: 37.5, width: 145, justifyContent: 'center', paddingHorizontal: 10 }}>
                                        <Text>{this.state.queriedData === null ? "" : this.state.queriedData.itemBrand}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={{ paddingHorizontal: 20, marginTop: 15,marginLeft:5 }}>
                            <Text style={{ color: "rgb(200,200,200)", fontSize: 12, paddingBottom: 5 }}>Product</Text>
                            <View style={{ borderWidth: 0.5, borderRadius: 5, justifyContent: 'center', backgroundColor: 'rgb(252,252,252)', height: 37.5, width: "98%" }}>
                                <Text style={{ marginHorizontal: 15 }}>{this.state.queriedData === null ? "" : this.state.queriedData.itemName}</Text>
                            </View>
                        </View>


                        <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
                            <Text style={{ color: "rgb(200,200,200)", fontSize: 12, paddingBottom: 5,paddingLeft:5 }}>Location</Text>
                            <View style={{ borderWidth: 0.5, borderRadius: 5, backgroundColor: 'rgb(252,252,252)', padding: 5, width: "96%",alignSelf:'center' }}>
                            <Dropdown labelFontSize={8}  itemTextStyle={{fontSize:10}}
                                        
                                        pickerStyle={{marginTop:40,width:'77%',alignSelf:'center',marginHorizontal:18}} 
                                        inputContainerStyle={{borderBottomWidth:0 ,width:'100%',alignSelf:'center', height:25}}
                                        rippleInsets={{top: 0, bottom: -4 }}
                                         dropdownOffset={{top: 8, left: 0}}    data={Location} 
                                         onChangeText={(val) => this.setState({Location : val})}/>
                                {/* <Picker selectedValue={this.state.Location}
                                    style={{ height: 37.5, opacity: Platform.OS === "ios" ? 0 : 1, width: "100%" }}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ Location: itemValue })}
                                >
                                    {
                                        Location.map(itm =>
                                            <Picker.Item label={itm} value={itm} key={itm} />
                                        )
                                    }

                                </Picker> */}
                            </View>
                        </View>

                        <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
                            <Text style={{ color: "rgb(200,200,200)", fontSize: 12, paddingBottom: 5,paddingLeft:5 }}>Refill</Text>
                            <View style={{ borderWidth: 0.5, borderRadius: 5, backgroundColor: 'rgb(252,252,252)', paddingh: 5, width: "96%",alignSelf:'center' }}>
                             
                            <Dropdown labelFontSize={8}  itemTextStyle={{fontSize:10}}
                                        
                                        pickerStyle={{marginTop:50,width:'77%',alignSelf:'center',marginHorizontal:18}} 
                                        inputContainerStyle={{borderBottomWidth:0 ,width:'97%',alignSelf:'center', height:30}}
                                        rippleInsets={{top: 0, bottom: -4 }}
                                         dropdownOffset={{top: 8, left: 0}}   data={Every} 
                                         onChangeText={(val) => this.setState({Every :val})}/>
                                {/* <Picker onValueChange={(itemValue, itemIndex) => this.setState({ Every: itemValue })}
                                    style={{ height: 37.5 }}
                                >
                                    {
                                        Every.map(itm =>
                                            <Picker.Item label={itm} value={itm} key={itm} />
                                        )
                                    }
                                </Picker> */}
                            </View>
                        </View>

                        
                        <View style={{ paddingHorizontal: 20, marginTop: 15, paddingVertical: 2}}>
                            <Text style={{ color: "rgb(200,200,200)", fontSize: 12, paddingBottom: 5,paddingLeft:5 }}>Quantity</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',width:'95%',alignSelf:'center'}}>
                                <TouchableOpacity onPress={this.decrementQTY} style={{ width: 50, backgroundColor: 'rgb(200,200,200)', marginHorizontal: 0.25 }}>
                                    <View style={{ borderWidth: 0.5, alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: 'rgb(252,252,252)', height: 37.5 }}>
                                        <Text style={{ fontSize: 18 }}>-</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{ width: "50%", backgroundColor: 'rgb(200,200,200)', marginHorizontal: 0.25 }}>
                                    <View style={{ borderWidth: 0.5, alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: 'rgb(252,252,252)', height: 37.5 }}>
                                        <Text style={{ fontSize: 18 }}>{this.state.currentQTY.toString()}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={this.incrementQTY} style={{ width: 50, backgroundColor: 'rgb(200,200,200)', marginHorizontal: 0.25 }}>
                                    <View style={{ borderWidth: 0.5, alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: 'rgb(252,252,252)', height: 37.5 }}>
                                        <Text style={{ fontSize: 18 }}>+</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ paddingHorizontal: 20, marginTop: 15, paddingVertical: 2 }}>
                            <Text style={{ fontSize: fontScale * 20,fontWeight:"700" }}>Price Watch & Store</Text>
                        </View>

                        <View style={{ paddingHorizontal: 20, marginTop: 15, paddingVertical: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ color: "#14c498", fontSize: 12 }}>Push Notification</Text>
                            <View style={{ borderRadius: 50, paddingVertical: 2, paddingHorizontal: 20 }}>
                                <Switch value={this.state.RefillNotification} style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                                    onValueChange={(val) => this.setState({ RefillNotification: val })}
                                />
                            </View>

                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly',
                         paddingHorizontal: 18, paddingBottom: 15, marginTop: 20,width:'100%',alignSelf:'center' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Ionicons name="ios-pricetag" color="rgb(238,122,35)" size={25} />
                                <Text style={{ fontSize: 12, marginLeft: 5 }}>Price</Text>
                            </View>
                            <View style={{ borderWidth: 0.25, height: 40, width: Dimensions.get("window").width * 0.6, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 4, borderRadius: 7.5 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 10 }}>
                                    <Text>$</Text>
                                    <TextInput
                                        style={{ height: 40, width: Dimensions.get("window").width * 0.55 }}
                                        onChangeText={this.setSearchQuery}
                                        onSubmitEditing={this.executeSearchQuery}
                                        value={this.state.queriedData === null ? "" : this.state.queriedData.normalPrice.toString()}
                                       />
                                </View>
                            </View>
                        </View>

                        <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30, paddingBottom: 15, marginTop: 20,flexDirection:'row',width:'90%',alignSelf:'center' }}>

                            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                <TouchableOpacity onPress={() => this.setState({ isAmazonSelected: !this.state.isAmazonSelected })} style={{ borderWidth: 0.25, marginHorizontal: 20, marginVertical: 5, height: 100 }}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 5 }}>
                                        {
                                            this.state.isAmazonSelected &&
                                            <AntDesign name="checkcircle" size={20} color="rgb(20,196,152)" style={{ position: 'absolute', right: 0, top: 0 ,zIndex:100 }} />
                                        }
                                        <Image style={{ width: 110, height: 90 }} source={Amazon} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.setState({ isCostcoSelected: !this.state.isCostcoSelected })}
                                    style={{ borderWidth: 0.25, marginHorizontal: 20, marginVertical: 5,  height: 100 }}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 5 }}>

                                        {
                                            this.state.isCostcoSelected &&
                                            <AntDesign name="checkcircle" size={20} color="rgb(20,196,152)" style={{ position: 'absolute', right: 0, top: 0,zIndex:100 }} />
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
                                            <AntDesign name="checkcircle" size={20} color="rgb(20,196,152)" style={{ position: 'absolute', right: 0, top: 0 ,zIndex:100}} />
                                        }
                                        <Image style={{ width: 110, height: 90 }} source={Petsmart} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.setState({ isWalmartSelected: !this.state.isWalmartSelected })}

                                    style={{ borderWidth: 0.25, marginHorizontal: 20, marginVertical: 5, height: 100 }}>

                                    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 5}}>
                                        {
                                            this.state.isWalmartSelected &&
                                            <AntDesign name="checkcircle" size={20} color="rgb(20,196,152)" style={{ position: 'absolute', right: 0, top: 0,zIndex:100 }} />
                                        }
                                        <Image style={{ width: 110, height: 90,zIndex:1 }} source={Walmart} />
                                    </View>
                                </TouchableOpacity>

                            </View>
                        </View>

                        <View style={{ paddingHorizontal: 20, marginTop: 15, paddingVertical: 2 }}>
                            <Text style={{ fontSize: fontScale * 20 , fontWeight:'700' }}>Pet & Instructions</Text>
                        </View>

                        <View style={{ width: "88%", alignSelf: "center", flexDirection: "row", alignItems: "center", height:80,
                        justifyContent: "space-around", marginTop: 10,borderRadius:10,borderWidth:1,borderColor:'lightgrey' }}>
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

                        <View style={{ width: "88%", alignSelf: "center", flexDirection: "row", alignItems: "center",height:80,
                         justifyContent: "space-around", marginTop: 15,borderRadius:10,borderWidth:1,borderColor:'lightgrey' }}>
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
                        <Modal />

                            <View style={{ marginTop: 10 }}>
                                <TouchableOpacity
                                    onPress={this.saveItem}
                                    style={{
                                    height: 35,
                                    backgroundColor: "#ee7a23",
                                    width: "80%",
                                    alignSelf: "center",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 16
                                    }}
                                 >
                                    <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
                                        Save
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView >
        )
    }
}

const mapStateToProps = state => ({
    // login: state.login,
    userSession: state.userSession,
    // confirmEmail: state.resendConfirmEmail
});

const mapDispatchToProps = {
    // loginAction,
    userSessionAction,
    
    // getAvatarAction,
    // resendConfirmEmailAction,
    // getPetsByOwnerAction,
    // getProvidersByOwnerAction,
    // getReminderByOwnerAction,
    // getRepeatTypesAction,
    // getCategoryInfoAction,
    // suggestedSearchListAction
};

export default connect(mapStateToProps, mapDispatchToProps)(AddProduct);


const Category = [
    {value: "Food"},
    {value:"Medication"},
    {value: "Cleaning"},
    {value: "Health"},
    { value: "Supplement"},
    {value: "Toy"},
    { value : "Treat"},
    {value:  "clothes"},
    {value: "Training"},
    {value: "Walk"},
    {value: "Potty"}
]
const Every = [
   { value: "Day"},
    { value: "Week"},
    { value: "Month"},
    { value: "Year"}
]
const Location = [
   { value: "Garage"},
    { value :"Kitchen"},
    { value: "Pantry"},
    { value :"Freezer"},
    { value: "Fridge"},
    {value:  "Storage"}
]
const SiteList = [
    "Amazon",
    "Petsmart",
    "Costco",
    "Walmart"
]

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
        marginTop: 10,
        borderRadius: 10
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


