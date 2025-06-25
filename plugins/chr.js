// Required Imports
const axios = require('axios');
const fs = require("fs");
const config = require('../settings');
const { cmd } = require('../lib/command');
const {
default: makeWASocket,
useMultiFileAuthState,
fetchLatestBaileysVersion,
DisconnectReason,
makeCacheableSignalKeyStore,
delay,
getContentType,
downloadContentFromMessage,
proto,
jidDecode
} = require('@whiskeysockets/baileys');

// Command Definition
cmd({
pattern: "channelreact",
alias: ["chr"],
react: "📕",
use: ".channelreact <channel_link>,<reaction>",
desc: "React to a message in a WhatsApp channel",
category: "owner",
filename: __filename,
},
async (conn, mek, m, {
q, reply
}) => {
try {
if (!q.includes(",")) return reply("උදාහරණය: .channelreact <channel_link>,<reaction>");

let link = q.split(",")[0].trim();  
let react = q.split(",")[1].trim();  

if (!link.includes("whatsapp.com/channel/")) return reply("වැරදි channel link එකක්!");  

const channelId = link.split('/')[4];  
const messageId = link.split('/')[5];  

const res = await conn.newsletterMetadata("invite", channelId);  
await conn.newsletterReactMessage(res.id, messageId, react);  

reply("Reaction එක යවලා තියෙනව බං!");

} catch (e) {
console.log("ChannelReact Error: ", e);
reply("Error එකක් ආව: " + e.message);
}
});
//මේක බොට් ඩිප්ලොය් කරන් ඉන්න කෙනාට විතරක් වැඩ කරන විදිහට හදල ඔනි🤧 is owner


cmd({
    pattern: "getdp",
    react: "💗",
    alias: ["gdp", "getpp", "pp"],
    desc: "youtube search.",
    category: "other",
    use: '.yts alone',
    filename: __filename
}, async (conn, mek, m, { from, quoted, prefix, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe && !isOwner) {
            return await reply("🚫 You are not authorized to get the profile picture!");
        }
      const ppUrl = await conn.profilePictureUrl(from, "image");
      await conn.sendMessage(from, {
        image: { url: ppUrl }, // Ensure img.allmenu is a valid image URL or base64 encoded image
      });
    } catch (e) {
      console.log(e);
      reply(`${e}`);
    }
  }
);


const fs = require("fs");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

cmd({
  pattern: "setfulldp",
  react: "🖼️",
  alias: ["fulldp", "dpbot"],
  desc: "Set full DP for bot",
  category: "owner",
  use: ".setfulldp (reply to image)",
  filename: __filename
}, async (conn, mek, m, {
  from, quoted, isOwner, reply
}) => {
  try {
    if (!isOwner) return await reply("🚫 ඔබට මෙම command එක භාවිතා කිරීමට අවසර නැහැ!");

    if (!quoted || !quoted.message || !quoted.message.imageMessage) {
      return await reply("🖼️ කරුණාකර image එකකට reply කරලා command එක දාන්න!");
    }

    const mediaPath = `./tmp/dp_${Date.now()}.jpg`;
    const stream = await downloadMediaMessage(quoted, "buffer", {}, { reuploadRequest: conn.updateMediaMessage });
    fs.writeFileSync(mediaPath, stream);

    await conn.updateProfilePicture(conn.user.id, {
      url: mediaPath
    });

    fs.unlinkSync(mediaPath);
    await reply("✅ DP එක සාර්ථකව update කළා!");
  } catch (e) {
    console.log(e);
    await reply("⚠️ දෝෂයක් ඇතිවී ඇත! " + e.message);
  }
});
