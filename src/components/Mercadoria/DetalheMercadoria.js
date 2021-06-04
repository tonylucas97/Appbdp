import React, { useState } from 'react';
import { Text, View, TextInput, Image, Button } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage"
import Svg, { Path } from "react-native-svg"
import ConfirmaAcao from '../../utils/ConfirmaAcao';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export default function DetalheMercadoria({ navigation, route }) {

    const [nome, setNome] = useState();
    const [precoCompra, setPrecoCompra] = useState();
    const [precoVenda, setPrecoVenda] = useState();
    const [nomeImg, setNomeImg] = useState();
    const [showConfirma, setShowConfirma] = useState(false);
    const [idMercadoria, setIdMercadoria] = useState(route.params.id);
    const [foto, setFoto] = useState();
    const [showOptions, setShowOptions] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            const getMercadoria = async () => {
                const token = await AsyncStorage.getItem("token")
                const result = await fetch(`https://apibdp.herokuapp.com/mercadoria/porid?id=${route.params.id}&token=${token}`)
                const json = await result.json();

                setNome(json.mercadoria.nome)
                setPrecoCompra(json.mercadoria.precoCompra)
                setPrecoVenda(json.mercadoria.precoVenda)
                setNomeImg(json.mercadoria.nomeImg)
                setIdMercadoria(json.mercadoria.id)
            }

            getMercadoria()

            return () => {

            };
        }, [])
    );

    const cancelaAcao = () => {
        setShowConfirma(false)
    }

    const showLibrary = () => {
        launchImageLibrary("photo", (response) => {
            setFoto(response);
            setShowOptions(false)
        })
    }

    const showCamera = () => {
        launchCamera("photo", (response) => {
            setFoto(response)
            setShowOptions(false)
        })
    }

    const deletaMercadoria = async (id) => {
        const result = await fetch(`https://apibdp.herokuapp.com/mercadoria/${id}`, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json', 'Authorization': await AsyncStorage.getItem("token") }

        })
        const json = await result.json();
        if (json.success) {
            navigation.navigate("Mercadoria")
        }
    }

    const updateMercadoria = async () => {
        if (nome && precoCompra && precoVenda) {
            const form = new FormData();
            form.append("nome", nome);
            form.append("precoCompra", parseFloat(precoCompra.replace(",", ".")));
            form.append("precoVenda", parseFloat(precoVenda.replace(",", ".")));
            form.append("id", idMercadoria);

            if (foto) {
                form.append("img", {
                    uri: foto.uri,
                    type: foto.type,
                    name: foto.fileName
                })
            }

            const result = await fetch("https://apibdp.herokuapp.com/mercadoria/alterarItem", {
                method: "POST",
                body: form

            })
            const json = await result.json()
            if (json.success) {
                navigation.navigate("Mercadoria")
            }
        }
    }

    return (
        <React.Fragment>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: "85%" }}>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 22, fontFamily: "Ubuntu-Bold" }}>Detalhe Mercadoria</Text>
                        <Text style={{ backgroundColor: "#FB212F", color: "#fff", textAlign: "center", paddingTop: 8, paddingBottom: 8, paddingLeft: 10, paddingRight: 10, borderRadius: 5 }} onPress={() => setShowConfirma(true)}>
                            <Svg
                                width={18}
                                height={20}
                                viewBox="0 0 18 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <Path
                                    d="M7 16a1 1 0 001-1V9a1 1 0 00-2 0v6a1 1 0 001 1zM17 4h-4V3a3 3 0 00-3-3H8a3 3 0 00-3 3v1H1a1 1 0 000 2h1v11a3 3 0 003 3h8a3 3 0 003-3V6h1a1 1 0 100-2zM7 3a1 1 0 011-1h2a1 1 0 011 1v1H7V3zm7 14a1 1 0 01-1 1H5a1 1 0 01-1-1V6h10v11zm-3-1a1 1 0 001-1V9a1 1 0 00-2 0v6a1 1 0 001 1z"
                                    fill="#fff"
                                />
                            </Svg>
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 30, flexWrap: "wrap", justifyContent: "space-between", width: "100%" }}>
                        <TextInput style={{ backgroundColor: "white", width: "100%", borderRadius: 5, paddingLeft: 14 }} placeholder="Nome" value={nome} onChangeText={text => setNome(text)} />
                        <TextInput style={{ backgroundColor: "white", marginTop: 15, width: "48%", borderRadius: 5, paddingLeft: 14 }} placeholder="Preço Compra" value={precoCompra ? precoCompra.toString().replace(".", ",") : precoCompra} onChangeText={text => setPrecoCompra(text)} />
                        <TextInput style={{ backgroundColor: "white", marginTop: 15, width: "48%", borderRadius: 5, paddingLeft: 14 }} placeholder="Preço Venda" value={precoVenda ? precoVenda.toString().replace(".", ",") : precoVenda} onChangeText={text => setPrecoVenda(text)} />
                    </View>
                    
                    {nomeImg && (
                        <View style={{ flexDirection: "row", marginTop: 30, flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
                            <Image source={{ uri: `http://apibaldosplasticos-com.umbler.net/${nomeImg}` }} style={{ width: 200, height: 200 }} />
                        </View>
                    )}
                    <View style={{ width: "55%", marginTop: 25 }}>
                        <Button title="Selecionar Foto" onPress={() => showOptions ? setShowOptions(false) : setShowOptions(true)} />
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 30, flexWrap: "wrap", justifyContent: "flex-end", width: "100%" }}>
                        <Text style={{ backgroundColor: "#FB212F", color: "#fff", width: "25%", textAlign: "center", paddingTop: 8, paddingBottom: 8, borderRadius: 5, marginRight: 20 }} onPress={() => navigation.navigate("Mercadoria")}>Voltar</Text>
                        <Text style={{ backgroundColor: "#2ECC71", color: "#fff", width: "25%", textAlign: "center", paddingTop: 8, paddingBottom: 8, borderRadius: 5 }} onPress={() => updateMercadoria()}>Salvar</Text>
                    </View>
                    
                </View>
            </View>
            {showConfirma && (
                <ConfirmaAcao mensagem={"Deseja Remover essa Mercadoria ?"} cancelaAcao={cancelaAcao} acaoMethod={deletaMercadoria} parametros={{ id: idMercadoria }} />
            )}
            {showOptions && (
                <View style={{ width: "100%", alignItems: "center", bottom: 0, position: "absolute", backgroundColor: "#fff" }}>
                    <Text style={{ paddingBottom: 27, paddingTop: 32, fontFamily: "Ubuntu-Regular" }} onPress={() => showLibrary()}>Biblioteca</Text>
                    <Text style={{ paddingBottom: 32, fontFamily: "Ubuntu-Regular" }} onPress={() => showCamera()}>Tirar foto</Text>
                </View>
            )}
        </React.Fragment>
    )
}