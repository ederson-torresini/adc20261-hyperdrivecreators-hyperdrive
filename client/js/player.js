class player extends Phaser.Scene {
  constructor() {
    super("player");
  }

  create() {
    this.add.image(400, 225, "start-background").postFX.addBlur(5);

    this.add
      .text(400, 50, "Escolha seu personagem:", {
        fontFamily: "pixelify-sans",
        fontSize: "64px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    this.anims.create({
      key: "navejogador1",
      frames: this.anims.generateFrameNumbers("navejogador1", { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "navejogador2",
      frames: this.anims.generateFrameNumbers("navejogador2", {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.navejogador1 = this.add
      .sprite(300, 225, "navejogador1")
      .setScale(3)
      .setInteractive()
      .on("pointerdown", () => {
        console.log("Nave jogador 1 selected");
        this.game.localPlayer = "navejogador1";
        this.game.socket.emit(
          "select-player",
          this.game.room,
          this.game.localPlayer,
        );
        this.scene.stop("player");
        this.scene.start("scene0");
      });
    this.navejogador1.play("navejogador1");

    this.navejogador2 = this.add
      .sprite(550, 225, "navejogador2")
      .setScale(3)
      .setInteractive()
      .on("pointerdown", () => {
        console.log("Nave jogador 2 selected");
        this.game.localPlayer = "navejogador2";
        this.game.socket.emit(
          "select-player",
          this.game.room,
          this.game.localPlayer,
        );
        this.scene.stop("player");
        this.scene.start("scene0");
      });
    this.navejogador2.play("navejogador2");
  }
}

export default player;
