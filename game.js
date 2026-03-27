import config from "./config.js";
import scene0 from "./scene0.js";
import TelaInicial from "./tela.js";

class Game extends Phaser.Game {
  constructor() {
    super(config);

    this.scene.add("TelaInicial", TelaInicial);
    this.scene.add("scene0", scene0);
    this.scene.start("TelaInicial"); // Inicia com a tela inicial
  }
}

window.onload = () => {
  window.game = new Game();
};
