class BootScene extends Phaser.Scene {
    constructor() {
        super({
            key:'BootScene'
        });
    }
 
    preload() {
        this.load.image('popup:background', 'assets/sprites/popup_background.png');
        this.load.image('popup:inside_small', 'assets/sprites/popup_inside_small.png');
        this.load.image('popup:inside_medium', 'assets/sprites/popup_inside_medium.png');
        this.load.image('popup:inside_large', 'assets/sprites/popup_inside_large.png');

        this.load.spritesheet('big_buttons', 'assets/sprites/big_buttons.png', { frameWidth: 190, frameHeight: 98 });
        this.load.spritesheet('long_buttons', 'assets/sprites/long_buttons.png', { frameWidth: 190, frameHeight: 49 });
        this.load.spritesheet('small_buttons', 'assets/sprites/small_buttons.png', { frameWidth: 45, frameHeight: 49 });


        this.load.spritesheet('tileset:forest', 'assets/sprites/forest.png', { frameWidth: 24, frameHeight: 24 });
        this.load.spritesheet('tileset:units', 'assets/sprites/units.png', { frameWidth: 24, frameHeight: 24 });
        this.load.spritesheet('tileset:items', 'assets/sprites/items.png', { frameWidth: 32, frameHeight: 32 });

        this.load.bitmapFont('font:guiOutline', 'assets/fonts/guiOutline.png', 'assets/fonts/guiOutline.xml');
        this.load.bitmapFont('font:gui', 'assets/fonts/gui.png', 'assets/fonts/gui.xml');

        this.load.spritesheet('tileset:effectsLarge', 'assets/sprites/effectsLarge.png', { frameWidth: 64, frameHeight: 64 });

        this.load.spritesheet("buttons", "assets/sprites/buttons.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("map", "assets/sprites/map.png", { frameWidth: 380, frameHeight: 590 });

        this.load.spritesheet("tiles", "assets/sprites/tiles.png", { frameWidth: 140, frameHeight: 140 });
        this.load.spritesheet("arrows", "assets/sprites/arrows.png", { frameWidth: 140*3, frameHeight: 140*3 });
        this.load.spritesheet("numbers", "assets/sprites/numbers.png", { frameWidth: 140, frameHeight: 140 });

        this.load.bitmapFont("bignumbersfont", "assets/fonts/bignumbersfont.png", "assets/fonts/bignumbersfont.fnt");

        this.load.json('data:frequency', 'assets/frequency.json');
        this.load.json('data:words', 'assets/words.json');
        this.load.json('data:values', 'assets/values.json');
        this.load.json('data:units', 'assets/units.json');
        this.load.json('data:levels', 'assets/levels.json');
    }
 
    create() {
        this.scene.start('LevelScene');
    }
};