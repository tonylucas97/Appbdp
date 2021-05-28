import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Svg, { Path } from "react-native-svg"
import AsyncStorage from "@react-native-async-storage/async-storage";
import InformacoesMercadoria from './components/InformacoesMercadoria';
import { useFocusEffect } from '@react-navigation/native';

export default function CarrinhoVenda({ navigation, route }) {

    const [carrinho, setCarrinho] = useState([] || route.params.carrinho);
    const [mercadoriasBusca, setMercadoriasBusca] = useState();
    const [showMercadorias, setShowMercadorias] = useState(false)
    const [textoBusca, setTextoBusca] = useState();
    const [showConfirma, setShowConfirma] = useState(false);
    const [showBtnDelete, setShowBtnDelete] = useState(true);
    const [total, setTotal] = useState(0);
    const [showInfoMercadoria, setshowInfoMercadoria] = useState(false);
    const [infoMercadoria, setInfoMercadoria] = useState();

    useFocusEffect(
        React.useCallback(() => {


            return () => {

            };
        }, [])
    );

    const deletaItem = (id) => {
        let novoCarrinho = []
        for (let i = 0; i < carrinho.length; i++) {
            if (carrinho[i].id != id) {
                novoCarrinho.push(carrinho[i])
            } else {
                setTotal(total - (parseFloat(carrinho[i].total)))
            }
        }

        setCarrinho(novoCarrinho)
        setShowConfirma(false)
        setShowBtnDelete(true)
    }

    const toggleShowConfirma = () => {
        if (showBtnDelete) {
            setShowConfirma(true)
            setShowBtnDelete(false)
        } else {
            setShowConfirma(false)
            setShowBtnDelete(true)
        }
    }

    const procuraMercadoria = async (nome) => {
        setTextoBusca(nome)
        if (nome.length > 2) {
            const result = await fetch(`http://apibaldosplasticos-com.umbler.net/mercadoria/busca/${nome}/${await AsyncStorage.getItem("token")}`)
            const json = await result.json()
            setMercadoriasBusca(json.mercadorias)
            setShowMercadorias(true)
        } else if (nome.length < 2) {
            setMercadoriasBusca([]);
            setShowMercadorias(false)

        }
    }

    const abreShowInfoMercadoria = async (id) => {
        const result = await fetch(`http://apibaldosplasticos-com.umbler.net/mercadoria/porid?id=${id}&token=${await AsyncStorage.getItem("token")}`)
        const json = await result.json()
        setInfoMercadoria(json.mercadoria);
        setshowInfoMercadoria(true)
        setTextoBusca('')
    }

    const addCarrinho = (nome, preco, desconto, quantidade, id) => {
        const mercadoria = { nome: nome, preco: preco, desconto: desconto || 0, quantidade: quantidade, id: id }
        if (mercadoria.desconto != 0) {
            mercadoria.total = (parseFloat(mercadoria.desconto.replace(",", '.')) * parseInt(mercadoria.quantidade)).toFixed(2)
        } else {
            mercadoria.total = (parseFloat(mercadoria.preco.replace(",", ".")) * parseInt(mercadoria.quantidade)).toFixed(2)
        }
        console.log(mercadoria)
        setCarrinho(carrinho.concat(mercadoria))
        setshowInfoMercadoria(false)
        setShowMercadorias(false)
        setTotal((parseFloat(total) + parseFloat(mercadoria.total)).toFixed(2))
    }

    return (
        <React.Fragment>
            <SafeAreaView style={{ backgroundColor: "#fff", height: "100%", flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }} onPress={() => console.log("Apertou")}>

                <View style={{ borderRadius: 5, width: "80%", flexDirection: "row", flexWrap: "wrap", marginTop: 30 }}>
                    <View style={{ backgroundColor: 'rgba(196,196,196,0.13)', flexDirection: "row", alignItems: "center" }}>
                        <Text style={{ paddingRight: 10, paddingLeft: 15, width: "20%" }}>
                            <Svg
                                width={21}
                                height={21}
                                viewBox="0 0 21 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <Path
                                    d="M15.777 14.54l3.748 3.747-1.238 1.238-3.747-3.748A7.84 7.84 0 019.625 17.5 7.878 7.878 0 011.75 9.625 7.878 7.878 0 019.625 1.75 7.878 7.878 0 0117.5 9.625a7.84 7.84 0 01-1.723 4.915zm-1.755-.65a6.105 6.105 0 001.728-4.265A6.123 6.123 0 009.625 3.5 6.123 6.123 0 003.5 9.625a6.123 6.123 0 006.125 6.125 6.105 6.105 0 004.266-1.728l.13-.131z"
                                    fill="#9B9B9B"
                                />
                            </Svg>
                        </Text>
                    </View>
                    <TextInput placeholder="Procurar Mercadoria" style={{ backgroundColor: 'rgba(196,196,196,0.13)', paddingRight: 10, width: "80%" }} onChangeText={texto => procuraMercadoria(texto)} value={textoBusca} />

                    <View style={{ width: "100%" }}>
                        {showMercadorias && (
                            <View style={{ backgroundColor: "#fff", position: "absolute", elevation: 2, zIndex: 100, width: "100%" }}>
                                <ScrollView style={{ height: 250 }}>
                                    {mercadoriasBusca != undefined && (
                                        mercadoriasBusca.map(item => {
                                            return (
                                                <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                                                    <Text onPress={() => abreShowInfoMercadoria(item.id)} style={{ fontFamily: "Ubuntu-Regular", paddingLeft: 12, paddingRight: 12, paddingBottom: 12, paddingTop: 18 }}>{item.nome}</Text>
                                                    <Text onPress={() => abreShowInfoMercadoria(item.id)} style={{ fontFamily: "Ubuntu-Regular", paddingLeft: 12, paddingRight: 12, paddingBottom: 12, paddingTop: 18 }}>{item.precoVenda.toString().replace(".",",")}</Text>
                                                </View>
                                            )
                                        })
                                    )}
                                </ScrollView>
                            </View>
                        )}
                    </View>
                </View>

                <View style={{ borderRadius: 5, width: "65%", flexDirection: "row", flexWrap: "wrap", marginTop: 35, justifyContent: "center" }}>
                    <Text style={{ fontSize: 24, fontFamily: "Ubuntu-Bold" }}>Carrinho</Text>
                </View>
                {carrinho === undefined || carrinho.length == 0 && (
                    <View style={{ width: "85%", flexDirection: "row", marginTop: 24, justifyContent: "center" }}>
                        <Text style={{ fontSize: 18, fontFamily: "Ubuntu-Bold", color: "#9B9B9B" }}>carrinho vazio</Text>
                    </View>
                )}

                {carrinho != undefined && (
                    <View style={{ width: "85%", height: "54%", marginTop: 22, elevation: 1 }}>
                        <ScrollView>
                            {carrinho.map((item, index) => {
                                return (
                                    <View key={item.id} style={{ flexDirection: "row", marginTop: 20, borderBottomWidth: 1, paddingBottom: 15, borderBottomColor: "#C4C4C4" }}>
                                        <View style={{ width: "70%", flexDirection: "row", flexWrap: "wrap" }}>
                                            <Text style={{ fontFamily: "Ubuntu-Bold", width: "100%", color: "#333333" }}>{item.nome}</Text>
                                            <Text style={{ fontFamily: "Ubuntu-Regular", width: "60%", color: "#333333", marginTop: 12 }}>R$ {item.preco}</Text>
                                            <Text style={{ fontFamily: "Ubuntu-Regular", width: "40%", color: "#333333", marginTop: 12 }}>Quant: {item.quantidade}</Text>
                                            {item.desconto != 0 && (
                                                <Text style={{ fontFamily: "Ubuntu-Regular", width: "60%", color: "#333333", marginTop: 12 }}>Desconto: {parseFloat(item.desconto).toFixed(2)}</Text>
                                            )}
                                            {item.desconto == 0 && (
                                                <Text style={{ fontFamily: "Ubuntu-Regular", width: "60%", color: "#333333", marginTop: 12 }}>Desconto: {0}</Text>
                                            )}
                                            <Text style={{ fontFamily: "Ubuntu-Regular", width: "40%", color: "#333333", marginTop: 12 }}>Total: {" "}
                                                {item.desconto != 0 && (
                                                    (parseFloat(item.desconto) * parseInt(item.quantidade)).toFixed(2)
                                                )}
                                                {item.desconto == 0 && (
                                                    (parseFloat(item.preco) * parseInt(item.quantidade)).toFixed(2)
                                                )}
                                            </Text>
                                        </View>
                                        <View style={{ width: "30%" }}>
                                            {showBtnDelete && (
                                                <Text style={{ alignSelf: "flex-end" }} onPress={() => toggleShowConfirma()}>
                                                    <Svg
                                                        width={31}
                                                        height={31}
                                                        viewBox="0 0 33 33"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <Path
                                                            d="M11.344 4.125h10.312a1.031 1.031 0 100-2.063H11.344a1.031 1.031 0 100 2.063zM27.844 6.188H5.156a1.031 1.031 0 100 2.062h1.032v18.563a2.065 2.065 0 002.062 2.062h16.5a2.064 2.064 0 002.063-2.063V8.25h1.03a1.031 1.031 0 000-2.063zM14.437 21.655a1.031 1.031 0 11-2.062 0v-8.25a1.031 1.031 0 112.063 0v8.25zm6.188 0a1.031 1.031 0 11-2.063 0v-8.25a1.031 1.031 0 112.063 0v8.25z"
                                                            fill="#FB212F"
                                                        />
                                                    </Svg>
                                                </Text>
                                            )}
                                            {showConfirma && (
                                                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-end" }}>
                                                    <Text style={{ backgroundColor: "#FB212F", padding: 5, marginRight: 8 }} onPress={() => toggleShowConfirma()}>
                                                        <Svg
                                                            width={24}
                                                            height={24}
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <Path
                                                                d="M18 6L6 18M6 6l12 12"
                                                                stroke="#fff"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </Svg>
                                                    </Text>
                                                    <Text style={{ backgroundColor: "#2ecc71", padding: 5 }} onPress={() => deletaItem(item.id)}>
                                                        <Svg
                                                            width={24}
                                                            height={24}
                                                            viewBox="0 0 32 32"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <Path
                                                                d="M27 9L13 23l-7-7"
                                                                stroke="#fff"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </Svg>
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                )
                            })}
                        </ScrollView>
                    </View>

                )}
                <View style={{ flexDirection: "row", justifyContent: "flex-end", width: "80%" }}>
                    <Text style={{ paddingRight: 15, fontFamily: "Ubuntu-Bold", marginTop: 15, fontSize: 16 }}>Total: {total ? total.replace(".", ",") : null}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "flex-end", width: "80%", marginTop: 20 }}>
                    <Text onPress={() => navigation.navigate("NomeClienteVenda")} style={{ fontFamily: "Ubuntu-regular", backgroundColor: "#FB212F", paddingBottom: 8, paddingTop: 8, paddingLeft: 19, paddingRight: 19, borderRadius: 5, marginRight: 15, color: "#fff" }}>Voltar</Text>
                    <Text onPress={() => navigation.navigate("FinalizarVenda", { carrinho: carrinho, cliente: route.params.nome, subtotal: total })} style={{ fontFamily: "Ubuntu-regular", backgroundColor: "#2ECC71", paddingBottom: 8, paddingTop: 8, paddingLeft: 19, paddingRight: 19, borderRadius: 5, color: "#fff" }}>Continuar</Text>
                </View>
            </SafeAreaView>
            {showInfoMercadoria && (
                <InformacoesMercadoria mercadoria={infoMercadoria} addCarrinho={addCarrinho} />
            )}
        </React.Fragment>
    )
}