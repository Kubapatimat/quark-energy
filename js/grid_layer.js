class GridLayer {
  constructor() {
    this.layer = new Konva.Layer()
  }

  drawGrid(canvas, gap) {
    const width = canvas.stage.width()
    const height = canvas.stage.height()

    for (let i = 0; i < width / gap; i++) {
      // Vertical lines
      this.layer.add(new Konva.Line({
        points: [Math.round(i * gap) + 0.5, 0, Math.round(i * gap) + 0.5, height],
        stroke: '#bbb',
        strokeWidth: 1,
      }));
    }
    
    // Horizontal lines
    for (let j = 0; j < height / gap; j++) {
      this.layer.add(new Konva.Line({
        points: [0, Math.round(j * gap), width, Math.round(j * gap)],
        stroke: '#bbb',
        strokeWidth: 0.5,
      }));
    }
  }
}

export default GridLayer