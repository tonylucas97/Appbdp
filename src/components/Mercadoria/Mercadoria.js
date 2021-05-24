import React, { useState } from "react"
import { View, SafeAreaView, ScrollView, Text, TextInput } from "react-native"
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, Colors } from 'react-native-paper';

export default function Mercadoria({ navigation, route }) {

    const [mercadorias, setMercadorias] = useState([])
    const [isLoading, setIsLoading] = useState();
    const [pulos, setPulos] = useState(0)

    useFocusEffect(
        React.useCallback(() => {
            setIsLoading(true)
            const getMercadorias = async () => {

                const result = await fetch(`http://apibaldosplasticos-com.umbler.net/mercadoria/limite?pulos=0&token=${await AsyncStorage.getItem("token")}`);
                const json = await result.json()
                setMercadorias(json.mercadorias[0])
            }

            getMercadorias();
            setIsLoading(false)
            return () => {
                setMercadorias([])
            };
        }, [])
    );

    const carregaMais = async () => {
        const result = await fetch(`http://apibaldosplasticos-com.umbler.net/mercadoria/limite?pulos=${pulos + 10}`)
        const json = await result.json();
        if (json.mercadorias[0].length) {
            console.log("tem alguam coisa")
            setMercadorias(mercadorias.concat(json.mercadorias[0]))
            setPulos(pulos + 10)
        }
        console.log(json.mercadorias[0])
    }

    const procuraMercadoria = async (texto) => {
        if (texto.length > 1) {
            const result = await fetch(`http://apibaldosplasticos-com.umbler.net/mercadoria/busca/${texto}/${await AsyncStorage.getItem("token")}`);
            const json = await result.json();

            setMercadorias(json.mercadorias)
        } else {
            const result = await fetch(`http://apibaldosplasticos-com.umbler.net/mercadoria/limite?pulos=0&token=${await AsyncStorage.getItem("token")}`);
            const json = await result.json()
            setMercadorias(json.mercadorias[0])
        }
        
    }

    return (
        <ScrollView>
            <SafeAreaView >
                <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 15 }}>
                    <View style={{ width: "85%", flexDirection: "row", flexWrap: "wrap", marginTop: 7, alignItems: "center" }}>
                        <Text style={{ width: "100%", paddingLeft: 7, fontSize: 23, fontFamily: "Ubuntu-Bold", marginBottom: 20 }}>Mercadorias</Text>
                        <View style={{ flexDirection: "row", width: "50%", alignItems: "center" }}>
                            <Text style={{ paddingLeft: 7, fontFamily: "Ubuntu-Regular", color: "#9B9B9B" }}>Exibindo {mercadorias.length} Resultados</Text>
                        </View>
                        <View style={{ flexDirection: "row", width: "50%", marginTop: 15, justifyContent: "flex-end" }}>
                            <Text style={{ paddingTop: 7, paddingBottom: 7, paddingLeft: 17, paddingRight: 17, color: "#fff", backgroundColor: "#FFA300", borderRadius: 5 }} onPress={() => navigation.navigate("NovaMercadoria")}>Novo</Text>
                        </View>

                    </View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
                    <View style={{ width: "85%", flexDirection: "row", flexWrap: "wrap", marginTop: 7, alignItems: "center" }}>
                        <View style={{ flexDirection: "row", width: "100%", alignItems: "center" }}>
                            <TextInput placeholder="Buscar mercadoria" style={{ backgroundColor: "#fff", width: "100%", paddingLeft: 15, borderRadius: 5 }} onChangeText={texto => procuraMercadoria(texto)} />
                        </View>
                    </View>
                </View>
                <View style={{ width: "100%", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 7 }}>
                    {!isLoading && (
                        mercadorias.map(item => {
                            return (
                                <View key={item.id} style={{ borderBottomWidth: 1, borderBottomColor: "#D8D8D8", borderStyle: "solid", paddingTop: 20, paddingBottom: 20, paddingLeft: 7, flexDirection: "row", flexWrap: "wrap", width: "85%" }}>
                                    <View style={{ flexDirection: "row", flexWrap: "wrap", width: "100%" }}>
                                        <Text style={{ fontFamily: "Ubuntu-Bold", color: "#9B9B9B", width: "50%", color: "#333333" }}>{item.nome}</Text>

                                    </View>
                                    <View style={{ flexDirection: "row", flexWrap: "wrap", width: "100%" }}>
                                        <Text style={{ fontFamily: "Ubuntu-Regular", color: "#9B9B9B", width: "50%", marginTop: 10 }}>Preço Compra: {item.precoCompra}</Text>
                                        <Text style={{ marginTop: 7, width: "50%" }}>

                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: "row", flexWrap: "wrap", width: "100%" }}>
                                        <Text style={{ fontFamily: "Ubuntu-Regular", color: "#9B9B9B", width: "50%", marginTop: 10 }}>Preço Venda: {item.precoVenda}</Text>
                                    </View>
                                    <View style={{ position: "absolute", right: 0, top: 38 }}>
                                        <Text style={{ marginRight: 20, fontFamily: "Ubuntu-Regular", backgroundColor: "#0079FF", color: "#fff", paddingTop: 8, paddingBottom: 8, paddingLeft: 18, paddingRight: 18 }} onPress={() => navigation.navigate("DetalheMercadoria", { id: item.id })}>Ver</Text>
                                    </View>

                                </View>
                            )
                        })
                    )}



                </View>
                {mercadorias.length >= 10 && (
                    <View style={{ flexDirection: "row", marginBottom: 20, justifyContent: "center", marginTop: 20 }}>
                        <Text onPress={() => carregaMais()} style={{ width: "85%", color: "#fff", backgroundColor: "#0079FF", padding: 8, borderRadius: 5, textAlign: "center", marginBottom: 10 }}>Carregar mais 10</Text>
                    </View>
                )}
            </SafeAreaView>
        </ScrollView>
    )
}