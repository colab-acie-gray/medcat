import React, { useState, useEffect } from "react";
import { View, FlatList, TextInput, TouchableOpacity, Text, StyleSheet, Keyboard } from "react-native";
import { useRoute } from "@react-navigation/native";

const ChatBox = ({message}) => {
    return(
        <View style={styles.chatMessage}>
            <Text style={styles.chatSender}>{message.sender}</Text>
            <Text style={styles.chatContent}>{message.content}</Text>
        </View>
    )
};

var idx = 1;

const CHATDATA = [
    {
        index: 0,
        sender: "MedCAT",
        content: "Welcome to MedCAT! I will now be helping you with your queries."
    },
];

const ChatScreen = () => {

    function cleanUp(str) {
        return str.replace(/\*/g, '');
    };
    
    // report
    const route = useRoute();
    const ocrOut = route.params?.text;
    console.log(ocrOut);

    // gemini stuff
    const GemAPI = 'APIKEY';
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(GemAPI);
    const firstPrompt = "Give three main prognosis and recommended steps for the following symptoms: "+ocrOut;
    console.log(firstPrompt)
    async function run(prompt) {
        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = cleanUp(response.text());
        console.log(text);
        
        const toAdd = text;
        const forPushing = {
            index: idx,
            sender: "MedCAT",
            content: toAdd,
        };
        idx += 1;
        CHATDATA.push(forPushing);
        console.log(CHATDATA);
        setUpdateFlag(!updateFlag);

        return text;
    }




    // keyboard stuff
    const [paddingBottom, setPaddingBottom] = useState("15%")
    const keyboardShowListener = Keyboard.addListener( 
        'keyboardDidShow', 
        () => {
            setPaddingBottom("95%");
        } 
    ); 
    const keyboardHideListener = Keyboard.addListener( 
        'keyboardDidHide', 
        () => {
            setPaddingBottom("15%");
        }
    );

    // handling input stuff

    const [updateFlag, setUpdateFlag] = useState(false);
    const [text, setText] = useState("");
    

    function addToChat() {
        const toPush = {
            index: idx,
            sender: "Me",
            content: text,
        };
        idx += 1;
        CHATDATA.push(toPush);
        setText("");
        if (text != "TESTING") {
            const prompt = "Explain what does "+text+" mean on a health report as a health information chatbot but limit the information to be only from WebMD and phrase it in a way that is easy to understand and short.";
            run(prompt);
        }
    }

    useEffect(() => {
        if (!ocrOut){
            return
        } else {
            run(firstPrompt);
        }
    }, []);

    

    return(
        <View style={[styles.container, {paddingBottom}]}>
            <View style={styles.outputBox}>
                <FlatList
                    data={CHATDATA}
                    renderItem={({item}) => <ChatBox message={item}/>}
                    nestedScrollEnabled={true}
                    keyExtractor={item=>item.index}
                    key={updateFlag}
                />
            </View>
            <View style={styles.inputBox}>
                <TextInput
                    placeholder="Enter your query"
                    value={text}
                    style={{textAlign: 'left', width: "80%"}}
                    onChangeText={value => setText(value)}
                />
                <TouchableOpacity onPress={(text)=>addToChat()}>
                    <Text style={{color: "#006ee6"}}>Send</Text>
                </TouchableOpacity>
                    
            </View>
        </View>
    )
};

export default ChatScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: "5%",
        paddingHorizontal: "3%",
    },
    inputBox: {
        height: 21,
        flexDirection: "row",
    },
    chatMessage: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: 'center',
        marginVertical: 8,
    },
    chatSender: {
        fontWeight: "bold",
        fontSize: 18,
    },
    chatContent: {
        fontSize: 16,
    },
})
