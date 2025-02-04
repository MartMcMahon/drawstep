import Card from "./card";
import { FillType, ShapeType } from "./shape";
import colors from "./colors";
import RNG from "./rng";

class Deck extends Array {
  constructor(seed) {
    super();
    colors.forEach((color, c_index) => {
      Object.values(ShapeType).forEach((shapeType) => {
        Object.values(FillType).forEach((fillType) => {
          [1, 2, 3].forEach((count) => {
            let card = new Card(count, c_index, fillType, shapeType, {});
            card.setPos(-100, -100);
            this.push(card);
          });
        });
      });
    });
    this.backface = Card.Back;

    this.rng = new RNG(seed);
  }

  static fromServer(o) {
    let d = new Deck();
    d.splice(0, o.length);
    o.forEach((c, i) => {
      let card = new Card(c.count, c.color_index, c.fillType, c.shape, {});
      d.push(card);
    });
    return d;
  }

  drawOne() {
    return this.pop();
  }

  draw(ctx, x, y) {
    let c = Card.Back();
    c.setPos(x, y);
    c.draw(ctx);
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

  shuffle() {
    let m = this.length,
      t,
      i;

    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(this.rng.random() * m--);

      // And swap it with the current element.
      t = this[m];
      this[m] = this[i];
      this[i] = t;
    }
  }
}
export default Deck;
