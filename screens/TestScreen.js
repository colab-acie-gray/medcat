import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import NLP from '../assets/prompts';

const TestScreen = ({navigation}) => {
    const [image, setImage] = useState(null);
    const [apiResponse, setApiResponse] = useState('');

    function cleanUp(str) {
        return str.replace(/\*/g, '');
    };

    const handleImageChange = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert('Permission to access camera roll is required!');
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (!pickerResult.canceled) {
            setImage(pickerResult.assets[0].uri);
        }
    };

    const goToChat = (stuff) => {
        // gemini stuff
        const GemAPI = 'APIKEY';
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(GemAPI);
        async function run(stuff) {
            // For text-only input, use the gemini-pro model
            const model = genAI.getGenerativeModel({ model: "gemini-pro"});
            const prompt = NLP+stuff;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = cleanUp(response.text());
            console.log(text);
            return text;
        }
        const text = run(stuff);
        navigation.navigate('Chat', {text});
    }

    const handleSubmit = async () => {
        if (!image) return;

        const formData = new FormData();
        console.log(image);
        formData.append('image', {
            uri: image,
            name: 'image.jpg',
            type: 'image/jpg',
        });

        try {
            const response = await axios.post("https://eoi4zds3zvye1l6.m.pipedream.net", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setApiResponse(response.data.message);
        } catch (error) {
            console.error('Error:', error);
        }

        goToChat(apiResponse);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Pick an image from camera roll" onPress={handleImageChange} />
            {image && <Text>{image}</Text>}
            <Button title="Submit" onPress={handleSubmit} disabled={!image} />
            {apiResponse && (
                <View>
                    <Text>API Response:</Text>
                    <Text>{apiResponse}</Text>
                </View>
            )}
        </View>
    );
};

export default TestScreen;
