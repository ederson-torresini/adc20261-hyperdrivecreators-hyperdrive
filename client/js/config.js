var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 500,
  fps: {
    target: 15,
    foreceSetTimeOut: true,
  },

  input: {
    gamepad: true,
    activePointers: 3,
  },

  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  
};
export default config;