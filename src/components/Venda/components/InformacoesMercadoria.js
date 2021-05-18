import React, { useState } from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

export default function InformacoesMercadoria(props) {

    const [total, setTotal] = useState()
    const [desconto, setDesconto] = useState()
    const [quantidade, setQuantidade] = useState('1')

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: "100%", height: "100%", position: "absolute", backgroundColor: "rgba(196,196,196,0.8)" }}>
            <View style={{ width: "85%", padding: 25, flexDirection: "row", flexWrap: "wrap", backgroundColor: "#fff", borderRadius: 5 }}>

                <Text style={{ fontFamily: "Ubuntu-Bold", width: "100%", marginBottom: 20 }}>{props.mercadoria.nome}</Text>
                <Text style={{ width: "100%", fontFamily: "Ubuntu-Regular" }}>Preço: {props.mercadoria.precoVenda.toString().replace(".", ",")}</Text>
                <View style={{ width: "100%", flexDirection: "row", flexWrap: "wrap", marginTop: 5, justifyContent: "space-between" }}>
                    <TextInput value={desconto} placeholder="Preço desconto" style={{ backgroundColor: "rgba(200,200,200,0.23)", paddingLeft: 10, paddingRight: 10, paddingTop: 6, paddingBottom: 6, marginTop: 15, width: "47%" }} onChangeText={text => setDesconto(text)} />
                    <TextInput value={quantidade} placeholder="Quantidade" style={{ backgroundColor: "rgba(200,200,200,0.23)", paddingLeft: 10, paddingRight: 10, paddingTop: 6, paddingBottom: 6, marginTop: 15, width: "47%" }} onChangeText={text => setQuantidade(text)} />

                </View>
                <View style={{ width: "100%", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-end", marginTop: 25 }}>
                    <Text style={{ fontFamily: "Ubuntu-Bold",fontSize:17 }}>Total: {desconto && quantidade && (
                        <Text style={{fontSize:17}}>{(parseFloat(desconto.replace(",",".")) * quantidade).toFixed(2)}</Text>
                    )}
                        {!desconto && quantidade && (
                            <Text style={{fontSize:17}}>{(parseFloat(props.mercadoria.precoVenda) * parseInt(quantidade)).toFixed(2)}</Text>
                        )}
                    </Text>
                </View>
                <View style={{ width: "100%", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-end", marginTop: 25 }}>
                    <Text style={{ fontFamily: "Ubuntu-regular" ,backgroundColor:"#2ECC71",paddingBottom: 8, paddingTop: 8, paddingLeft: 14, paddingRight: 14, borderRadius: 5,color:"#fff"}} onPress={() => props.addCarrinho(props.mercadoria.nome,props.mercadoria.precoVenda,desconto,quantidade,props.mercadoria.id)}>Salvar</Text>
                </View>

            </View>

        </SafeAreaView>
    )
}