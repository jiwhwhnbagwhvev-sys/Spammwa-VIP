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

async function sendMessage(targets, url) {
  try {
    console.log("📥 Ambil TXT...");

    const res = await axios.get(url);
    const text = res.data;

    console.log("✅ TXT KEAMBIL");

    for (let t of targets) {
      t = t.trim();
      if (!t) continue;

      // 🔥 pecah biar FULL ke kirim
      const parts = text.match(/.{1,3000}/gs);

      for (let part of parts) {
        await sock.sendMessage(t, { text: part });

        console.log("📤 Kirim ke:", t);

        await new Promise(r => setTimeout(r, 1200));
      }
    }

  } catch (err) {
    console.log("❌ ERROR:", err.message);
  }
}

module.exports = { startBot, sendMessage };
