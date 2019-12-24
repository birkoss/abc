class Tile extends Phaser.GameObjects.Container {

    constructor(scene) {
        super(scene, 0, 0);
        scene.add.existing(this);

        this.create();

        this.picked = false;
        this.setCoordinate(0, 0);

        this.letter = "";
    }

    select() {
        this.background.tint = 0x42a7bd;
        this.picked = true;
    }

    unselect() {
        this.background.tint = 0xd45477;
        this.picked = false;
    }

    setLetter(letter) {
        this.letter = letter;

        this.label.text = this.letter;
    }

    setCoordinate(x, y) {
        this.coordinate = new Phaser.Math.Vector2(x, y);
    }

    create() {
        this.background = this.scene.add.sprite(0, 0, "tiles");
        this.background.setScale(0.5);
        this.background.setOrigin(0.5);
        this.add(this.background);

        this.unselect();

        this.label = this.scene.add.bitmapText(0, 0, "font:gui", "#", 30, Phaser.GameObjects.BitmapText.ALIGN_CENTER);
        this.label.setOrigin(0.5);
        this.label.x = -2;
        this.add(this.label);
    }
};