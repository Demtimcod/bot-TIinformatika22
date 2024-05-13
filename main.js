const telegramBot = require("node-telegram-bot-api");
require('dotenv').config();

// abrordc bot copyrigth
const token = process.env.BOT_TOKEN;
const options = {
    polling: true
};

const dcbot = new telegramBot(token, options);
// dcbot.on("message", call => {
//     let id = call.from.id;
//     dcbot.sendMessage(id, "hallo");
// });
const prefix = "/";
const datas = new RegExp(`^${prefix}data$`);
const start = new RegExp(`^${prefix}start$`);
const profile = new RegExp(`^${prefix}cek`);
const info = new RegExp(`^${prefix}info$`);
const location = new RegExp(`^${prefix}lokasi$`);
const resuld = `
selamat datang tuan
di bot @demtimcod_bot
/data untuk cek data tuan 
/cek untuk cek profile tuan 
/mahasiswa {parameter}
`;
const data = `
email : abror@demtimcod.org 
no HP: 08726896277
ini data anda tuan
`;

// dcbot.onText(start, call => {
//     let id = call.from.id;
//     dcbot.sendMessage(id, resuld);
// });
dcbot.onText(start, call => {
    dcbot.sendMessage(call.from.id, resuld, {
        reply_markup: {
            keyboard: [["/data", "/cek"], ["/info"], ["/lokasi"]]
        }
    });
});

dcbot.onText(datas, call => {
    let id = call.from.id;
    dcbot.sendMessage(id, data);
});

dcbot.onText(profile, call => {
    let id = call.from.id;
    let negara = "";
    if (call.from.language_code == "id") {
        negara = "indonesia";
    } else {
        negara = "tidak di temukan";
    }
    const hasil = `
   nama depan = ${call.from.first_name}
   nama belakang = ${
       call.from.last_name == undefined ? " " : call.from.last_name
   }
   username = ${call.from.username == undefined ? " " : call.from.username}
   negara = ${negara}
   profile telegram anda tuan
   `;
    dcbot.sendMessage(id, hasil);
});

dcbot.onText(info, call => {
    // if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
    dcbot.sendMessage(
        call.from.id,
        '<b>bot demtimcod</b> \n <i>v280224</i> \n <a href="http://www.github.com/DemtimCod">Github Repostory</a> \n <code>demcod : { name : abror_dc }</code> \n <pre>demtimcod © 2024</pre>',
        { parse_mode: "HTML" }
    );
});

dcbot.onText(location, msg => {
    // var location = "location";
    //     if (msg.text.indexOf(location) === 0) {
    dcbot.sendLocation(msg.from.id, -6.922551, 113.6173587);
    dcbot.sendMessage(msg.from.id, "ini lokasi anda tuan 📍");
});

dcbot.onText(/mahasiswa/, async call => {
    let text = call.text.split(" ")[1];
    let datas = await fetch(
        `https://api-frontend.kemdikbud.go.id/hit_mhs/${text}`
    );
    // regex (/ /g, '') hapus spasi
    let data = await datas.json();
    let temp = "";
    let info = `Daftar mahasiswa dengan keyword : ${text.toUpperCase()}`;
    for (mhs of data.mahasiswa) {
        temp += `
        profile : ${mhs.text} \n
        `;
    }
    dcbot.sendMessage(call.from.id, info)
    dcbot.sendMessage(call.from.id, temp.toLowerCase());
});
