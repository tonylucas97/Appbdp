
import React, { useState } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import Resumo from '../Resumo/Resumo'
import Mercadoria from "../Mercadoria/Mercadoria";
import Venda from "../Venda/Venda";
import { useFocusEffect } from '@react-navigation/native';
import { Divider } from "react-native-paper"
const Drawer = createDrawerNavigator();

import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

export default function LogadoNavigation({ navigation,route }) {

    const [token, setToken] = useState()
    const [admin,setAdmin] = useState()

    useFocusEffect(
        React.useCallback(() => {

            const getToken = async () => {
                const token = await AsyncStorage.getItem("token")
                const admin = await AsyncStorage.getItem("admin");
                setAdmin(admin)
                setToken(token)
            }

            getToken();
            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );




    return (
        <Drawer.Navigator drawerContent={() => {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <DrawerContentScrollView>
                        <View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ fontFamily: "Ubuntu-Medium", color: "#9B9B9B", fontSize: 24, width: "50%" }}>Olá!</Text>
                            <Text styte={{ width: "50%" }}>
                                <Svg
                                    width={22}
                                    height={22}
                                    viewBox="0 0 22 22"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <G
                                        clipPath="url(#prefix__clip0)"
                                        stroke="#9B9B9B"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <Path d="M11 13.75a2.75 2.75 0 100-5.5 2.75 2.75 0 000 5.5z" />
                                        <Path d="M17.783 13.75a1.513 1.513 0 00.303 1.668l.055.055a1.834 1.834 0 11-2.594 2.594l-.055-.055a1.512 1.512 0 00-1.669-.302 1.512 1.512 0 00-.916 1.384v.156a1.834 1.834 0 01-3.667 0v-.082a1.512 1.512 0 00-.99-1.385 1.513 1.513 0 00-1.668.303l-.055.055a1.834 1.834 0 11-2.595-2.594l.055-.055a1.513 1.513 0 00.303-1.669 1.513 1.513 0 00-1.384-.916H2.75a1.833 1.833 0 010-3.667h.082a1.512 1.512 0 001.385-.99 1.512 1.512 0 00-.303-1.668l-.055-.055a1.833 1.833 0 112.594-2.595l.055.055a1.512 1.512 0 001.669.303h.073a1.513 1.513 0 00.917-1.384V2.75a1.833 1.833 0 113.666 0v.082a1.513 1.513 0 00.917 1.385 1.512 1.512 0 001.668-.303l.055-.055a1.834 1.834 0 112.594 2.594l-.055.055a1.512 1.512 0 00-.302 1.669v.073a1.513 1.513 0 001.384.917h.156a1.833 1.833 0 010 3.666h-.082a1.512 1.512 0 00-1.385.917v0z" />
                                    </G>
                                    <Defs>
                                        <ClipPath id="prefix__clip0">
                                            <Path fill="#fff" d="M0 0h22v22H0z" />
                                        </ClipPath>
                                    </Defs>
                                </Svg>
                            </Text>
                        </View>
                        <Text style={{ fontFamily: "Ubuntu-Bold", marginTop: 10, fontSize: 20, color: "#0079FF" }}>{admin}</Text>
                        <View style={{marginTop:25}}>
                            <Text style={{fontFamily:"Ubuntu-Regular",fontSize:17,color:"black"}} onPress={() => navigation.navigate("Resumo")}>Resumo</Text>
                        </View>
                        <View style={{marginTop:25}}>
                            <Text style={{fontFamily:"Ubuntu-Regular",fontSize:17}} onPress={() => navigation.navigate("Mercadoria")}>Mercadorias</Text>
                        </View>
                        <View style={{marginTop:25}}>
                            <Text style={{fontFamily:"Ubuntu-Regular",fontSize:17}} onPress={() => navigation.navigate("Venda")}>Notas</Text>
                        </View>
                        <View style={{marginTop:25}}>
                            <Text style={{fontFamily:"Ubuntu-Regular",fontSize:17}} onPress={() => navigation.navigate("Resumo")}>Relatorio</Text>
                        </View>

                    </DrawerContentScrollView>
                    <View style={{ flexWrap: "wrap", flexDirection: "row", alignItems: "center" }}>
                        <Text>
                            <Svg
                                width={30}
                                height={30}
                                viewBox="0 0 16 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <Path
                                    d="M0 10a1 1 0 001 1h7.59l-2.3 2.29a1 1 0 00.325 1.639 1 1 0 001.095-.219l4-4a1 1 0 00.21-.33 1 1 0 000-.76 1 1 0 00-.21-.33l-4-4a1.004 1.004 0 10-1.42 1.42L8.59 9H1a1 1 0 00-1 1zM13 0H3a3 3 0 00-3 3v3a1 1 0 002 0V3a1 1 0 011-1h10a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1v-3a1 1 0 10-2 0v3a3 3 0 003 3h10a3 3 0 003-3V3a3 3 0 00-3-3z"
                                    fill="#9B9B9B"
                                />
                            </Svg>
                        </Text>
                        <Text onPress={async() => {
                            await AsyncStorage.removeItem("token");
                            navigation.navigate("Login")
                        }} style={{ justifyContent: "flex-end", fontFamily: "Ubuntu-Medium", color: "#9B9B9B", fontSize: 17, marginLeft: 17 }}>Sair</Text>
                    </View>
                </View>

            )
        }}>

            <Drawer.Screen name="Resumo" component={Resumo} />
            <Drawer.Screen name="Mercadoria" component={Mercadoria} />
            <Drawer.Screen name="Venda" component={Venda} />
        </Drawer.Navigator>
    )

}
