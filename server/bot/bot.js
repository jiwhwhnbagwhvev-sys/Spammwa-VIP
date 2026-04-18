const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require("@whiskeysockets/baileys");
const P = require("pino");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session");

  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: P({ level: "silent" }),
    auth: state,
    browser: ["Termux Bot", "Chrome", "1.0.0"]
  });

  // ✅ Simpan session
  sock.ev.on("creds.update", saveCreds);

  // ✅ Koneksi & reconnect
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;

      console.log("❌ Koneksi putus:", reason);

      if (reason !== DisconnectReason.loggedOut) {
        console.log("🔄 Reconnect...");
        startBot();
      } else {
        console.log("⚠️ Harus login ulang");
      }
    }

    if (connection === "open") {
      console.log("✅ Bot terhubung ke WhatsApp");
    }
  });

  // ✅ Pairing Code (bukan QR)
  if (!sock.authState.creds.registered) {
    const phoneNumber = await askNumber();
    const code = await sock.requestPairingCode(phoneNumber);
    console.log("\n🔑 Kode Pairing:", code);
  }

  // ✅ Listener pesan (contoh)
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

    if (text === "ping") {
      await sock.sendMessage(msg.key.remoteJid, { text: "pong 🏓" });
    }
  });
}

// 📱 Input nomor
function askNumber() {
  return new Promise((resolve) => {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question("📱 Masukkan nomor (contoh 628xxx): ", (num) => {
      readline.close();
      resolve(num);
    });
  });
}

// 🚀 Jalankan bot
startBot();
