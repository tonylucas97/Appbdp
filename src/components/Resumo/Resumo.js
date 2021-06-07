import React, { useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App({ navigation }) {

    const [notas, setNotas] = useState(0);
    const [total, setTotal] = useState(0);
    const [lucro, setLucro] = useState(0.00);

    useFocusEffect(
        React.useCallback(() => {
            const getNotas = async () => {
                var data = new Date();
                var dia = String(data.getDate()).padStart(2, '0');
                var mes = String(data.getMonth() + 1).padStart(2, '0');
                var ano = data.getFullYear();
                const dataAtual = ano + '-' + mes + '-' + dia;
                const result = await fetch(`https://apibdp.herokuapp.com/notas/${dataAtual}/${dataAtual}/${await AsyncStorage.getItem("token")}`);
                const json = await result.json()
                let subtotal = 0
                let lucroL = 0
                for (let i = 0; i < json.notas.length; i++) {
                    subtotal += total + json.notas[i].subtotal
                    const resultVenda = await fetch(`https://apibdp.herokuapp.com/vendas/porid?id=${json.notas[i].id}&token=${await AsyncStorage.getItem("token")}`)
                    const jsonVenda = await resultVenda.json()
                    console.log(jsonVenda)
                    for (let j = 0; j < jsonVenda.vendas.length; j++) {
                        
                    }
                    
                    
                }
                setNotas(json.notas.length)
                setLucro(lucroL)
                setTotal(subtotal)
            }

            getNotas();

            return () => {
                setNotas([])
                setTotal(0)
            };
        }, [])
    );

    return (
        <SafeAreaView style={{ flexDirection: "row", justifyContent: "center" }}>
            <View style={{ width: "85%", flexDirection: "row", flexWrap: "wrap", marginTop: 15, alignItems: "center"}}>
                <Text style={{ width: "100%", paddingLeft: 7, fontSize: 23, fontFamily: "Ubuntu-Bold", marginBottom: 20 }}>Resumo</Text>
                <View style={{ flexDirection: "row", flexWrap: "nowrap", paddingLeft: 7, marginTop: 25 ,width:"100%"}}>
                    <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 21 }}>Total: </Text>
                    <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 21 }}>{total.toFixed(2).toString().replace(".", ",")}</Text>
                </View>
                <View style={{ flexDirection: "row", flexWrap: "nowrap", paddingLeft: 7, marginTop: 25 ,width:"100%"}}>
                    <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 21 }}>Lucro: </Text>
                    <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 21 }}>{parseFloat(lucro)}</Text>
                </View>
                <View style={{ flexDirection: "row", flexWrap: "nowrap", paddingLeft: 7, marginTop: 25 ,width:"100%"}}>
                    <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 21 }}>Vendas: </Text>
                    <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 21 }}>{notas}</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}