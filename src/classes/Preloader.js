import * as PIXI from 'pixi.js';

export class Preloader {
  constructor(app) {
    this.app = app;
    this.loaderText = null;
  }

  show() {
    this.loaderText = new PIXI.Text({
        text: 'Loading 0%',
        style: {
            fontSize: 40,
            fill: 0xffffff,
        },
    });

    this.loaderText.anchor.set(0.5);
    this.loaderText.x = this.app.screen.width / 2;
    this.loaderText.y = this.app.screen.height / 2;

    this.app.stage.addChild(this.loaderText);
  }

  update(progress) {
    const percent = Math.round(progress * 100);
    this.loaderText.text = `Loading ${percent}%`;
  }

  hide() {
    this.app.stage.removeChild(this.loaderText);
    this.loaderText.destroy();
    this.loaderText = null;
  }

  async load(assets) {
    this.show();

    // laisse le temps d’afficher "Loading 0%"
    await new Promise(requestAnimationFrame);

    await PIXI.Assets.load(assets, (progress) => {
      this.update(progress);
    });

    // force affichage 100%
    this.update(1);

    // petite pause visuelle (optionnelle mais nice)
    await new Promise((resolve) => setTimeout(resolve, 300));

    this.hide();
  }
}