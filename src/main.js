import * as PIXI from 'pixi.js';
import { assets } from './config/assets.js';
import { bands } from './config/bands.js';
import { ReelGrid } from './classes/ReelGrid.js';

const app = new PIXI.Application();

await app.init({
  resizeTo: window,
  backgroundColor: 0x1099bb,
});

document.body.appendChild(app.canvas);

await PIXI.Assets.load(assets);

const reelGrid = new ReelGrid({
  bands,
  symbolSize: 100,
  spacing: 20,
});

app.stage.addChild(reelGrid.container);

reelGrid.center(app);
reelGrid.render();

const spinButton = PIXI.Sprite.from('spinButton');

spinButton.anchor.set(0.5);
spinButton.width = 100;
spinButton.height = 100;
spinButton.x = app.screen.width / 2;
spinButton.y = reelGrid.container.y + reelGrid.gridHeight;

spinButton.eventMode = 'static';
spinButton.cursor = 'pointer';

spinButton.on('pointertap', () => {
  reelGrid.spin();
});

app.stage.addChild(spinButton);