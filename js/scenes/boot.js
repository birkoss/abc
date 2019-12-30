class BootScene extends Phaser.Scene {
    constructor() {
        super({
            key:'BootScene'
        });
    }
 
    preload() {

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
    }
 
    create() {
        this.scene.start('LevelScene');
    }
};