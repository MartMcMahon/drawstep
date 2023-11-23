import Shape from "./shape";

const grey = { r: 127, g: 127, b: 127, a: 1 };
const red = { r: 200, g: 0, b: 0, a: 1 };
const green = { r: 0, g: 200, b: 0, a: 1 };
const purple = { r: 100, g: 0, b: 100, a: 1 };
const colors = [green, red, purple];


class Card {
  static width = 50;
  static height = 80;
  static spacer = 25;
  static render_offset = 5;
  static backgroundColor = "rgba(180, 180, 180, 1)";

  constructor(count, color_index, fillType, shape) {
    Object.assign(this, { count, color_index, fillType, shape });
    this.x = 0;
    this.y = 0;

    this.shapeSprites = [];
    for (let i = 0; i < count; i++) {
      this.shapeSprites.push(
        new Shape(this.x, this.y + i * Card.spacer, { color: colors[color_index], fillType, shape })
      );
    }
  }

  setPos(x, y) {
    Object.assign(this, { x, y });
    this.shapeSprites.forEach((shape, i) => {
      shape.x = x + Card.render_offset;
      shape.y = y + i * Card.spacer + Card.render_offset;
    });
  }

  draw(ctx) {
    const NORTH = -0.5 * Math.PI;
    const EAST = 0;
    const SOUTH = 0.5 * Math.PI;
    const WEST = Math.PI;

    let cornRad = Card.height / 20;
    ctx.beginPath();
    let p = [
      { x: this.x, y: this.y + cornRad },
      { x: this.x + cornRad, y: this.y },
      { x: this.x + Card.width - cornRad, y: this.y },
      { x: this.x + Card.width, y: this.y + cornRad },
      { x: this.x + Card.width, y: this.y + Card.height - cornRad },
      { x: this.x + Card.width - cornRad, y: this.y + Card.height },
      { x: this.x + cornRad, y: this.y + Card.height },
      { x: this.x, y: this.y + Card.height - cornRad },
    ];
    ctx.moveTo(p[0].x, p[0].y);
    ctx.arc(p[1].x, p[0].y, cornRad, WEST, NORTH);
    ctx.lineTo(p[2].x, p[2].y);
    ctx.arc(p[2].x, p[3].y, cornRad, NORTH, EAST);
    ctx.lineTo(p[4].x, p[4].y);
    ctx.arc(p[5].x, p[4].y, cornRad, EAST, SOUTH);
    ctx.lineTo(p[6].x, p[6].y);
    ctx.arc(p[6].x, p[7].y, cornRad, SOUTH, WEST);
    ctx.closePath();
    ctx.strokeStyle = `rgba(20, 20, 20, 1)`;
    ctx.stroke();
    ctx.fillStyle = Card.backgroundColor;
    ctx.fill();
    this.shapeSprites.forEach((shape) => {
      shape.draw(ctx);
      shape.ink(ctx);
    });
  }
}
export default Card;
