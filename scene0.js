class scene0 extends Phaser.Scene {
  constructor() {
    super("scene0");

    this.threshold = 0.1;
    this.speed = 400;
    this.direction = undefined;
    this.money = 0;
    this.timer = 0;
  }

  preload() {
    this.load.image("mapa", "assets/mapahyperdrive.png");

    this.load.spritesheet("nave", "assets/nave.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    
    this.load.plugin(
      "rexvirtualjoystickplugin",
      "rexvirtualjoystickplugin.min.js",
      true,
    );
    this.load.audio("dinheiro", "assets/dinheiro.mp3");
  }

  create() {
    const worldWidth = 3200;
    const worldHeight = 1925;
    this.add
      .tileSprite(0, 0, worldWidth, worldHeight, "mapa")
      .setOrigin(0)
      .setDepth(-1);

    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

    this.dinheiro = this.sound.add("dinheiro");

    this.anims.create({
      key: "walk-up",
      frames: this.anims.generateFrameNumbers("nave", { start: 0, end:3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-left",
      frames: this.anims.generateFrameNumbers("nave", { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers("nave", { start: 12, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-down",
      frames: this.anims.generateFrameNumbers("nave", { start: 8, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });

    this.nave = this.physics.add.sprite(400, 225, "nave", 20);
    this.nave.setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.nave, true, 0.1, 0.1);

    this.joystick = this.plugins.get("rexvirtualjoystickplugin").add(this, {
      x: 100,
      y: 350,
      radius: 50,
      base: this.add.circle(0, 0, 50, 0xcccccc),
      thumb: this.add.circle(0, 0, 25, 0x666666),
    });

    this.joystick.on("update", () => {
      const angle = Phaser.Math.DegToRad(this.joystick.angle);
      const force = this.joystick.force;

      if (force > this.threshold) {
        this.direction = new Phaser.Math.Vector2(
          Math.cos(angle),
          Math.sin(angle),
        ).normalize();
      }

      if (this.joystick.force > 0) {
        this.nave.setVelocity(
          this.direction.x * this.speed,
          this.direction.y * this.speed,
        );

        switch (true) {
          case this.joystick.angle >= -135 && this.joystick.angle < -45:
            this.nave.anims.play("walk-up", true);
            break;
          case this.joystick.angle >= -45 && this.joystick.angle < 45:
            this.nave.anims.play("walk-right", true);
            break;
          case this.joystick.angle >= 45 && this.joystick.angle < 135:
            this.nave.anims.play("walk-down", true);
            break;
          case this.joystick.angle >= 135 || this.joystick.angle < -135:
            this.nave.anims.play("walk-left", true);
            break;
        }
      } else {
        this.nave.setVelocity(0, 0);
        this.nave.anims.stop();
      }
    });
    
    this.textTime = this.add
      .text(16, 16, `Time: ${this.timer}`, {
        fontSize: "32px",
        fill: "#fff",
      })
      .setScrollFactor(0);
    setInterval(() => {
      this.timer += 1;
      this.textTime.setText(`Time: ${this.timer}`);
      
    }, 1000);
  }
}

export default scene0;
