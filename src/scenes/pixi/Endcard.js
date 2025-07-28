import * as PIXI from 'pixi.js';
import globals from '../../../globals';
import gsap from 'gsap';
import { openStorePage } from '../../../engine';
import data from '../../config/data';

const TextureCache = PIXI.utils.TextureCache;
let pixiScene;
export default class Endcard {
  constructor(didWon = false) {
    this.didWon = didWon;
    console.log('Endcard constructor');
    pixiScene = globals.pixiScene;
    this.init();
  }

  init() {
    console.log('Endcard start');
    if (data.isBackgroundImgOpen) {
      this.addBackground();
    } else {
      this.drawBackground();
    }
    this.addLogo();
    this.addButton();
    this.addHeaderText();

    gsap.delayedCall(0.7, () => {
      //openStorePage();
    });
  }

  drawBackground() {
    const bg = new PIXI.Graphics();
    bg.beginFill(data.backgroundColor);
    bg.drawRect(0, 0, window.innerWidth, window.innerHeight);
    bg.endFill();
    bg.alpha = data.backgroundAlpha;
    pixiScene.addChild(bg);
    bg.resize = (w, h) => {
      bg.width = w;
      bg.height = h;
    };
    bg.resize(window.innerWidth, window.innerHeight);
    bg.interactive = true;
    bg.buttonMode = true;
    bg.on('pointerdown', () => {
      openStorePage();
    });
    gsap.fromTo(
      bg,
      { pixi: { alpha: 0 } },
      { pixi: { alpha: data.backgroundAlpha }, duration: 0.4 }
    );
  }

  addHeaderText() {
    const cont = new PIXI.Container();
    pixiScene.addChild(cont);
    cont.visible = data.isHeaderTextOpen;
    cont.width = cont.iWidth = 100;
    cont.height = cont.iHeight = 100;
    const text = new PIXI.Text(data.headerText, {
      fontFamily: 'customInGameFont',
      fontSize: data.headerTextFontSize,
      fill: data.headerTextFontColor,
      align: 'center',
      stroke: data.headerTextFontStroke,
      strokeThickness: data.headerTextFontStrokeThickness,
      lineJoin: 'round',
    });
    text.anchor.set(0.5);
    cont.addChild(text);
    text.text = data.headerText.split('_').join('\n');

    cont.resize = (w, h) => {
      cont.scale.set(
        Math.min((w / cont.iWidth) * 0.8, (h / cont.iHeight) * 0.2) *
          data.headerTextScale
      );
      cont.y = h * data.headerTextPosY;
      cont.x = w * data.headerTextPosX;
    };
    cont.resize(window.innerWidth, window.innerHeight);

    //animate header text
    gsap.fromTo(
      text,
      { pixi: { scale: 0 } },
      { pixi: { scale: 1 }, duration: 0.8, ease: 'back.out(1.3)' }
    );
  }

  addButton() {
    const cont = new PIXI.Container();
    pixiScene.addChild(cont);

    const button = PIXI.Sprite.from(TextureCache['endCardButton']);
    button.anchor.set(0.5);
    button.interactive = true;
    button.buttonMode = true;
    button.on('pointerdown', () => {
      openStorePage();
    });
    button.visible = data.isButtonOpen;

    cont.addChild(button);
    cont.iWidth = button.width;
    cont.iHeight = button.height;

    cont.resize = (w, h) => {
      cont.scale.set(
        Math.min((w * 0.6) / cont.iWidth, (h * 0.15) / cont.iHeight) *
          data.buttonScale
      );
      cont.y = h * data.buttonPosY;
      cont.x = w * data.buttonPosX;
    };
    cont.resize(window.innerWidth, window.innerHeight);

    const text = new PIXI.Text(data.buttonText, {
      fontFamily: 'customInGameFont',
      fontSize: 60,
      fill: data.buttonTextFontColor,
      align: 'center',
      stroke: data.buttonTextFontStroke,
      strokeThickness: data.buttonTextFontStrokeThickness,
      lineJoin: 'round',
    });
    text.anchor.set(0.5);
    button.addChild(text);

    text.scale.set(
      Math.min(
        (cont.iWidth * 0.8) / text.width,
        (cont.iHeight * 0.8) / text.height
      ) * data.buttonTextScale
    );

    //animate button
    gsap.fromTo(
      button,
      { pixi: { scale: 0 } },
      {
        pixi: { scale: 1 },
        duration: 0.6,
        ease: 'sine.out',
        onComplete: () => {
          gsap.to(button, {
            pixi: { scale: 1.1 },
            duration: 1,
            // ease: "power1.in",
            repeat: -1,
            yoyo: true,
          });
        },
      }
    );
  }

  addLogo() {
    const cont = new PIXI.Container();
    pixiScene.addChild(cont);

    const logo = PIXI.Sprite.from(TextureCache['endCardLogo']);
    logo.anchor.set(0.5);
    logo.visible = data.isLogoOpen;
    cont.width = cont.iWidth = logo.width;
    cont.width = cont.iHeight = logo.height;
    cont.addChild(logo);

    cont.resize = (w, h) => {
      cont.scale.set(
        Math.min((w * 0.9) / cont.iWidth, (h * 0.3) / cont.iHeight) *
          data.logoScale
      );
      cont.y = h * data.logoPosY;
      cont.x = w * data.logoPosX;
    };
    cont.resize(window.innerWidth, window.innerHeight);

    //animate logo
    gsap.fromTo(
      logo,
      { pixi: { scale: 0 } },
      { pixi: { scale: 1 }, duration: 0.8, ease: 'back.out(1.3)' }
    );
  }

  addBackground() {
    const background = PIXI.Sprite.from(TextureCache['background']);
    background.anchor.set(0.5);
    background.iWidth = background.width;
    background.iHeight = background.height;

    background.resize = (w, h) => {
      background.scale.set(
        Math.max(w / background.iWidth, h / background.iHeight)
      );
      background.position.set(w / 2, h / 2);
    };
    background.resize(window.innerWidth, window.innerHeight);

    pixiScene.addChild(background);
    background.interactive = true;
    background.buttonMode = true;
    background.on('pointerdown', () => {
      openStorePage();
    });

    //animate background
    gsap.fromTo(
      background,
      { pixi: { alpha: 0 } },
      { pixi: { alpha: 1 }, duration: 0.4 }
    );
  }
}
