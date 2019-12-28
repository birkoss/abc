class Map extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene);
        scene.add.existing(this);

        this.options = {
            fallSpeed: 250,
            grid: {
                width: 5,
                height: 8
            }
        };

        this.tileSize = 70;

        this.create();

        this.answer = "";
    }

    create() {
        this.tiles = [];
        this.arrows = [];

        this.pool = [];

        this.background = this.scene.add.sprite(0, 0, "tileset:forest");
        this.add(this.background);

        this.totalFrequencies = 0;
        for (var letter in this.scene.cache.json.get('data:frequency')) {
            this.totalFrequencies += this.scene.cache.json.get('data:frequency')[letter];
        }

        for(var y = 0; y < this.options.grid.height; y++) {
            this.tiles[y] = [];
            for(var x = 0; x < this.options.grid.width; x++) {
                var tileXPos = x * this.tileSize + this.tileSize / 2;
                var tileYPos = y * this.tileSize + this.tileSize / 2;

                var tile = new Tile(this.scene);
                tile.setCoordinate(x, y);
                tile.setLetter(this.pickLetter());

                this.tiles[y][x] = tile;

                tile.x = tileXPos;
                tile.y = tileYPos;

                this.add(tile);
            }
        }

        /* Make the background as big as the tiles */
        this.background.displayWidth = this.tileSize * this.options.grid.width;
        this.background.displayHeight = this.tileSize * this.options.grid.height;
        this.background.x = this.background.displayWidth / 2;
        this.background.y = this.background.displayHeight / 2;
        this.background.alpha = 0.1;
        this.background.setInteractive();
        
        this.startTurn();
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

    selectTile(tile) {
        tile.select();
        this.visitedTiles.push(tile.coordinate);

        this.highlightNeighboors(tile, true);
    }

    highlightNeighboors(tile, status) {
        for (let x2=-1; x2<=1; x2++) {
            for (let y2=-1; y2<=1; y2++) {
                if ((x2 == 0 || y2 == 0) && (x2 != y2)) {
                    let newX = tile.coordinate.x + x2;
                    let newY = tile.coordinate.y + y2;
                    if (newX >= 0 && newX < this.options.grid.width && newY >= 0 && newY < this.options.grid.height) {
                        if (status) {
                            this.tiles[newY][newX].highlight();
                        } else {
                            this.tiles[newY][newX].unhighlight();
                        }
                    }
                }
            }
        }
    }

    tileMoved(e) {
        var y = Math.floor((e.position.y - this.y) / this.tileSize);
        var x = Math.floor((e.position.x - this.x) / this.tileSize);

        let tile = this.tiles[y][x];

        /* Only apply the movement if we are close to the center of the tile */
        var distance = new Phaser.Math.Vector2((e.position.x - this.x) - (x * this.tileSize), (e.position.y - this.y) - (y * this.tileSize)).distance(new Phaser.Math.Vector2(this.tileSize / 2, this.tileSize / 2));
        if (distance > this.tileSize * 0.4) {
            return;
        }

        if (!tile.picked && this.isNeighboor(tile.coordinate, this.visitedTiles[ this.visitedTiles.length - 1 ])) {
            this.selectTile(tile);

            var fromPos = this.visitedTiles[this.visitedTiles.length - 2];
            var arrow = this.scene.add.sprite(this.tiles[fromPos.y][fromPos.x].x, this.tiles[fromPos.y][fromPos.x].y, "arrows");
            this.add(arrow);
            arrow.setScale(0.5);
            arrow.tint = 0xd3bf8f;
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

            this.addAnswer(tile.letter);

            this.arrows.push(arrow);
        } else if (this.visitedTiles.length > 1) {
            if (this.visitedTiles[ this.visitedTiles.length - 2 ].x == x && this.visitedTiles[ this.visitedTiles.length - 2 ].y == y) {
                let coordinate = this.visitedTiles.pop();

                /* Remove the last tile, and unselect its neighboors */
                let tile = this.tiles[coordinate.y][coordinate.x];
                tile.unselect();
                this.highlightNeighboors(tile);

                /* Remove the last arrow */
                let arrow = this.arrows.pop();
                arrow.destroy();

                /* Retry to highlight all visitedTiles neighboors */
                this.visitedTiles.forEach(single_coordinate => {
                    let tile = this.tiles[single_coordinate.y][single_coordinate.x];
                    this.highlightNeighboors(tile, true);
                }, this);

                this.addAnswer("");
            }
        }
    }

    isValidWord() {
        if (this.scene.cache.json.get('data:words')[this.answer.length]) {
            let words = this.scene.cache.json.get('data:words')[this.answer.length];
            for(let i=0; i<words.length; i++) {
                if (words[i] == this.answer) {
                    return true;
                    break;
                }
            }
        }
        return false;
    }

    tileReleased(e) {
        this.background.off('pointerup', this.tileReleased, this);
        this.background.off('pointermove', this.tileMoved, this);

        this.arrows.forEach(single_arrow => {
            single_arrow.destroy();
        });
        this.arrows = [];
        this.arrows.length = 0;

        /* Add all highlighted tiles in the visitedTiles to remove them */
        for(var y = 0; y < this.options.grid.height; y++) {
            for(var x = 0; x < this.options.grid.width; x++) {
                if (this.tiles[y][x].highlighted && !this.tiles[y][x].picked) {
                    this.visitedTiles.push(new Phaser.Math.Vector2(x, y));
                }
            }
        }

        console.log(this.visitedTiles.length);

        /* Unselect and unhighligth all tiles */
        for (let i = 0; i < this.visitedTiles.length; i++) {
            this.tiles[this.visitedTiles[i].y][this.visitedTiles[i].x].unhighlight();
            this.tiles[this.visitedTiles[i].y][this.visitedTiles[i].x].unselect();
        }

        let wordValid = this.isValidWord();

        if (wordValid) {
            /* Remove existing tiles and add those in a pool */
            for (var i = 0; i < this.visitedTiles.length; i++) {
                this.tiles[this.visitedTiles[i].y][this.visitedTiles[i].x].visible = false;
                this.pool.push(this.tiles[this.visitedTiles[i].y][this.visitedTiles[i].x]);
                this.tiles[this.visitedTiles[i].y][this.visitedTiles[i].x] = null;
            }

            /* Fall remaining tiles */
            for (var i = this.options.grid.height - 1; i >= 0; i--) {
                for (var j = 0; j < this.options.grid.width; j++) {
                    if (this.tiles[i][j] != null) {
                        var holes = this.findHolesBelow(i, j);
                        if(holes > 0) {
                            var coordinate = new Phaser.Math.Vector2(this.tiles[i][j].coordinate.x, this.tiles[i][j].coordinate.y);
                            var destination = new Phaser.Math.Vector2(j, i + holes);
                            
                            this.scene.tweens.add({
                                targets: this.tiles[i][j],
                                y: this.tiles[i][j].y + holes * this.tileSize,
                                duration: this.options.fallSpeed,
                            });
                            this.tiles[destination.y][destination.x] = this.tiles[i][j]
                            this.tiles[coordinate.y][coordinate.x] = null;
                            this.tiles[destination.y][destination.x].coordinate = new Phaser.Math.Vector2(destination.x, destination.y)
                        }
                    }
                }
            }

            /* Place new tiles from the pool in missing spot */
            for (var i = 0; i < this.options.grid.width; i++) {
                var holes = this.findHolesInCol(i);
                if (holes > 0) {
                    for (var j = 1; j <= holes; j++) {
                        var tileXPos = i * this.tileSize + this.tileSize / 2;
                        var tileYPos = -j * this.tileSize + this.tileSize / 2;
                        var theTile = this.pool.pop();

                        theTile.x = tileXPos;
                        theTile.y = tileYPos;
                        theTile.visible = true;

                        theTile.unselect();

                        this.scene.tweens.add({
                            targets: theTile,
                            y: theTile.y + holes * this.tileSize,
                            duration: this.options.fallSpeed,
                        });
                        
                        theTile.coordinate = new Phaser.Math.Vector2(i, holes - j);
                        theTile.setLetter(this.pickLetter());
                        this.tiles[holes - j][i] = theTile;
                    }
                }
            }
        }

        this.startTurn();

        this.visitedTiles = [];
        this.visitedTiles.length = 0;
    }

    debugTiles() {
        for(var y = 0; y < this.options.grid.height; y++) {
            let row = [];
            for(var x = 0; x < this.options.grid.width; x++) {
                if (this.tiles[y][x] == null) {
                    row.push(" (_x_)");
                } else {
                    row.push(this.tiles[y][x].label.text+"(" + this.tiles[y][x].coordinate.x + "x" + this.tiles[y][x].coordinate.y + ")");
                }
            }
            console.log(row);
        }
        console.error("");
    }

    startTurn() {
        console.log("startTurn");

        this.background.off('pointerdown', this.tilePicked, this);
        this.background.on('pointerdown', this.tilePicked, this);
    }

    findHolesInCol(col){
        var result = 0;
        for(var i = 0; i < this.options.grid.height; i++){
            if(this.tiles[i][col] == null){
                result ++;
            }
        }
        return result;
    }

    findHolesBelow(row, col) {
        var result = 0;
        for (var i = row + 1; i < this.options.grid.height; i++) {
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

        var y = Math.floor((e.position.y - this.y) / this.tileSize);
        var x = Math.floor((e.position.x - this.x) / this.tileSize);

        let tile = this.tiles[y][x];

        this.addAnswer(tile.letter);

        this.background.off('pointerdown', this.tilePicked, this);

        this.background.on('pointerup', this.tileReleased, this);
        this.background.on('pointermove', this.tileMoved, this);

        this.selectTile(tile);
    }

    addAnswer(val) {
        if (val != "") {
            this.answer += val;
        } else {
            this.answer = this.answer.substr(0, this.answer.length-1);
        }
        
        this.emit("ANSWER_CHANGED", this.answer, this.isValidWord());
    }

};