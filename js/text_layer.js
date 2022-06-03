class TextLayer {
  constructor(calculatedEnergy, selectedQuark) {
    this.layer = new Konva.Layer();
    this.energyText = new Konva.Text({
      x: 50,
      y: 50,
      id: "energyText",
      fontSize: 36,
      fontFamily: "Arial",
      fill: "black",
    });
    this.layer.add(this.energyText);
    this.updateEnergy(calculatedEnergy);

    this.quarkInfoText = new Konva.Text({
      x: 50,
      y: 100,
      id: "quarkInfoText",
      fontSize: 36,
      fontFamily: "Arial",
      fill: "black",
    });
    this.layer.add(this.quarkInfoText);
    this.updateQuarkInfo(selectedQuark);
  }

  updateEnergy(calculatedEnergy) {
    const formatter = new Intl.NumberFormat("pl-PL", {
      minimumFractionDigits: 6,
      maximumFractionDigits: 6,
    });

    const energyText = this.layer.find("#energyText")[0];
    energyText.setAttr("text", `Energia: ${formatter.format(calculatedEnergy)}`);
    this.layer.draw();
  }

  updateQuarkInfo(selectedQuark) {
    const energyText = this.layer.find("#quarkInfoText")[0];
    if (selectedQuark === null) {
      energyText.visible(false);
      return
    }

    energyText.visible(true);
    const formatter = new Intl.NumberFormat("pl-PL", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const mod = (m, n) => ((m % n) + n) % n

    energyText.setAttr("text", `Pozycja: (${formatter.format(selectedQuark.x())}, ${formatter.format(selectedQuark.y())}), rotacja: ${formatter.format(mod(-selectedQuark.rotation() + 90, 360))}`);
    this.layer.draw();
  }
}

export default TextLayer