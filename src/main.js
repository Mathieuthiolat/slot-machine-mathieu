import * as PIXI from 'pixi.js';

//Import assets
import { assets } from './config/assets.js';
import { bands } from './config/bands.js';
import { paylines } from './config/paylines.js';
import { paytable } from './config/paytable.js';

//Import classes
import { Preloader } from './classes/Preloader.js';
import { ReelGrid } from './classes/ReelGrid.js';
import { WinCalculator } from './classes/WinCalculator.js';

const app = new PIXI.Application();

await app.init({
  resizeTo: window,
  backgroundColor: 0x1099bb,
  resolution: window.devicePixelRatio,
  autoDensity: true,
});

document.body.appendChild(app.canvas);

const preloader = new Preloader(app);

await preloader.load(assets);

const reelGrid = new ReelGrid({
  bands,
  symbolSize: 100,
  spacing: 20,
});
const winCalculator = new WinCalculator({
  paylines,
  paytable,
});

app.stage.addChild(reelGrid.container);

reelGrid.center(app);
reelGrid.render();

const spinButton = PIXI.Sprite.from('spinButton');
spinButton.anchor.set(0.5);
spinButton.width = 100;
spinButton.height = 100;
spinButton.x = app.screen.width / 2;
spinButton.y = reelGrid.container.y + reelGrid.gridHeight / 2 + 80;
spinButton.eventMode = 'static';
spinButton.cursor = 'pointer';
app.stage.addChild(spinButton);

const winText = new PIXI.Text({
  text: 'Total wins: 0',
  style: {
    fontSize: 20,
    fill: 0xffffff,
  },
});

winText.x = app.screen.width / 2;
winText.y = spinButton.y + 80;
winText.style.wordWrap = true;
winText.style.wordWrapWidth = app.screen.width * 0.8;
winText.anchor.set(0.5, 0);
app.stage.addChild(winText);

//Spin function to roll the grid and calculate wining
spinButton.on('pointertap', () => {
  reelGrid.spin();

  const result = winCalculator.calculate(reelGrid.getGrid());
  formatWinText(result);
});

function formatWinText(result) {
  let text = `Total wins: ${result.total}\n`;

  for (let i = 0; i < result.wins.length; i++) {
    text += `- payline ${result.wins[i].paylineId}, ${result.wins[i].symbol} x${result.wins[i].count}, ${result.wins[i].payout}\n`;
  }

  winText.text = text;

  fitTextToArea(
    winText,
    app.screen.width * 0.9,
    app.screen.height - winText.y - 20,
  );
}

function fitTextToArea(textObject, maxWidth, maxHeight) {
  textObject.scale.set(1);

  const scaleX = maxWidth / textObject.width;
  const scaleY = maxHeight / textObject.height;

  const scale = Math.min(1, scaleX, scaleY);

  textObject.scale.set(scale);
}

function layout() {
  reelGrid.center(app);

  spinButton.x = app.screen.width / 2;
  spinButton.y =
    reelGrid.container.y + reelGrid.gridHeight / 2 + 60;

  winText.x = app.screen.width / 2;
  winText.y = spinButton.y + spinButton.height / 2 + 20;

  fitTextToArea(
    winText,
    app.screen.width * 0.9,
    app.screen.height - winText.y - 20
  );
}
window.addEventListener('resize', layout);
layout();

const resultInitial = winCalculator.calculate(reelGrid.getGrid());
formatWinText(resultInitial);
