// import colors from "./colors";
import Card from "./card";
import Deck from "./deck";
import "./style.css";

let canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.querySelector("#app").appendChild(canvas);
let ctx = canvas.getContext("2d");

let buttons = [];

function shuffle(array) {
  console.log(array.length);
  let m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  console.log(array.length);
  return array;
}

// class Game {
//   constructor() {
//     this.deck = new Deck();
//     this.score = 0;
//     this.selected = [];
//   }
// }
// let game = new Game();

let d = new Deck();
let table = [];
let table_index = 0;
let selected = [];
let trophies = [];

let secondsPassed = 0;
let oldTimeStamp = 0;
let frameRate = 0;

let mousePos = { x: 0, y: 0 };

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
  // Use time to calculate new position
  // rectX += (movingSpeed * secondsPassed);
  // rectY += (movingSpeed * secondsPassed);
  frameRate = 1 / secondsPassed;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // draw deck ??
  d.forEach((c) => {
    if (c.highlight) {
      ctx.beginPath();
      ctx.rect(c.x - 5, c.y - 5, Card.width + 10, Card.height + 10);
      ctx.closePath();
      ctx.fillStyle = "cyan";
      ctx.fill();
    }
    c.draw(ctx);
  });

  // draw table
  table.forEach((c) => {
    if (c.highlight) {
      ctx.beginPath();
      ctx.rect(c.x - 5, c.y - 5, Card.width + 10, Card.height + 10);
      ctx.closePath();
      ctx.fillStyle = "cyan";
      ctx.fill();
    }
    if (c.selected) {
      ctx.beginPath();
      ctx.rect(c.x - 5, c.y - 5, Card.width + 10, Card.height + 10);
      ctx.closePath();
      ctx.fillStyle = "orange";
      ctx.fill();
    }
    c.draw(ctx);
  });

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
    ctx.font = "24px Helvetica";
    ctx.fillText(butt.text, butt.x + 5, butt.y + 5 + 24);
    ctx.closePath();
    drawTime(ctx);
  });
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

function tableStateUpdate() {
  if (selected.length === 3) {
    let cards = selected.map((i) => {
      return table[i];
    });
    // console.log(isSet(cards));
    if (isSet(cards)) {
      console.log("a set!");
      for (let x = 0; x < cards.length; x++) {
        trophies.push(cards[x]);
        let newCard = d.pop();
        // debugger;
        newCard.setTableIndex(selected[x]);
        console.log('selected', selected)
        // debugger;
        table[selected[x]] = newCard;
        // debugger;
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
        d = shuffle(d);
        return;
      } else {
        console.log("drawing");
        let c = d.pop();

        let x = 120 * (table.length % 4) + 250;
        let y = 120 * Math.floor(table.length / 4) + 120;
        c.setPos(x, y);
        table.push(c);
        return;
      }
    }
  });
});

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
