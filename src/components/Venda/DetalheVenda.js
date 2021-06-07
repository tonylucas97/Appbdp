
import React, { useState } from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ScrollView } from 'react-native-gesture-handler';
import RNPrint from 'react-native-print';

export default function DetalheVenda({ navigation, route }) {

    const [cliente, setCliente] = useState(route.params.cliente);
    const [total, setTotal] = useState(parseFloat(route.params.total).toFixed(2).toString().replace('.', ','));
    const [mercadoriaVendida, setMercadoriaVendida] = useState([]);

    useFocusEffect(
        React.useCallback(() => {

            const getNota = async () => {
                const resultVendas = await fetch(`https://apibdp.herokuapp.com/vendas/porid?token=${await AsyncStorage.getItem("token")}&id=${route.params.id}`)
                const jsonVendas = await resultVendas.json();
                for (let i = 0; i < jsonVendas.vendas.length; i++) {
                    const resultMercadoria = await fetch(`https://apibdp.herokuapp.com/mercadoria/porid?id=${jsonVendas.vendas[i].mercadoriaId}&token=${await AsyncStorage.getItem("token")}`);
                    const jsonMercadoria = await resultMercadoria.json();
                    const mercadoria = jsonMercadoria.mercadoria;
                    mercadoria.precoDesconto = jsonVendas.vendas[i].precoDesconto
                    mercadoria.precoDia = jsonVendas.vendas[i].precoDia
                    mercadoria.quantidade = jsonVendas.vendas[i].quantidade
                    setMercadoriaVendida(mercadoriaVendida => [...mercadoriaVendida, mercadoria]);
                }

                console.log(mercadoriaVendida)

            }

            getNota()
            return () => {
                setMercadoriaVendida([])
            };
        }, [])
    );


    const geraPDF = async (id) => {
        const resultNotas = await fetch(`https://apibdp.herokuapp.com/notas/porid?id=${id}&token=${await AsyncStorage.getItem("token")}`);
        const jsonNotas = await resultNotas.json();
        const resultVendas = await fetch(`https://apibdp.herokuapp.com/vendas/porid?id=${jsonNotas.nota.id}&token=${await AsyncStorage.getItem("token")}`);
        const jsonVendas = await resultVendas.json();
        let mercadorias = [];
        for (let i = 0; i < jsonVendas.vendas.length; i++) {
            const result = await fetch(`https://apibdp.herokuapp.com/mercadoria/porid?id=${jsonVendas.vendas[i].mercadoriaId}&token=${await AsyncStorage.getItem("token")}`)
            const json = await result.json();
            const mercadoria = {
                nome: json.mercadoria.nome,
                precoVenda: json.mercadoria.precoVenda,
                precoDia: jsonVendas.vendas[i].precoDia,
                precoDesconto: jsonVendas.vendas[i].precoDesconto,
                quantidade: jsonVendas.vendas[i].quantidade,
                total: jsonVendas.vendas[i].desconto ? parseFloat(jsonVendas.vendas[i].desconto) * jsonVendas.vendas[i].quantidade : jsonVendas.vendas[i].precoDia * jsonVendas.vendas[i].quantidade
            };
            mercadorias.push(mercadoria)
            console.log(mercadoria)

        }




        let dia = jsonNotas.nota.data.slice(8, 10);
        let mes = jsonNotas.nota.data.slice(5, 7);
        let ano = jsonNotas.nota.data.slice(0, 4);
        let dataFormated = dia + '/' + mes + '/' + ano
        let corpo = `
        
        <div style="width:80%;margin:0 auto;margin-bottom:30px;">
            
            <p style="text-align:left;diplay:inline">${jsonNotas.nota.cliente}</p>
            
        </div>
        
        <table style="border:1px solid;border-collapse: collapse;font-size:10px;margin: 0 auto;width:80%">
        
        <thead>
            <tr>
                <td style="border:1px solid;padding:7px">Nome da mercadoria</td>
                <td style="border:1px solid;padding:7px">Preço</td>
                <td style="border:1px solid;padding:7px">Quantidade</td>
                <td style="border:1px solid;padding:7px">Desconto</td>
                <td style="border:1px solid;padding:7px">Total</td>
            </tr>   
        <thead>
        <tbody>`

        for (let i = 0; i < mercadorias.length; i++) {
            const linha = `
                <tr>
                    <td style="padding: 10px;border: 1px solid black">${mercadorias[i].nome}</td>
                    <td style="padding: 10px;border: 1px solid black">${mercadorias[i].precoDia}</td>
                    <td style="padding: 10px;border: 1px solid black">${mercadorias[i].quantidade}</td>
                    <td style="padding: 10px;border: 1px solid black">${mercadorias[i].precoDesconto}</td>
                    <td style="padding: 10px;border: 1px solid black">${mercadorias[i].total}</td>
                </tr>
            `

            corpo += linha;
        }


        corpo += `
            </tbody>
            </table>
            <h5 style="margin-top:30px;text-align:center">Desconto: ${jsonNotas.nota.descontoPorcento} %</h5>
            <h5 style="margin-top:15px;text-align:center">Subtotal: ${parseFloat(jsonNotas.nota.subtotal).toFixed(2).toString().replace(".", ",")}</h5>
            
            
            `
        RNPrint.print({
            html: corpo
            
        })

    }

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", width: "80%" }}>
                <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 25, color: "#001E40", marginBottom: 20 }}>Detalhe Nota</Text>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", width: "80%" }}>
                <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 17, color: "#001E40" }}>Cliente: {cliente}</Text>
                <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 17, color: "#001E40" }}>R$ {total}</Text>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", width: "80%", marginTop: 25 }}>
                <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 17, color: "#777777" }}>Mercadorias</Text>
            </View>
            <View style={{ width: "80%", height: "60%", backgroundColor: "#fff", borderWidth: 1, borderColor: 'rgba(119,119,119,0.2)', borderRadius: 8, marginTop: 25, padding: 5 }}>
                <ScrollView>
                    {mercadoriaVendida != undefined && (

                        mercadoriaVendida.map((item, index) => {
                            return (
                                <View key={index} style={{ flexDirection: "row", paddingBottom: 10, marginTop: 10, justifyContent: "center" }}>
                                    <View style={{ borderBottomColor: "#C4C4C4", borderBottomWidth: 1, width: "85%", paddingBottom: 12, flexDirection: "row", flexWrap: "wrap" }}>
                                        <Text style={{ fontFamily: "Ubuntu-Bold", padding: 5, width: "100%", color: "black" }}>{item.nome}</Text>
                                        <Text style={{ fontFamily: "Ubuntu-Regular", padding: 5, width: "100%" }}>Preço: {item.precoDesconto ? parseFloat(item.precoDesconto).toFixed(2) : parseFloat(item.precoDia).toFixed(2)}</Text>
                                        <View style={{ width: "100%", flexDirection: "row", flexWrap: "wrap" }}>
                                            <Text style={{ fontFamily: "Ubuntu-Regular", padding: 5, width: "55%" }}>Quantidade: {item.quantidade}</Text>
                                            <Text style={{ fontFamily: "Ubuntu-Regular", padding: 5, width: "45%" }}>Total: {item.precoDesconto ? (item.precoDesconto * item.quantidade).toFixed(2) : (item.precoDia * item.quantidade).toFixed(2)}</Text>
                                        </View>

                                    </View>
                                </View>
                            )
                        })

                    )}
                </ScrollView>

            </View>
            <View style={{ width: "80%", marginTop: 20, justifyContent: "flex-end", flexDirection: "row" }}>
                <Text style={{ paddingTop: 7, paddingBottom: 7, paddingLeft: 17, paddingRight: 17, color: "#fff", backgroundColor: "#0079FF", borderRadius: 5, marginRight: 18 }} onPress={() => geraPDF(route.params.id)}>PDF</Text>
                <Text style={{ paddingTop: 7, paddingBottom: 7, paddingLeft: 17, paddingRight: 17, color: "#fff", backgroundColor: "#FB212F", borderRadius: 5 }} onPress={() => navigation.navigate("Venda")}>Voltar</Text>
            </View>
        </SafeAreaView >
    )
}