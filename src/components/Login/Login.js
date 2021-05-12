import React, { useState } from 'react';
import { View, Text,ToastAndroid } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Svg, { Path } from "react-native-svg"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ActivityIndicator, Colors } from 'react-native-paper';

export default function Login({ navigation }) {

    const [usuario, setUsuario] = useState();
    const [senha, setSenha] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const signIn = async (usuario, senha) => {
        if(usuario && senha){
        const formData = new FormData();
        formData.append('usuario', usuario)
        formData.append('senha', senha)
        const result = await fetch("http://apibaldosplasticos-com.umbler.net/login", {
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: usuario, senha: senha })
        });
        const json = await result.json();
        if (json.success) {
            AsyncStorage.setItem("token", json.token)
            navigation.navigate("LogedNavigator",{admin:json.admin})
        }
        }else{
            ToastAndroid.show("Dados inválidos",ToastAndroid.SHORT)
        }
        
    }

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
            <View style={{ width: "65%", padding: 15 }}>
                <Text style={{ fontFamily: "Ubuntu-Bold", color: "#001E40", fontSize: 23, marginBottom: 15 }}>Bem Vindo</Text>
                <Text style={{ fontFamily: "Ubuntu-Light", color: "#001E40", fontSize: 23 }}>Login</Text>
                <TextInput placeholder="Usuario" style={{ borderBottomWidth: 1, marginTop: 25, borderBottomColor: "#C4C4C4", fontFamily: "Ubuntu-Light" }} onChangeText={text => setUsuario(text)} />
                <TextInput secureTextEntry={true} placeholder="Senha" style={{ borderBottomWidth: 1, marginTop: 12, borderBottomColor: "#C4C4C4", fontFamily: "Ubuntu-Light" }} onChangeText={text => setSenha(text)} />
                <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 35, backgroundColor: "#0079FF", alignItems: "center", width: 100, justifyContent: isLoading ? "space-between" : "center", alignSelf: "flex-end" }} >
                    {isLoading && (
                        <ActivityIndicator animating={true} color={Colors.red800} size={20}/>
                    )}
                    <Text style={{ fontFamily: "Ubuntu-Light", paddingTop: 10, paddingBottom: 10,color: "#fff" }} onPress={() => signIn(usuario, senha)}>Entrar</Text>

                </View>
            </View>
        </View>
    )
}