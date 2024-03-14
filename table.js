import Card from "./card";

class Table extends Array {
  constructor() {
    // for (let i = 0;i < 12; i++) {
    //   let c = deck.pop();
    //   c.setTableIndex(i);
    //   this.push(c);
    // }
    super();
  }

  static fromServer(tableData) {
    let t = new Table();
    tableData.forEach((c, i) => {
      let card = new Card(c.count, c.color_index, c.fillType, c.shape);
      t.push(card);
      card.setTableIndex(i);
    });
    return t;
  }

  // draw table
  draw(ctx) {
    this.forEach((c) => {
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
  }
}
export default Table;
