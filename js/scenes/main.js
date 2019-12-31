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

        this.map = new Map(this, this.levelConfig);

        this.map.x = (this.sys.game.canvas.width - this.map.getBounds().width) / 2;
        this.map.y = this.sys.game.canvas.height - this.map.getBounds().height - this.map.x;

        this.map.on("ANSWER_CHANGED", this.onMapAnswerChanged, this);
        this.map.on("ANSWER_SUBMITTED", this.onMapAnswerSubmitted, this);

        this.background.x = this.map.x - 15;
        this.background.y = this.map.y - 15;

        this.panel = new Panel(this);
        this.panel.create(this.levelConfig.data.enemy, this.levelConfig.data.health);
        this.panel.on("ATTACK_DONE", this.onPanelAttackDone, this);
    }

    showPopup(popup_type, config) {
        this.scene.pause();

        var popup = new PopupScene(popup_type, config);
        popup.setEvent(this.onPopupButtonClicked, this);

        this.scene.add("popup_" + popup_type, popup, true);
    }

    /* Events */

    onPanelAttackDone() {
        this.panel.answer = "";
        this.panel.refresh();

        if (this.panel.enemy.health == 0) {
            let savegame = this.game.load();
            if (savegame.levels[this.levelConfig.ID] == null || savegame.levels[this.levelConfig.ID] == undefined) {
                savegame.levels[this.levelConfig.ID] = {
                    tries: 0,
                    stars: 0
                }
            }

            let stars = 0;

            savegame.levels[this.levelConfig.ID]['tries']++;
            if (savegame.levels[this.levelConfig.ID]['stars'] < stars) {
                savegame.levels[this.levelConfig.ID]['stars'] = stars;
            }

            this.game.save(savegame);

            this.showPopup("win", {stars: stars});
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
            /* Get the total point for this word for each letter */
            let wordPoints = 0;
            for (let i=0; i<answer.length; i++) {
                wordPoints += this.map.pickLetterValue(answer[i]);
            }
            
            /* Old score was : answer.length * (answer.length - 1) */
            this.panel.points = wordPoints * (answer.length - 1);

            /* If the word is smaller than the minimum accepted, reset the point */
            if (answer.length <= this.map.pickMinWordLength()) {
                this.panel.points = 0;
            }
        } else {
            this.panel.points = 0;
        }
        this.panel.answer = answer;
        this.panel.refresh(true);
    }

    onMapAnswerSubmitted(answer, isValid) {
        this.panel.attack(this.panel.points);
    }

    onPopupButtonClicked(popup_type, button_text) {
        switch (popup_type) {
            case "leave":
                switch (button_text) {
                    case "Oui":
                        this.scene.start('LevelScene');
                        break;
                    case "Non":
                        this.scene.resume();
                        break;
                }
                break;
            case "gameover":
                this.scene.start('LevelScene');
                break;
            case "win":
                this.scene.start('LevelScene');
                break;
        }
    }


};