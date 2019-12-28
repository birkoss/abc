class MainScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainScene'
        });
    }

    create() {
        this.panel = new Panel(this);

        this.background = this.add.sprite(0, 0, "map");
        this.background.setOrigin(0);

        this.map = new Map(this);

        this.map.x = (this.sys.game.canvas.width - this.map.getBounds().width) / 2;
        this.map.y = this.map.x + this.panel.getBounds().height;

        this.map.on("ANSWER_CHANGED", this.onMapAnswerChanged, this);
        this.map.on("ANSWER_SUBMITTED", this.onMapAnswerSubmitted, this);

        //this.background.displayWidth = this.map.background.displayWidth + 10;
        //this.background.displayHeight = this.map.background.displayHeight + 10;
        this.background.x = this.map.x - 15;
        this.background.y = this.map.y - 15;

        console.log(this.background.displayWidth + "x" + this.background.displayHeight);


    }

    /* Events */

 
    onMapAnswerChanged(answer, isValid) {
        if (isValid) {
            this.panel.points = answer.length * (answer.length - 1);
        } else {
            this.panel.points = 0;
        }
        this.panel.answer = answer;
        this.panel.refresh();
    }

    onMapAnswerSubmitted(answer, isValid) {
        this.panel.answer = "";
        this.panel.refresh();
    }


};