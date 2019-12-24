class Map extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        scene.add.existing(this);

        this.create();

        this.answer = "";
    }

    create() {
        this.tiles = [];
        this.arrows = [];

        this.pool = [];

        this.altTintColor = 0x42a7bd;
        this.tintColor = 0xd45477;

        this.background = this.scene.add.sprite(0, 0, "tileset:forest");
        this.add(this.background);

        this.totalFrequencies = 0;
        for (var letter in this.scene.cache.json.get('data:frequency')) {
            this.totalFrequencies += this.scene.cache.json.get('data:frequency')[letter];
        }

        for(var y = 0; y < gameOptions.fieldSize.height; y++) {
            this.tiles[y] = [];
            for(var x = 0; x < gameOptions.fieldSize.width; x++) {
                let container = this.scene.add.container();
                this.add(container);

                var tileXPos = x * gameOptions.tileSize + gameOptions.tileSize / 2;
                var tileYPos = y * gameOptions.tileSize + gameOptions.tileSize / 2;

                var theTile = this.scene.add.sprite(0, 0, "tiles");
                theTile.setScale(0.5);
                theTile.setOrigin(0.5);
                theTile.picked = false;
                theTile.coordinate = new Phaser.Math.Vector2(x, y);
                this.tiles[y][x] = container;

                theTile.value = this.pickLetter();
                theTile.tint = this.tintColor;
                
                let label = this.scene.add.bitmapText(0, 0, "font:gui", theTile.value, 30, Phaser.GameObjects.BitmapText.ALIGN_CENTER);
                //label.setScale(0.5);
                label.setOrigin(0.5);
                label.x = -2;

                container.add(theTile);
                container.add(label);

                container.x = tileXPos;
                container.y = tileYPos;
            }
        }

        this.background.displayWidth = gameOptions.tileSize * gameOptions.fieldSize.width;
        this.background.displayHeight = gameOptions.tileSize * gameOptions.fieldSize.height;
        this.background.x = this.background.displayWidth / 2;
        this.background.y = this.background.displayHeight / 2;

        this.background.setInteractive();
        this.background.on('pointerdown', this.tilePicked, this);
    }

    pickLetter() {
        let rnd = Phaser.Math.RND.realInRange(0, this.totalFrequencies);
        let lastTotal = 0;

        for (var letter in this.scene.cache.json.get('data:frequency')) {
            let currentValue = this.scene.cache.json.get('data:frequency')[letter];

            if (rnd >= lastTotal && rnd <= lastTotal + currentValue) {
                return letter;
            }
            lastTotal += currentValue;
        }

        return "E";
    }
 
    isNeighboor(pos1, pos2) {
        return (Math.abs(pos1.x - pos2.x) <= 1) && (Math.abs(pos1.y - pos2.y) <= 1);
    }

    tileMoved(e) {
        var y = Math.floor((e.position.y - this.y) / gameOptions.tileSize);
        var x = Math.floor((e.position.x - this.x) / gameOptions.tileSize);

        let tile = this.tiles[y][x].getAt(0);

        /* Only apply the movement if we are close to the center of the tile */
        var distance = new Phaser.Math.Vector2((e.position.x - this.x) - (x * gameOptions.tileSize), (e.position.y - this.y) - (y * gameOptions.tileSize)).distance(new Phaser.Math.Vector2(gameOptions.tileSize / 2, gameOptions.tileSize / 2));
        if (distance > gameOptions.tileSize * 0.4) {
            return;
        }

        if (!tile.picked && this.isNeighboor(tile.coordinate, this.visitedTiles[ this.visitedTiles.length - 1 ])) {
            tile.picked = true;
            tile.tint = this.altTintColor;
            this.visitedTiles.push(tile.coordinate);

            var fromPos = this.visitedTiles[this.visitedTiles.length - 2];
            var arrow = this.scene.add.sprite(this.tiles[fromPos.y][fromPos.x].x, this.tiles[fromPos.y][fromPos.x].y, "arrows");
            this.add(arrow);
            arrow.setScale(0.5);
            arrow.tint = this.tintColor;
            arrow.setOrigin(0.5);
            var tileDiff = new Phaser.Math.Vector2(this.visitedTiles[this.visitedTiles.length - 1].x, this.visitedTiles[this.visitedTiles.length - 1].y)
            tileDiff.subtract(new Phaser.Math.Vector2(this.visitedTiles[this.visitedTiles.length - 2].x, this.visitedTiles[this.visitedTiles.length - 2].y));

            if (tileDiff.x == 0) {
                arrow.setAngle(-90 * tileDiff.y);
            } else {
                arrow.setAngle(90 * (tileDiff.x + 1));
                if (tileDiff.y != 0) {
                    arrow.setFrame(1);
                    if (tileDiff.x == 1 && tileDiff.y == -1) {
                        arrow.setAngle(90);
                    } else if (tileDiff.x == -1 && tileDiff.y == 1) {
                        arrow.setAngle(-90);
                    }
                }
            }

            this.addAnswer(tile.value);

            this.arrows.push(arrow);
        } else if (this.visitedTiles.length > 1) {
            if (this.visitedTiles[ this.visitedTiles.length - 2 ].x == x && this.visitedTiles[ this.visitedTiles.length - 2 ].y == y) {
                let previousCoordinate = this.visitedTiles[ this.visitedTiles.length - 1 ];

                let previousTile = this.tiles[previousCoordinate.y][previousCoordinate.x].getAt(0);

                previousTile.picked = false;
                previousTile.tint = this.tintColor;

                this.visitedTiles.pop();

                this.arrows[this.arrows.length - 1].destroy();
                this.arrows.pop();

                this.addAnswer("");
            }
        }
    }

    tileReleased(e) {
        this.background.off('pointerup', this.tileReleased, this);
        this.background.off('pointermove', this.tileMoved, this);

        this.arrows.forEach(single_arrow => {
            single_arrow.destroy();
        });
        this.arrows = [];
        this.arrows.length = 0;

        for (let i = 0; i < this.visitedTiles.length; i++) {
            this.tiles[this.visitedTiles[i].y][this.visitedTiles[i].x].getAt(0).tint = this.tintColor;
            this.tiles[this.visitedTiles[i].y][this.visitedTiles[i].x].getAt(0).picked = false;
        }

        if (this.answer.length == 2) {
            /* Remove existing tiles and add those in a pool */
            for (var i = 0; i < this.visitedTiles.length; i++) {
                this.tiles[this.visitedTiles[i].y][this.visitedTiles[i].x].visible = false;
                this.pool.push(this.tiles[this.visitedTiles[i].y][this.visitedTiles[i].x]);
                this.tiles[this.visitedTiles[i].y][this.visitedTiles[i].x] = null;
            }

            /* Fall remaining tiles */
            for (var i = gameOptions.fieldSize.height - 1; i >= 0; i--) {
                for (var j = 0; j < gameOptions.fieldSize.width; j++) {
                    if (this.tiles[i][j] != null) {
                        var holes = this.findHolesBelow(i, j);
                        if(holes > 0) {
                            var coordinate = new Phaser.Math.Vector2(this.tiles[i][j].getAt(0).coordinate.x, this.tiles[i][j].getAt(0).coordinate.y);
                            var destination = new Phaser.Math.Vector2(j, i + holes);
                            
                            this.scene.tweens.add({
                                targets: this.tiles[i][j],
                                y: this.tiles[i][j].y + holes * gameOptions.tileSize,
                                duration: gameOptions.fallSpeed,

                                onComplete: this.nextTurn,
                                callbackScope: this,
                            });
                            console.log(destination.x + "x" + destination.y);
                            this.tiles[destination.y][destination.x] = this.tiles[i][j]
                            this.tiles[coordinate.y][coordinate.x] = null;
                            this.tiles[destination.y][destination.x].getAt(0).coordinate = new Phaser.Math.Vector2(destination.x, destination.y)
                        }
                    }
                }
            }

            /* Place new tiles from the pool in missing spot */
            for (var i = 0; i < gameOptions.fieldSize.width; i++) {
                var holes = this.findHolesInCol(i);
                if (holes > 0) {
                    for (var j = 1; j <= holes; j++) {
                        var tileXPos = i * gameOptions.tileSize + gameOptions.tileSize / 2;
                        var tileYPos = -j * gameOptions.tileSize + gameOptions.tileSize / 2;
                        var theTile = this.pool.pop();

                        theTile.x = tileXPos;
                        theTile.y = tileYPos;
                        theTile.visible = true;
                        theTile.getAt(0).tint = this.tintColor;
                        theTile.getAt(0).picked = false;

                        this.scene.tweens.add({
                            targets: theTile,
                            y: theTile.y + holes * gameOptions.tileSize,
                            duration: gameOptions.fallSpeed,

                            onComplete: this.nextTurn,
                            callbackScope: this,
                        });
                        
                        theTile.getAt(0).coordinate = new Phaser.Math.Vector2(i, holes - j);
                        theTile.getAt(0).value = this.pickLetter();
                        theTile.getAt(1).text = theTile.getAt(0).value;
                        this.tiles[holes - j][i] = theTile;
                    }
                }
            }
        } else {
            this.nextTurn();
        }

        this.visitedTiles = [];
        this.visitedTiles.length = 0;
    }

    debugTiles() {
        for(var y = 0; y < gameOptions.fieldSize.height; y++) {
            let row = [];
            for(var x = 0; x < gameOptions.fieldSize.width; x++) {
                if (this.tiles[y][x] == null) {
                    row.push(" (_x_)");
                } else {
                    row.push(this.tiles[y][x].getAt(1).text+"(" + this.tiles[y][x].getAt(0).coordinate.x + "x" + this.tiles[y][x].getAt(0).coordinate.y + ")");
                }
            }
            console.log(row);
        }
        console.error("");
    }

    nextTurn() {
        console.log("nextTurn");
        this.background.off('pointerdown', this.tilePicked, this);
        this.background.on('pointerdown', this.tilePicked, this);
    }

    findHolesInCol(col){
        var result = 0;
        for(var i = 0; i < gameOptions.fieldSize.height; i++){
            if(this.tiles[i][col] == null){
                result ++;
            }
        }
        return result;
    }

    findHolesBelow(row, col) {
        var result = 0;
        for (var i = row + 1; i < gameOptions.fieldSize.height; i++) {
            if (this.tiles[i][col] == null) {
                result ++;
            }
        }
        return result;
    }

    tilePicked (e){
        this.answer = "";

        this.visitedTiles = [];
        this.visitedTiles.length = 0;

        var y = Math.floor((e.position.y - this.y) / gameOptions.tileSize);
        var x = Math.floor((e.position.x - this.x) / gameOptions.tileSize);

        let tile = this.tiles[y][x].getAt(0);

        this.addAnswer(tile.value);

        tile.tint = this.altTintColor;
        tile.picked = true;

        this.background.off('pointerdown', this.tilePicked, this);

        this.background.on('pointerup', this.tileReleased, this);
        this.background.on('pointermove', this.tileMoved, this);

        this.visitedTiles.push(tile.coordinate);
    }

    addAnswer(val) {
        if (val != "") {
            this.answer += val;
        } else {
            this.answer = this.answer.substr(0, this.answer.length-1);
        }
        
        this.emit("ANSWER_CHANGED", this.answer);
    }

};