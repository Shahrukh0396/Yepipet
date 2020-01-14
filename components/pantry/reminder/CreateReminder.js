import React from 'react'
import { View, Text, Alert } from 'react-native'
import { FontAwesome, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function ReminderComponent(props) {
    const { navigate } = props.navigation;
    return (
        <View style={{ flexDirection: 'row', marginLeft: -10, marginRight: 2 }}>
            <View style={{
                width: 60,
                height: 30,
                backgroundColor: "#2b78e4",
                borderWidth: 1,
                borderColor: "black",
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <TouchableOpacity onPress={() => navigate("AddObservation")}>
                    {/* <AntDesign name="copy1" color="white" /> */}
                    <Text style={{ color: 'white' }}>Note</Text>
                </TouchableOpacity>

            </View>
            <View style={{
                width: 68,
                height: 30,
                backgroundColor: "orange",
                borderWidth: 1,
                borderColor: "black",
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal:5
            }}>
                <TouchableOpacity onPress={() => navigate("ScheduleDetail", { petDetail: null })}>
                    {/* <FontAwesome5 name="bell" color="white" /> */}
                    <Text style={{ color: 'white' }}>Remind</Text>
                </TouchableOpacity>

            </View>
            <View style={{
                width: 60,
                height: 30,
                backgroundColor: "rgb(12.5,71.8,56.9)",
                borderWidth: 1,
                borderColor: "black",
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <TouchableOpacity onPress={props.refill}>
                    {/* <FontAwesome name="cart-plus" color="white" /> */}
                    <Text style={{ color: 'white' }}>Refill</Text>
                </TouchableOpacity>


            </View>


        </View>
    )
}
