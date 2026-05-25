class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: "Gameover" });
  }

  init() {
    let room = new URLSearchParams(window.location.search).get("room");
    if (room) {
      this.game.room = room;
      this.game.socket.emit("join-room", this.game.room);
    }
  }

  create() {
    // Adicionar imagem de game over como fundo cobrindo toda a tela
    const gameOverImage = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      "gameover",
    );
    gameOverImage.setScrollFactor(0);
    gameOverImage.setDisplaySize(
      this.cameras.main.width,
      this.cameras.main.height,
    );
  }
}

export default GameOver;
