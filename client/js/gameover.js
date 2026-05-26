class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: "Gameover" });
  }

  init(data) {
    this.elapsedTime = data?.elapsedTime ?? 0;

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

    const minutes = Math.floor(this.elapsedTime / 60);
    const seconds = this.elapsedTime % 60;
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      seconds,
    ).padStart(2, "0")}`;

    this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 + 80,
        `Tempo jogado: ${formattedTime}`,
        {
          fontSize: "32px",
          fill: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4,
        },
      )
      .setOrigin(0.5)
      .setScrollFactor(0);
  }
}

export default GameOver;
