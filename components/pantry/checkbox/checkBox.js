import React, { Component, useState } from 'react';
import { View, Text } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
export default function CheckBoxComponent() {
  const [expirationSelected, selectExpiration] = useState(false);
  const [depletionSelected, selectDepletion] = useState(false);
  const [locationSelected, selectLocation] = useState(false);
  const [nameSelected, selectName] = useState(false);


  return (
    <View style={{
      flexDirection: 'row', marginHorizontal: 5,
      paddingVertical: 5,
      borderWidth: 1, borderColor: 'transparent',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingTop:20
    }}>
      <TouchableOpacity onPress={() => selectExpiration(!expirationSelected)} style={{ marginHorizontal: 6,}}>
        <View style={{ backgroundColor: expirationSelected ? "rgb(151,215,198)" : 'rgb(238,238,238)', padding: 5, paddingHorizontal: 7.5, borderRadius: 10 }}>
          <Text style={{ fontSize: 10,paddingVertical:8 }}>Expiration</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => selectDepletion(!depletionSelected)} style={{ marginHorizontal: 6, }}>
        <View style={{ backgroundColor: depletionSelected ? "rgb(151,215,198))" : 'rgb(238,238,238)', padding: 5, paddingHorizontal: 7.5, borderRadius: 10 }}>
          <Text style={{ fontSize: 10,paddingVertical:8 }}>Depletion</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => selectLocation(!locationSelected)} style={{ marginHorizontal: 3, }}>
        <View style={{ backgroundColor: locationSelected ? "rgb(151,215,198))" : 'rgb(238,238,238)', padding: 5, paddingHorizontal: 7.5, borderRadius: 10 }}>
          <Text style={{ fontSize: 10,paddingVertical:8,paddingHorizontal:10 }}>Location</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => selectName(!nameSelected)} style={{ marginHorizontal: 6, }}>
        <View style={{ backgroundColor: nameSelected ? "rgb(151,215,198))" : 'rgb(238,238,238)', padding: 5, paddingHorizontal: 7.5, borderRadius: 10 }}>
          <Text style={{ fontSize: 10,paddingVertical:8,paddingHorizontal:13 }}>Name</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}