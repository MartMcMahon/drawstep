const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

gameState = { deck: [], players: {}, table: [] };

function broadcast(outgoing) {
  wss.clients.forEach((client) => {
    if (client.readyState == WebSocket.OPEN) {
      client.send(JSON.stringify(outgoing));
    }
  });
}
function single(ws, outgoing) {
  ws.send(JSON.stringify(outgoing));
}

wss.on("connection", (ws) => {
  // ws.send("welcome");

  ws.on("message", (msg) => {
    msg = JSON.parse(msg);
    console.log(`received ${msg}`);

    switch (msg.action) {
      case "id":
        // let p = gameState.players[msg.player.name] || msg.player;
        gameState.players[msg.player.name] = msg.player;
        broadcast({ action: "players", players: gameState.players });
        console.log(`sending ${gameState.table}`);
        single(ws, {
          action: "currentGame",
          deck: gameState.deck,
          table: gameState.table,
        });
        break;
      case "newGame":
        gameState.deck = msg.deck;
        gameState.table = msg.table;
        broadcast({ action: "newGame", deck: msg.deck, table: msg.table });
        break;
      case "setGet":
        let idxs = msg.selected;
        let playerName = msg.playerName;
        gameState.players[playerName].score += 1;
        broadcast({ action: "setGot", idxs, players: gameState.players });
        break;
    }
  });
});

const PORT = 8000;
app.get("/", (_req, res) => res.send("hello!"));
server.listen(PORT, () => console.log(`running on port ${PORT}`));
