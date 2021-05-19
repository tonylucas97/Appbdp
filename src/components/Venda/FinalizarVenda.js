import React, { useState } from 'react'
import { SafeAreaView, Text, View, StyleSheet } from 'react-native'
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import { TextInput } from 'react-native-gesture-handler';
import ConfirmaAcao from '../../utils/ConfirmaAcao';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { json } from 'body-parser';

export default function FinalizarVenda({ navigation, route }) {

    const [formaPagamentoV, setFormaPagamentoV] = useState("dinheiro");
    const [descontoV, setDescontoV] = useState("0");
    const [subtotal, setSubtotal] = useState(route.params.subtotal)
    const [showConfirma, setShowConfirma] = useState(false)
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Dinheiro', value: 'dinheiro' },
        { label: 'Cartão', value: 'cartao' },
        { label: 'Cheque', value: 'cheque' }
    ]);

    const finalizaNota = async () => {
        const adminId = await AsyncStorage.getItem("adminId");
        const resultNota = await fetch(`http://apibaldosplasticos-com.umbler.net/notas`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subtotal: subtotal, cliente: route.params.cliente,descontoPorcentagem: String(descontoV), metodoPagamento: String(formaPagamentoV), token: await AsyncStorage.getItem("token") })
        })
        const jsonNota = await resultNota.json();
        
        for(let i = 0 ; i < route.params.carrinho.length; i++) {
            const resultMercadoria = await fetch(`http://apibaldosplasticos-com.umbler.net/mercadoria/porid?id=${route.params.carrinho[i].id}&token=${await AsyncStorage.getItem("token")}`);
            const jsonMercadoria = await resultMercadoria.json();
            const quantidade = route.params.carrinho[i].quantidade;
            

            const resultVenda = await fetch(`http://apibaldosplasticos-com.umbler.net/vendas`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({precoDia: jsonMercadoria.mercadoria.precoVenda,precoDesconto: route.params.carrinho[i].desconto
                    ,quantidade: quantidade,notaId:jsonNota.nota.id,mercadoriaId: jsonMercadoria.mercadoria.id,token: await AsyncStorage.getItem("token")
                })
            })

            const jsonVenda = await resultVenda.json();
            
        }

        if(jsonNota.success){
            navigation.navigate("Venda")
        }
          

    }

    const cancelaAcao = () => {
        setShowConfirma(false)
    }



    const calculaDesconto = (text) => {
        setDescontoV(text)
        if (text && text != "0") {
            setSubtotal((route.params.subtotal - ((parseInt(text) / 100) * route.params.subtotal)).toFixed(2))
        } else if (!text) {
            setSubtotal(parseFloat(route.params.subtotal))
        }
    }

    const renderTotal = () => {
        if (descontoV != "0" && descontoV) {
            return (
                <View width="100%">
                    <Text style={{ width: "100%", textAlign: "right", fontFamily: "Ubuntu-Bold" }}>Desconto : {descontoV} %</Text>
                    <Text style={{ width: "100%", textAlign: "right", marginTop: 12, fontFamily: "Ubuntu-Bold", textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>Total : {route.params.subtotal}</Text>
                    <Text style={{ width: "100%", textAlign: "right", marginTop: 12, fontFamily: "Ubuntu-Bold", fontSize: 17 }}>Subtotal: {(route.params.subtotal - ((parseInt(descontoV) / 100) * route.params.subtotal)).toFixed(2)}</Text>
                </View>
            )
        } else {
            return (
                <Text style={{ width: "100%", textAlign: "right", marginTop: 12, fontFamily: "Ubuntu-Bold", fontSize: 17 }}>Subtotal: {route.params.subtotal.toString().replace(".", ",")}</Text>
            )
        }
    }

    return (
        <React.Fragment>
            <SafeAreaView style={{ padding: 10, flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F7F7F7" }}>
                <View style={{ width: "90%", marginTop: 30 }}>
                    <Text style={{ fontFamily: "Ubuntu-Bold", marginBottom: 20, fontSize: 19, alignSelf: "flex-start" }}>Forma de pagamento</Text>
                    <DropDownPicker
                        open={open}
                        value={formaPagamentoV}
                        items={items}
                        setOpen={setOpen}
                        setValue={valor => setFormaPagamentoV(valor)}
                        setItems={setItems}
                    />

                </View>


                <View style={{ width: "90%", flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
                    <Text style={{ fontFamily: "Ubuntu-Bold", marginTop: 30, fontSize: 19, marginBottom: 15, width: "100%" }}>Desconto</Text>

                    <TextInput value={descontoV} onChangeText={text => calculaDesconto(text)} placeholder="" style={{ width: "13%", backgroundColor: '#fff', borderRadius: 5, paddingTop: 8, paddingBottom: 8, paddingLeft: 10, paddingRight: 15, fontFamily: "Ubuntu-Regular" }} />
                    <Text style={{ marginLeft: 7 }}>
                        <Svg
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <Path
                                d="M19 5L5 19M17.5 20a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM6.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                                stroke="#000"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    </Text>
                </View>
                <View style={{ width: "90%", flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
                    {renderTotal()}
                </View>

                <View style={{ width: "90%", marginTop: 30, flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-end" }}>
                    <Text onPress={() => navigation.navigate("CarrinhoVenda")} style={{ fontFamily: "Ubuntu-regular", backgroundColor: "#FB212F", paddingBottom: 8, paddingTop: 8, paddingLeft: 19, paddingRight: 19, borderRadius: 5, color: "#fff", alignSelf: "flex-end", marginRight: 15 }}>Voltar</Text>
                    <Text onPress={() => setShowConfirma(true)} style={{ fontFamily: "Ubuntu-regular", backgroundColor: "#2ECC71", paddingBottom: 8, paddingTop: 8, paddingLeft: 19, paddingRight: 19, borderRadius: 5, color: "#fff", alignSelf: "flex-end" }}>Finalizar</Text>
                </View>

            </SafeAreaView>
            {showConfirma && (
                <ConfirmaAcao acaoMethod={finalizaNota} cancelaAcao={cancelaAcao} parametros={{ id: null }} />
            )}
        </React.Fragment >
    )
}

const style = StyleSheet.create({
    descontoAtivo: {

    },
    descontoPadrao: {
        backgroundColor: "#fff", paddingTop: 8, paddingBottom: 8, paddingLeft: 15, paddingRight: 15, borderRadius: 5, marginLeft: 15, fontFamily: "Ubuntu-Regular"
    }
})