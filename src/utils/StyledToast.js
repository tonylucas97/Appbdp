import React from "react"
import { Text, View } from "react-native"
import * as Animatable from 'react-native-animatable';

export default props =>

<Animatable.View animation="fadeInUp" style={{width:"100%",height:"100%",position:"absolute",flex:1,flexDirection:"column",justifyContent:"flex-end",backgroundColor: props.backgroundColor || "gray",color: props.textColor || "black"}}>
    <Text>{props.message}</Text>
</Animatable.View>