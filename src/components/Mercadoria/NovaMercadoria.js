import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Button, Text, Image, TextInput, View ,ToastAndroid} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { RNCamera } from 'react-native-camera';

export default function NovaMercadoria({ navigation }) {

    const [nome, setNome] = useState()
    const [precoCompra, setPrecoCompra] = useState()
    const [precoVenda, setPrecoVenda] = useState()
    const [foto, setFoto] = useState();
    const [showSuccess, setShowSuccess] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [camera, setCamera] = useState({ type: RNCamera.Constants.Type.back, flashMode: RNCamera.Constants.FlashMode.auto })
    const [codigoBarras, setCodigoBarras] = useState("")
    const [showScanner, setShowScanner] = useState(false)

    const salvaMercadoria = async () => {
        if (nome && precoCompra && precoVenda ) {

            const form = new FormData();
            form.append("nome", nome);
            form.append("precoCompra", parseFloat(precoCompra.replace(",", ".")));
            form.append("precoVenda", parseFloat(precoVenda.replace(",", ".")));
            form.append("codigoBarras",codigoBarras.toString())
            if (foto) {
                form.append("img", {
                    uri: foto.uri,
                    type: foto.type,
                    name: foto.fileName
                })
            }

            const result = await fetch("https://apibdp.herokuapp.com/mercadoria", {
                method: "POST",
                headers: { "Authorization": await AsyncStorage.getItem("token") },
                body: form
            })
            const json = await result.json();
            if (json.success) {
                navigation.navigate("Mercadoria")
            }else{
                ToastAndroid.show(json.message,ToastAndroid.SHORT)
            }
        }
    }

    const onBarCodeRead = (result) => {
        if(result){
            setCodigoBarras(result.data)
            setShowScanner(false)
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
        <React.Fragment>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: "85%" }}>
                    <Text style={{ fontSize: 25, textAlign: 'center', fontFamily: "Ubuntu-Bold" }}>Nova Mercadoria</Text>
                    <View style={{ flexDirection: "row", marginTop: 30, flexWrap: "nowrap", justifyContent: "space-between", width: "100%" }}>
                        <TextInput onChangeText={text => setCodigoBarras(text)} placeholder="Codigo de barras" value={codigoBarras} style={{ backgroundColor: "white", width: "48%", borderRadius: 5, paddingLeft: 14 }}/>
                        <Text style={{ backgroundColor: "#0079FF", color: "#fff",width:"48%", textAlign: "center", paddingTop: 8, paddingBottom: 8, borderRadius: 5 }} onPress={() => showScanner ? setShowScanner(false) : setShowScanner(true)}>Codigo de Barras</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 30, flexWrap: "wrap", justifyContent: "space-between", width: "100%" }}>
                        <TextInput style={{ backgroundColor: "white", width: "100%", borderRadius: 5, paddingLeft: 14 }} placeholder="Nome" onChangeText={text => setNome(text)} />
                        <TextInput style={{ backgroundColor: "white", marginTop: 15, width: "48%", borderRadius: 5, paddingLeft: 14 }} placeholder="Preço Compra" onChangeText={text => setPrecoCompra(text)} />
                        <TextInput style={{ backgroundColor: "white", marginTop: 15, width: "48%", borderRadius: 5, paddingLeft: 14 }} placeholder="Preço Venda" onChangeText={text => setPrecoVenda(text)} />

                    </View>
                    <View style={{ flexDirection: "row", marginTop: 30, flexWrap: "wrap", justifyContent: "flex-end", width: "100%" }}>
                        <Text style={{ backgroundColor: "#FB212F", color: "#fff", width: "25%", textAlign: "center", paddingTop: 8, paddingBottom: 8, borderRadius: 5, marginRight: 20 }} onPress={() => navigation.navigate("Mercadoria")}>Voltar</Text>
                        <Text style={{ backgroundColor: "#2ECC71", color: "#fff", width: "25%", textAlign: "center", paddingTop: 8, paddingBottom: 8, borderRadius: 5 }} onPress={() => salvaMercadoria()}>Salvar</Text>
                        {showSuccess && (
                            <Text style={{ backgroundColor: "#2ECC71", width: "100%", paddingTop: 8, paddingBottom: 8, borderRadius: 5, textAlign: "center", color: "#fff", marginTop: 25 }}>Mercadoria Salva</Text>
                        )}
                    </View>

                </View>
                

            </View>
            {showScanner && (
                <View style={styles.container}>
                    <RNCamera
                        ref={ref => {
                            setCamera(ref);
                        }}
                        defaultTouchToFocus
                        flashMode={RNCamera.Constants.FlashMode.on}
                        autoFocus={RNCamera.Constants.AutoFocus.on}
                        onBarCodeRead={result => onBarCodeRead(result)}
                        androidCameraPermissionOptions={{
                            title: 'Permission to use camera',
                            message: 'We need your permission to use your camera',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                        style={styles.preview}
                        type={RNCamera.Constants.Type.back}
                    />
                    <View style={[styles.overlay, styles.topOverlay]}>
                        <Text style={styles.scanScreenMessage}>Please scan the barcode.</Text>
                    </View>
                    <View style={[styles.overlay, styles.bottomOverlay]}>
                        <Text
                            onPress={() => setShowScanner(false)}
                            style={styles.enterBarcodeManualButton}
                        >Cancelar</Text>
                    </View>
                </View>
            )}
        </React.Fragment>
    )
}

const styles = {
    container: {
        flex: 1,
        position:"absolute",
        width:"100%",
        height:"100%",
        zIndex:500
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    overlay: {
        position: 'absolute',
        padding: 16,
        right: 0,
        left: 0,
        alignItems: 'center'
    },
    topOverlay: {
        top: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    bottomOverlay: {
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    enterBarcodeManualButton: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 40
    },
    scanScreenMessage: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    }
};