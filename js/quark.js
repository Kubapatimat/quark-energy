class Quark {
  constructor(color, R, x, y, updateCallback, clickCallback) {
    this.group = new Konva.Group({
      x: x,
      y: y,
      rotation: 0,
      draggable: true
    });

    const quark_ball = new Konva.Circle({
      x: 0,
      y: -R,
      radius: R,
      fill: color,
      name: "quark"
    });

    const quark_arrow = new Konva.Arrow({
      x: 0,
      y: -R,
      points: [0, R, 0, -R + 6],
      pointerLength: 16,
      pointerWidth: 12,
      fill: "black",
      stroke: "black",
      strokeWidth: 4,
      name: "quark"
    });
    
    const quark_arrow_origin = new Konva.Circle({
      x: 0,
      y: 0,
      radius: 4,
      fill: "black",
      name: "quark"
    })

    this.group.add(quark_ball);
    this.group.add(quark_arrow);
    this.group.add(quark_arrow_origin);

    this.group.on("transform dragmove", (e) => updateCallback(e, this.group));
    this.group.on("click tap", (e) => clickCallback(e, this.group));
    this.group.on("dragend", (e) => {
      this.group.position({
        x: Math.round(this.group.x() / 25) * 25,
        y: Math.round(this.group.y() / 25) * 25
      });
      updateCallback(e, this.group);
    })

    return this.group;
  }
}

export default Quark
