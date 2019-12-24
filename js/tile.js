class Tile extends Phaser.GameObjects.Container {

    constructor(scene, frame, data) {
        super(scene, 0, 0);
        scene.add.existing(this);

        this.backgroundFrame = frame;

        this.dataTile = {
            item: null
        };
    }

    createTile() {
        this.background = this.scene.add.sprite(0, 0, "tileset:world", this.backgroundFrame);
        this.background.setOrigin(0, 0);
        this.add(this.background);

        this.overlay = null;
    }

    setItem(frame, name) {
        this.dataTile.item = {
            frame: frame,
            name: name
        };
    }

    createOverlay() {
        this.overlay = this.scene.add.sprite(0, 0, "tileset:world", 0);
        this.overlay.setTint(0x000000);
        this.overlay.setAlpha(0.8);
        this.overlay.setOrigin(0, 0);
        this.add(this.overlay);
    }

    isWaiting() {
        this.emit("isWaiting");
    }

    itemRevealed() {
        this.emit("itemRevealed", this, this.dataTile.item);
    }

    reveal() {
        if (this.overlay != null) {
            this.scene.tweens.add({
                targets: this.overlay,
                alpha: 0,
                duration: 200,
                onComplete: this.revealItem,
                callbackScope: this,
            }, this);
        } else {
            this.isWaiting();
        }
    }

    revealItem() {
       this.overlay.destroy();
       this.overlay = null;

        if (this.dataTile.item != null) {
            this.item = this.scene.add.sprite(0, 0, "tileset:items", this.dataTile.item.frame);    // 132 = skull
            this.item.setAlpha(0);
            this.item.setOrigin(0, 0);
            this.item.x = (this.background.width - this.item.width) / 2;
            this.item.y = (this.background.height - this.item.height) / 2;
            this.add(this.item);


            this.scene.tweens.add({
                targets: this.item,
                alpha: 1,
                duration: 200,
                onComplete: this.itemRevealed,
                callbackScope: this,
            });
        } else {
            this.isWaiting();
        }
    }
};