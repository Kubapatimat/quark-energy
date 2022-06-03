class Canvas {
  constructor(container, width, height) {
    this.stage = new Konva.Stage({
      container,
      width,
      height,
    });
  }
}

export default Canvas