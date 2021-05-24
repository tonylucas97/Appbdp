import React, { useState } from 'react'
import { Button, SafeAreaView, Text, View } from 'react-native'
import Svg, { G, Circle, Path } from "react-native-svg"
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from 'react-native-gesture-handler';
import { formataData } from './Services'
import DatePicker from 'react-native-date-picker'

export default function Vendas({ navigation }) {

    const [vendas, setVendas] = useState([])
    const [date, setDate] = useState(new Date())
    const [dataFinal, setDataFinal] = useState(new Date())
    const [showDataInicial, setShowDataInicial] = useState(false)
    const [showDataFinal, setShowDataFinal] = useState(false)
    const [pulos, setPulos] = useState(0)

    useFocusEffect(
        React.useCallback(() => {
            const getNotas = async () => {
                fetch(`http://apibaldosplasticos-com.umbler.net/notas/limite?token=${await AsyncStorage.getItem("token")}&pulos=${0}`).then((result) => {
                    return result.json()
                }).then((result) => {
                    setVendas(result.notas[0])
                })
            }
            getNotas()
            return () => {
                setVendas([])
                setShowDataInicial(false);
                setShowDataFinal(false);
                setDate(new Date());
                setDataFinal(new Date())
                setPulos(0)
            };
        }, [])
    );

    const detalheVenda = async (id) => {
        const result = await fetch(`http://apibaldosplasticos-com.umbler.net/notas/porid?token=${await AsyncStorage.getItem("token")}&id=${id}`);
        const json = await result.json();
        if (json.success) {
            navigation.navigate("DetalheVenda", { cliente: json.nota.cliente, total: json.nota.subtotal, id: id })
        }
    }

    const vendaPorData = async () => {
        const dataInicialFormated = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + (date.getDate())).slice(-2)
        const dataFinalFormated = dataFinal.getFullYear() + '-' + ("0" + (dataFinal.getMonth() + 1)).slice(-2) + '-' + ('0' + (dataFinal.getDate())).slice(-2)
        navigation.navigate("VendaData", { dataInicial: dataInicialFormated, dataFinal: dataFinalFormated })
    }

    const carregaMais = async () => {
        const result = await fetch(`http://apibaldosplasticos-com.umbler.net/notas/limite?token=${await AsyncStorage.getItem("token")}&pulos=${pulos + 10}`)
        const json = await result.json();
        if (json.notas[0].length) {
            console.log("tem alguam coisa")
            setVendas(vendas.concat(json.notas[0]))
            setPulos(pulos + 10)
        }
        console.log(json.notas[0])

    }

    const toggleShowDataInicial = () => {
        if (showDataInicial) {
            setShowDataInicial(false)
            setShowDataFinal(false)
        } else {
            setShowDataInicial(true)
            setShowDataFinal(false)
        }
    }

    const toggleShowDataFinal = () => {
        if (showDataFinal) {
            setShowDataInicial(false)
            setShowDataFinal(false)
        } else {
            setShowDataInicial(false)
            setShowDataFinal(true)
        }
    }

    return (
        <React.Fragment>
            <ScrollView>
                <SafeAreaView style={{ backgroundColor: "#fff", height: "100%" }}>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', zIndex: 4 }}>
                        <View style={{ width: "85%", backgroundColor: 'rgba(0,121,255,0.075)', flexDirection: 'row', flexWrap: 'wrap', padding: 15, marginTop: 25, borderRadius: 5, alignItems: "center" }}>
                            <View style={{ width: "37%", flexDirection: 'row', justifyContent: "center", alignItems: "center" }}>

                                <Text style={{ fontFamily: "Ubuntu-Medium", color: "#0079FF" }} onPress={toggleShowDataInicial}>Data Inicial </Text>
                                <Text style={{ marginLeft: 4 }} onPress={toggleShowDataInicial}>
                                    <Svg
                                        width={11}
                                        height={7}
                                        viewBox="0 0 11 7"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <Path
                                            d="M10.246.29a1 1 0 00-1.41 0l-3.59 3.54L1.706.29a1 1 0 10-1.41 1.42l4.24 4.24a1 1 0 001.42 0l4.29-4.24a1 1 0 000-1.42z"
                                            fill="#0079FF"
                                        />
                                    </Svg>
                                </Text>

                            </View>


                            <View style={{ width: "26%", alignItems: "center" }}>
                                <Text style={{ backgroundColor: "#fff", padding: 7, borderRadius: 5 }}>
                                    <Svg
                                        width={18}
                                        height={18}
                                        viewBox="0 0 18 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <Path
                                            d="M15.3 1.8h-1.8V.9a.9.9 0 10-1.8 0v.9H6.3V.9a.9.9 0 10-1.8 0v.9H2.7A2.7 2.7 0 000 4.5v10.8A2.7 2.7 0 002.7 18h12.6a2.7 2.7 0 002.7-2.7V4.5a2.7 2.7 0 00-2.7-2.7zm.9 13.5a.9.9 0 01-.9.9H2.7a.9.9 0 01-.9-.9V9h14.4v6.3zm0-8.1H1.8V4.5a.9.9 0 01.9-.9h1.8v.9a.9.9 0 001.8 0v-.9h5.4v.9a.9.9 0 101.8 0v-.9h1.8a.9.9 0 01.9.9v2.7z"
                                            fill="#0079FF"
                                        />
                                    </Svg>
                                </Text>
                            </View>
                            <View style={{ width: "37%", flexDirection: 'row', justifyContent: "center", alignItems: "center" }}>

                                <Text style={{ fontFamily: "Ubuntu-Medium", color: "#0079FF" }} onPress={toggleShowDataFinal}>Data Final </Text>
                                <Text style={{ marginLeft: 4 }} onPress={toggleShowDataFinal}>
                                    <Svg
                                        width={11}
                                        height={7}
                                        viewBox="0 0 11 7"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <Path
                                            d="M10.246.29a1 1 0 00-1.41 0l-3.59 3.54L1.706.29a1 1 0 10-1.41 1.42l4.24 4.24a1 1 0 001.42 0l4.29-4.24a1 1 0 000-1.42z"
                                            fill="#0079FF"
                                        />
                                    </Svg>
                                </Text>

                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', zIndex: 4 }}>
                        <View style={{ width: "85%", flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            <Text style={{ backgroundColor: "#0079FF", color: "#fff", paddingBottom: 8, paddingTop: 8, paddingLeft: 14, paddingRight: 14, marginTop: 15, borderRadius: 5 }} onPress={vendaPorData}>Procurar</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: "center", marginTop: 20 }}>
                        <View style={{ width: "85%", flexDirection: "column" }}>
                            <View style={{ width: "100%", flexDirection: "row", flexWrap: "wrap" }}>
                                <View style={{ width: "50%", justifyContent: "center" }}>
                                    <Text style={{ marginLeft: 7, marginTop: 15, marginBottom: 15, fontSize: 23, fontFamily: "Ubuntu-Bold", color: "#001E40" }}>Notas</Text>
                                </View>
                                <View style={{ width: "50%", flexWrap: "wrap", flexDirection: "row", justifyContent: "flex-end" }}>
                                    <Text onPress={() => navigation.navigate("NomeClienteVenda")} style={{ marginLeft: 7, marginTop: 15, marginBottom: 15, fontSize: 16, fontFamily: "Ubuntu-Medium", color: "#fff", backgroundColor: "#FFA300", paddingTop: 7, paddingBottom: 7, paddingLeft: 10, paddingRight: 10, borderRadius: 5 }}>Nova</Text>
                                </View>
                            </View>

                            {vendas != undefined && (
                                vendas.map((item, index) => {
                                    return (
                                        <View key={index} style={{ borderBottomWidth: 1, borderBottomColor: "#D8D8D8", borderStyle: "solid", paddingTop: 20, paddingBottom: 20, paddingLeft: 7, flexDirection: "row" }}>
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
                    </View>
                    {vendas.length >= 10 && (
                        <View style={{ flexDirection: "row", marginBottom: 20, justifyContent: "center", marginTop: 20 }}>
                            <Text onPress={() => carregaMais()} style={{ width: "85%", color: "#fff", backgroundColor: "#0079FF", padding: 8, borderRadius: 5, textAlign: "center", marginBottom: 10 }}>Carregar mais 10</Text>
                        </View>
                    )}

                </SafeAreaView>
            </ScrollView>
            {
                showDataInicial && (
                    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", position: 'absolute', height: '100%', width: '100%', backgroundColor: 'rgba(196,196,196,0.8)' }}>
                        <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 20, color: "black", marginBottom: 24 }}>Data Inicial</Text>
                        <DatePicker
                            date={date}
                            onDateChange={setDate}
                            style={{ backgroundColor: 'white', borderRadius: 5 }}
                            locale="pt-BR"
                            mode="date"
                        />
                        <Text style={{ fontFamily: "Ubuntu-Bold", backgroundColor: "#2ECC71", paddingBottom: 8, paddingTop: 8, paddingLeft: 14, paddingRight: 14, color: "#fff", borderRadius: 5, marginTop: 25 }} onPress={toggleShowDataInicial}>Confirmar</Text>
                    </SafeAreaView>
                )
            }
            {
                showDataFinal && (
                    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", position: 'absolute', height: '100%', width: '100%', backgroundColor: 'rgba(196,196,196,0.8)' }}>
                        <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 20, color: "black", marginBottom: 24 }}>Data Final</Text>
                        <DatePicker
                            date={dataFinal}
                            onDateChange={setDataFinal}
                            style={{ backgroundColor: 'white', borderRadius: 5 }}
                            locale="pt-BR"
                            mode="date"
                        />
                        <Text style={{ fontFamily: "Ubuntu-Bold", backgroundColor: "#2ECC71", paddingBottom: 8, paddingTop: 8, paddingLeft: 14, paddingRight: 14, color: "#fff", borderRadius: 5, marginTop: 25 }} onPress={toggleShowDataFinal}>Confirmar</Text>
                    </SafeAreaView>
                )
            }


        </React.Fragment >
    )
}