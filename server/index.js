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

// if (gameState.players.hasOwnProperty(msg.player.name)) {
//   if (gameState.players[msg.player.name].timestamp < now - PLAYER_TIMEOUT_SECS) {
//     delete gameState.players[msg.player.name];
//   }
// }

wss.on("connection", (ws) => {
  // ws.send("welcome");

  ws.on("message", (msg) => {
    msg = JSON.parse(msg);
    // console.log(`received ${msg}`);

    switch (msg.action) {
      case "ping":
        // single(ws, {action: "currentGame", deck: gameState.deck, table: gameState.table});
        single(ws, { action: "pong" });
        break;
      case "id":
        let now = +Date.now().timestamp();
        gameState.players[msg.player.name] = { ...msg.player, timestamp: now };
        broadcast({ action: "players", players: gameState.players });
        single(ws, {
          action: "currentGame",
          deck: gameState.deck,
          table: gameState.table,
        });
        break;
      case "newGame":
        console.log("new game msg ", msg.deck.length);
        gameState.deck = msg.deck;
        gameState.table = msg.table;
        broadcast({
          action: "newGame",
          deck: gameState.deck,
          table: gameState.table,
        });
        break;
      case "setGet":
        let idxs = msg.selected;
        let playerId = msg.playerId;
        gameState.players[playerId].score += 1;
        broadcast({ action: "setGot", idxs, players: gameState.players });
        break;
    }
  });
});

const PORT = 8000;
app.get("/", (_req, res) => res.send("hello!"));
server.listen(PORT, () => console.log(`running on port ${PORT}`));
