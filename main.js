import "./style.css";
import javascriptLogo from "./javascript.svg";
import viteLogo from "/vite.svg";

const ShapeType = Object.freeze({
  Diamond: 0,
  Squiggle: 1,
  Oval: 2,
});

class Shape {
  constructor(x, y, params) {
    Object.assign(this, { x, y, ...params });
    this.width = params.width || 20;
    this.height = params.height || 10;
    this.color = params.color || { r: 100, b: 100, g: 100, a: 1 };
    this.shape = params.shape || ShapeType.Diamond;
    this.fillType = params.fillType || FillType.Empty;

    // console.log(this);
  }

  draw(ctx) {
    switch (this.shape) {
      case ShapeType.Diamond:
        drawDiamond(ctx, this.x, this.y);
        break;
      case ShapeType.Squiggle:
        drawSquiggle(ctx, this.x, this.y);
        break;
      case ShapeType.Oval:
        drawOval(ctx, this.x, this.y, this.color, this.fill_type);
        break;
      default:
        break;
    }
  }
  ink(ctx) {
    let { r, g, b, a } = this.color;
    let color = `rgba(${r}, ${g}, ${b}, ${a})`;
    switch (this.fillType) {
      case FillType.Empty:
        ctx.strokeStyle = color;
        ctx.stroke();
        break;
      case FillType.Shade:
        ctx.fillStyle = color;
        ctx.fill();
        for (let i = 0; i < this.width * 2; i = i + this.width / 10) {
          ctx.clearRect(this.x + i, this.y, this.width / 20, this.height * 2);
        }
        this.fillType = FillType.Empty;
        this.draw(ctx);
        this.ink(ctx);
        this.fillType = FillType.Shade;
        break;
      case FillType.Full:
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.fill();
        break;
      default:
        console.error("invalid fill type");
        break;
    }
  }
}

class Card {
  static padding_space = 10;

  constructor(count, color, fillType, shape) {
    Object.assign(this, { count, color, fillType, shape });
    this.x = 0;
    this.y = 0;

    let spacer = 30;
    // console.log(this);
    this.shapeSprites = [];
    for (let i = 0; i < count; i++) {
      this.shapeSprites.push(
        new Shape(this.x, this.y + i * spacer, { color, fillType, shape })
      );
    }
  }

  setPos(x, y) {
    let spacer = 30;
    Object.assign(this, { x, y });
    this.shapeSprites.forEach((shape, i) => {
      shape.x = x;
      shape.y = y + i * spacer;
    });
  }

  draw(ctx) {
    this.shapeSprites.forEach((shape) => {
      shape.draw(ctx);
      shape.ink(ctx);
    });
  }
}

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
const FillType = {
  Empty: 0,
  Shade: 1,
  Full: 2,
};

colors.forEach((color, c_index) => {
  let color_x = c_index * 300;
  Object.values(ShapeType).forEach((shapeType) => {
    let shape_y = shapeType * 300;
    Object.values(FillType).forEach((fillType) => {
      let fill_x = fillType * 100;
      [1, 2, 3].forEach((count) => {
        let card = new Card(count, color, fillType, shapeType, {});
        card.setPos(color_x + fill_x, shape_y + ( count-1 ) * 100);
        console.log(card.x, card.y);
        card.draw(ctx);
       });
    });
  });
});


function drawOval(ctx, x, y, color, fill_type) {
  let width = 40;
  let height = 20;

  //.3125, .375
  let p = [
    { x: x + width * 0.3125, y: y },
    { x: x + width - width * 0.3125, y: y },
    { x: x + width - width * 0.3125, y: y + height },
    { x: x + width * 0.3125, y: y + height },
  ];

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(p[0].x, p[0].y);
  ctx.lineTo(p[1].x, p[1].y);
  ctx.bezierCurveTo(
    x + (width * 11) / 10,
    y,
    x + (width * 11) / 10,
    y + height,
    p[2].x,
    p[2].y
  );
  ctx.lineTo(p[3].x, p[3].y);
  ctx.bezierCurveTo(
    x - width / 10,
    y + height,
    x - width / 10,
    y,
    p[0].x,
    p[0].y
  );
  ctx.closePath();
}

function drawSquiggle(ctx, x, y) {
  let width = 40;
  let height = 20;
  let p = [
    { x: x + width / 10, y: y + height },
    { x: x + width / 2, y: y + height / 5 },
    { x: x + (width * 9) / 10, y: y },
    { x: x + width / 2, y: y + (height * 4) / 5 },
  ];
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(p[0].x, p[0].y);
  ctx.bezierCurveTo(
    x - width / 5,
    y + height / 2,
    x,
    y - height / 4,
    p[1].x,
    p[1].y
  );
  ctx.bezierCurveTo(
    x + (width * 5) / 6,
    y + (height * 4) / 5,
    x + (width * 9) / 8,
    y + height / 6,
    p[2].x,
    p[2].y
  );
  ctx.bezierCurveTo(
    x + (width * 6) / 5,
    y + height / 2,
    x + width,
    y + (height * 5) / 4,
    p[3].x,
    p[3].y
  );

  ctx.bezierCurveTo(
    x + width / 6,
    y + height / 5,
    x - width / 8,
    y + (height * 5) / 6,
    p[0].x,
    p[0].y
  );
  ctx.closePath();
}

function drawDiamond(ctx, x, y) {
  let width = 40;
  let height = 20;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y + height / 2);
  ctx.lineTo(x + width / 2, y);
  ctx.lineTo(x + width, y + height / 2);
  ctx.lineTo(x + width / 2, y + height);
  ctx.closePath();
}

function ink(ctx, color, fill_type) {
  let { r, g, b, a } = color;
  color = `rgba(${r}, ${g}, ${b}, ${a})`;
  switch (fill_type) {
    case FillType.Empty:
      ctx.strokeStyle = color;
      ctx.stroke();
      break;
    // case FillType.Shade:
    //   ctx.fillStyle = color;
    //   ctx.fill();
    //   break;
    case FillType.Full:
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.fill();
      break;
    default:
      console.error("invalid fill type");
      break;
  }
}
