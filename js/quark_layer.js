import Quark from "./quark.js";

class QuarkLayer {
  constructor() {
    this.layer = new Konva.Layer();
    this.quarks = [];
  }

  addQuark(color, updateCallback, clickCallback) {
    const radius = 50;
    const pos = this.layer.getRelativePointerPosition();
    const quark = new Quark(color, radius, pos.x, pos.y, updateCallback, clickCallback);
    this.quarks.push(quark);
    this.layer.add(quark);
  }
}

export default QuarkLayer