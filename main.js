import colors from "./colors";
import Card from "./card";
import Deck from "./deck";
import Table from "./table";
import "./style.css";

let playerId = window.location.search.split("?")[1] || "new";
let player = { name: playerId, score: 0 };

let deck = new Deck();
let table = new Table();

let canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.querySelector("#app").appendChild(canvas);
let ctx = canvas.getContext("2d");

let buttons = [];
let selected = [];
let trophies = [];

let secondsPassed = 0;
let oldTimeStamp = 0;
let frameRate = 0;

let mousePos = { x: 0, y: 0 };

let numSets = 0;
let debug_sets = [];

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

buttons = [
  {
    x: canvas.width - 150,
    y: canvas.height - 300,
    width: 130,
    height: 50,
    text: "new game",
  },
  {
    x: canvas.width - 150,
    y: canvas.height - 100,
    width: 100,
    height: 50,
    text: "shuffle",
  },
  {
    x: canvas.width - 150,
    y: canvas.height - 200,
    width: 100,
    height: 50,
    text: "draw one",
  },
];

function update(secondsPassed) {
  frameRate = 1 / secondsPassed;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw table
  table.draw(ctx);

  // draw ui
  ctx.beginPath();
  ctx.rect(canvas.width - 200, canvas.height / 4, 200, 200);
  ctx.closePath();
  ctx.strokeStyle = "black";
  ctx.stroke();
  ctx.fillStyle = "rgba(200, 200, 200, 1)";
  ctx.fill();

  ctx.beginPath();
  let playerBoxPos = {
    x: canvas.width - 200 + 5,
    y: canvas.height / 4 + 5 * 30,
  };
  ctx.rect(playerBoxPos.x, playerBoxPos.y, 175, 50);
  ctx.closePath();
  ctx.strokeStyle = colors.grey;
  ctx.stroke();
  ctx.fillStyle = "rgba(150, 105, 150, 1)";
  ctx.fill();
  ctx.beginPath();
  ctx.font = "24px Helvetica";
  ctx.fillStyle = "black";
  ctx.fillText(
    `${player.name}: ${player.score}`,
    playerBoxPos.x + 5,
    playerBoxPos.y + 5 + 24
  );
  ctx.closePath();

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
}

function drawTime(ctx) {
  let elapsed = parseInt((new Date() - startTime) / 1000);
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.font = "14px Verdana";
  ctx.fillText(elapsed + " secs", canvas.width - 75, 25);
  ctx.fillText(frameRate + " fps", canvas.width - 75, 50);
  ctx.fillText(
    "{ " + mousePos.x + ", " + mousePos.y + " }",
    canvas.width - 175,
    75
  );
  ctx.fillText("score: " + trophies.length, canvas.width - 100, 75);
  ctx.fillText("selected: " + selected, canvas.width - 400, 100);
  ctx.restore();
}

function drawMessage() {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.font = "32px Verdana";
  ctx.fillText(`there are/is ${numSets} set(s)`, canvas.width / 2 - 100, 50);
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
      trophies.splice(trophies.length, 0, cards);

      selected.forEach((i) => {
        table[i] = false;
      });
      table = table.filter((c) => c);
      table.forEach((c, i) => {
        c.setTableIndex(i);
      });
      while (table.length < 12) {
        let c = deck.pop();
        c.setTableIndex(table.length);
        table.push(c);
      }
      selected = [];
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

  buttons.forEach((butt) => {
    if (butt.highlight) {
      if (butt.text === "shuffle") {
        console.log("running shuffle");
        deck.shuffle();
        return;
      } else if (butt.text === "new game") {
        get12();
        numSets = verify12();
        while (numSets === 0) {
          get12();
          debug_sets = [];
          numSets = verify12();
        }
        console.log("numSets: ", numSets);
        console.log("sets: ", debug_sets);
        // deck = new Deck();
        // deck.shuffle();
        // table = new Table();
        // for (let i = 0; i < 12; i++) {
        //   let c = deck.pop();
        //   c.setTableIndex(i);
        //   table.push(c);
        // }
      } else {
        let c = deck.pop();
        c.setTableIndex(table.length);
        table.push(c);
        return;
      }
    }
  });
});

function get12() {
  deck = new Deck();
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
          debug_sets.push([i, j, k]);
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
  console.log("checking set ", sel);
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
