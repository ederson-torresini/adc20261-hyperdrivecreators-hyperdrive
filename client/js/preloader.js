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

    this.load.image("tela", "tela.png");
    this.load.image("start", "starbuton.png");
    this.load.image("room-background", "room-background.png");
    this.load.spritesheet("navejogador1", "navejogador1.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("navejogador2", "navejogador2.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image("nave-inimiga", "nave.inimiga.png");
    this.load.image("bala", "bala.png");
    this.load.image("explosao", "explosão.png");
    this.load.image("turbo", "turbo.png");
    this.load.image("asteroid", "Asteroid.png");
    this.load.image("mapa", "mapahyperdrive.png");
    this.load.audio("musica", "musicafundo.mp3");
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
