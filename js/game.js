var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: window.innerWidth,
    height: window.innerHeight,
    pixelArt: true,
    roundPixels: true,
    scene: [
        BootScene,
        MainScene,
    ]
};

var game = new Phaser.Game(config);

var savedData;
var score;
var gameOptions = {
    bgColors: [0x42a7bd, 0xd45477],
    gameWidth: 750,
    gameHeight: 1334,
    tileSize: 70,
    fieldSize: {
        width: 5,
        height: 8
    },
    fallSpeed: 250,
    localStorageName: "drawsumgame"
}

var windowRatio = window.innerWidth / window.innerHeight;
if(windowRatio < gameOptions.gameWidth / gameOptions.gameHeight){
    gameOptions.gameHeight = gameOptions.gameWidth / windowRatio;
}