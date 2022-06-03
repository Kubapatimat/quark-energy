class SelectionLayer {
  constructor() {
    this.layer = new Konva.Layer();
    this.rect = new Konva.Rect({
      fill: 'rgba(0, 0, 255, 0.3)',
      visible: false,
    });
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.layer.add(this.rect);
  }
}

export default SelectionLayer