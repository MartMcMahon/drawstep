import "./style.css";
import javascriptLogo from "./javascript.svg";
import viteLogo from "/vite.svg";

let canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.querySelector("#app").appendChild(canvas);
let ctx = canvas.getContext("2d");
drawDiamond(ctx, 100, 100);
drawSquiggle(ctx, 150, 100);
drawOval(ctx, 200, 100);

function drawOval(ctx, x, y) {
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

  ctx.strokeStyle = "purple";
  ctx.stroke();
  ctx.closePath();
}

function drawSquiggle(ctx, x, y) {
  let width = 40;
  let height = 20;
  let p = [
    { x: x, y: y + height },
    { x: x + width / 2, y: y + height / 5 },
    { x: x + width, y: y },
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

  ctx.strokeStyle = "green";
  ctx.stroke();
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
  ctx.fillStyle = "red";
  ctx.fill();
}
