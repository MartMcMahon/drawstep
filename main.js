import Card from "./card";
import { FillType, ShapeType } from "./shape";
import "./style.css";

let canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.querySelector("#app").appendChild(canvas);
let ctx = canvas.getContext("2d");

const grey = { r: 127, g: 127, b: 127, a: 1 };
const red = { r: 200, g: 0, b: 0, a: 1 };
const green = { r: 0, g: 200, b: 0, a: 1 };
const purple = { r: 100, g: 0, b: 100, a: 1 };
const colors = [green, red, purple];

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

class Deck extends Array {
  constructor() {
    super();
    colors.forEach((color, c_index) => {
      Object.values(ShapeType).forEach((shapeType) => {
        Object.values(FillType).forEach((fillType) => {
          [1, 2, 3].forEach((count) => {
            let card = new Card(count, color, fillType, shapeType, {});
            card.setPos(0, 0);
            card.draw(ctx);
            this.push(card);
          });
        });
      });
    });
  }

  static debug() {
    let d = [];
     colors.forEach((color, c_index) => {
      let color_x = c_index * 300;
      Object.values(ShapeType).forEach((shapeType) => {
        let shape_y = shapeType * 300;
        Object.values(FillType).forEach((fillType) => {
          let fill_x = fillType * 100;
          [1, 2, 3].forEach((count) => {
            let card = new Card(count, color, fillType, shapeType, {});
            card.setPos(color_x + fill_x, shape_y + (count - 1) * 100);
            card.draw(ctx);
            d.push(card);
          });
        });
      });
    });
    return d;
  }
}
let d = new Deck();
d = Deck.debug();
let table = [];
let table_index = 0;

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
  // ctx.fillText("{ " + d[10].x + ", " + d[10].y + " }", canvas.width - 175, 100);
  // ctx.fillText(
  //   "{ " + (d[10].x + Card.width) + ", " + (d[10].y + Card.height) + " }",
  //   canvas.width - 175,
  //   120
  // );
  ctx.restore();
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
  buttons.forEach((butt) => {
    if (butt.highlight) {
      if (butt.text === "shuffle") {
        console.log("running shuffle");
        d = shuffle(d);
      } else {
        console.log("drawing");
        let c = d.pop();

        let x = 120 * (table.length % 4) + 250;
        let y = 120 * Math.floor(table.length / 4) + 120;
        c.setPos(x, y);
        table.push(c);

        // ((table.length % 5) + 1);
      }
    }
  });
});
