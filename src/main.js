import * as PIXI from 'pixi.js';

const app = new PIXI.Application();

await app.init({
  resizeTo: window,
  backgroundColor: 0x1099bb,
});

document.body.appendChild(app.canvas);


const symbolSize = 100;
const spacing = 20;

const cellSize = symbolSize + spacing;

const gridWidth = 5 * cellSize;
const gridHeight = 3 * cellSize;

const bands = [
  ["hv2", "lv3", "lv3", "hv1", "hv1", "lv1", "hv1", "hv4", "lv1", "hv3", "hv2", "hv3", "lv4", "hv4", "lv1", "hv2", "lv4", "lv1", "lv3", "hv2"],
  ["hv1", "lv2", "lv3", "lv2", "lv1", "lv1", "lv4", "lv1", "lv1", "hv4", "lv3", "hv2", "lv1", "lv3", "hv1", "lv1", "lv2", "lv4", "lv3", "lv2"],
  ["lv1", "hv2", "lv3", "lv4", "hv3", "hv2", "lv2", "hv2", "hv2", "lv1", "hv3", "lv1", "hv1", "lv2", "hv3", "hv2", "hv4", "hv1", "lv2", "lv4"],
  ["hv2", "lv2", "hv3", "lv2", "lv4", "lv4", "hv3", "lv2", "lv4", "hv1", "lv1", "hv1", "lv2", "hv3", "lv2", "lv3", "hv2", "lv1", "hv3", "lv2"],
  ["lv3", "lv4", "hv2", "hv3", "hv4", "hv1", "hv3", "hv2", "hv2", "hv4", "hv4", "hv2", "lv2", "hv4", "hv1", "lv2", "hv1", "lv2", "hv4", "lv4"]
];
  
const assets = [
    { alias: 'hv1', src: '/assets/hv1_symbol.png' },
    { alias: 'hv2', src: '/assets/hv2_symbol.png' },
    { alias: 'hv3', src: '/assets/hv3_symbol.png' },
    { alias: 'hv4', src: '/assets/hv4_symbol.png' },
    { alias: 'lv1', src: '/assets/lv1_symbol.png' },
    { alias: 'lv2', src: '/assets/lv2_symbol.png' },
    { alias: 'lv3', src: '/assets/lv3_symbol.png' },
    { alias: 'lv4', src: '/assets/lv4_symbol.png' },
    { alias: 'spinButton', src: '/assets/spin_button.png' },
  ];
await PIXI.Assets.load(assets);

const positions = [0, 0, 0, 0, 0];
const reels = [
  bands[0],
  bands[1],
  bands[2],
  bands[3],
  bands[4],
];

const reelsContainer = new PIXI.Container();
app.stage.addChild(reelsContainer);
reelsContainer.pivot.set(gridWidth / 2, gridHeight / 2);
reelsContainer.x = app.screen.width / 2;
reelsContainer.y = app.screen.height / 2;

const spinButton = PIXI.Sprite.from('spinButton');

spinButton.anchor.set(0.5);
spinButton.width = 100;
spinButton.height = 100;

spinButton.x = app.screen.width / 2;
spinButton.y = reelsContainer.y + gridHeight + 80;

spinButton.eventMode = 'static';
spinButton.cursor = 'pointer';

app.stage.addChild(spinButton);

spinButton.on('pointertap', spin);

function getVisibleSymbols(band, position, visibleCount = 3) {
  const result = [];

  for (let row = 0; row < visibleCount; row++) {
    const symbolIndex = (position + row) % band.length;
    result.push(band[symbolIndex]);
  }

  return result;
}

function spin() {
  for (let i = 0; i < positions.length; i++) {
    positions[i] = Math.floor(Math.random() * bands[i].length);
  }

  showReels(bands, positions);
}

function showSymbol(symbolId, reelIndex, rowIndex) {
  const symbolSprite = PIXI.Sprite.from(symbolId);

  symbolSprite.anchor.set(0.5);
  symbolSprite.width = 100;
  symbolSprite.height = 100;

  symbolSprite.x = reelIndex * cellSize + cellSize / 2;
  symbolSprite.y = rowIndex * cellSize + cellSize / 2;

  reelsContainer.addChild(symbolSprite);
}

function showReels(bands, positions) {
  reelsContainer.removeChildren();

  for (let reelIndex = 0; reelIndex < bands.length; reelIndex++) {
    const visibleSymbols = getVisibleSymbols(
      bands[reelIndex],
      positions[reelIndex]
    );

    for (let rowIndex = 0; rowIndex < visibleSymbols.length; rowIndex++) {
      showSymbol(visibleSymbols[rowIndex], reelIndex, rowIndex);
    }
  }
}




const grid = reels.map((band, i) =>
  getVisibleSymbols(band, positions[i])
);


console.log(grid);