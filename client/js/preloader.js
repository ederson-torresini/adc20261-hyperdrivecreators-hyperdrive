class Preloader extends Phaser.Scene {
  constructor() {
    super({ key: "Preloader" });
  }

  init() {
    this.add.image(400, 250, "tela").setScale(0.9);
    this.add.rectangle(400, 300, 468, 32).setStrokeStyle(1, 0xffffff);
    this.progressBar = this.add.rectangle(170, 300, 4, 28, 0xffffff);

    this.load.on("progress", (progress) => {
      this.progressBar.width = 4 + 460 * progress;
    });
  }

  preload() {
    this.load.setPath("assets/");
    this.load.image("gameover", "telagameover.png");
    this.load.image("tela", "tela.png");
    this.load.image("start", "starbuton.png");
    this.load.image("room-background", "room-background.png");
    this.load.spritesheet("navejogador1", "navejogador1.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("navejogador2", "navejogador2.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("policia", "nave.inimiga.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("explosao", "explosão.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.image("barreira", "barreira.png");
    this.load.image("escudo", "escudo.png");
    this.load.image("turbo", "turbo.png");
    this.load.image("asteroid", "Asteroid.png");
    this.load.image("mapa", "mapahyperdrive.png");
    this.load.audio("musica", "musicafundo.mp3");
    this.load.plugin("rexvirtualjoystickplugin", "../js/rexvirtualjoystickplugin.min.js", true);
  }

  create() {
    this.scene.stop("Preloader");
    if (this.game.room) {
      this.scene.start("player");
    } else {
      this.scene.start("room");
    }
  }
}
export default Preloader;
