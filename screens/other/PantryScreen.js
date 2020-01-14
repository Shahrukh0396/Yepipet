import React from 'react';
import { connect } from 'react-redux'
import {
    StyleSheet,
    FlatList,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
    Platform,
    Dimensions,
} from 'react-native';
import Editpet from '../../src/apiActions/pet/editPet';
import Menu from '../../components/Menu';
import { MaterialIcons, Entypo, AntDesign, MaterialCommunityIcons, Ionicons , EvilIcons } from '@expo/vector-icons';
import styles from '../../constants/Form.style';
import Notfound from "../../assets/notfound.png"
import ReminderComponent from '../../components/pantry/reminder/CreateReminder';
import CheckBoxComponent from '../../components/pantry/checkbox/checkBox';
import { baseURL } from '../../src/apiActions';
import userSessionAction from '../../src/apiActions/user/userSession';
import { iOS } from '../../src/common';
import { TextInput } from 'react-native-gesture-handler';
import Pet1 from "../../assets/images/Pet_01.png"
import Pet2 from "../../assets/images/Pet_02.png"
import Pet3 from "../../assets/images/Pet_03.png"

const { width,fontScale } = Dimensions.get("screen");


class Pantry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addProductFlag: false,
            isOpenMenu: false,
            isReminderCreate: false,
            selectedForReminder: "",
            pantryList: [],
            searchtext:"",
            result : [],
            searchQuery: "",
            queriedData: "",
            userData: {},
            isCheck1:false,
            isCheck2:false,
            isCheck3:false
        }
    }
    
    editpetInfo(item){
        console.log(item,"editpetInfo");
        this.props.Editpet(item)
         this.props.navigation.navigate("EditProduct")
    }

    refillItem = () => {
        Alert.alert(
            'Add to Pantry',
            'Please confirm adding super dog soap to your pantry'
            [
            {
                text: 'Cancel',
                onPress: () => console.log("Cancel Pressed"),
                style: 'cancel'
            },
            {
                text: 'Confirm',
                onPress: () => console.log("Pantry Updated"),
                style: 'cancel'
            }
            ]

        )
    }
    
    setSearchQuery = (searchQuery) => this.setState({ searchtext: searchQuery })

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

    componentDidMount = async () => {
        try {
             const response = await fetch(`${baseURL}/users/${this.props.userSession.user.userID.toString()}`,{
                 method:"GET",
                 headers: {
                    'Content-Type': "application/json",          
                    'Accept': "application/json"
                 }
             })
             console.log("Response");
             const userName = await response.json();
             console.log(userName,"REAL Response")

             this.setState({userData: userName})
             console.log(this.state.userData,"userDAtaaaa")

        }catch(error){
            console.log(error,"error")
        }
    }

    componentWillMount = async () => {
        try {
            const response = await fetch(`${baseURL}/pantry/user/${this.props.userSession.user.userID}`,{
                method: "GET",                                                                                                                                                                                                                                                        
                headers: {                                                      
                    'Content-Type': "application/json",          
                    'Accept': "application/json"                      
                }       
            })
            const pantryList = await response.json();
          
            
            this.setState({ pantryList: pantryList.filter(item => item.userID == this.props.userSession.user.userID) })
        } catch (error) {
            console.log("error"),
                console.log(error)
        }
    }

    searchApi = async (e) => {
        console.log(e, "eeee")
            try{
                const response =  await fetch(`${baseURL}/pantry/Collection/Search/${e.toString()}`,{
                    method: "GET",                                                                                                                                                                                                                                                        
                    headers: {                                                      
                        'Content-Type': "application/json",          
                        'Accept': "application/json"                      
                    }       
                })
                const searchlist =  await response.json();
                this.setState({ result: searchlist.filter(item => item.userID == this.props.userSession.user.userID) })
                console.log(this.state.result,"search text")
            }catch(error){

                console.log(error,"error")
            }
    }

    render() {
        const { navigate } = this.props.navigation;
        let PantryData = this.state.pantryList.filter((text) => {
            return text.itemName.toLowerCase().indexOf(this.state.searchtext.toLowerCase()) != -1
        }) 
        console.log("this.state.selectedForReminder");
        console.log("thi.state.query data " ,this.state.searchtext);

        return (
            <SafeAreaView style={{ ...styles.safeArea, backgroundColor: 'rgb(250,249,250)' }}>
                <Menu
                    openMenu={this.state.isOpenMenu}
                    navigation={this.props.navigation}
                    closeMenu={() => this.setState({ isOpenMenu: false })}
                />
                <ScrollView scrollEnabled={true} scrollEventThrottle={200}>
                    <View style={{ paddingBottom: 22, paddingTop: 25, paddingHorizontal: 10, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ alignSelf: 'flex-start' }}>
                            <TouchableOpacity  >
                                <MaterialIcons onPress={() => this.setState({ isOpenMenu: true })}
                                    name="menu" color="#000" size={30} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.title_head]}> Pet Pantry </Text>
                        </View>

                    </View>

                    <View style={[styles.container_form, styles.form_group, { marginHorizontal: 15 }]}>
                        <View style={{ flex: 0.3, paddingRight: 18 }}>
                            <Image style={[styles.image_circle, { marginTop: 15 }]} source={(this.props.getAvatar && this.props.getAvatar.url) ? { uri: this.props.getAvatar.url } : require('../../assets/images/default-avatar.jpg')} />
                        </View>
                        <View style={{ flex: 0.7 }}>
                            <View style={{ position: 'relative' }}>
                                <Text style={format.user_name}>{this.state.userData.userFirstName + " " + this.state.userData.userLastName}</Text>
                                <TouchableOpacity style={format.button_edit} onPress={() => navigate('UserProfile')}>
                                    <Image style={{ justifyContent: 'center', height: 27, width: 27 }} source={require('../../assets/images/icon-edit.png')} />
                                </TouchableOpacity>
                            </View>
                            <Text style={format.user_email}>{this.state.userData.userEmail}</Text>
                            <Text style={format.user_phone}>{this.state.userData.userPhone}</Text>
                        </View>
                    </View>


                    <View style={[styles.container_form, { marginBottom: 21, marginHorizontal: 15, paddingBottom: 0 }]}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {
                                this.state.isCheck1 ? 
                            <TouchableOpacity onPress={() => this.setState({isCheck1:false})} style={{ marginHorizontal: 7.5 }}>
                                <Image
                                    style={[styles.image_circle, format.image_circle, { borderColor: "orange"}]}
                                    source={Pet1}
                                />
                                
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => this.setState({isCheck1:true})} style={{marginHorizontal: 7.5}}>
                                <Image
                                    style={[styles.image_circle, format.image_circle, { borderColor: "orange"}]}
                                    source={Pet1}
                                />
                                <View style={{ flexDirection: "row", position: "relative", bottom: 30, paddingLeft: 10, zIndex: 50, justifyContent: "flex-end" }}>
                                   
                                   
                                   <TouchableOpacity style={{ backgroundColor: "white" ,borderRadius:25}}>
                                        <AntDesign name="checkcircle" size={24} color="rgb(32,183,145)" />
                                    </TouchableOpacity>

                                </View>
                            </TouchableOpacity>
                            }
                            {
                                this.state.isCheck2 ? 
                            <TouchableOpacity onPress={() => this.setState({isCheck2:false})} style={{ marginHorizontal: 7.5 }}>
                                <Image
                                    style={[styles.image_circle, format.image_circle, { borderColor: "orange"}]}
                                    source={Pet2}
                                />
                                
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => this.setState({isCheck2:true})} style={{marginHorizontal: 7.5}}>
                                <Image
                                    style={[styles.image_circle, format.image_circle, { borderColor: "orange"}]}
                                    source={Pet2}
                                />
                                <View style={{ flexDirection: "row", position: "relative", bottom: 30, paddingLeft: 10, zIndex: 50, justifyContent: "flex-end" }}>
                                   
                                   
                                   <TouchableOpacity style={{ backgroundColor: "white" ,borderRadius:25}}>
                                        <AntDesign name="checkcircle" size={24} color="rgb(32,183,145)" />
                                    </TouchableOpacity>

                                </View>
                            </TouchableOpacity>
                            }

                            {
                                this.state.isCheck3 ? 
                            <TouchableOpacity onPress={() => this.setState({isCheck3:false})} style={{ marginHorizontal: 7.5 }}>
                                <Image
                                    style={[styles.image_circle, format.image_circle, { borderColor: "orange"}]}
                                    source={Pet3}
                                />
                                
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => this.setState({isCheck3:true})} style={{marginHorizontal: 7.5}}>
                                <Image
                                    style={[styles.image_circle, format.image_circle, { borderColor: "orange"}]}
                                    source={Pet3}
                                />
                                <View style={{ flexDirection: "row", position: "relative", bottom: 30, paddingLeft: 10, zIndex: 50, justifyContent: "flex-end" }}>
                                   
                                   
                                   <TouchableOpacity style={{ backgroundColor: "white" ,borderRadius:25}}>
                                        <AntDesign name="checkcircle" size={24} color="rgb(32,183,145)" />
                                    </TouchableOpacity>

                                </View>
                            </TouchableOpacity>
                            }
                        </ScrollView>
                    </View>


           
                    <View style={{ flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center' }}>
                        <Text style={{ fontSize: fontScale * 18, fontWeight: 'bold' }}>Pantry Advisor</Text>
                        <View style={{ marginHorizontal: 7.5 }}>
                            <MaterialCommunityIcons name="dog-side" size={20} />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 }}>
                        <View style={{ width: 40 }}>
                            <TouchableOpacity onPress={()=> navigate("BarcodeScanner")}>
                                <MaterialCommunityIcons name="barcode-scan" color="rgb(78,148,178)" size={30} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ borderWidth: 0.25, height: 40, width: Dimensions.get("window").width * 0.8, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 5, borderRadius: 7.5, marginRight: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                <View style={{ width: 30 }}>
                                    <AntDesign name="search1" color="grey" size={20} />
                                </View>
                                <View>
                                    <TextInput placeholder="Search" 
                                    onChangeText={this.setSearchQuery}
                                    onSubmitEditing={this.executeSearchQuery} 
                                    style={{ height: 40, width: Dimensions.get("window").width * 0.65,color:"grey" }} />
                                </View>
                                
                            </View>
                            <View style={{ marginRight: 5 }}>
                                <Ionicons name="ios-mic" size={20} color="black" />
                            </View>
                        </View>
                        {/* <View style={{position:'absolute',backgroundColor:'white',height:80,width: Dimensions.get("window").width * 0.80,top:60,marginLeft:63}}>
                            <ScrollView>
                                <Text style={{fontSize:18}}>Blue Buffalo</Text>
                                <Text style={{fontSize:18}}>IAMS</Text>
                                <Text style={{fontSize:18}}>Purina</Text>
                            </ScrollView>  
                        </View> */}

                    </View>
                   

                    <View style={{backgroundColor:'white',width:'90%',justifyContent:'center',alignSelf:'center',borderRadius:12}}>
                    <View>
                        <View style={{
                            width: "90%",
                            alignSelf: "center",
                            height: 450,
                            flexDirection: "column",
                            justifyContent: "space-around",
                            borderRadius: 12,
                        }} >
                            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "95%", alignSelf: "center" }}>
                                <View style={{ flexDirection: 'row', marginHorizontal: 6 }}>
                                    <Text style={{ fontSize: fontScale * 18,fontWeight:'700',color:'#000' }}>
                                        My Pantry {""}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                    <View style={{ marginRight: 20 }}>
                                        <AntDesign name="sharealt" size={20} />
                                    </View>
                                    <TouchableOpacity onPress={() => navigate("AddProduct")}>
                                        <View style={{ padding: 5 ,borderRadius: 20, backgroundColor: "rgb(238,238,238)", alignItems: 'center', justifyContent: 'center' }}>
                                            <Entypo name="plus" size={10} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View>
                                <Text style={{ fontSize: fontScale * 18, marginLeft: 15, textDecorationLine: "underline" }}>Sort By</Text>
                                <CheckBoxComponent />
                            </View>
                            {
                                this.state.addProductFlag ?
                                    <View style={{ width: "90%", alignSelf: 'flex-start' }}>
                                        <Image source={Notfound} style={{ alignSelf: "center" }} />
                                        <Text style={{ textAlign: "left", fontSize: fontScale * 18, fontWeight: "bold" }}>
                                            Pantry is
                                         </Text>
                                        <Text>Add a product, we can help you to watch for promotion and keep track inventory for you.</Text>
                                    </View>
                                    :
                                    <View>
                                        <FlatList
                                            nestedScrollEnabled={true}
                                            style={{ height: 300  }}
                                            data={PantryData}
                                            renderItem={({ item, index }) => 
                                        
                                            (
                                                item.itemID !== this.state.selectedForReminder ?
                                                    <View style={{ paddingBottom: 5, paddingHorizontal:1, borderWidth: 1, marginVertical: 10, marginHorizontal: 8,
                                                     borderColor: 'transparent', borderTopColor: 'rgb(238,238,238)',paddingTop:10 }}>
                                                        <View style={{ position: 'absolute', right: 0, top: 75 }}>
                                                            <TouchableOpacity onPress={() => this.setState({ selectedForReminder: item.itemID })}>
                                                                <View style={{ width: 30, height: 30 }}>
                                                                    <EvilIcons name="chevron-right" size={40} style={{color:'darkgray'}}/>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
      
                                                            <View style={{
                                                                flex: 1, flexDirection: 'row' }}>
                                                                <View style={{ flex: 0.3}}>
                                                                    <Image source={{ uri: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" }} style={{ width: 25, height: 25, borderRadius: 25 }} />

                                                                   
                                                                    </View>
                                                                <View style={{ flex: 2, }}>
                                                                    <TouchableOpacity onPress={() => this.editpetInfo(item)}>
                                                                        <Text style={{ marginLeft: 5, fontSize: 20 }}>
                                                                            {item.itemBrand}
                                                                        </Text>
                                                                    </TouchableOpacity>
                                                                    </View>
                                                                <View style={{
                                                                    flex: 0.5, alignItems: 'flex-end'}}>
                                                                    <Image source={{ uri: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" }} style={{ width: 25, height: 25, borderRadius: 25 }} />

                                                                    </View>
                                                            </View>
                                                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',width:width}}>
                                                            <View style={{ borderRadius: 25 }}>
                                                                <Image source={{ uri: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" }} style={{ width: 25, height: 25, borderRadius: 25 }} />
                                                            </View>
                                                            <TouchableOpacity onPress={() => this.editpetInfo(item)}>
                                                                <Text style={{textAlign:'left',marginLeft:10,width:'100%',fontSize:10 }}>
                                                                {item.itemBrand}
                                                                </Text>
                                                            </TouchableOpacity>
                                                            <View style={{ borderRadius: 25,justifyContent:'flex-end',marginLeft:130 }}>
                                                                <Image source={{ uri: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" }} style={{ width: 25, height: 25, borderRadius: 25 }} />
                                                            </View>
                                                        </View> */}
                                                        <View style={{ paddingHorizontal: 35.5,paddingTop:10 }}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                <View >
                                                                    <Text>Qty </Text>
                                                                </View>
                                                                <View  style={{width:80 }}>
                                                                    <Text >{item.itemQuantity}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                <View>
                                                                    <Text>Category</Text>
                                                                </View>
                                                                <View style={{width:80}}>
                                                                    <Text>{item.itemCategory}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                <View>
                                                                    <Text>Current price</Text>
                                                                </View>
                                                                <View style={{ width:80 }}>
                                                                    <Text>${parseInt(item.priceWatchCurrentPrice)}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                <View>
                                                                    <Text style={{ color: "rgb(32,183,145)" }}>Notify me</Text>
                                                                </View>
                                                                <View style={{ width:80 }}>
                                                                    <Text style={{ color: "rgb(32,183,145)" }}>${item.priceWatchPricePoint}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                <View>
                                                                    <Text>Location</Text>
                                                                </View>
                                                                <View style={{ width:80 }}>
                                                                    <Text>{item.itemLocation}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    :
                                                    <View style={{ paddingBottom: 10, paddingHorizontal: 10, borderWidth: 1,
                                                     marginVertical: 0, marginHorizontal: 0, borderColor: 'transparent', borderBottomColor: 'gray' }}>
                                                        <View style={{ position: 'absolute', left: 0, top:0 }}>
                                                            <TouchableOpacity onPress={() => this.setState({ selectedForReminder: "" })}>
                                                                <View style={{ width: 30, height: 30 }}>
                                                                    <Entypo name="chevron-right" size={30} />
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                        <View style={{alignSelf:'flex-end' }}>
                                                            <ReminderComponent {...this.props} refill={this.refillItem} />
                                                        </View>
                                                    </View>

                                            )}
                                        />
                                    </View>
                            }
                    </View>
                        </View>
                            <View>
                                <Image style={format.image_style} source={require('../../assets/images/img-dog.png')} />
                                <TouchableOpacity style={format.button_add} onPress={() => navigate('AddProduct')}>
                                    <Text style={format.button_text_big}>Add an item</Text>
                                    <Text style={format.button_text_normal}>Add an item on your shopping list </Text>
                                    <Text style={format.button_text_normal}></Text>
                                </TouchableOpacity>
                            </View>
                    <View style={{ height: 25 }} />

                            </ View>                             
                </ScrollView>
            </SafeAreaView >
        );
    }
}

const mapStateToProps = state => ({
    userSession: state.userSession,

});

const mapDispatchToProps = {
    userSessionAction,
    Editpet,
};

export default connect(mapStateToProps, mapDispatchToProps)(Pantry);




const format = StyleSheet.create({
    button_text_big: {
        fontWeight: '700',
        fontSize: iOS ? 17 : 20,
        color: '#fff',
        textAlign: 'center'
    },
    button_text_normal: {
        fontWeight: '500',
        color: '#fff',
        fontSize: iOS ? 12 : 12,
        textAlign: 'center'
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#fcfcfc',
        paddingTop: 20,
        position: 'relative',
        height: 1500
    },
    image_circle: {
        width: 60,
        height: 60,
        borderRadius: 60 / 2
    },
    container_form: {
        borderWidth: 1,
        borderColor: 'grey',
        padding: 20,
        width: '90%',
        marginTop: 10,
        alignSelf: "center",
        backgroundColor: '#fff',
        height: "15%"
    },
    button_check: {
        width: 60,
        height: 60,
        borderWidth: 2,
        borderColor: '#14c498',
        borderRadius: 60 / 2,
        position: 'relative',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 18
    },
    text_note: {
        fontSize: 16,
        fontWeight: '400',
        fontStyle: 'italic',
        color: '#202c3c'
    },
    user_name: {
        fontSize: Platform.OS === 'ios' ? 20 : 23,
        fontWeight: '700',
        color: '#ee7a23',
        textTransform: 'capitalize',
        marginBottom: 4,
        paddingRight: 30
    },
    user_email: {
        fontWeight: '400',
        color: '#000000',
        fontSize: Platform.OS === 'ios' ? 11 : 14,
        marginBottom: 7
    },
    user_phone: {
        fontSize: Platform.OS === 'ios' ? 13 : 16,
        fontWeight: '700',
        color: '#000'
    },
    button_edit: {
        position: 'absolute',
        zIndex: 1,
        right: 0,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        borderRadius: 30 / 2,
    },
    image_pet: {
        width: 60,
        height: 60,
        borderRadius: 60 / 2
    },
    icon_check: {
        width: 24,
        height: 24,
        position: 'absolute',
        right: 0,
        bottom: 0
    },
    title_big: {
        color: '#202c3c',
        fontSize: Platform.OS === 'ios' ? 19 : 22,
        fontWeight: '700',
        paddingRight: 17
    },
    button_check: {
        width: 60,
        height: 60,
        borderWidth: 2,
        borderColor: '#14c498',
        borderRadius: 60 / 2,
        position: 'relative',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 18
    },
    text_note: {
        fontSize: Platform.OS === 'ios' ? 13 : 16,
        fontWeight: '400',
        fontStyle: 'italic',
        color: '#202c3c'
    },
    image_circle: {
        width: 60,
        height: 60,
        borderRadius: 60 / 2
    },
    image_style: {
        alignSelf: 'center',
        marginBottom: -11,
        position: 'relative',
        zIndex: 1,
        width: 111,
        height: 63
    },
    button_add: {
        backgroundColor: 'rgb(32,183,145)',
        paddingVertical: 10,
        borderRadius: 101 / 2
    },
})