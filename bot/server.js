const express = require("express");
const { startBot, sendMessage } = require("./bot");

const app = express();
app.use(express.json());

startBot();

app.post("/send", async (req, res) => {
  const { targets, url } = req.body;

  await sendMessage(targets, url);

  res.send({ status: "done" });
});

app.listen(3000, () => {
  console.log("🚀 Server jalan di http://localhost:3000");
});
