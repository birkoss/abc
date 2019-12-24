class MainScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainScene'
        });
    }

    create() {
        this.panel = new Panel(this);

        this.map = new Map(this);

        this.map.x = (this.sys.game.canvas.width - this.map.getBounds().width) / 2;
        this.map.y = this.map.x + this.panel.getBounds().height;

        this.map.on("ANSWER_CHANGED", this.onMapAnswerChanged, this);
        this.map.on("ANSWER_SUBMITTED", this.onMapAnswerSubmitted, this);

    }

    /* Events */

 
    onMapAnswerChanged(answer) {
        this.panel.answer = answer;
        this.panel.refresh();
    }

    onMapAnswerSubmitted(answer) {
        this.panel.answer = "";
        this.panel.refresh();
    }


};