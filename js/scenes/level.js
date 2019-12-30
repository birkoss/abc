class LevelScene extends Phaser.Scene {
    constructor() {
        super({
            key:'LevelScene'
        });
    }
 
    create() {
        this.pages = this.add.container();
        
        this.pageWidth = this.sys.canvas.width;

        /* How much we need to scroll to change the page */
        this.pageThreshold = this.pageWidth / 8;

        this.currentLevel = null;

        let padding = (3 * 100) + (10 * 2);
        let startAtX = (this.pageWidth - padding) / 2;
        let levelsPerPage = 15;

        for (let i=0; i<25; i++) {
            this.currentPage = Math.floor(i / levelsPerPage);
            let pageStartAtX = this.currentPage * this.pageWidth;

            let level = this.add.sprite(0, 0, "tileset:forest");
            level.setOrigin(0);

            level.displayWidth = 100;
            level.displayHeight = 100;
            level.levelID = i;

            let indexInPage = (i - (this.currentPage * levelsPerPage));

            let y = Math.floor(indexInPage / 3);
            let x = indexInPage - (y * 3);

            level.x = (x * (level.displayWidth + 10)) + startAtX + pageStartAtX;
            level.y = y * (level.displayHeight + 10);

            level.setInteractive();
            level.on('pointerdown', function (pointer) {
                this.currentLevel = level;
                level.alpha = 0.4;
            }, this);

            this.pages.add(level);
        }

        this.pages.y = (this.sys.canvas.height - this.pages.getBounds().height) / 2;

        this.maxPages = this.currentPage + 1;
        this.currentPage = 0;

        /* Track the startion and last position */
        this.input.on('pointerdown', function (pointer) {
            this.pages.startX = this.pages.x;
            this.pages.lastX = pointer.x;
            this.pages.diff = 0;
        }, this);   

        /* Move the levels container and keep track of the last position */
        this.input.on('pointermove', function (pointer) {
            this.pages.x -= (this.pages.lastX - pointer.x);
            this.pages.lastX = pointer.x;

            /* The difference between the current position and the starting position */
            this.pages.diff = this.pages.x - this.pages.startX;

            if (this.currentLevel != null && (this.pages.diff > this.pageThreshold || this.pages.diff < this.pageThreshold * -1)) {
                this.currentLevel.alpha = 1;
                this.currentLevel = null;
            }

        }, this);  

        /* Animate the levels container depending on the new page */
        this.input.on('pointerup', function (pointer) {
            if (this.currentLevel != null) {
                this.currentLevel.alpha = 1;
            }

            if (this.pages.diff > this.pageThreshold) {
                this.changePage(-1);
            } else if (this.pages.diff < this.pageThreshold * -1) {
                this.changePage(1);
            } else {
                this.changePage(0);
                if (this.currentLevel != null) {
                    this.changeLevel(this.currentLevel.levelID);
                }
            }

            this.currentLevel = null;
        }, this);   
    }

    changePage(page) {
        this.currentPage += page;

        if (this.currentPage < 0) {
            this.currentPage = 0;
        }

        if (this.currentPage >= this.maxPages) {
            this.currentPage = this.maxPages - 1;
        }

        this.tweens.add({
            targets: this.pages,
            x: this.currentPage * -this.pageWidth,
            duration: 300,
            ease: "Linear",

        });
    }

    changeLevel(levelID) {
        this.scene.start('MainScene', {levelID: levelID});
    }

};