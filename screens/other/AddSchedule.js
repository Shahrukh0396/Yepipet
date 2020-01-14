import * as React from 'react';
import { View, Text, DatePickerAndroid, StyleSheet, ScrollView, SafeAreaView, Dimensions, TextInput, Image, Picker, Switch, PickerIOS, Platform } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler";
import styles from '../../constants/Form.style';
import { AntDesign, FontAwesome, Foundation } from "@expo/vector-icons";
import NotFound from "../../assets/imagenotfound.png"
const { fontScale } = Dimensions.get("screen")

export default class AddSchedule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            date:"",
            EnablePushReminder : false,
            syncCalendar : false,
        }
    }
        async date(){
            try {
                const { action, year, month, day } = await DatePickerAndroid.open({
                    // Use `new Date()` for current date.
                    // May 25 2020. Month 0 is January.
                    date: new Date(2020, 4, 25),
                });
                if (action !== DatePickerAndroid.dismissedAction) {
                    this.setState({ date: (month + 1 >= 10 ? month + 1 : "0" + String(month + 1)) + "/" + String(day) + "/" + String(year) })
                    // Selected year, month (0-11), day
                }
            } catch ({ code, message }) {
                console.warn('Cannot open date picker', message);
            }
    
        }
    render() {

        const { navigate } = this.props.navigation;

        return (
            <SafeAreaView style={Styles.safeArea}>
                <ScrollView>
            <View style={{maxHeight: 800}}>
                <View style={Styles.header}>
                            <View>
                                <AntDesign onPress={() => navigate("pentry")} name="left" size={25} />
                            </View>
                            <View>
                                <Text style={Styles.heading}>
                                    Add a Schedule
                                </Text>
                            </View>
                </View>
                <View style={{ width: "90%", alignSelf: "center", borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 5 }}>
                                    <View>

                                        <TouchableOpacity

                                            style={{ position: 'relative', paddingRight: 6, height: 60, marginRight: 18, paddingLeft: 5 }}
                                        // onPress={() => this._toggleCheck(item, index)}
                                        >
                                            <Image
                                                style={[Styles.image_circle, { borderColor: 'black' }]}
                                                source={require('../../assets/images/img-pet-default.png')}
                                            />
                                        </TouchableOpacity>
                                        <View style={{ flexDirection: "row", position: "relative", justifyContent: "center", bottom: 15, paddingLeft: 15, zIndex: 50 }}>

                                            <TouchableOpacity style={{ backgroundColor: "white" }}>
                                                <Foundation name="social-github" size={25} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View>
                                        <Text style={{ fontSize: fontScale * 20 }}>
                                            Juno (2 Yr)
                                        </Text>
                                        <Text style={{ fontSize: fontScale * 10 }}>
                                            Give 2 cup twice deaily
                                        </Text>
                                    </View>
                                </View>

                                <View style={{
                    width: "90%",
                    borderWidth: 1,
                    borderColor: "black",
                    alignSelf: "center",
                    marginTop: 10,
                    justifyContent:"center",
                }}>
                   {/*} <Text style={{ 
                        fontSize: fontScale *15,
                        marginTop:50
                         }}>
                         Please Provide usage instruction on kirkland dog food for juno
                        </Text>  */}

           <View>
                      <View style={{ 
                           flexDirection: "row", 
                           justifyContent: "space-around", 
                           marginTop: 5 
                           }}>
                               <AntDesign name="folder1" size={20}/>
                                          <Text>
                                                Category
                                        </Text>

                <View style={{ borderColor: "grey", borderWidth: 1, width: "69%", height: 25 }}>

                    <Picker selectedValue={Category[0]} style={{ height: 25, opacity: Platform.OS === "ios" ? 0 : 1 }} >
                        {
                            Category.map(itm =>
                                <Picker.Item label={itm} value={itm} key={itm} />
                            )
                        }
                    </Picker>
                </View>
                       </View>
                <View style={{ 
                    flexDirection: "row", 
                    justifyContent: "space-around", 
                    marginTop: 5
                     }}>
                         <AntDesign name="bells" size={20}/>
                    <Text>ToDo</Text>
                                      <View style={{ borderColor: "grey", borderWidth: 1, width: "69%", height: 25 }}>

                                                     <Picker selectedValue={ToDo[0]} style={{ height: 25, opacity: Platform.OS === "ios" ? 0 : 1 }} >
                                                           {
                                                             ToDo.map(itm =>
                                                     <Picker.Item label={itm} value={itm} key={itm}/>
                                                            )}
                                                    </Picker>
                                       </View>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 5 }}>
                    <AntDesign name="sync" size={20}/>
                <Text>Repeat</Text>
                                      <View style={{ borderColor: "grey", borderWidth: 1, width: "69%", height: 25, }}>

                                                     <Picker selectedValue={Repeat[0]} style={{ height: 25, opacity: Platform.OS === "ios" ? 0 : 1 }} >
                                                           {
                                                             Repeat.map(itm =>
                                                     <Picker.Item label={itm} value={itm} key={itm}/>
                                                            )}
                                                    </Picker>
                                       </View>
                </View>
                <View style={{ flexDirection: "row",marginTop:5}}>
                    <AntDesign name="calendar" size={20}/>
                    <Text style ={{paddingHorizontal: 5,marginLeft:20}}>Date</Text>

                    <View
                        style={{
                        marginHorizontal: 10,
                        width: 140,
                        backgroundColor: "transparent",
                        borderWidth: 1,
                        }}
                    >

                            <Text style={{ textAlign: "center",paddingVertical: 5 }}>
                            {this.state.date === "" ? "00/00/00" : this.state.date}
                            </Text>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => this.date()}>
                                <FontAwesome name="calendar" size={20} />
                        </TouchableOpacity >
                    </View>
                </View>
                <View style = {{flexDirection:"row",paddingTop: 5,}}>
                    <FontAwesome name="clock-o" size={20}/>            
                <Text style ={{paddingHorizontal: 5,}}>Time</Text>
                                      <View style={{ borderColor: "grey", borderWidth: 1, width: "69%", height: 25, marginHorizontal:10 }}>

                                                     <Picker selectedValue={Time[0]} style={{ height: 25, opacity: Platform.OS === "ios" ? 0 : 1 }} >
                                                           {
                                                             Time.map(itm =>
                                                     <Picker.Item label={itm} value={itm} key={itm}/>
                                                            )}
                                                    </Picker>
                                       </View>
                      </View>
            </View>
            <View style = {{flexDirection:"row"}}>
                <FontAwesome name="bullhorn" sixe={20}/>
                <Text>Enable Push Reminder</Text>
                <View >
                    <Switch value={this.state.EnablePushReminder}
                        onValueChange={(val) => this.setState({ EnablePushReminder: val })} />
                </View>
            </View>
            <View style = {{flexDirection:"row",paddingHorizontal: 5,}}>
                <Text>Sync With Calendar</Text>
                <View >
                    <Switch value={this.state.syncCalendar}
                        onValueChange={(val) => this.setState({ syncCalendar: val })} />
                </View>
            </View>
            <View style={{flexDirection:'row'}}>
                <AntDesign name="filetext1"/>
                <Text style={{marginLeft:20}}>Description</Text>
            </View>
            <View>
                <TextInput 
                style ={{ 
                    borderWidth:1,
                    borderColor:"black",
                    textAlign:"center",
                    paddingHorizontal: 10,
                    height:80,
                    width:200,
                    marginLeft:80
                    }}
                     placeholder = "Get More Super Clean Soap"/>
            </View>
            <View>
                       <View style={{ flexDirection: "row", paddingLeft: 5, paddingTop: 5, }}>
                            <FontAwesome name="camera" size={20} style={{ paddingTop: 5 }} />
                                <Text style={{ fontSize: fontScale * 22, textDecorationLine: "underline" }}>
                                 Photos
                                 </Text>
                        </View>
                                 <View style={{flexDirection:"row",marginTop:10,marginLeft:40}}>
                                    <View >
                                        <Image source={NotFound} />
                                    </View>
                                    <View style = {{paddingHorizontal:5}}>
                                        <Image source={NotFound} />
                                    </View>
                                </View>
            </View>
            <View style={{justifyContent:"center"}}>
                <TouchableOpacity style={{ marginLeft: 5 }} onPress={()=> navigate("camera")}>
                         <Image
                            style={[styles.image_circle, { borderColor: 'black',marginTop:10}]}
                            source={require('../../assets/images/icon-camera.png')}
                           />
                </TouchableOpacity>
            </View>

                <View style={{ flexDirection: "row", paddingLeft: 2, paddingTop: 5, justifyContent: "flex-start" }}>
                <FontAwesome name="tags" size={20} style={{ paddingTop: 5 }} />
                   <Text style={{ fontSize: fontScale * 22, paddingLeft: 10, textDecorationLine: "underline" }}>
                      Labels
                   </Text>
                   </View>
                <View>
                   <TextInput style={{ borderColor: "grey", borderWidth: 1, width: "80%", marginLeft: 10,height:30 }} placeholder="will render to juno 2yrs at add product pet n instructions"/>
                </View>

                <View style={{ marginTop: 10 }}>
                                    <TouchableOpacity style={{ height: 35, backgroundColor: "black", width: "85%", alignSelf: "center", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
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

const Category=[
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

const Repeat = [
    //https://api.yepipet.app/dev/generalreminder/repeattypes
    "Daily"
]

const Frequency = [
    "Once",
    "Twice",
    "Thrice",
    "4 times",
    "5 times"
]
const ToDo = [
    "Get More super clean soap"
]

const Time = [
    "8:00 p.m"
]

const date = [

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


const Styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fcfcfc',
        paddingTop: 20,
        position: 'relative',
        height:"90%",

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
    image_circle: {
        width: 60,
        height: 60,
        borderRadius: 60 / 2
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
        width: 1,
        height: 1,
        borderRadius: 60 / 2
    },
})


