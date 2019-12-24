class Panel extends Phaser.GameObjects.Container {

    constructor(scene) {
        super(scene, 0, 0);
        scene.add.existing(this);

        this.answer = "";

        this.create();
    }

    create() {
        this.background = this.scene.add.sprite(0, 0, "tileset:forest", 0);
        this.background.setTint(0xff0000);
        this.background.setOrigin(0, 0);
        this.add(this.background);

        this.background.displayWidth = this.scene.sys.game.canvas.width;
        this.background.displayHeight = 60;

        this.add(this.background);


        this.txt_answer = this.scene.add.bitmapText(0, 0, "font:gui", "", 30, Phaser.GameObjects.BitmapText.ALIGN_CENTER).setOrigin(0);
        this.txt_answer.tint = 0xdcdcdc;
        this.txt_answer.y = 12;
        this.txt_answer.x = 10;
        this.add(this.txt_answer);

        this.refresh();
    }

    refresh() {
        this.txt_answer.text = "Answer:" + this.answer;
    }
};