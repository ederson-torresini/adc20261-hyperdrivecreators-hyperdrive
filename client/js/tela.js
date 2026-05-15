class TelaInicial extends Phaser.Scene {
  constructor() {
    super({ key: "TelaInicial" });
  }

  init() {
    let room = new URLSearchParams(window.location.search).get("room");
    if (room) {
      this.game.room = room;
      this.game.socket.emit("join-room", this.game.room);
    }
  }

  preload() {
    this.load.image("tela", "assets/tela.png");
    this.load.image("start", "assets/starbuton.png");
  }

  create() {
    this.add.image(400, 250, "tela").setScale(0.9);

    this.add
      .image(400, 225, "start")
      .setScale(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.stop("TelaInicial");
        this.scene.start("Preloader");
      });
  }
}

export default TelaInicial;
