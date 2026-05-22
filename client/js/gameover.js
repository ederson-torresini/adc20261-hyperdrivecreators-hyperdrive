class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: "GameOver" });
  }

  init() {
    let room = new URLSearchParams(window.location.search).get("room");
    if (room) {
      this.game.room = room;
      this.game.socket.emit("join-room", this.game.room);
    }
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
