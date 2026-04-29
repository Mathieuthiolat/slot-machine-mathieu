import * as PIXI from 'pixi.js';

export class ReelGrid {
  constructor({ bands, symbolSize = 100, spacing = 20, visibleRows = 3 ,debug = false}) {
    this.bands = bands;
    this.symbolSize = symbolSize;
    this.spacing = spacing;
    this.visibleRows = visibleRows;

    this.cellSize = this.symbolSize + this.spacing;
    this.gridWidth = this.bands.length * this.cellSize;
    this.gridHeight = this.visibleRows * this.cellSize;

    this.positions = debug
        ? [0, 11, 1, 10, 14]
        : new Array(this.bands.length).fill(0);

    this.container = new PIXI.Container();
    this.container.pivot.set(this.gridWidth / 2, this.gridHeight / 2);
    
    this.debugBorder = new PIXI.Graphics();
    this.debug = debug;

    if (this.debug) {// I had an issue when creating the bands.js assets so i made a check to be sure
      bands.forEach((band, i) => {
        if(band.length != 20){
          console.error(`Band ${i} is invalid: expected 20 symbols, got ${band.length}`)
        }
      });
    }
    
  }

  center(app) {
    this.container.x = app.screen.width / 2;
    this.container.y = app.screen.height / 2;
  }

  createDebugBorder() { //Helping debug to improve placement
    this.debugBorder.clear();
    this.debugBorder.rect(0, 0, this.gridWidth, this.gridHeight);
    this.debugBorder.stroke({ width: 2, color: 0xff0000 });
  }

  getVisibleSymbols(band, position) {
    const result = [];

    for (let row = 0; row < this.visibleRows; row++) {
      const symbolIndex = (position + row) % band.length;
      result.push(band[symbolIndex]);
    }

    return result;
  }

  getGrid() {
    return this.bands.map((band, index) =>
      this.getVisibleSymbols(band, this.positions[index])
    );
  }

  spin() {
    for (let i = 0; i < this.positions.length; i++) {
      this.positions[i] = Math.floor(Math.random() * this.bands[i].length);
    }

    this.render();
  }

  render() {
    this.container.removeChildren();

    const grid = this.getGrid();

    for (let reelIndex = 0; reelIndex < grid.length; reelIndex++) {
      for (let rowIndex = 0; rowIndex < grid[reelIndex].length; rowIndex++) {
        this.showSymbol(grid[reelIndex][rowIndex], reelIndex, rowIndex);
      }
    }

    if (this.debug) {
      this.createDebugBorder();
      this.container.addChild(this.debugBorder);
    }
  }

  showSymbol(symbolId, reelIndex, rowIndex) {
    const symbolSprite = PIXI.Sprite.from(symbolId);

    symbolSprite.anchor.set(0.5);
    symbolSprite.width = this.symbolSize;
    symbolSprite.height = this.symbolSize;

    symbolSprite.x = reelIndex * this.cellSize + this.cellSize / 2;
    symbolSprite.y = rowIndex * this.cellSize + this.cellSize / 2 ;

    this.container.addChild(symbolSprite);
  }
}