import React from "react";
import { View,  Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const HomeScreen = ({ navigation }) => {
    // assets
    const HomeScreenSplashImage = require("../assets/images/homeScreenSplash.png");

    return(
        <View style={styles.container}>
            <View style={styles.gap}/>
            <View style={styles.gapSmall}/>
            <Text style={styles.headingText}>Medical Consultation and Analysis Tool</Text>
            <View style={styles.gap}/>
            <Image source={HomeScreenSplashImage} style={styles.homeSpash}/>
            <View style={styles.gap}/>
            <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("Test")}>
                <Text style={styles.buttonText}>Click to scan Medical Report</Text>
            </TouchableOpacity>
        </View>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
    },
    gap: {
        height: '9%',
    },
    gapSmall: {
        height: '5%',
    },
    headingText: {
        fontSize: 25,
        fontWeight: "800",
        textAlign: "center",
    },
    homeSpash: {
        width: 250,
        height: 250,
    },
    button: {
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        padding: "8%",
        paddingHorizontal: "15%",
        borderRadius: "15%"
    },
    buttonText: {
        fontWeight: "bold",
        textAlign: "center",
        color: "#fff",
        width: 200,
        height: 16,
    }
  });
  