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

    this.load.spritesheet("policia", "assets/nave.inimiga.png", {
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
      frames: this.anims.generateFrameNumbers("nave", { start: 0, end: 3 }),
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

    // Animações para o inimigo (policia)
    this.anims.create({
      key: "inimigo-walk-up",
      frames: this.anims.generateFrameNumbers("policia", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "inimigo-walk-left",
      frames: this.anims.generateFrameNumbers("policia", { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "inimigo-walk-right",
      frames: this.anims.generateFrameNumbers("policia", {
        start: 12,
        end: 15,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "inimigo-walk-down",
      frames: this.anims.generateFrameNumbers("policia", { start: 8, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });

    this.nave = this.physics.add.sprite(400, 225, "nave", 20);
    this.nave.setCollideWorldBounds(true);
    this.nave.setDrag(300); // Desaceleração natural
    this.nave.setMaxVelocity(400); // Velocidade máxima
    this.nave.body.setSize(32, 32); // Diminuir área de colisão
    this.nave.body.setOffset(16, 16); // Centralizar o body
    this.cameras.main.startFollow(this.nave, true, 0.1, 0.1);

    // Criar nave inimiga
    this.inimigo = this.physics.add.sprite(800, 300, "policia", 20);
    this.inimigo.setCollideWorldBounds(true);
    this.inimigo.speed = 200; // Velocidade do inimigo
    this.inimigo.body.setSize(32, 32); // Diminuir área de colisão
    this.inimigo.body.setOffset(16, 16); // Centralizar o body

    // Adicionar colisão entre nave e inimigo
    this.physics.add.collider(
      this.nave,
      this.inimigo,
      this.onCollision,
      null,
      this,
    );

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
        const accel = 500; // Aceleração da nave
        this.nave.setAcceleration(
          this.direction.x * accel,
          this.direction.y * accel,
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
        this.nave.setAcceleration(0, 0);
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

  update() {
    // Lógica de perseguição do inimigo
    const dx = this.nave.x - this.inimigo.x;
    const dy = this.nave.y - this.inimigo.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 10) {
      // Evitar movimento se muito próximo
      const direction = new Phaser.Math.Vector2(dx, dy).normalize();
      this.inimigo.setVelocity(
        direction.x * this.inimigo.speed,
        direction.y * this.inimigo.speed,
      );

      // Determinar a direção e tocar animação
      const angle = Phaser.Math.RadToDeg(Math.atan2(dy, dx));
      if (angle >= -135 && angle < -45) {
        this.inimigo.anims.play("inimigo-walk-up", true);
      } else if (angle >= -45 && angle < 45) {
        this.inimigo.anims.play("inimigo-walk-right", true);
      } else if (angle >= 45 && angle < 135) {
        this.inimigo.anims.play("inimigo-walk-down", true);
      } else {
        this.inimigo.anims.play("inimigo-walk-left", true);
      }
    } else {
      this.inimigo.setVelocity(0, 0);
      this.inimigo.anims.stop();
    }
  }

  onCollision() {
    // Quando colidir, parar o jogo e mostrar Game Over
    this.physics.pause();
    this.nave.anims.stop();
    this.inimigo.anims.stop();

    // Adicionar texto de Game Over
    this.add
      .text(400, 200, "Game Over", {
        fontSize: "48px",
        fill: "#ff0000",
        fontFamily: "Arial",
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    // Botão para reiniciar
    let restartButton = this.add
      .text(400, 300, "Reiniciar", {
        fontSize: "24px",
        fill: "#00ff00",
        fontFamily: "Arial",
      })
      .setOrigin(0.5)
      .setInteractive()
      .setScrollFactor(0);

    restartButton.on("pointerdown", () => {
      this.scene.restart();
    });
  }
}

export default scene0;
