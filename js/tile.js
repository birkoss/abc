class Tile extends Phaser.GameObjects.Container {

    constructor(scene) {
        super(scene, 0, 0);
        scene.add.existing(this);

        this.create();

        this.picked = false;
        this.highlighted = false;
        this.setCoordinate(0, 0);

        this.letter = "";
    }

    select() {
        this.unhighlight();

        this.background.setFrame(1);
        this.picked = true;
    }

    highlight() {
        if (!this.picked && !this.highlighted) {
            this.alpha = 0.5;
            this.highlighted = true;
        }
    }

    unhighlight() {
        if (this.highlighted) {
            this.alpha = 1;
            this.highlighted = false;
        }
    }

    unselect() {
        this.background.setFrame(0);
        this.picked = false;

        this.unhighlight();
    }

    setLetter(letter, value) {
        this.letter = letter;

        this.label.text = this.letter;

        this.letterValue.text = value;
    }

    setCoordinate(x, y) {
        this.coordinate = new Phaser.Math.Vector2(x, y);
    }

    create() {
        this.background = this.scene.add.sprite(0, 0, "buttons");
        //this.background.setScale(1.4);
        this.background.setOrigin(0.5);
        this.add(this.background);

        this.unselect();

        this.label = this.scene.add.bitmapText(0, 0, "font:gui", "#", 30, Phaser.GameObjects.BitmapText.ALIGN_CENTER);
        //this.label.tint = 0xb1a077;
        this.label.setOrigin(0.5);
        this.label.x = -2;
        this.add(this.label);

        this.letterValue = this.scene.add.bitmapText(0, 0, "font:gui", "90", 10, Phaser.GameObjects.BitmapText.ALIGN_CENTER);
        this.letterValue.tint = 0xb1a077;
        this.letterValue.setOrigin(1);
        this.letterValue.x = this.background.width/2 - 6;
        this.letterValue.y = this.background.height/2 - 5;
        this.add(this.letterValue);
    }
};