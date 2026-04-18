const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const P = require("pino");
const axios = require("axios");
const readline = require("readline");

async function startBot(){
  const { state, saveCreds } = await useMultiFileAuthState("session");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: P({ level: "silent" }),
    auth: state
  });

  sock.ev.on("creds.update", saveCreds);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Masukkan nomor (628xxx): ", async (nomor)=>{
    try{
      const code = await sock.requestPairingCode(nomor);
      console.log("🔑 KODE:", code);
    }catch(e){
      console.log("❌ Gagal ambil kode");
    }
  });

  sock.ev.on("connection.update", async (update)=>{
    const { connection } = update;

    if(connection === "open"){
      console.log("🟢 CONNECTED");

      await axios.post("http://localhost:3000/status",{
        status:"online"
      });
    }

    if(connection === "close"){
      console.log("🔴 DISCONNECT");

      await axios.post("http://localhost:3000/status",{
        status:"offline"
      });

      startBot();
    }
  });
}

startBot();
