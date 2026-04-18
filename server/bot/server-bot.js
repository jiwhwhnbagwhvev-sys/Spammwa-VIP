const express = require("express");
const { exec } = require("child_process");
const app = express();

app.use(express.json());

let statusBot = "offline";

// ===== TERIMA STATUS =====
app.post("/status",(req,res)=>{
  statusBot = req.body.status;
  res.json({msg:"ok"});
});

// ===== STATUS KE WEB =====
app.get("/status",(req,res)=>{
  res.json({bot:statusBot});
});

// ===== HALAMAN =====
app.get("/",(req,res)=>{
res.send(`
<html>
<head>
<title>BOT PANEL</title>

<style>
body{
margin:0;
font-family:sans-serif;
background:#0b1a2a;
color:white;
text-align:center;
}

.lock{
position:fixed;
top:0;left:0;
width:100%;height:100%;
background:linear-gradient(#000,#1a0000);
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
z-index:9999;
}

.lock h2{
color:red;
animation:blink 1s infinite alternate;
}

@keyframes blink{
from{opacity:0.5;}
to{opacity:1;}
}

.box{
background:#111;
padding:20px;
border-radius:15px;
margin:20px;
}

button{
padding:12px;
margin:10px;
border:none;
border-radius:10px;
cursor:pointer;
}

</style>
</head>

<body>

<div id="lock" class="lock">
<h2>⚠️ BOT BELUM TERHUBUNG</h2>
<p>Buka Termux & jalankan bot</p>
</div>

<div id="panel" style="display:none;">
<h2>🤖 BOT ONLINE</h2>

<div class="box">
<input id="nomor" placeholder="628xxx"><br>
<input id="pesan" placeholder="pesan"><br>
<button onclick="kirim()">KIRIM</button>
</div>

<p id="out"></p>
</div>

<script>

function cek(){
fetch("/status")
.then(r=>r.json())
.then(d=>{
if(d.bot==="online"){
lock.style.display="none";
panel.style.display="block";
}else{
lock.style.display="flex";
}
});
}

setInterval(cek,2000);

function kirim(){
let n=nomor.value;
let p=pesan.value;

let url="https://wa.me/"+n+"?text="+encodeURIComponent(p);
out.innerHTML="<a href='"+url+"' target='_blank'>Kirim WA</a>";
}

</script>

</body>
</html>
`);
});

// ===== RUN SERVER =====
app.listen(3000, ()=>{
console.log("🔥 http://localhost:3000");

// AUTO BUKA BROWSER (ANDROID)
exec("termux-open-url http://localhost:3000");
});
