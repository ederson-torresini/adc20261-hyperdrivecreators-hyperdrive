class scene0 extends Phaser.Scene {
  constructor() {
    super("scene0");

    this.threshold = 0.1;
    this.speed = 400;
    this.direction = undefined;
    this.currentAnim = null;
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

    this.load.image("asteroid", "assets/Asteroid.png");

    this.load.plugin(
      "rexvirtualjoystickplugin",
      "rexvirtualjoystickplugin.min.js",
      true,
    );
  }

  create() {
    this.timer = 0; // Zerar o timer no início da cena

    this.worldWidth = 3200;
    this.worldHeight = 1925;

    this.add
      .tileSprite(0, 0, this.worldWidth, this.worldHeight, "mapa")
      .setOrigin(0)
      .setDepth(-1);

    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);

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

    this.nave = this.physics.add.sprite(400, 225, "nave", 0);
    this.nave.setCollideWorldBounds(true);
    this.nave.setDrag(300); // Desaceleração natural
    this.nave.setMaxVelocity(400); // Velocidade máxima
    this.nave.body.setSize(32, 32); // Diminuir área de colisão
    this.nave.body.setOffset(16, 16); // Centralizar o body
    this.cameras.main.startFollow(this.nave, true, 0.1, 0.1);

    // Criar nave inimiga
    this.inimigo = this.physics.add.sprite(800, 300, "policia", 0);
    this.inimigo.setCollideWorldBounds(true);
    this.inimigo.speed = 200; // Velocidade do inimigo
    this.inimigo.body.setSize(32, 32); // Diminuir área de colisão
    this.inimigo.body.setOffset(16, 16); // Centralizar o body

    // Asteroides
    this.asteroides = this.physics.add.group();
    for (let i = 0; i < 100; i++) {
      const x = Phaser.Math.Between(100, this.worldWidth - 100);
      const y = Phaser.Math.Between(100, this.worldHeight - 100);
      const asteroid = this.asteroides.create(x, y, "asteroid");
      asteroid.body.setSize(48, 48); // Diminuir hitbox dos asteroides
      asteroid.body.setOffset(24, 24); // Centralizar o body no sprite de 96x96
      console.log(x, y);
    }
    this.physics.add.collider(this.nave, this.asteroides, () => {
      // Colisão com asteroides: parar a nave
      this.nave.setVelocity(0, 0);
    });

    // Adicionar colisão entre nave e inimigo
    this.physics.add.collider(
      this.nave,
      this.inimigo,
      this.onCollision,
      null,
      this,
    );

    this.enemies = this.physics.add.group();
    this.enemies.add(this.inimigo);
    this.physics.add.collider(
      this.nave,
      this.enemies,
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

      // Lógica para movimentação dos asteroides
      if (force > this.threshold) {
        this.direction = new Phaser.Math.Vector2(
          Math.cos(angle),
          Math.sin(angle),
        ).normalize();

        const accel = 500; // Aceleração da nave
        this.nave.setAcceleration(
          this.direction.x * accel,
          this.direction.y * accel,
        );

        let desiredAnim = null;
        if (this.joystick.angle >= -135 && this.joystick.angle < -45) {
          desiredAnim = "walk-up";
        } else if (this.joystick.angle >= -45 && this.joystick.angle < 45) {
          desiredAnim = "walk-right";
        } else if (this.joystick.angle >= 45 && this.joystick.angle < 135) {
          desiredAnim = "walk-down";
        } else {
          desiredAnim = "walk-left";
        }

        if (desiredAnim && this.currentAnim !== desiredAnim) {
          this.currentAnim = desiredAnim;
          this.nave.anims.play(desiredAnim, true);
        }
      } else {
        // Joystick não acionado: motor desligado
        this.nave.setAcceleration(0, 0);
        this.nave.anims.stop();
        this.currentAnim = null;
      }
    });

    this.textTime = this.add
      .text(16, 16, `Timer: ${this.timer}`, {
        fontSize: "32px",
        fill: "#fff",
      })
      .setScrollFactor(0);
    this.timerInterval = setInterval(() => {
      this.timer += 1;
      this.textTime.setText(`Time: ${this.timer}`);

      if (this.timer % 10 === 0) {
        this.spawnEnemy();
      }
    }, 1000);
  }

  update() {
    // Lógica de perseguição de todos inimigos do grupo
    this.enemies.getChildren().forEach((inimigo) => {
      const dx = this.nave.x - inimigo.x;
      const dy = this.nave.y - inimigo.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 10) {
        // Evitar movimento se muito próximo
        const direction = new Phaser.Math.Vector2(dx, dy).normalize();
        inimigo.setVelocity(
          direction.x * inimigo.speed,
          direction.y * inimigo.speed,
        );

        // Determinar a direção e tocar animação
        const angle = Phaser.Math.RadToDeg(Math.atan2(dy, dx));
        if (angle >= -135 && angle < -45) {
          inimigo.anims.play("inimigo-walk-up", true);
        } else if (angle >= -45 && angle < 45) {
          inimigo.anims.play("inimigo-walk-right", true);
        } else if (angle >= 45 && angle < 135) {
          inimigo.anims.play("inimigo-walk-down", true);
        } else {
          inimigo.anims.play("inimigo-walk-left", true);
        }
      } else {
        inimigo.setVelocity(0, 0);
        inimigo.anims.stop();
      }
    });
  }

  spawnEnemy() {
    const margin = 200;
    let x = Phaser.Math.Between(
      0 + margin,
      this.physics.world.bounds.width - margin,
    );
    let y = Phaser.Math.Between(
      0 + margin,
      this.physics.world.bounds.height - margin,
    );

    if (Phaser.Math.Distance.Between(x, y, this.nave.x, this.nave.y) < margin) {
      x = Phaser.Math.Between(
        0 + margin,
        this.physics.world.bounds.width - margin,
      );
      y = Phaser.Math.Between(
        0 + margin,
        this.physics.world.bounds.height - margin,
      );
    }

    const novoInimigo = this.physics.add.sprite(x, y, "policia", 0);
    novoInimigo.setCollideWorldBounds(true);
    novoInimigo.speed = 200;
    novoInimigo.body.setSize(32, 32);
    novoInimigo.body.setOffset(16, 16);
    this.enemies.add(novoInimigo);
    this.physics.add.collider(
      this.nave,
      novoInimigo,
      this.onCollision,
      null,
      this,
    );
  }

  onCollision() {
    // Quando colidir, parar o jogo e mostrar Game Over
    clearInterval(this.timerInterval); // Parar o timer
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
