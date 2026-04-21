const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const axios = require("axios");

let sock;

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    auth: state
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection }) => {
    if (connection === "open") {
      console.log("✅ WA CONNECTED");
    }
  });
}

async function sendMessage(targets, txtUrl) {
  try {
    const res = await axios.get(txtUrl);
    const text = res.data;

    for (let t of targets) {
      await sock.sendMessage(t, { text });
      console.log("Kirim ke:", t);

      await new Promise(r => setTimeout(r, 2000));
    }

  } catch (e) {
    console.log("Error:", e.message);
  }
}

module.exports = { startBot, sendMessage };
