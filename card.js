import colors from "./colors";
import Shape from "./shape";

class Card {
  static width = 50;
  static height = 80;
  static spacer = 25;
  static render_offset = 5;
  static backgroundColor = "snow";

  constructor(count, color_index, fillType, shape) {
    Object.assign(this, { count, color_index, fillType, shape });
    this.x = 0;
    this.y = 0;

    this.shapeSprites = [];
    for (let i = 0; i < count; i++) {
      this.shapeSprites.push(
        new Shape(this.x, this.y + i * Card.spacer, {
          color: colors[color_index],
          fillType,
          shape,
        })
      );
    }
  }

  clone() {
    return new Card(this.count, this.color_index, this.fillType, this.shape);
  }

  setPos(x, y) {
    Object.assign(this, { x, y });
    this.shapeSprites.forEach((shape, i) => {
      shape.x = x + Card.render_offset;
      shape.y = y + i * Card.spacer + Card.render_offset;
    });
  }

  setTableIndex(i) {
    let x = (Card.width + Card.spacer + 10) * (i % 3) + 60;
    let y = (Card.height + Card.spacer) * Math.floor(i / 3) + 120;
    this.setPos(x, y);
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

  static Back() {
    let c = new Card(0, 0, 0, 0);
    c.shapeSprites = [];
    return c;
  }
}
export default Card;
