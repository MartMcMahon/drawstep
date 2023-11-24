const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

gameState = { deck: [], players: {} };

function broadcast(outgoing) {
  wss.clients.forEach((client) => {
    if (client.readyState == WebSocket.OPEN) {
      client.send(JSON.stringify(outgoing));
    }
  });
}

wss.on("connection", (ws) => {
  // ws.send("welcome");

  ws.on("message", (msg) => {
    msg = JSON.parse(msg);
    console.log(`received ${msg}`);

    switch (msg.action) {
      case "id":
        let p = gameState.players[msg.player.name] || { name: "new", score: 0 };
        gameState.players[msg.player.name] = p;
        broadcast({ action: "players", players: gameState.players });
        break;
      case "newGame":
        gameState.deck = msg.deck;
        wss.clients.forEach((client) => {
          if (client.readyState == WebSocket.OPEN) {
            client.send(JSON.stringify({ action: "newGame", deck: msg.deck }));
          }
        });
        break;
    }
  });
});

const PORT = 8000;
app.get("/", (_req, res) => res.send("hello!"));
server.listen(PORT, () => console.log(`running on port ${PORT}`));
