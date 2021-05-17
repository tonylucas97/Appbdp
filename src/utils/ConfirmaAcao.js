import React from 'react'
import { Text, View } from 'react-native'

export default function ConfirmaAcao(props) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', position: 'absolute', backgroundColor: "rgba(226,223,223,0.6)" }}>
            <View style={{backgroundColor:"#fff",padding:28,borderRadius: 5}}>
                <Text style={{ fontSize: 16, fontFamily: "Ubuntu-Bold" }}>{props.mensagem}</Text>
                <View style={{flexDirection: "row",flexWrap: "wrap",justifyContent: "space-between",marginTop:18}}>
                    <Text onPress={() => props.cancelaAcao()} style={{ fontFamily: "Ubuntu-Regular",width:"42%" ,textAlign: "center",backgroundColor:"#FB212F",color:"#fff",borderRadius: 5,padding:7}}>Não</Text>
                    <Text onPress={() => props.acaoMethod(props.parametros.id)} style={{ fontFamily: "Ubuntu-Regular",width:"42%" ,textAlign: "center",backgroundColor:"#2ECC71",color:"#fff",borderRadius: 5,padding:7}}>Sim</Text>
                </View>
            </View>
        </View>
    )
}