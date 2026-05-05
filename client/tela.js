class TelaInicial extends Phaser.Scene {
  constructor() {
    super({ key: "TelaInicial" });
  }

  preload() {
  this.load.image("tela", "assets/tela.png");
    this.load.image("start", "assets/starbuton.png");
  }

  create() {
    this.add.image(400, 250, "tela").setScale(0.9);
  
   this.add.image(400, 225, "start").setScale(0.5).setInteractive().on("pointerdown", () => {
      this.scene.start("scene0");
    });
   
  }
  update() {
    // Lógica de atualização, se necessário (ex: animações)
  }
}

export default TelaInicial;
