const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "MD=vgAFiSra#PaetRHSfrObtiR76QVE2ger7UhiIqDTkGAKUabuWGU0", // ඔයාගේ session id එක දාන්න
MONGODB: process.env.MONGODB || "mongodb+srv://udavin56:1234@cluster0.urhma.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", // ඔයාගේ mongodb url එක දාන්න
BOT_NAME: process.env.BOT_NAME || "VINER-MD",
ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/rdl1p6.jpg",
LANG: process.env.BOT_LANG || 'EN' ,
OMDB_API_KEY: process.env.OMDB_API_KEY || "76cb7f39",
DELETEMSGSENDTO : process.env.DELETEMSGSENDTO === undefined ? '' : process.env.DELETEMSGSENDTO,
};
