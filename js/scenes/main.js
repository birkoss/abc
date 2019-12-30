class MainScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainScene'
        });
    }

    init(config) {
        this.levelConfig = config;
    }

    create() {
        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#3f7cb6");

        this.background = this.add.sprite(0, 0, "map");
        this.background.setOrigin(0);

        this.map = new Map(this);

        this.map.x = (this.sys.game.canvas.width - this.map.getBounds().width) / 2;
        this.map.y = this.sys.game.canvas.height - this.map.getBounds().height - this.map.x;

        this.map.on("ANSWER_CHANGED", this.onMapAnswerChanged, this);
        this.map.on("ANSWER_SUBMITTED", this.onMapAnswerSubmitted, this);

        this.background.x = this.map.x - 15;
        this.background.y = this.map.y - 15;

        this.panel = new Panel(this);
        this.panel.create("skeleton", 100);
        this.panel.on("ATTACK_DONE", this.onPanelAttackDone, this);
    }

    /* Events */

    onPanelAttackDone() {
        this.panel.answer = "";
        this.panel.refresh();

        if (this.panel.enemy.health == 0) {
            alert("You win!");
            this.registry.destroy();
            this.events.off();
            this.scene.restart();
        } else if (this.panel.player.health == 0) {
            alert("You lose!");
            this.registry.destroy();
            this.events.off();
            this.scene.restart();
        } else {
            this.map.refillMap();
        }
    }
 
    onMapAnswerChanged(answer, isValid) {
        if (isValid) {
            let letterValues = this.cache.json.get('data:values');

            /* Get the total point for this word for each letter */
            let wordPoints = 0;
            for (let i=0; i<answer.length; i++) {
                wordPoints += letterValues[answer[i]];
            }
            
            /* Old score was : answer.length * (answer.length - 1) */
            this.panel.points = wordPoints * (answer.length - 1);
        } else {
            this.panel.points = 0;
        }
        this.panel.answer = answer;
        this.panel.refresh(true);
    }

    onMapAnswerSubmitted(answer, isValid) {
        this.panel.attack(this.panel.points);
    }


};