import * as React from 'react';
import { Alert, View, Text, DatePickerAndroid, StyleSheet, ScrollView, SafeAreaView, Dimensions, TextInput, Image, Picker, Switch, PickerIOS, Platform } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler";
import styles from '../../constants/Form.style';
import { AntDesign, FontAwesome, MaterialIcons,Entypo } from "@expo/vector-icons";
import NotFound from "../../assets/imagenotfound.png";
import * as ImagePicker from 'expo-image-picker';
const { fontScale } = Dimensions.get("screen")

export default class AddObservation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            date: "",
            EnablePushReminder: false,
            syncCalendar: false,
            formDataImage1:null,
            formDataImage2:null,
            imageReminder1:null,
            imageReminder2:null,
        }
    }
    async date() {
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

    _chooseOption(formDataImage, avatarSource) {
        Alert.alert(
            'Upload Image',
            'Please choose option',
            [
                {text: 'From Camera', onPress: () => this._pickImage('Camera', formDataImage, avatarSource)},
                {text: 'From Library', onPress: () => this._pickImage('Library', formDataImage, avatarSource)},
                {text: 'Cancel', onPress: () =>  console.log("Cancel Pressed") , style: 'cancel'}
            ]
        )
    };

    openImagePickOptions = () => {
        Alert.alert(
            'Alert Title',
            'My Alert Msg',
            [
                // { text: 'Ask me later', onPress: () => console.log('Ask me later pressed') },
                {
                    text: 'Open Gallery',
                    onPress: async () => {
                        const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, mediaTypes: ImagePicker.MediaTypeOptions.Images });
                        if (result.cancelled) {
                            return;
                        } else {

                            console.log("uri");
                            this.setState({
                                photosForOB: [...this.state.photosForOB, result.uri]
                            })
                            console.log(result);

                        }

                    },
                    // style: 'cancel',
                },
                {
                    text: 'Open Camera',
                    onPress: async () => {

                        const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, mediaTypes: ImagePicker.MediaTypeOptions.Images });
                        if (result.cancelled) {
                            return;
                        } else {
                            this.setState({
                                photosForOB: [...this.state.photosForOB, result.uri]
                            })
                            console.log("uri");
                            console.log(result.uri);
                        }
                    }
                },
            ],
            { cancelable: true },
        );
    }

    render() {

        const { navigate } = this.props.navigation;
        const {
            imageReminder1,
            imageReminder2
        } = this.state;

        return (
            <SafeAreaView style={Styles.safeArea}>
                <ScrollView>
                    <View>
                        <View style={Styles.header}>
                            <View>
                                <AntDesign onPress={() => navigate("pentry")} name="left" size={25} />
                            </View>
                            <View>
                                <Text style={Styles.heading}>
                                    Add an Observation
                                </Text>
                            </View>
                            <View>
                                <Entypo name="plus" size={25} style={{paddingRight:5}}/>
                            </View>
                        </View>
                        <View style={[styles.container_form, { marginBottom: 21, marginHorizontal: 15, paddingBottom: 0 }]}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <TouchableOpacity style={{ marginHorizontal: 7.5 }}>
                                <Image
                                    style={[styles.image_circle, { borderColor: 'orange' }]}
                                    source={{ uri: "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png" }}
                                />
                                <View style={{ flexDirection: "row", position: "relative", bottom: 30, paddingLeft: 10, zIndex: 50, justifyContent: "flex-end" }}>
                                    <TouchableOpacity style={{ backgroundColor: "white" }}>
                                        <AntDesign name="checkcircle" size={24} color="rgb(32,183,145)" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginHorizontal: 7.5 }}>
                                <Image
                                    style={[styles.image_circle, { borderColor: 'orange' }]}
                                    source={{ uri: "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png" }}
                                />
                                <View style={{ flexDirection: "row", position: "relative", bottom: 30, paddingLeft: 10, zIndex: 50, justifyContent: "flex-end" }}>
                                    <TouchableOpacity style={{ backgroundColor: "white" }}>
                                        <AntDesign name="checkcircle" size={24} color="rgb(32,183,145)" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginHorizontal: 7.5 }}>
                                <Image
                                    style={[styles.image_circle, { borderColor: "orange" }]}
                                    source={{ uri: "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png" }}
                                />
                                <View style={{ flexDirection: "row", position: "relative", bottom: 30, paddingLeft: 10, zIndex: 50, justifyContent: "flex-end" }}>
                                    <TouchableOpacity style={{ backgroundColor: "white" }}>
                                        <AntDesign name="checkcircle" size={24} color="rgb(32,183,145)" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>

                        <View style={[styles.container_form,{marginBottom:26,marginHorizontal:10}]}>
                            <View>
                                <Text style={{
                                    fontSize:fontScale*22,
                                    fontWeight:'bold',
                                    justifyContent:'center',
                                    textAlign:'center'}}>
                                        Care & Observation
                                </Text>
                            </View>
                            

                            <View style={{flexDirection:'column'}}>
                            <View style={{  marginTop: 15, flexDirection:'row' }}>
                                <View style = {{width:40}}>
                            <Text style={{ color: "rgb(200,200,200)", fontSize: 12, paddingBottom: 5, }}>Area:</Text>
                                </View>
                            <View style={{ borderWidth: 0.5, borderRadius: 5, backgroundColor: 'rgb(252,252,252)', width: "80%",marginLeft:10 }}>
                                <Picker selectedValue={this.state.Area1}
                                    style={{ height: 37.5, opacity: Platform.OS === "ios" ? 0 : 1, width: "100%" }}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ Area1: itemValue })}
                                >
                                    {
                                        Area1.map(itm =>
                                            <Picker.Item label={itm} value={itm} key={itm} />
                                        )
                                    }

                                </Picker>
                            </View>
                        </View>
                                <View style={{ borderColor: "grey", borderWidth: 1, width: "80%",height: 37.5,backgroundColor: 'rgb(252,252,252)', marginTop: 10,borderRadius:5,marginLeft:50 }}>

                                    <Picker selectedValue={Area2[0]} style={{ height: 37.5, opacity: Platform.OS === "ios" ? 0 : 1 }} >
                                        {
                                            Area2.map(itm =>
                                                <Picker.Item label={itm} value={itm} key={itm} />
                                            )}
                                    </Picker>
                                </View>
                            </View>



                            <View style={{ flexDirection: "row", marginTop: 15 }}>
                                <Text style={{paddingTop:10}}>Date</Text>

                                <View
                                    style={{
                                        borderWidth: 1,
                                        backgroundColor: 'rgb(252,252,252)',
                                        width:'30%',
                                        borderRadius:5,
                                        height:37.5,
                                        marginLeft:20,
                                        paddingTop:5
                                    }}
                                >

                                    <Text style={{ textAlign: "center", paddingVertical: 5, }}>
                                        {this.state.date === "" ? "00/00/00" : this.state.date}
                                    </Text>
                                </View>
                                <View style={{ marginLeft: 5 }}>
                                    <TouchableOpacity onPress={() => this.date()} style={{paddingTop:10}}>
                                        <FontAwesome name="calendar" size={20} />
                                    </TouchableOpacity >
                                </View>

                                <View style={{  flexDirection:'row',paddingTop: 2, }}>
                                    <Text style={{ paddingHorizontal: 5,paddingTop:10 }}>Time</Text>
                                    <View style={{ 
                                        borderColor: "grey", 
                                        borderWidth: 1,
                                        backgroundColor: 'rgb(252,252,252)', 
                                        width: '50%', 
                                        height: 37.5, 
                                        borderRadius:5 }}>

                                        <Picker selectedValue={Time[0]} style={{ height: 40, opacity: Platform.OS === "ios" ? 0 : 1 }} >
                                            {
                                                Time.map(itm =>
                                                    <Picker.Item label={itm} value={itm} key={itm} />
                                                )}
                                        </Picker>
                                    </View>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'column', marginTop: 10 }}>
                                <Text style={{ marginLeft: 120 }}>Summary</Text>
                                <View style={{paddingTop:10}}>
                                <TextInput style={{ borderColor: "grey", borderWidth: 1,borderRadius:5,height:40,paddingTop:10}} placeholder="Observation allergy reaction" />
                                </View>
                            </View>

                            <View style={{ flexDirection: 'column', marginTop: 10 }}>
                                <Text style={{ marginTop: 10,marginLeft:120 }}>Observation</Text>
                            <View style={{
                           borderWidth:1,
                           borderColor:'grey',
                           height:80,
                           width:'99%',
                           marginTop:10,
                           borderRadius:12,
                           paddingTop:10
                           }}>
                           <TextInput style={{textAlign:'left'}} placeholder='This is an example for text area notes.'/>
                       </View>
                       </View>

                            <View style={[styles.form_group,{marginTop:20}]}>
                                    <View style={{flexDirection:'row'}}>
                                        <View style={{width:'10%'}}>
                                            <MaterialIcons name='photo-camera' style={{fontSize:20,textAlign:'left'}}></MaterialIcons>
                                        </View>

                                        <View style={{width: '90%',}}>
                                            <Text style={[styles.form_label,{justifyContent: 'flex-start', alignItems: 'center',textAlign:'left',marginLeft:'1%'}]}>
                                                Photos
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={{flexDirection:'row',width:'100%'}}>
                                    <View style={{width:'50%'}}>
                                        <TouchableOpacity style={{flex: 0.5, paddingRight: 5}} onPress={() => this._chooseOption('formDataImage1', 'imageReminder1')}>                    
                                            <Image 
                                                style={{width: '100%', height: 90}} 
                                                source={imageReminder1 ? {uri: imageReminder1} : require('../../assets/images/img-default.png')}
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{width:'50%'}}>
                                        <TouchableOpacity style={{flex: 0.5, paddingLeft: 5}} onPress={() => this._chooseOption('formDataImage2', 'imageReminder2')}>                    
                                            <Image 
                                                style={{width: '100%', height: 90}} 
                                                source={imageReminder2 ? {uri: imageReminder2} : require('../../assets/images/img-default.png')}
                                            />
                                        </TouchableOpacity>  
                                    </View>
                                </View>

                                <View style={{marginBottom: 16,marginTop:20,width:'100%'}}>
                                {
                                    this.state.formDataImage1 && !this.state.formDataImage2
                                    ?
                                        <TouchableOpacity onPress={() => this._chooseOption('formDataImage2', 'imageReminder2')}>
                                            <View style={Styles.group_upload}>
                                                <Image style={{width: 40, height: 32}} source={require('../../assets/images/icon-camera.png')}/>
                                                <Text style={Styles.text_upload}>Add new photo</Text>
                                            </View>
                                        </TouchableOpacity>
                                    :
                                        this.state.formDataImage1 && this.state.formDataImage2
                                        ?
                                            <TouchableOpacity onPress={() => this._chooseOption('formDataImage1', 'imageReminder1')}>
                                                <View style={Styles.group_upload}>
                                                    <Image style={{width: 40, height: 32}} source={require('../../assets/images/icon-camera.png')}/>
                                                    <Text style={Styles.text_upload}>Add new photo</Text>
                                                </View>
                                            </TouchableOpacity>
                                        :
                                            <TouchableOpacity onPress={() => this._chooseOption('formDataImage1', 'imageReminder1')}>
                                                <View style={Styles.group_upload}>
                                                    <Image style={{width: 40, height: 32}} source={require('../../assets/images/icon-camera.png')}/>
                                                    <Text style={Styles.text_upload}>Add new photo</Text>
                                                </View>
                                            </TouchableOpacity>
                                }
                                </View>
                            {/* <View style={{ justifyContent: "center" }}>
                                <TouchableOpacity style={{ marginLeft: 5 }} onPress={this.openImagePickOptions}>
                                    <Image
                                        style={[styles.image_circle, { borderColor: 'black', marginTop: 10, }]}
                                        source={require('../../assets/images/icon-camera.png')}
                                    />
                                </TouchableOpacity>
                            </View> */}

                            {/* <View style={{ flexDirection: "row", paddingLeft: 2, paddingTop: 5, justifyContent: "flex-start" }}>
                                <FontAwesome name="tags" size={20} style={{ paddingTop: 5 }} />
                                <Text style={{ fontSize: fontScale * 22, paddingLeft: 10, textDecorationLine: "underline" }}>
                                    Labels
                                </Text>
                            </View>
                            <View>
                                <TextInput style={{ borderColor: "grey", borderWidth: 1, width: "80%", marginLeft: 10, height: 30 }} placeholder="will render to juno 2yrs at add product pet n instructions" />
                            </View> */}

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

const Area1 = [
    "Pantry"
]

const Area2 = [
    "Super Clean Soap"
]

const Time = [
    ""
]
const Styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fcfcfc',
        paddingTop: 20,
        position: 'relative',
        height: "90%",

    },
    header: {
        paddingVertical: 20,
        flexDirection: "row",
        justifyContent: 'space-around'
    },
    heading: {
        fontSize: fontScale * 18,
        fontWeight: "bold",
        marginRight: 20
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
    group_upload: {
        alignItems: 'center',
        padding: 18, 
        borderWidth: 1, 
        borderStyle: 'dashed', 
        borderColor: '#e0e0e0',
        flex: 1
    },
    text_upload: {
        color: '#4e94b2', 
        fontSize: 15, 
        fontWeight: '500', 
        marginTop: 5
    },
})
