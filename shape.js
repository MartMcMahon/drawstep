import Card from "./card";

const FillType = Object.freeze({
  Empty: 0,
  Shade: 1,
  Full: 2,
});

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
        ctx.save();
        ctx.strokeStyle = color;
        ctx.stroke();
        break;
      case FillType.Shade:
        ctx.fillStyle = color;
        ctx.fill();
        for (let i = 0; i < this.width * 2; i = i + this.width / 10) {
          ctx.clearRect(this.x + i, this.y, this.width / 20, this.height * 2);
          ctx.beginPath();
          ctx.rect(this.x + i, this.y, this.width / 20, this.height * 2);
          ctx.closePath();
          ctx.fillStyle = Card.backgroundColor;
          ctx.fill();
        }
        ctx.fillStyle = color;
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
export default Shape;
export { FillType, ShapeType };
