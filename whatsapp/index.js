// const { Client, LocalAuth } = require('whatsapp-web.js');
// const qrcode=require('qrcode-terminal')

// const client = new Client({
//     authStrategy: new LocalAuth()
// });

// client.on('qr', (qr) => {
//     qrcode.generate(qr,{small:true})
//     console.log('QR RECEIVED', qr);
// });

// client.on('ready', () => {
//     console.log('Client is ready!');
// });

// client.on('message', async (message) => {
//     try {
//         if (message != "status@broadcast") {
//             const contact = message.getContact()
//             console.log(contact,message.body)
//         }

//         console.log(message.body);
//     } catch (error) {

//     }
// });


// module.exports=client
