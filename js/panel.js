class Panel extends Phaser.GameObjects.Container {

    constructor(scene) {
        super(scene, 0, 0);
        scene.add.existing(this);

        this.answer = "";
        this.points = 0;
    }

    create(enemyID, enemyHealth) {
        this.background = this.scene.add.sprite(0, 0, "map");
        this.background.setOrigin(0);
        this.background.setOrigin(0, 0);
        this.add(this.background);

        this.background.x = (this.scene.sys.game.canvas.width - this.background.width) / 2;
        this.background.y = -480;

        this.txt_answer = this.scene.add.bitmapText(0, 0, "font:gui", "", 20, Phaser.GameObjects.BitmapText.ALIGN_CENTER).setOrigin(0.5, 0);
        this.txt_answer.tint = 0xdcdcdc;
        this.txt_answer.y = 12;
        this.txt_answer.x = this.scene.sys.game.canvas.width/2;
        this.add(this.txt_answer);

        /* Generate battlefield and units */
        this.scene.anims.create({
            key: "attack",
            frames:this.scene.anims.generateFrameNumbers('tileset:effectsLarge', { frames: [10, 11] }),
            frameRate: 10,
            repeat: 3
        });

        let unitsData = this.scene.cache.json.get('data:units');
        unitsData.forEach(single_data => {
            this.scene.anims.create({
                key: single_data.id,
                frames:this.scene.anims.generateFrameNumbers('tileset:units', { frames: single_data.frames }),
                frameRate: 3,
                repeat: -1
            });
        }, this);

        this.battlefield = this.scene.add.container();
        this.add(this.battlefield);

        for (let i=0; i<5; i++) {
            let tile = this.scene.add.sprite(0, 0, "tileset:forest", (i % 2 == 1 ? 0 : 1));
            tile.x = (i * 48);
            tile.setOrigin(0);
            tile.setScale(2);
            tile.y = 0;
            this.battlefield.add(tile);
        }

        this.battlefield.x = (this.scene.sys.game.canvas.width - this.battlefield.getBounds().width) / 2;
        this.battlefield.y = this.background.height + this.background.y - this.battlefield.getBounds().height - 15;

        this.enemy = new Unit(this.scene, enemyID, enemyHealth);
        this.enemy.x = (3 * 48) + 24;
        this.enemy.y = 24;
        this.enemy.animate();
        this.battlefield.add(this.enemy);

        let icon = this.scene.add.sprite(0, 0, "tileset:items", 84);
        icon.setOrigin(0, 0);
        icon.x = this.battlefield.getBounds().width + 18;
        this.battlefield.add(icon);

        this.enemyHealth = this.scene.add.bitmapText(icon.x + (icon.width/2)-2, icon.y + icon.height - 4, "font:gui", this.enemy.health, 20, Phaser.GameObjects.BitmapText.ALIGN_CENTER).setOrigin(0.5, 0);
        this.enemyHealth.tint = 0xdcdcdc;
        this.battlefield.add(this.enemyHealth);

        this.player = new Unit(this.scene, "knight", 10);
        this.player.face(1);
        this.player.x = (1 * 48) + 24;
        this.player.y = 24;
        this.player.animate();
        this.player.originalX = this.player.x;
        this.battlefield.add(this.player);

        icon = this.scene.add.sprite(0, 0, "tileset:items", 84);
        icon.setOrigin(0, 0);
        icon.x = -50;
        this.battlefield.add(icon);

        this.playerHealth = this.scene.add.bitmapText(icon.x + (icon.width/2)-2, icon.y + icon.height - 4, "font:gui", this.player.health, 20, Phaser.GameObjects.BitmapText.ALIGN_CENTER).setOrigin(0.5, 0);
        this.playerHealth.tint = 0xdcdcdc;
        this.battlefield.add(this.playerHealth);

        this.refresh();
    }

    attack(attackDamage) {
        this.player.damage(1);

        this.attackDamage = attackDamage;

        this.scene.tweens.add({
            targets: this.player,
            x: this.enemy.x,
            duration: 200,
            onComplete: this.onAttackMoved,
            callbackScope: this
        });
    }

    onAttackMoved() {
        this.attackEffect = this.scene.add.sprite(0, 0, "tileset:effectsLarge");
        this.attackEffect.x = this.enemy.x;
        this.attackEffect.y = this.enemy.y;
        this.attackEffect.on('animationcomplete', this.onAttackEffectCompleted, this);
        this.attackEffect.play("attack");
        this.battlefield.add(this.attackEffect);

        this.enemy.damage(this.attackDamage);
        this.refresh();
    }

    onAttackEffectCompleted() {
        this.attackEffect.destroy();

        this.scene.tweens.add({
            targets: this.player,
            x: this.player.originalX,
            duration: 200,
            onComplete: this.onAttackDone,
            callbackScope: this
        });
    }

    onAttackDone() {
        this.emit("ATTACK_DONE");
    }

    refresh() {
        if (this.points > 0 && this.answer != "") {
            this.txt_answer.text = this.answer + " (" + this.points + ")";
        } else {
            this.txt_answer.text = "";
        }

        this.enemyHealth.text = this.enemy.health;
        this.playerHealth.text = this.player.health;
    }
};