class room extends Phaser.Scene {
  constructor() {
    super("room");
    this.qrcodeContainer = document.getElementById("qr-code");
  }

  create() {
    this.add.image(400, 250, "room-background");
    this.game.room = (Math.random() * 10000).toString().split(".")[0];
    this.add.text(50, 50, this.game.room, {
      fontFamily: "pixelify-sans",
      fontSize: "32px",
      fill: "#000000",
    });

    new QRCode(this.qrcodeContainer, {
      text: location.href + "?room=" + this.game.room,
      width: 450,
      height: 450,
    });

    console.log("Joining room:", this.game.room);
    this.game.socket.emit("join-room", this.game.room);

    this.game.socket.on("game-started", ({player, asteroids}) => {
      console.log(
        "Jogo iniciado na sala:",
        this.game.room,
        "player:",
        player,
      );

      if (player === "navejogador1") this.game.localPlayer = "navejogador2";
      else this.game.localPlayer = "navejogador1";

      this.qrcodeContainer.remove();

      this.scene.stop("room");
      this.scene.start("scene0", asteroids);
    });
  }
}

export default room;
