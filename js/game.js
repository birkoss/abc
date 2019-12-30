var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: window.innerWidth,
    height: window.innerHeight,
    pixelArt: true,
    roundPixels: true,
    scene: [
        BootScene,
        LevelScene,
        MainScene,
    ]
};

var game = new Phaser.Game(config);