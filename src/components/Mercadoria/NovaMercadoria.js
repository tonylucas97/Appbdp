import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Button, Text, Image, TextInput, View } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';


export default function NovaMercadoria({ navigation }) {

    const [nome, setNome] = useState()
    const [precoCompra, setPrecoCompra] = useState()
    const [precoVenda, setPrecoVenda] = useState()
    const [foto, setFoto] = useState();
    const [showSuccess, setShowSuccess] = useState(false);
    const [showOptions, setShowOptions] = useState(false);


    const salvaMercadoria = async () => {
        if (nome && precoCompra && precoVenda) {

            const form = new FormData();
            form.append("nome", nome);
            form.append("precoCompra", precoCompra);
            form.append("precoVenda", precoVenda);

            if (foto) {
                form.append("img", {
                    uri: foto.uri,
                    type: foto.type,
                    name: foto.fileName
                })
            }

            const result = await fetch("http://apibaldosplasticos-com.umbler.net/mercadoria", {
                method: "POST",
                headers: { "Authorization": await AsyncStorage.getItem("token") },
                body: form
            })
            const json = await result.json();

            console.log(json)
        }
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

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: "85%" }}>
                <Text style={{ fontSize: 25, textAlign: 'center', fontFamily: "Ubuntu-Bold" }}>Nova Mercadoria</Text>
                <View style={{ flexDirection: "row", marginTop: 30, flexWrap: "wrap", justifyContent: "space-between", width: "100%" }}>
                    <TextInput style={{ backgroundColor: "white", width: "100%", borderRadius: 5, paddingLeft: 14 }} placeholder="Nome" onChangeText={text => setNome(text)} />
                    <TextInput style={{ backgroundColor: "white", marginTop: 15, width: "48%", borderRadius: 5, paddingLeft: 14 }} placeholder="Preço Compra" onChangeText={text => setPrecoCompra(text)} />
                    <TextInput style={{ backgroundColor: "white", marginTop: 15, width: "48%", borderRadius: 5, paddingLeft: 14 }} placeholder="Preço Venda" onChangeText={text => setPrecoVenda(text)} />

                </View>
                <View style={{ width: "55%", marginTop: 25 }}>
                    <Button title="Selecionar Foto" onPress={() => showOptions ? setShowOptions(false) : setShowOptions(true)} />
                </View>
                {foto && (
                    <View style={{ flexDirection: "row", marginTop: 30, flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
                        <Image source={{ uri: foto.uri }} style={{width:200,height:200}} />
                    </View>
                )}
                <View style={{ flexDirection: "row", marginTop: 30, flexWrap: "wrap", justifyContent: "flex-end", width: "100%" }}>
                    <Text style={{ backgroundColor: "#FB212F", color: "#fff", width: "25%", textAlign: "center", paddingTop: 8, paddingBottom: 8, borderRadius: 5, marginRight: 20 }} onPress={() => navigation.navigate("Mercadoria")}>Voltar</Text>
                    <Text style={{ backgroundColor: "#2ECC71", color: "#fff", width: "25%", textAlign: "center", paddingTop: 8, paddingBottom: 8, borderRadius: 5 }} onPress={() => salvaMercadoria()}>Salvar</Text>
                    {showSuccess && (
                        <Text style={{ backgroundColor: "#2ECC71", width: "100%", paddingTop: 8, paddingBottom: 8, borderRadius: 5, textAlign: "center", color: "#fff", marginTop: 25 }}>Mercadoria Salva</Text>
                    )}
                </View>
                
            </View>
            {showOptions && (
                <View style={{ width: "100%", alignItems: "center", bottom: 0, position: "absolute", backgroundColor: "#fff" }}>
                    <Text style={{ paddingBottom: 27, paddingTop: 32, fontFamily: "Ubuntu-Regular" }} onPress={() => showLibrary()}>Biblioteca</Text>
                    <Text style={{ paddingBottom: 32, fontFamily: "Ubuntu-Regular" }} onPress={() => showCamera()}>Tirar foto</Text>
                </View>
            )}
        </View>
    )
}