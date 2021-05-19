import React, { useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { formataData } from './Services';
import Svg, { G, Circle, Path } from "react-native-svg"
import { ScrollView } from 'react-native-gesture-handler';

export default function VendaData({ navigation, route }) {

    const [notas, setNotas] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            const getNotas = async () => {
                console.log(route.params.dataInicial)
                fetch(`http://apibaldosplasticos-com.umbler.net/notas/${route.params.dataInicial}/${route.params.dataFinal}/${await AsyncStorage.getItem("token")}`).then((result) => {
                    return result.json()
                }).then((result) => {
                    setNotas(result.notas)
                })
            }
            getNotas()
            return () => {
                setNotas([])
            };
        }, [])
    );

    const detalheVenda = async (id) => {
        const result = await fetch(`http://apibaldosplasticos-com.umbler.net/notas/${id}/${await AsyncStorage.getItem("token")}`);
        const json = await result.json();
        console.log(jsopn)
        if (json.success) {
            navigation.navigate("DetalheVenda", { cliente: json.notas.cliente, total: json.notas.subtotal, id: id })
        }
    }

    return (
        <SafeAreaView style={{ backgroundColor: "#fff", height: "100%" }}>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 45, width: "60%" }}>
                    <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 17 }}>{formataData(route.params.dataInicial)}</Text>
                    <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 17 }}>a</Text>
                    <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 17 }}>{formataData(route.params.dataFinal)}</Text>
                </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <View style={{ width: "85%", flexDirection: "row", justifyContent: "space-around" }}>
                    <Text style={{ marginTop: 25, fontFamily: "Ubuntu-Bold", fontSize: 24, color: "#001E40" }}>Notas</Text>
                </View>
            </View>
            <ScrollView style={{ height: "50%" }}>
                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 25 }}>
                    {notas != undefined && (

                        notas.map((item, index) => {
                            return (
                                <View key={index} style={{ borderBottomWidth: 1, borderBottomColor: "#D8D8D8", borderStyle: "solid", paddingTop: 20, paddingBottom: 20, paddingLeft: 7, flexDirection: "row", width: "80%" }}>
                                    <View style={{ flexDirection: "row", flexWrap: "wrap", width: "70%" }}>
                                        <View style={{ width: "50%" }}>
                                            <Text style={{ fontFamily: "Ubuntu-Medium", color: "#9B9B9B" }}>
                                                {item.cliente && (
                                                    <Text>{item.cliente}</Text>
                                                )}
                                                {item.cliente === '' && (
                                                    <Text>Sem Nome</Text>
                                                )}
                                            </Text>
                                        </View>
                                        <View style={{ width: "50%" }}>
                                            <Text style={{ fontFamily: "Ubuntu-Medium", color: "#9B9B9B" }}>{formataData(item.data)}</Text>
                                        </View>

                                    </View>
                                    <View style={{ flexDirection: "row", flexWrap: "wrap", width: "30%", justifyContent: "flex-end" }}>
                                        <Text style={{ marginRight: 7 }} onPress={() => detalheVenda(item.id)}>
                                            <Svg
                                                width={21}
                                                height={16}
                                                viewBox="0 0 21 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <Path
                                                    d="M19.924 7.6c-2.02-4.69-5.82-7.6-9.92-7.6s-7.9 2.91-9.92 7.6a1 1 0 000 .8c2.02 4.69 5.82 7.6 9.92 7.6s7.9-2.91 9.92-7.6a1.001 1.001 0 000-.8zm-9.92 6.4c-3.17 0-6.17-2.29-7.9-6 1.73-3.71 4.73-6 7.9-6s6.17 2.29 7.9 6c-1.73 3.71-4.73 6-7.9 6zm0-10a4 4 0 100 8 4 4 0 000-8zm0 6a2 2 0 110-4 2 2 0 010 4z"
                                                    fill="#0079FF"
                                                />
                                            </Svg>
                                        </Text>
                                    </View>
                                </View>
                            )
                        })


                    )}


                </View>
                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-end", marginTop: 30, width: "80%" }}>
                        <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 17, paddingTop: 7, paddingBottom: 7, paddingLeft: 17, paddingRight: 17, backgroundColor: "#FB212F", color: "#fff", borderRadius: 5 }} onPress={() => navigation.navigate("Venda")}>Voltar</Text>
                    </View>
                </View>
            </ScrollView>

        </SafeAreaView>
    )
}