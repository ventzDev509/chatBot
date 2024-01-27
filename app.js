const express = require("express");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

require("dotenv").config();

const PORT = 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const openai = new OpenAI({
    headers: "application/json",
    apiKey: process.env.OPEN_AI_API_KEY,
    timeout: 20000,
});

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
     console.log(qr)
//     qrcode.generate(qr, { small: true }, function (qr) {
//     console.log(qr)
// });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', handleIncomingMessage);

async function handleIncomingMessage(message) {
    try {
        if (message.body && message.body.trim() !== "" && message.broadcast ==undefined) {
            const contact = message.getContact();
            console.log(message.from);
            const msg = message.body;

            const phoneNumber = message.from;

            // Utiliser la valeur du _serialized dans la réponse automatique
            await processMessage(phoneNumber, msg);
        }
    } catch (error) {
        console.error("Error processing message:", error);
    }
}

async function processMessage(contact, msg) {
    try {
        const response = await generateOpenAIResponse(msg);
        
        
        // Utiliser la valeur du _serialized dans la fonction sendMessageToWhatsApp
        await sendMessageToWhatsApp(contact, response);
    } catch (error) {
        console.error("Error processing message:", error);
    }
}

async function generateOpenAIResponse(userMessage) {
    const response = await openai.chat.completions.create({
        messages: [
            { role: "system", content: "You are a helpful assistant designed to output JSON." },
            { role: "user", content: userMessage },
        ],
        model: "gpt-3.5-turbo",
    });

    return response.choices[0].message.content;
}

async function sendMessageToWhatsApp(contact, message) {
    try {
        await client.sendMessage(contact, message);
        console.log(JSON.stringify(message, null, 2));
    } catch (error) {
        console.error("Error sending message to WhatsApp:", error);
    }
}

app.post("/chat", (req, res) => {
    const message = req.body.message;
    // Handle incoming chat messages via HTTP POST request
    // You can add logic here to process and respond to HTTP messages
    res.send("Received your message!");
});

client.initialize();

app.listen(PORT, () => {
    console.log(`Server is ready and listening on port ${PORT}`);
});
