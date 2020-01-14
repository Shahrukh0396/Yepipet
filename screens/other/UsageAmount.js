import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions, TextInput, Image, Picker, Switch, PickerIOS, Platform } from "react-native"
import { AntDesign, FontAwesome, Foundation } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NavigationEvents } from "react-navigation";
const { fontScale } = Dimensions.get("screen");
import styles from '../../constants/Form.style';

export default class UsageAmount extends Component {
    constructor(){
        super();
        this.state = {
            Action: Action[0],
            Repeat: Repeat[0],
            Frequency: Frequency[0],
            Time:Time[0],
            Num: Num[0],
            Unit:Unit[0],
            Measure: Measure[0]

        }
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
                 <SafeAreaView style={Styles.safeArea}>
                      <ScrollView>
                           <View style={{height:'95%'}}>
                              <View style={Styles.header}>
                                 <View>
                                    <AntDesign onPress = {() => navigate("AddProduct")} name="left" size={25} />
                                 </View>
                               <View>
                                   <Text style={Styles.heading}>
                                      Usage and Amount
                                   </Text>
                               </View>
                          </View>

                    <View style={[styles.container_form, styles.form_group, { marginHorizontal: 15 }]}>
                        <View style={{ flex: 0.3, paddingRight: 18 }}>
                            <Image style={[styles.image_circle, { marginTop: 15 }]}  
                            source={{ uri: "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png" }} />
                        </View>
                        <View style={{ flex: 0.7 }}>
                            <View style={{ position: 'relative' }}>
                                <Text style={{fontWeight:'bold',fontSize:fontScale*15}}>Juno</Text>
                            </View>
                            <Text> 
                                2 Year
                            </Text>
                        </View>
                    </View>
                    <View style={[styles.container_form,{marginBottom:26,marginHorizontal:10}]}>
                        <View style={{flexDirection:'column',marginLeft:10}}>
                            <Text style={{ 
                                fontSize: fontScale *15,
                                marginTop:10
                             }}>
                                 View and record care activities,
                            </Text>
                            <Text style={{fontSize: fontScale *15}}>
                                 Observations, and tasks on your pet.
                            </Text>
                        </View>
                    <View style={{ 
                        flexDirection: "row",
                        marginLeft: 10,
                        paddingTop: 5
                           }}>
                    {/* <FontAwesome name="black-tie" size={20} style={{ paddingTop: 5 }} /> */}
                    <Text style={{ 
                        fontSize: fontScale * 22, 
                        textDecorationLine: "underline",
                        fontWeight:'bold'
                        }}>
                        Schedule
                    </Text>
                  </View>
                <View>
                    <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
                            <Text style={{ color: "rgb(200,200,200)", fontSize: 12, paddingBottom: 5 }}>Action</Text>
                            <View style={{ borderWidth: 0.5, borderRadius: 5, backgroundColor: 'rgb(252,252,252)', paddingh: 5, width: "100%" }}>
                                <Picker selectedValue={this.state.Action}
                                    style={{ height: 37.5, opacity: Platform.OS === "ios" ? 0 : 1, width: "100%" }}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ Action: itemValue })}
                                >
                                    {
                                        Action.map(itm =>
                                            <Picker.Item label={itm} value={itm} key={itm} />
                                        )
                                    }

                                </Picker>
                            </View>
                        </View>
                        <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
                            <Text style={{ color: "rgb(200,200,200)", fontSize: 12, paddingBottom: 5 }}>Repeat</Text>
                            <View style={{ borderWidth: 0.5, borderRadius: 5, backgroundColor: 'rgb(252,252,252)', paddingh: 5, width: "100%" }}>
                                <Picker selectedValue={this.state.Repeat}
                                    style={{ height: 37.5, opacity: Platform.OS === "ios" ? 0 : 1, width: "100%" }}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ Repeat: itemValue })}
                                >
                                    {
                                        Repeat.map(itm =>
                                            <Picker.Item label={itm} value={itm} key={itm} />
                                        )
                                    }

                                </Picker>
                            </View>
                        </View>

                        <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
                            <Text style={{ color: "rgb(200,200,200)", fontSize: 12, paddingBottom: 5 }}>Frequency</Text>
                            <View style={{ borderWidth: 0.5, borderRadius: 5, backgroundColor: 'rgb(252,252,252)', paddingh: 5, width: "100%" }}>
                                <Picker selectedValue={this.state.Frequency}
                                    style={{ height: 37.5, opacity: Platform.OS === "ios" ? 0 : 1, width: "100%" }}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ Frequency: itemValue })}
                                >
                                    {
                                        Frequency.map(itm =>
                                            <Picker.Item label={itm} value={itm} key={itm} />
                                        )
                                    }

                                </Picker>
                            </View>
                        </View>
                        <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
                            <Text style={{ color: "rgb(200,200,200)", fontSize: 12, paddingBottom: 5 }}>Date/Time(1)</Text>
                            <View style={{ borderWidth: 0.5, borderRadius: 5, backgroundColor: 'rgb(252,252,252)', paddingh: 5, width: "100%" }}>
                                <Picker selectedValue={this.state.Time}
                                    style={{ height: 37.5, opacity: Platform.OS === "ios" ? 0 : 1, width: "100%" }}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ Time: itemValue })}
                                >
                                    {
                                        Time.map(itm =>
                                            <Picker.Item label={itm} value={itm} key={itm} />
                                        )
                                    }

                                </Picker>
                            </View>
                        </View>
                        <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
                            <Text style={{ color: "rgb(200,200,200)", fontSize: 12, paddingBottom: 5 }}>Date/Time(2)</Text>
                            <View style={{ borderWidth: 0.5, borderRadius: 5, backgroundColor: 'rgb(252,252,252)', paddingh: 5, width: "100%" }}>
                                <Picker selectedValue={this.state.Time}
                                    style={{ height: 37.5, opacity: Platform.OS === "ios" ? 0 : 1, width: "100%" }}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ Time: itemValue })}
                                >
                                    {
                                        Time.map(itm =>
                                            <Picker.Item label={itm} value={itm} key={itm} />
                                        )
                                    }

                                </Picker>
                            </View>
                        </View>       
            </View>
            <View style={{ flexDirection: "row", marginLeft:10, paddingTop: 5 }}>
                    {/* <FontAwesome name="black-tie" size={20} style={{ paddingTop: 5 }} /> */}
                    <Text style={{ fontSize: fontScale * 22, textDecorationLine: "underline",fontWeight:'bold' }}>
                            Amount
                    </Text>
            </View>
                          <View>
                             <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
                                <Text style={{ color: "rgb(200,200,200)", fontSize: 12, paddingBottom: 5 }}>Number</Text>
                                <View style={{ borderWidth: 0.5, borderRadius: 5, backgroundColor: 'rgb(252,252,252)', paddingh: 5, width: "100%" }}>
                                    <Picker selectedValue={this.state.Num}
                                        style={{ height: 37.5, opacity: Platform.OS === "ios" ? 0 : 1, width: "100%" }}
                                        onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ Num: itemValue })}
                                    >
                                        {
                                            Num.map(itm =>
                                                <Picker.Item label={itm} value={itm} key={itm} />
                                            )
                                        }
                                    </Picker>
                                </View>
                             </View>
                             <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
                                <Text style={{ color: "rgb(200,200,200)", fontSize: 12, paddingBottom: 5 }}>Unit</Text>
                                <View style={{ borderWidth: 0.5, borderRadius: 5, backgroundColor: 'rgb(252,252,252)', paddingh: 5, width: "100%" }}>
                                    <Picker selectedValue={this.state.Unit}
                                        style={{ height: 37.5, opacity: Platform.OS === "ios" ? 0 : 1, width: "100%" }}
                                        onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ Unit: itemValue })}
                                    >
                                        {
                                            Unit.map(itm =>
                                                <Picker.Item label={itm} value={itm} key={itm} />
                                            )
                                        }

                                    </Picker>
                                </View>
                            </View>
                            <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
                                <Text style={{ color: "rgb(200,200,200)", fontSize: 12, paddingBottom: 5 }}>Measure</Text>
                                <View style={{ borderWidth: 0.5, borderRadius: 5, backgroundColor: 'rgb(252,252,252)', paddingh: 5, width: "100%" }}>
                                    <Picker selectedValue={this.state.Measure}
                                        style={{ height: 37.5, opacity: Platform.OS === "ios" ? 0 : 1, width: "100%" }}
                                        onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ Measure: itemValue })}
                                    >
                                        {
                                            Measure.map(itm =>
                                                <Picker.Item label={itm} value={itm} key={itm} />
                                            )
                                        }

                                    </Picker>
                                </View>
                            </View>
                       </View>
                       <View style={{ flexDirection: "row", paddingLeft: 0, paddingTop: 5, justifyContent: "flex-start" }}>
                            <Text style={{ fontSize: fontScale * 22, paddingLeft: 20, textDecorationLine: "underline",fontWeight:'bold' }}>
                               General Instructions
                            </Text>
                       </View>
                       <View style={{
                           borderWidth:1,
                           borderColor:'grey',
                           height:70,
                           width:'95%',
                           marginHorizontal:10,
                           marginTop:10,
                           borderRadius:12
                           }}>
                           <TextInput style={{textAlign:'left'}} placeholder='something'/>
                       </View>

                       <View style={{ marginTop: 10 }}>
                            <TouchableOpacity style={{ 
                                        height: 35, 
                                        backgroundColor: "orange", 
                                        width: "80%", 
                                        alignSelf: "center", 
                                        flexDirection: "row", 
                                        alignItems: "center", 
                                        justifyContent: "center",
                                        borderRadius:16 
                                        }}>
                                <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
                                    Save
                                </Text>
                            </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
</SafeAreaView>
        )
    }
}

const Action=[
    "Give",
    "Feed",
    "Take",
    "Use",
    "Apply"
]

const Repeat = [
    //https://api.yepipet.app/dev/generalreminder/repeattypes
    "Daily",
]

const Frequency = [
    "Once",
    "Twice",
    "Thrice",
    "4 times",
    "5 times"
]

const Time = [
    "8:00 p.m"
]

const Num = [
    ""
]

const Unit = [
    ""
]

const Measure = [
    ""
]

const Styles = {
    image_circle: {
        width: 60,
        height: 60,
        borderRadius: 60 / 2
    },
    header: {
        paddingVertical: 20,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    heading: {
        fontSize: fontScale * 20,
        fontWeight: "bold",
        marginRight: 150
}
}