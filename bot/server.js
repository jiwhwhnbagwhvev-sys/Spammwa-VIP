const express = require("express");
const path = require("path");
const { startBot, sendMessage } = require("./bot");

const app = express();
app.use(express.json());

// 🔥 serve index.html
app.use(express.static(__dirname));

// start bot WA
startBot();

// API kirim
app.post("/send", async (req, res) => {
  const { targets, url } = req.body;

  await sendMessage(targets, url);

  res.send({ status: "done" });
});

// default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, () => {
  console.log("🚀 http://localhost:3000");
});
