const axios = require("axios");
const cheerio = require('cheerio');
const { cmd, commands } = require('../command')
const config = require('../config');
const {fetchJson} = require('../lib/functions');

const api = `https://nethu-api-ashy.vercel.app`;

var desc =''
if(config.LANG === 'SI') desc = "sinhalasub වෙතින් වීඩියෝ බාගත කරයි."
else desc = "Download videos from sinhalasub."

var imgmsg =''
if(config.LANG === 'SI') imgmsg = "*🚩 කරුණාකර වචන කිහිපයක් ලියන්න*"
else imgmsg = "*🚩 Please give me a text*"

var urlneed =''
if(config.LANG === 'SI') urlneed = "*🚩 කරුණාකර sinhalasub url එකක් ලබා දෙන්න*"
else urlneed = "*🚩 Please give me a sinhalasub url*"

var N_FOUND =''
if(config.LANG === 'SI') N_FOUND = "*මට කිසිවක් සොයාගත නොහැකි විය :(*"
else N_FOUND = "*I couldn't find anything :(*"

var epurlneed = config.LANG === 'SI' ? "*🚩 කරුණාකර sinhalasub episode url එකක් ලබා දෙන්න්*" : "*🚩 Please give me a SinhalaSub episode url*";
 

 
cmd({
  pattern: "sinhalasub",
  alias: ["ssub"],
  desc: desc,
  category: "downloa",
  use: ".sinhalasub 2024",
  filename: __filename
},
async (conn, mek, m, { from, q, reply, prefix }) => {
  try {
    if (!q) return reply(imgmsg);

    const res = await fetchJson(`${api}/movie/sinhalasub/search?text=${encodeURIComponent(q)}`);

    if (!res.result || res.result.data.length === 0) {
      return reply(N_FOUND);
    }

    const buttons = res.result.data.slice(0, 10).map((item, i) => ({
      buttonId: `${prefix}sub_search ${item.link}`,
      buttonText: { displayText: `${item.title}` },
      type: 1
    }));

    const buttonMessage = {
      image: { url: "https://i.ibb.co/1YPWpS3H/9882.jpg" },
      caption: `*_SINHALASUB SEARCH RESULT 📽️_*\n\n\`Input :\` ${q}`,
      footer: "> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏᴋᴜ-ᴍᴅ 🔒🪄",
      buttons: buttons,
      headerType: 4
    };

    return await conn.buttonMessage2(from, buttonMessage, mek);

  } catch (e) {
    reply('*Error*');
    console.error(e);
  }
});

cmd({
  pattern: "sub_search",
  react: "🔎",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, mek, m, { from, q, prefix, quoted, reply }) => {
  try {
    if (!q) return reply(urlneed);

    let sin = await fetchJson(`${api}/movie/sinhalasub/movie?url=${q}`);
    if (!sin.result?.data) return reply(N_FOUND);

    let data = sin.result.data;

    const caption = `*_SINHALASUB MOVIE INFORMATION 📽️_*

*┃* 📝 \`Title\` : ${data.title}
*┃* 📅 \`Release Date\` : ${data.date}
*┃* 🌍 \`Country\` : ${data.country}
*┃* 🎯 \`TMDB Rating\` : ${data.tmdbRate}
*┃* 🗳️ \`SinhalaSub Votes\` : ${data.sinhalasubVote}
*┃* 🎬 \`Directed by\` : ${data.director}
*┃* 🏷️ \`Categories\` : ${data.category.join(', ')}
*┃* ✍️ \`Subtitle By\` : ${data.subtitle_author}
*┃* 📎 \`Url\` : ${q}

🧾 Description:
${data.description.split('\n')[0]}`;

    const sections = [
      {
        title: "Download PixelDrain ⬇️",
        rows: data.pixeldrain_dl.map(dl => ({
          title: `${dl.quality} (${dl.size})`,
          rowId: `${prefix}subsdl ${dl.link}`
        }))
      },
      {
        title: "Download DDL ⬇️",
        rows: data.ddl_dl.map(dl => ({
          title: `${dl.quality} (${dl.size})`,
          rowId: `${prefix}subsdl ${dl.link}`
        }))
      }
    ];

    await conn.listMessage2(from, {
      image: { url: data.images[0] },
      caption,
      footer: "> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏᴋᴜ-ᴍᴅ 🔒🪄",
      title: "",
      buttonText: "\`Reply Below Number\` 🔢",
      sections,
    }, mek);
    
  } catch (err) {
    console.error(err);
    reply("❌ Error occurred while fetching data.");
  }
});

cmd({
  pattern: "subsdl",
  react: "⬇️",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, mek, m, { from, q, quoted, reply }) => {
  try {
    if (!q) return reply(urlneed);

    await conn.sendMessage(from, {
      document: { url: q },
      mimetype: "video/mp4",
      fileName: "Sinhalasub-Movie.mp4",
      caption: "> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏᴋᴜ-ᴍᴅ 🔒🪄",
      contextInfo: {
        mentionedJid: [],
        isForwarded: false,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363404913442592@newsletter',
          newsletterName: "Loku MD V1",
          serverMessageId: 999
        },
        externalAdReply: {
          title: "Sinhalasub Movie",
          body: 'www.sinhalasub.lk',
          mediaType: 1,
          sourceUrl: q,
          thumbnailUrl: "https://i.ibb.co/1YPWpS3H/9882.jpg",
          renderLargerThumbnail: false,
          showAdAttribution: true
        }
      }
    }, { quoted: mek });

  } catch (e) {
    console.error("subsdl error:", e);
    reply(`*ERROR*`);
  }
});
