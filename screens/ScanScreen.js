import React, { useState } from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import MlkitOcr from 'react-native-mlkit-ocr';

const ScanScreen = ({navigation}) => {
    // OCR
    const [recognizedText, setRecognizedText] = useState('');
    const [loading, setLoading] = useState(false);

    const detect = async(uri) => {
        const resultFromUri = await MlkitOcr.detectFromUri(uri);
        return(resultFromUri);
    };

    const selectImage = async () => {
        try {
            setLoading(true);
            const result = await launchImageLibraryAsync({
                mediaTypes: MediaTypeOptions.Images,
                allowsEditing: false,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.canceled) {
                const inUri = result.uri;
                const textResult = detect(inUri);
                console.log(textResult);
                setRecognizedText(textResult[0].text);
            }
        } catch (error) {
            console.error('Error during OCR:', error);
        } finally {
            setLoading(false);
        }
    };

    return(
        <View style={styles.container}>
            <Button title="Select Image" onPress={selectImage} disabled={loading} />
            {loading && <Text>Loading...</Text>}
            {recognizedText ? (
                <View style={{ marginTop: 20 }}>
                    <Text>Recognized Text:</Text>
                    <Text>{recognizedText}</Text>
                </View>
            ) : null}  
        </View>
    );
};

export default ScanScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
