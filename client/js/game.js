import config from "./config.js";
import scene0 from "./scene0.js";
import TelaInicial from "./tela.js";
import Preloader from "./preloader.js";
import room from "./room.js";
import player from "./player.js";

class Game extends Phaser.Game {
  constructor() {
    super(config);

    this.scene.add("Preloader", Preloader);
    this.scene.add("TelaInicial", TelaInicial);
    this.scene.add("scene0", scene0);
    this.scene.add("room", room);
    this.scene.add("player", player);
    this.scene.start("TelaInicial"); // Inicia com a tela inicial

    if (location.hostname.match(/localhost|127\.0\.0\.1/)) {
      this.socket = io("http://localhost:3000");
    } else if (location.hostname.match(/github\.dev/)) {
      this.socket = io(location.hostname.replace("8080", "3000"));
    } else {
      this.socket = io();
    }

    this.socket.on("connect", () => {
      console.log("Socket ID:", this.socket.id);

      this.socket.on("change-scene", (scene) => {
        let currentScene = this.scene.scenes.find((s) =>
          s.scene.isActive(),
        ).scene.key

        if (currentScene !== scene) {
          console.log("Changing scene to:", scene);
          this.scene.stop(currentScene);
          this.scene.start(scene);
        }
      });
    });
  }
}

window.onload = () => {
  window.game = new Game();
};
