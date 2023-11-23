import Card from "./card";
import { FillType, ShapeType } from "./shape";
import "./style.css";

// class Deck {
//   constructor()
// }

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

colors.forEach((color, c_index) => {
  let color_x = c_index * 300;
  Object.values(ShapeType).forEach((shapeType) => {
    let shape_y = shapeType * 300;
    Object.values(FillType).forEach((fillType) => {
      let fill_x = fillType * 100;
      [1, 2, 3].forEach((count) => {
        let card = new Card(count, color, fillType, shapeType, {});
        card.setPos(color_x + fill_x, shape_y + (count - 1) * 100);
        console.log(card.x, card.y);
        card.draw(ctx);
      });
    });
  });
});
