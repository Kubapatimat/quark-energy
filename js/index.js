import Canvas from "./canvas.js"
import GridLayer from "./grid_layer.js";
import QuarkLayer from "./quark_layer.js"
import TransfomerLayer from "./transformer_layer.js";
import SelectionLayer from "./selection_layer.js";
import TextLayer from "./text_layer.js";

const keys = {"1": false, "2": false, "3": false}
const energyFunctionTextarea = document.getElementById("energyFunctionTextarea")
energyFunctionTextarea.value = `
function (quarks) {
  let sum = 0;
  for (const q1 of quarks) {
    for (const q2 of quarks) {
      sum += Math.cos(
        radians(q1.angle - q2.angle)
      ) / (1 + Math.hypot(q1.x - q2.x, q1.y - q2.y));
    }
  }
  return sum;
};
`


const quarks_decorator = (quarks) => quarks.map(quark => ({x: quark.x(), y: quark.y(), angle: quark.rotation()}))
let energy_lambda = new Function("const radians = (degrees) => degrees * Math.PI / 180; let fn = " + energyFunctionTextarea.value + "; return fn")()
let energy = (quarks) => energy_lambda(quarks_decorator(quarks))

document.getElementById("submitFunction").addEventListener("click", () => {
  energy_lambda = new Function("const radians = (degrees) => degrees * Math.PI / 180; let fn = " + energyFunctionTextarea.value + "; return fn")()
  energy = (quarks) => energy_lambda(quarks_decorator(quarks))
  textLayer.updateEnergy(energy(quarkLayer.quarks));
})


const canvas = new Canvas("container", window.innerWidth, window.innerHeight);
const gridLayer = new GridLayer();
gridLayer.drawGrid(canvas, 25)
const quarkLayer = new QuarkLayer();
const transformerLayer = new TransfomerLayer();
const selectionLayer = new SelectionLayer()
const textLayer = new TextLayer(energy(quarkLayer.quarks), null);

const energyUpdater = () =>
textLayer.updateEnergy(energy(quarkLayer.quarks));
const quarkInfoUpdater = (quark) => {
  if(transformerLayer.tr.nodes().length !== 1) {
    textLayer.updateQuarkInfo(null);
  } else {
    textLayer.updateQuarkInfo(quark)
  }
}


// Selection start
canvas.stage.on('mousedown touchstart', (e) => {
  if (e.target !== canvas.stage || e.evt.button === 2) {
    return;
  }
  e.evt.preventDefault();

  selectionLayer.x1 = canvas.stage.getPointerPosition().x;
  selectionLayer.y1 = canvas.stage.getPointerPosition().y;
  selectionLayer.x2 = canvas.stage.getPointerPosition().x;
  selectionLayer.y2 = canvas.stage.getPointerPosition().y;

  selectionLayer.rect.visible(true);
  selectionLayer.rect.width(0);
  selectionLayer.rect.height(0);
});

// Selection move
canvas.stage.on('mousemove touchmove', (e) => {
  if (!selectionLayer.rect.visible() || e.evt.button === 2) {
    return;
  }
  e.evt.preventDefault();

  selectionLayer.x2 = canvas.stage.getPointerPosition().x;
  selectionLayer.y2 = canvas.stage.getPointerPosition().y;

  selectionLayer.rect.setAttrs({
    x: Math.min(selectionLayer.x1, selectionLayer.x2),
    y: Math.min(selectionLayer.y1, selectionLayer.y2),
    width: Math.abs(selectionLayer.x2 - selectionLayer.x1),
    height: Math.abs(selectionLayer.y2 - selectionLayer.y1),
  });
});

// Selection end
canvas.stage.on('mouseup touchend', (e) => {
  if (!selectionLayer.rect.visible() || e.evt.button === 2) {
    return;
  }
  e.evt.preventDefault();

  const box = selectionLayer.rect.getClientRect();
  const selected = quarkLayer.quarks.filter((shape) =>
    Konva.Util.haveIntersection(box, shape.getClientRect())
  );
  transformerLayer.setNodes(selected)
  quarkInfoUpdater(transformerLayer.tr.nodes()[0])

  selectionLayer.rect.visible(false);
  selectionLayer.x1 = 0
  selectionLayer.y1 = 0
  selectionLayer.x2 = 0
  selectionLayer.y2 = 0
});


canvas.stage.on("contextmenu", (e) => {
  e.evt.preventDefault()

  const clickCallback = (e, quark) => {
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = transformerLayer.tr.nodes().indexOf(quark) >= 0;
  
    if (!metaPressed && !isSelected) {
      transformerLayer.setNodes([quark]);
    } else if (metaPressed && isSelected) {
      const nodes = transformerLayer.tr.nodes().slice();
      nodes.splice(nodes.indexOf(quark), 1);
      transformerLayer.setNodes(nodes);
    } else if (metaPressed && !isSelected) {
      const nodes = transformerLayer.tr.nodes().concat([quark]);
      transformerLayer.setNodes(nodes);
    }

    quarkInfoUpdater(quark)
  }

  let color = ""
  if (keys["1"]) {
    // Red
    color = "rgba(250, 107, 107, 0.4)"
  }
  else if (keys["2"]) {
    // Green
    color = "rgba(133, 247, 129, 0.4)"
  }
  else if (keys["3"]) {
    // Blue
    color = "rgba(119, 217, 247, 0.4)"
  }
  else {
    // Gray
    color = "rgba(120, 117, 118, 0.4)"
  }
  quarkLayer.addQuark(color, (_e, quark) => {energyUpdater(); quarkInfoUpdater(quark)}, clickCallback);

  energyUpdater();
});

const container = canvas.stage.container()
container.tabIndex = 1
container.focus()

container.addEventListener("keydown", (e) => {
  // Delete
  if (e.keyCode === 46) {
    const quarks = quarkLayer.quarks.filter((quark) => transformerLayer.tr.nodes().map(node => node._id).indexOf(quark._id) === -1)

    if (quarks.length !== quarkLayer.quarks.length) {
      transformerLayer.setNodes([])
      quarkLayer.quarks = quarks
      quarkLayer.layer.removeChildren()
      for (const quark of quarks) {
        quarkLayer.layer.add(quark)
      }
      energyUpdater()
      quarkInfoUpdater(null)
    }
  }

  if (e.keyCode === 49) {
    keys["1"] = true
  }
  if (e.keyCode === 50) {
    keys["2"] = true
  }
  if (e.keyCode === 51) {
    keys["3"] = true
  }
})

container.addEventListener("keyup", (e) => {
  if (e.keyCode === 49) {
    keys["1"] = false
  }
  if (e.keyCode === 50) {
    keys["2"] = false
  }
  if (e.keyCode === 51) {
    keys["3"] = false
  }
})

canvas.stage.add(gridLayer.layer);
canvas.stage.add(quarkLayer.layer);
canvas.stage.add(transformerLayer.layer);
canvas.stage.add(selectionLayer.layer);
canvas.stage.add(textLayer.layer);