import Card from "./card";
import { FillType, ShapeType } from "./shape";
import colors from "./colors";

class Deck extends Array {
  constructor() {
    super();
    colors.forEach((color, c_index) => {
      Object.values(ShapeType).forEach((shapeType) => {
        Object.values(FillType).forEach((fillType) => {
          [1, 2, 3].forEach((count) => {
            let card = new Card(count, c_index, fillType, shapeType, {});
            card.setPos(-100, -100);
            // card.draw(ctx);
            this.push(card);
          });
        });
      });
    });
    this.backface = Card.Back;
  }

  drawOne() {
    return this.pop();
  }

  draw(ctx, x, y) {
    this.backface.setPos(x, y);
    this.backface.draw(ctx);
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
export default Deck;
