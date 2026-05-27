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
      frames: this.anims.generateFrameNumbers("navejogador1", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "navejogador2",
      frames: this.anims.generateFrameNumbers("navejogador2", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.navejogador1 = this.add
      .sprite(300, 225, "navejogador1")
      .setOrigin(0.5)
      .setDisplaySize(120, 120)
      .setInteractive()
      .on("pointerdown", () => {
        this.startGame("navejogador1");
      });
    this.navejogador1.play("navejogador1");

    this.navejogador2 = this.add
      .sprite(550, 225, "navejogador2")
      .setOrigin(0.5)
      .setDisplaySize(120, 120)
      .setInteractive()
      .on("pointerdown", () => {
        this.startGame("navejogador2");
      });
    this.navejogador2.play("navejogador2");
  }

  startGame(player) {
    console.log("Jogador selecionado:", player);
    this.game.localPlayer = player;

    let asteroids = [];
    for (let x = 0; x < 50; x++) {
      asteroids.push({
        x: Math.random(),
        y: Math.random(),
      });
    }

    this.game.socket.emit("start-game", this.game.room, player, asteroids);

    this.scene.stop("player");
    this.scene.start("scene0", asteroids);
  }
}

export default player;
