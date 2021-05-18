import React, { useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"

export default function NovaVenda({ navigation }) {

    const [nome, setNome] = useState('')

    const verificaNome = () => {
        if(nome != ''){
            navigation.navigate("CarrinhoVenda",{nome:nome})
        }else{
            console.log("nao tem nd cachorro")
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 25, fontFamily: "Ubuntu-Bold", marginBottom: 25, color: "#001E40" }}>Informações do Cliente</Text>
            <Text>
                <Svg
                    width={208}
                    height={208}
                    viewBox="0 0 208 208"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <Path
                        opacity={0.5}
                        d="M104 208c57.438 0 104-46.562 104-104S161.438 0 104 0 0 46.562 0 104s46.562 104 104 104z"
                        fill="url(#prefix__paint0_linear)"
                    />
                    <Path
                        d="M104.203 205.142c56.226 0 101.806-45.58 101.806-101.807 0-56.226-45.58-101.806-101.806-101.806-56.227 0-101.807 45.58-101.807 101.806 0 56.227 45.58 101.807 101.807 101.807z"
                        fill="#F5F5F5"
                    />
                    <Path
                        d="M104.298 205.545a101.322 101.322 0 0055.96-16.748c-3.751-20.502-18.028-21.67-18.028-21.67H63.5s-13.473 1.106-17.68 19.966a101.34 101.34 0 0058.478 18.452z"
                        fill="#0079FF"
                    />
                    <Path
                        d="M103.216 150.329c27.139 0 49.14-22 49.14-49.139 0-27.139-22.001-49.14-49.14-49.14s-49.139 22.001-49.139 49.14 22 49.139 49.139 49.139z"
                        fill="#333"
                    />
                    <Path
                        opacity={0.1}
                        d="M87.357 142.119h31.486v25.19a15.744 15.744 0 01-15.737 15.743 15.745 15.745 0 01-15.743-15.743v-25.19h-.006z"
                        fill="#000"
                    />
                    <Path
                        d="M88.355 140.951h29.502a.999.999 0 01.998.999v24.191a15.75 15.75 0 01-9.722 14.549 15.745 15.745 0 01-21.77-14.546V141.95a.998.998 0 01.992-.999z"
                        fill="#FDB797"
                    />
                    <Path
                        opacity={0.1}
                        d="M87.414 154.009a45.315 45.315 0 0031.486.087v-3.874H87.414v3.787z"
                        fill="#000"
                    />
                    <Path
                        d="M103.216 156.116c24.925 0 45.131-20.206 45.131-45.131s-20.206-45.131-45.131-45.131-45.131 20.206-45.131 45.131 20.206 45.131 45.131 45.131z"
                        fill="#FDB797"
                    />
                    <Path
                        opacity={0.1}
                        d="M71.069 69.933s19.02 38.608 72.674 16.187l-12.491-19.587-22.144-7.947-38.04 11.347z"
                        fill="#000"
                    />
                    <Path
                        d="M71.069 69.367s19.02 38.608 72.674 16.181l-12.491-19.587-22.144-7.947-38.04 11.353z"
                        fill="#333"
                    />
                    <Path
                        d="M70.902 66.75a26.07 26.07 0 016.463-10.51c8.878-8.776 23.432-10.626 30.896-20.633 1.788 2.778.406 7.048-2.682 8.24 7.152-.048 15.44-.674 19.483-6.556a13.374 13.374 0 01-2.255 14.125c6.338.298 13.111 4.589 13.511 10.921.274 4.22-2.384 8.213-5.838 10.633s-7.662 3.531-11.789 4.44c-12.051 2.661-55.653 13.797-47.79-10.66z"
                        fill="#333"
                    />
                    <Path
                        d="M58.067 118.816c2.319 0 4.199-3.525 4.199-7.873 0-4.348-1.88-7.873-4.199-7.873s-4.199 3.525-4.199 7.873c0 4.348 1.88 7.873 4.2 7.873zM148.342 118.816c2.318 0 4.198-3.525 4.198-7.873 0-4.348-1.88-7.873-4.198-7.873-2.319 0-4.199 3.525-4.199 7.873 0 4.348 1.88 7.873 4.199 7.873z"
                        fill="#FDB797"
                    />
                    <Defs>
                        <LinearGradient
                            id="prefix__paint0_linear"
                            x1={104}
                            y1={208}
                            x2={104}
                            y2={0}
                            gradientUnits="userSpaceOnUse"
                        >
                            <Stop stopColor="gray" stopOpacity={0.25} />
                            <Stop offset={0.54} stopColor="gray" stopOpacity={0.12} />
                            <Stop offset={1} stopColor="gray" stopOpacity={0.1} />
                        </LinearGradient>
                    </Defs>
                </Svg>
            </Text>
            <TextInput placeholder="Nome" style={{ backgroundColor: "#fff", width: "70%", paddingLeft: 15, borderRadius: 5, marginTop: 25 }} onChangeText={texto => setNome(texto)}/>
            <View style={{ width: "70%" }}>
                <Text onPress={() => verificaNome()} style={{ alignSelf: "flex-end", fontFamily: "Ubuntu-Regular", backgroundColor: "#0079FF", padding: 12, color: "#fff", borderRadius: 5, marginTop: 20 }}>Continuar</Text>
            </View>
        </SafeAreaView>
    )
}