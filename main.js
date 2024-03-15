import colors from "./colors";
import Card from "./card";
import Deck from "./deck";
import Table from "./table";
import "./style.css";

let DEBUGGING = false;

// let playerId = window.location.search.split("?")[1] || "new";
// let player = { name: playerId, score: 0 };

let deck = new Deck(0);
let table = new Table();
let won = false;

let canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.querySelector("#app").appendChild(canvas);
let ctx = canvas.getContext("2d");

let buttons = [];
let selected = [];
let trophies = {};

let winTime = 0;
let secondsPassed = 0;
let oldTimeStamp = 0;
let frameRate = 0;
let mousePos = { x: 0, y: 0 };
let numSets = 0;

let history = {};
function getHistory() {
  if (!localStorage.getItem("history")) {
    localStorage.setItem("history", JSON.stringify({}));
  }
  history = JSON.parse(localStorage.getItem("history"));
}

function getDate() {
  return new Date().toJSON().split("T")[0];
}

let dateString = getDate().split("-").join("");
let puzzleDate = getDate();

function gameLoop(timeStamp) {
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;

  // Pass the time to the update
  update(secondsPassed);
  draw();

  window.requestAnimationFrame(gameLoop);
}
let startTime = new Date();
gameLoop(startTime);

// buttons = [
//   {
//     x: canvas.width - 150,
//     y: canvas.height - 300,
//     width: 130,
//     height: 50,
//     text: "new game",
//   },
//   {
//     x: canvas.width - 150,
//     y: canvas.height - 100,
//     width: 100,
//     height: 50,
//     text: "shuffle",
//   },
//   {
//     x: canvas.width - 150,
//     y: canvas.height - 200,
//     width: 100,
//     height: 50,
//     text: "draw one",
//   },
// ];

function update(secondsPassed) {
  frameRate = 1 / secondsPassed;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw table
  table.draw(ctx);

  // draw ui
  let playerBoxPos = {
    x: canvas.width - 195,
    y: canvas.height / 4 - 100,
  };
  ctx.beginPath();
  ctx.rect(
    playerBoxPos.x,
    playerBoxPos.y,
    (Card.width + 3) * 3,
    (Card.height + 2) * numSets
  );
  ctx.closePath();
  ctx.strokeStyle = "black";
  ctx.stroke();
  ctx.fillStyle = "rgba(200, 200, 200, 1)";
  ctx.fill();

  ctx.beginPath();

  Object.entries(trophies).forEach(([k, v], e) => {
    if (v) {
      k.split(",").forEach((i) => {
        let card = table[i].clone();
        console.log("e: ", e);
        card.setPos(playerBoxPos.x, playerBoxPos.y + (Card.height + 2) * e);
        card.draw(ctx);
        playerBoxPos.x += Card.width + 3;
      });
    }
    playerBoxPos.x = canvas.width - 200 + 5;
  });

  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.font = "32px Verdana";
  ctx.fillText(
    `${numSets - Object.values(trophies).filter((t) => t).length} left`,
    playerBoxPos.x,
    playerBoxPos.y + (Card.height + 2) * numSets
  );
  ctx.closePath();
  ctx.restore();

  // write date
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.font = "32px Verdana";
  ctx.fillText(
    puzzleDate,
    playerBoxPos.x - 20,
    playerBoxPos.y + (Card.height + 2) * numSets + 50 + 50
  );
  ctx.closePath();
  ctx.restore();

  buttons.forEach((butt) => {
    if (butt.highlight) {
      ctx.beginPath();
      ctx.rect(butt.x - 5, butt.y - 5, butt.width + 10, butt.height + 10);
      ctx.closePath();
      ctx.fillStyle = "cyan";
      ctx.fill();
    }
    ctx.beginPath();
    ctx.rect(butt.x, butt.y, butt.width, butt.height);
    ctx.closePath();
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.fillStyle = "grey";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.font = "32px Helvetica";
    ctx.fillText(butt.text, butt.x + 5, butt.y + 5 + 24);
    ctx.closePath();
  });

  drawTime(ctx);
  drawMessage();

  // won the game
  if (won) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "lavender";
    ctx.rect(100, 100, canvas.width - 140, 300);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.font = "40px Verdana";
    ctx.fillText(
      `You won in ${(winTime - startTime) / 1000} seconds!`,
      200,
      200
    );

    ctx.fill();
    ctx.restore();
  }
}

function drawTime(ctx) {
  if (DEBUGGING) {
    let elapsed = parseInt((new Date() - startTime) / 1000);
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.font = "14px Verdana";
    ctx.fillText(elapsed + " secs", canvas.width - 75, 25);
    ctx.fillText(
      "{ " + mousePos.x + ", " + mousePos.y + " }",
      canvas.width - 175,
      75
    );
    ctx.fillText("selected: " + selected, canvas.width - 400, 100);
    ctx.restore();
  }
}

function drawMessage() {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.font = "32px Verdana";
  let s = `there are ${numSets} sets`;
  if (numSets === 1) {
    s = `there is ${numSets} set`;
  }
  ctx.fillText(s, canvas.width / 2 - 100, 50);
  ctx.closePath();
  ctx.restore();
}

function tableStateUpdate() {
  if (selected.length === 3) {
    let cards = selected.map((i) => {
      return table[i];
    });
    if (isSet(cards)) {
      console.log("a set!");
      trophies[selected.sort((a, b) => a - b)] = true;
      console.log("trophies: ", trophies);
      selected.forEach((i) => {
        table[i].selected = false;
      });
      selected = [];
      if (Object.values(trophies).filter((t) => t).length === numSets) {
        console.log("you won!");
        won = true;
        winTime = new Date();
      }
    } else {
      console.log("bad");
    }
  }
}

window.addEventListener("mousemove", (e) => {
  table.forEach((card, i) => {
    mousePos.x = e.x;
    mousePos.y = e.y;
    if (
      e.x > card.x &&
      e.x < card.x + Card.width &&
      e.y > card.y &&
      e.y < card.y + Card.height
    ) {
      card.highlight = true;
    } else {
      card.highlight = false;
    }
  });

  buttons.forEach((butt) => {
    if (
      e.x > butt.x &&
      e.x < butt.x + butt.width &&
      e.y > butt.y &&
      e.y < butt.y + butt.height
    ) {
      butt.highlight = true;
    } else {
      butt.highlight = false;
    }
  });
});

window.addEventListener("mousedown", (e) => {
  // if (selected.length > 3) {
  //   let removed = selected.splice(0, selected.length - 3);
  //   removed.forEach(card => {
  //     card.selected = false;
  //   })
  //   return;
  // } else if (selected.length === 3) {
  //   return;
  // }
  table.forEach((card, idx) => {
    if (card.highlight) {
      if (!card.selected) {
        card.selected = true;
        selected.push(idx);
        return;
      } else {
        card.selected = false;
        let i = selected.indexOf(idx);
        selected.splice(i, 1);
        return;
      }
    }
  });

  tableStateUpdate();

  // buttons.forEach((butt) => {
  //   if (butt.highlight) {
  //     if (butt.text === "shuffle") {
  //       console.log("running shuffle");
  //       deck.shuffle();
  //       return;
  //     } else if (butt.text === "new game") {
  //       get12();
  //       numSets = verify12();
  //       while (numSets === 0) {
  //         get12();
  //         trophies = {};
  //         numSets = verify12();
  //       }
  //       console.log("numSets: ", numSets);
  //       // deck = new Deck();
  //       // deck.shuffle();
  //       // table = new Table();
  //       // for (let i = 0; i < 12; i++) {
  //       //   let c = deck.pop();
  //       //   c.setTableIndex(i);
  //       //   table.push(c);
  //       // }
  //     } else {
  //       let c = deck.pop();
  //       c.setTableIndex(table.length);
  //       table.push(c);
  //       return;
  //     }
  //   }
  // });
});

function newGame() {
  get12();
  numSets = verify12();
  while (numSets === 0) {
    get12();
    numSets = verify12();
  }
  console.log("numSets: ", numSets);
}

function get12() {
  deck = new Deck(parseInt(dateString));
  deck.shuffle();
  table = new Table();
  for (let i = 0; i < 12; i++) {
    let c = deck.pop();
    c.setTableIndex(i);
    table.push(c);
  }
}

function verify12() {
  let numSets = 0;
  for (let i = 0; i < 12; i++) {
    for (let j = i; j < 12; j++) {
      for (let k = j; k < 12; k++) {
        if (i === j || i === k || j === k) {
          continue;
        }
        if (isSet([table[i], table[j], table[k]])) {
          numSets++;
          trophies[[i, j, k].sort((a, b) => a - b)] = false;
          // answer_sets.push([i, j, k]);
        }
      }
    }
  }
  return numSets;
}

const PropType = Object.freeze({
  Suit: "shape",
  Color: "color_index",
  Count: "count",
  Fill: "fillType",
});
function isSet(sel) {
  if (sel.length > 3) {
    console.error("too many!");
    return;
  }
  return Object.values(PropType).every((propType) => {
    let matchSum = 0;
    sel.forEach((c) => {
      matchSum += c[propType];
    });

    if (matchSum % 3 !== 0) {
      console.log("matchSum for " + propType + " is " + matchSum);
      return false;
    }
    return true;
  });
}

/// start the new game
newGame();
//////////////////
