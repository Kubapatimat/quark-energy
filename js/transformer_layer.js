class TransfomerLayer {
  constructor() {
    this.layer = new Konva.Layer();
    this.tr = new Konva.Transformer({
      nodes: [],
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      rotationSnaps: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
    });
    this.layer.add(this.tr);
  }

  setNodes(nodes) {
    this.tr.nodes(nodes)
  }
}

export default TransfomerLayer