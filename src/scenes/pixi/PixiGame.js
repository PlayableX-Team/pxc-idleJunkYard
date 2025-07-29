import gsap from 'gsap';
import * as PIXI from 'pixi.js';
import Joystick3D from './scripts.js/joystick';
import { getDevicePlatform, openStorePage } from '../../../engine';
import globals from '../../../globals';
import Endcard from './Endcard';
import { Spine } from '@pixi-spine/all-4.1';
import data from '../../config/data';
import AudioManager from '../../../engine/audio/AudioManager';
import * as THREE from 'three';
import Powerup from './pwoerup.js';
// ... existing imports ...

let pixiScene = null;
let pixiApp = null;

const TextureCache = PIXI.utils.TextureCache;
// console.log("TextureCache", TextureCache);
export default class PixiGame {
  constructor() {
    console.log('Game constructor');

    pixiScene = globals.pixiScene;
    pixiApp = globals.pixiApp;
    globals.pixiGame = this;
  }

  start() {
    console.log('Game start');
    this.addCtaButton();
    this.addLogo();
    // this.createUpgradePopup();
    // this.addHand();
    this.createCashContainer();
    this.addAnalogTutorial();
    this.addHelper();
    // this.addTutorialText();
    if (data.xSecondsForEndCard > 0) {
      gsap.delayedCall(data.xSecondsForEndCard, () => {
        new Endcard(true);
      });
    }
    if (data.xSecondsForStore > 0) {
      gsap.delayedCall(data.xSecondsForStore, () => {
        openStorePage();
      });
    }

    globals.joystick = new Joystick3D();

    globals.EventEmitter.on('gameFinished', () => {
      if (globals.gmovr) return;
      globals.EventEmitter.emit('endcard_shown');
      new Endcard(true);
      globals.gmovr = true;
      // AudioManager.stopAllSFX();
    });

    document.addEventListener('keydown', (event) => {
      // console.log(event);
      if (event.key == 'e') {
        new Endcard(true);
      }
      if (event.key == 'u') {
        this.upgradePopup.visible = true;
        this.tutorialCall();
      }
    });

    globals.EventEmitter.on('upgrade_open', () => {
      if (globals.upgradeClosedOnPurpose) return;
      if (this.upgradePopup.visible) return;
      // console.log("upgrade Area");

      this.upgradePopup.visible = true;
      this.tutorialCall();
    });
    globals.EventEmitter.on('upgrade_close', () => {
      if (!this.upgradePopup.visible) return;

      this.upgradePopup.visible = false;
      this.tutorialKill();
    });
    this.powerUps = [];
    this.addPowerUpPanel();
    this.addCapacityFullText();

    // gsap.delayedCall(1, () => {
    //   new Endcard(true);
    // });
  }

  addPowerUpPanel() {
    const cont = new PIXI.Container();
    pixiScene.addChild(cont);
    const bg = PIXI.Sprite.from(TextureCache['powerUpPanel']);
    cont.iWidth = bg.width;
    cont.iHeight = bg.height;
    bg.anchor.set(0.5);

    cont.addChild(bg);
    this.powerUpPanel = cont;

    const posConfig = {
      obj1: { x: -240, y: -160 },
      obj2: { x: -240, y: -60 },
      obj3: { x: -240, y: 40 },
      obj4: { x: -240, y: 140 },
    };

    // Tüm power-up'ları tanımla
    const powerUpConfigs = [
      {
        cost: data.magnetPowerCost,
        type: 'magnetPower',
        text: data.magnetPowerText,
        effect: data.magnetPowerUpgradeEffect,
        upgradeType: 'power',
        isOn: data.isMagneyPowerupOn,
      },
      {
        cost: data.magnetRangeCost,
        type: 'magnetRange',
        text: data.magnetRangeText,
        effect: data.magnetRangeUpgradeEffect,
        upgradeType: 'range',
        isOn: data.isMagnetRangePowerupOn,
      },
      {
        cost: data.magnetCapacityCost,
        type: 'magnetCapacity',
        text: data.magnetCapacityText,
        effect: data.magnetCapacityUpgradeEffect,
        upgradeType: 'capacity',
        isOn: data.isMagnetCapacityPowerupOn,
      },
      {
        cost: data.vehicleSpeedCost,
        type: 'vehicleSpeed',
        text: data.vehicleSpeedText,
        effect: data.vehicleSpeedUpgradeEffect,
        upgradeType: 'speed',
        isOn: data.isVehicleSpeedPowerupOn,
      },
    ];

    // Sadece açık olan power-up'ları filtrele
    const activePowerUps = powerUpConfigs.filter((config) => config.isOn);

    // Açık olan power-up'ları sırasıyla obj pozisyonlarına yerleştir
    const positionKeys = ['obj1', 'obj2', 'obj3', 'obj4'];

    activePowerUps.forEach((config, index) => {
      if (index < positionKeys.length) {
        const position = posConfig[positionKeys[index]];
        const powerUp = new Powerup(
          config.cost,
          config.type,
          0.5,
          bg,
          position.x,
          position.y,
          config.text,
          config.effect,
          config.upgradeType
        );
        this.powerUps.push(powerUp);
      }
    });

    const crossButton = PIXI.Sprite.from(TextureCache['crossButton']);
    crossButton.anchor.set(0.5);
    crossButton.scale.set(1.1);
    cont.addChild(crossButton);
    crossButton.position.set(
      cont.iWidth / 2 - crossButton.width / 2 + 10,
      -cont.iHeight / 2 + crossButton.height / 2 - 30
    );
    this.crossButton = crossButton;
    crossButton.interactive = true;
    crossButton.buttonMode = true;
    crossButton.on('pointerdown', () => {
      AudioManager.playSFX('tap');
      globals.threeGame.cameraReset();
      this.tutorialHand.visible = false;
      gsap.to(cont, {
        pixi: { alpha: 0 },
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          cont.visible = false;
        },
      });
    });

    cont.resize = (w, h) => {
      globals.threesc;
      cont.scale.set(
        Math.min((w * 0.55) / cont.iWidth, (h * 0.4) / cont.iHeight)
      );

      if (w < h) {
        cont.position.set(w * 0.5, h * 0.75);
      } else {
        cont.position.set(w * 0.8, h * 0.5);
      }
    };
    cont.resize(window.innerWidth, window.innerHeight);
    this.powerUpPanel.visible = false;
    this.powerUpPanel.alpha = 0;

    const hand = PIXI.Sprite.from(TextureCache['hand']);
    hand.anchor.set(0.5);
    hand.scale.set(data.handScale);
    cont.addChild(hand);
    hand.position.set(data.handPosX, data.handPosY);
    hand.rotation = data.handAngle;
    this.hand = hand;
    gsap.to(hand.scale, {
      x: hand.scale.x * 0.9,
      y: hand.scale.y * 0.9,
      duration: 0.5,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1,
    });
    this.tutorialHand = hand;
  }

  addTutorialText() {
    const cont = new PIXI.Container();

    pixiScene.addChild(cont);

    const wrapper = new PIXI.Sprite.from(TextureCache['white_box']);
    wrapper.anchor.set(0.5);

    cont.width = cont.iWidth = wrapper.width;
    cont.height = cont.iHeight = wrapper.height;

    // wrapper.position.set(wrapper.iWidth / 2, wrapper.iHeight / 2);
    cont.addChild(wrapper);

    const tractor = new PIXI.Sprite.from(TextureCache['tractor']);
    tractor.anchor.set(0.5);
    tractor.scale.set(0.5);
    wrapper.addChild(tractor);
    tractor.x = -150;
    tractor.visible = false;

    const lumber = new PIXI.Sprite.from(TextureCache['lumber']);
    lumber.anchor.set(0.5);
    lumber.scale.set(0.5);
    wrapper.addChild(lumber);
    lumber.x = -150;
    lumber.visible = false;

    const text = new PIXI.Text(data.tutorialText, {
      fontFamily: 'customInGameFont',
      fontSize: 64,
      fill: 'white',
      align: 'center',
      stroke: 'black',
      strokeThickness: 12,
      wordWrap: true,
      wordWrapWidth: 600,
      lineJoin: 'round',
    });

    text.anchor.set(0.5);
    wrapper.addChild(text);
    text.x = (cont.iWidth / 2) * 0.25;
    text.scale.set(
      Math.min(
        (cont.iWidth * 0.65) / text.width,
        (cont.iHeight * 0.9) / text.height
      )
    );

    cont.resize = (w, h) => {
      cont.scale.set(
        Math.min((w * 0.6) / cont.iWidth, (h * 0.15) / cont.iHeight)
      );
      cont.position.set(w / 2, h * 0.2);
    };
    cont.resize(window.innerWidth, window.innerHeight);
    wrapper.scale.set(0);

    globals.EventEmitter.on('tutorialShow', (key) => {
      console.log('tutorial show', key);
      if (key == 'lumber') {
        lumber.visible = true;
        tractor.visible = false;
      } else {
        lumber.visible = false;
        tractor.visible = true;
      }
      text.text = data[key + 'Text'];

      text.scale.set(
        Math.min(
          (cont.iWidth * 0.65) / text.width,
          (cont.iHeight * 0.6) / text.height
        )
      );

      console.log('upgrade affordable');
      if (wrapper.scale.x != 0) return;
      gsap.to(wrapper, {
        pixi: { scale: 1 },
        duration: 0.5,
        ease: 'back.out',
        onComplete: () => {
          gsap.to(wrapper, {
            pixi: { scale: 0.95 },
            duration: 0.5,
            yoyo: true,
            repeat: -1,
          });
        },
      });
    });

    // globals.EventEmitter.on('logCollected', () => {
    //   if (this.lumberCalled) return;
    //   if (
    //     globals.currentCash +
    //       data.logPrice * globals.harvester.logsLoaded.length >=
    //       data.powerUpgradeCost ||
    //     globals.currentCash +
    //       data.logPrice * globals.harvester.logsLoaded.length >=
    //       data.speedUpgradeCost
    //   ) {
    //     this.lumberCalled = true;
    //     globals.EventEmitter.emit('tutorialShow', 'lumber');
    //     globals.tutorialTarget = new THREE.Vector3(20, 0, 5);
    //   }
    // });

    // globals.EventEmitter.on('logSelled', () => {
    //   if (this.tractorCalled) return;
    //   gsap.killTweensOf(wrapper);
    //   wrapper.scale.set(0);
    //   if (
    //     globals.currentCash +
    //       data.logPrice * globals.harvester.logsLoaded.length >=
    //       data.powerUpgradeCost ||
    //     globals.currentCash +
    //       data.logPrice * globals.harvester.logsLoaded.length >=
    //       data.speedUpgradeCost
    //   ) {
    //     this.tractorCalled = true;
    //     globals.EventEmitter.emit('tutorialShow', 'tractor');
    //     globals.tutorialTarget = new THREE.Vector3(8, 0, -15);
    //   }
    // });

    globals.EventEmitter.on('saw_upgrade', () => {
      gsap.killTweensOf(wrapper);
      wrapper.scale.set(0);
    });

    globals.EventEmitter.on('speed_upgrade', () => {
      gsap.killTweensOf(wrapper);
      wrapper.scale.set(0);
    });
  }

  addAnalogTutorial() {
    const s_cont = new PIXI.Container();
    s_cont.width = s_cont.iWidth = 100;
    s_cont.height = s_cont.iHeight = 100;
    globals.pixiScene.addChild(s_cont);
    const spine = new Spine(TextureCache['Analog_Spine'].spineData);
    spine.state.setAnimation(0, 'animation', true);
    // console.log(spine);
    spine.position.set(0, 50);
    s_cont.addChild(spine);
    s_cont.resize = (w, h) => {
      s_cont.scale.set(
        Math.min((w * 0.1) / s_cont.iWidth, (h * 0.1) / s_cont.iHeight)
      );
      s_cont.position.set(w / 2, h * 0.75);

      if (w > h) {
        s_cont.scale.set(
          Math.min((w * 0.05) / s_cont.iWidth, (h * 0.05) / s_cont.iHeight)
        );
        s_cont.position.set(w / 2, h * 0.75);
      }
    };
    s_cont.resize(window.innerWidth, window.innerHeight);

    let tutorialText = new PIXI.Text(data.tutorialText, {
      fontFamily: 'customInGameFont',
      fontSize: data.tutorialTextFontSize,
      fill: data.tutorialTextFontColor,
      align: 'center',
      stroke: data.tutorialTextFontStroke,
      strokeThickness: data.tutorialTextFontStrokeThickness,
      lineJoin: 'round',
    });
    tutorialText.anchor.set(0.5);
    s_cont.addChild(tutorialText);
    tutorialText.position.set(0, -150);

    globals.analogTutorial = s_cont;

    globals.pixiScene.on('pointerdown', () => {
      s_cont.visible = false;
      globals.tutorialDelay && globals.tutorialDelay.kill();
      gsap.to(this.helperCont, {
        pixi: { scale: 1 },
        duration: 0.5,
        ease: 'power2.out',
      });
    });

    globals.pixiScene.on('pointerup', () => {
      return;
      globals.tutorialDelay = gsap.delayedCall(5, () => {
        s_cont.visible = true;
      });
    });
  }

  addCtaButton() {
    const cont = new PIXI.Container();
    pixiScene.addChild(cont);

    const button = PIXI.Sprite.from(TextureCache['gameButton']);
    button.anchor.set(0.5);
    button.interactive = true;
    button.buttonMode = true;
    button.on('pointerdown', () => {
      openStorePage();
    });
    gsap.to(button, {
      pixi: { scale: 0.95 },
      duration: 0.8,
      repeat: -1,
      yoyo: true,
    });

    cont.addChild(button);
    cont.iWidth = button.width;
    cont.iHeight = button.height;

    cont.resize = (w, h) => {
      cont.scale.set(
        Math.min((w * 0.3) / cont.iWidth, (h * 0.05) / cont.iHeight) *
          data.gameButtonScale
      );
      cont.y = h - cont.height * data.gameButtonPosY;
      cont.x = w - cont.width * data.gameButtonPosX;
    };
    cont.resize(window.innerWidth, window.innerHeight);

    const text = new PIXI.Text(data.gameButtonText, {
      fontFamily: 'customInGameFont',
      fontSize: 64,
      fill: data.gameButtonTextFontColor,
      align: 'center',
      stroke: data.gameButtonTextFontStroke,
      strokeThickness: data.gameButtonTextFontStrokeThickness,
      wordWrap: true,
      wordWrapWidth: cont.iWidth * 0.8,
      lineJoin: 'round',
    });
    text.anchor.set(0.5);
    button.addChild(text);

    text.scale.set(
      Math.min(
        ((cont.iWidth * 0.8) / text.width) * data.gameButtonTextScale,
        ((cont.iHeight * 0.8) / text.height) * data.gameButtonTextScale
      )
    );
  }

  addLogo() {
    const logo = PIXI.Sprite.from(TextureCache['logo']);
    logo.anchor.set(0.5);

    logo.iWidth = logo.width;
    logo.iHeight = logo.height;

    logo.resize = (w, h) => {
      logo.scale.set(
        Math.min((w * 0.25) / logo.iWidth, (h * 0.05) / logo.iHeight) *
          data.gameLogoScale
      );
      logo.y = h - logo.height * data.gameLogoPosY;
      logo.x = logo.width * data.gameLogoPosX;
    };
    logo.resize(window.innerWidth, window.innerHeight);

    pixiScene.addChild(logo);
  }

  createCashContainer() {
    globals.currentCash = data.initialCash;
    this.cashContainer = new PIXI.Container();
    pixiScene.addChild(this.cashContainer);

    const bg = PIXI.Sprite.from(TextureCache['cash_ui']);
    bg.anchor.set(0.5);
    this.cashContainer.addChild(bg);
    bg.position.set(bg.width / 2, bg.height / 2);

    this.cashContainer.width = this.cashContainer.iWidth = bg.width;
    this.cashContainer.height = this.cashContainer.iHeight = bg.height;

    this.cashContainer.pivot.set(
      this.cashContainer.iWidth / 2,
      this.cashContainer.iHeight / 2
    );

    const text = new PIXI.Text(data.userStartMoney, {
      fontFamily: 'customInGameFont',
      fontSize: data.moneyBarTextFontSize,
      fill: data.moneyBarTextFontColor,
      align: 'center',
      stroke: data.moneyBarTextFontStroke,
      strokeThickness: data.moneyBarTextFontStrokeThickness,
      lineJoin: 'round',
    });
    text.anchor.set(0.5);
    bg.addChild(text);
    text.position.set(50, 0);

    const money = PIXI.Sprite.from(TextureCache['money']);
    money.anchor.set(0.5);
    bg.addChild(money);
    money.position.set(-60, 0);
    money.scale.set(0.75);
    this.money = money;

    // globals.EventEmitter.on('logSelled', () => {
    //   globals.currentCash += data.logPrice;
    // });
    this.cashContainer.text = text;

    this.cashContainer.resize = (w, h) => {
      this.cashContainer.scale.set(
        Math.min(
          (w * 0.35) / this.cashContainer.iWidth,
          (h * 0.1) / this.cashContainer.iHeight
        )
      );
      this.cashContainer.x = w - this.cashContainer.width * 0.5;
      this.cashContainer.y = this.cashContainer.height;
    };
    this.cashContainer.resize(window.innerWidth, window.innerHeight);
  }

  moneyAnimation() {
    // 3D objenin dünya pozisyonunu al
    const worldPosition = new THREE.Vector3();
    globals.threeGame.moneySpawnPoint.getWorldPosition(worldPosition);
    this.powerUps.forEach((powerUp) => {
      powerUp.updateButton();
    });

    // Kamera ve renderer referanslarını al
    const camera = globals.threeCamera;
    const renderer = globals.threeRenderer;

    // 3D pozisyonu 2D screen space'e dönüştür
    const vector = worldPosition.clone();
    vector.project(camera);

    // Normalized device coordinates (-1 to 1) to screen coordinates
    const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;

    // Money sprite'ını oluştur
    const money = PIXI.Sprite.from(TextureCache['money']);
    money.anchor.set(0.5);
    money.position.set(x, y);
    money.scale.set(0.25);
    pixiScene.addChild(money);

    // this.money objesinin global pozisyonunu al
    const targetPosition = this.money.toGlobal(new PIXI.Point(0, 0));

    // Para animasyonu - this.money'nin pozisyonuna ve scale'ine git
    gsap.to(money, {
      pixi: {
        x: targetPosition.x,
        y: targetPosition.y,
        scaleX: this.money.scale.x * this.cashContainer.scale.x,
        scaleY: this.money.scale.y * this.cashContainer.scale.y,
      },
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        // Animasyon bittiğinde sprite'ı sahadan kaldır
        pixiScene.removeChild(money);

        // Para miktarını güncelle (isteğe bağlı)
        // globals.currentCash += someAmount;

        // Ses efekti çal (isteğe bağlı)
        // AudioManager.playSFX('collect');
      },
    });
  }

  addHand() {
    const hand = PIXI.Sprite.from(TextureCache['hand']);
    hand.anchor.set(0.1, 0.1);
    // hand.position.set(this.face.x, this.face.y);
    // hand.scale.set(0.5);
    // hand.alpha = 0;
    this.upgradePopup.addChild(hand);

    // console.log("Hand added");
    this.hand = hand;
  }

  collectTextAnimation(displayText = 'COLLECTED', targetObj) {
    // Harvester'ın 3D dünya pozisyonunu al
    const worldPosition = new THREE.Vector3();
    targetObj.getWorldPosition(worldPosition);

    // Kamera referansını al
    const camera = globals.threeCamera;

    // 3D pozisyonu 2D screen space'e dönüştür
    const vector = worldPosition.clone();
    vector.project(camera);

    // Normalized device coordinates (-1 to 1) to screen coordinates
    const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;

    // Text oluştur
    const text = new PIXI.Text('+' + displayText, {
      fontFamily: 'customInGameFont',
      fontSize: data.junkCollectTextAnimationFontSize,
      fill: data.junkCollectTextAnimationFontColor,
      align: 'center',
      stroke: data.junkCollectTextAnimationFontStroke,
      strokeThickness: data.junkCollectTextAnimationFontStrokeThickness,
      lineJoin: 'round',
    });
    text.anchor.set(0.5);
    text.position.set(x, y);
    pixiScene.addChild(text);

    // Rastgele yatay saçılma (-100 ile +100 arası)
    const randomX = (Math.random() - 0.5) * 200;
    // Rastgele hız (0.8 ile 1.5 saniye arası)
    const randomDuration = 0.8 + Math.random() * 0.7;
    // Rastgele yukarı mesafe (150 ile 250 arası)
    const randomY = 150 + Math.random() * 100;

    // Text animasyonu - rastgele yönlerde saçıl, yukarı git ve fade out
    gsap.to(text, {
      pixi: {
        x: x + randomX,
        y: y - randomY,
        alpha: 0,
      },
      duration: 2,
      ease: 'power2.out',
      onComplete: () => {
        // Animasyon bittiğinde text'i sahneden kaldır
        pixiScene.removeChild(text);
      },
    });
  }

  addCapacityFullText() {
    const text = new PIXI.Text(data.capacityFullText, {
      fontFamily: 'customInGameFont',
      fontSize: data.capacityFullTextFontSize,
      fill: data.capacityFullTextFontColor,
      align: 'center',
      stroke: data.capacityFullTextFontStroke,
      strokeThickness: data.capacityFullTextFontStrokeThickness,
      lineJoin: 'round',
    });
    text.anchor.set(0.5);
    text.position.set(window.innerWidth / 2, window.innerHeight / 2);
    text.scale.set(0.5);
    text.resize = (w, h) => {
      text.position.set(w * 0.5, h * 0.8);
    };
    text.resize(window.innerWidth, window.innerHeight);
    pixiScene.addChild(text);
    this.capacityFullText = text;

    gsap.to(this.capacityFullText.scale, {
      x: this.capacityFullText.scale.x * 0.9,
      y: this.capacityFullText.scale.y * 0.9,
      duration: 0.5,
      ease: 'power1.in',
      yoyo: true,
      repeat: -1,
    });
    this.capacityFullText.alpha = 0;
  }

  addHelper() {
    const cont = new PIXI.Container();

    pixiScene.addChild(cont);

    const wrapper = new PIXI.Sprite.from(TextureCache['helperBox']);
    wrapper.anchor.set(0.5);
    wrapper.tint = data.helperBoxColor;

    cont.width = cont.iWidth = wrapper.width;
    cont.height = cont.iHeight = wrapper.height;

    // wrapper.position.set(wrapper.iWidth / 2, wrapper.iHeight / 2);
    cont.addChild(wrapper);

    const tractor = new PIXI.Sprite.from(TextureCache['collectJunk']);
    tractor.anchor.set(0.5);
    tractor.scale.set(data.collectJunkScale);
    wrapper.addChild(tractor);
    tractor.x = -150;

    this.helperImg = tractor;

    const text = new PIXI.Text(data.collectJunkText, {
      fontFamily: 'customInGameFont',
      fontSize: data.helperTextFontSize,
      fill: data.helperTextFontColor,
      align: 'center',
      stroke: data.helperTextFontStroke,
      strokeThickness: data.helperTextFontStrokeThickness,
      wordWrap: true,
      wordWrapWidth: 600,
      lineJoin: 'round',
    });

    text.anchor.set(0.5);
    this.helperText = text;
    wrapper.addChild(text);
    text.x = (cont.iWidth / 2) * 0.25;
    text.scale.set(
      Math.min(
        (cont.iWidth * 0.65) / text.width,
        (cont.iHeight * 0.9) / text.height
      )
    );

    cont.resize = (w, h) => {
      cont.scale.set(
        Math.min((w * 0.6) / cont.iWidth, (h * 0.15) / cont.iHeight)
      );
      cont.position.set(w * data.helperBoxPosX, h * data.helperBoxPosY);
    };
    cont.resize(window.innerWidth, window.innerHeight);
    this.helperCont = wrapper;
    this.helperCont.scale.set(0);
    //wrapper.scale.set(0);

    // globals.EventEmitter.on('tutorialShow', (key) => {
    //   console.log('tutorial show', key);
    //   if (key == 'lumber') {
    //     lumber.visible = true;
    //     tractor.visible = false;
    //   } else {
    //     lumber.visible = false;
    //     tractor.visible = true;
    //   }
    //   text.text = data[key + 'Text'];

    //   text.scale.set(
    //     Math.min(
    //       (cont.iWidth * 0.65) / text.width,
    //       (cont.iHeight * 0.6) / text.height
    //     )
    //   );

    //   console.log('upgrade affordable');
    //   if (wrapper.scale.x != 0) return;
    //   gsap.to(wrapper, {
    //     pixi: { scale: 1 },
    //     duration: 0.5,
    //     ease: 'back.out',
    //     onComplete: () => {
    //       gsap.to(wrapper, {
    //         pixi: { scale: 0.95 },
    //         duration: 0.5,
    //         yoyo: true,
    //         repeat: -1,
    //       });
    //     },
    //   });
    // });

    // globals.EventEmitter.on('logCollected', () => {
    //   if (this.lumberCalled) return;
    //   if (
    //     globals.currentCash +
    //       data.logPrice * globals.harvester.logsLoaded.length >=
    //       data.powerUpgradeCost ||
    //     globals.currentCash +
    //       data.logPrice * globals.harvester.logsLoaded.length >=
    //       data.speedUpgradeCost
    //   ) {
    //     this.lumberCalled = true;
    //     globals.EventEmitter.emit('tutorialShow', 'lumber');
    //     globals.tutorialTarget = new THREE.Vector3(-8, 0, -15);
    //   }
    // });

    // globals.EventEmitter.on('logSelled', () => {
    //   if (this.tractorCalled) return;
    //   gsap.killTweensOf(wrapper);
    //   wrapper.scale.set(0);
    //   if (
    //     globals.currentCash +
    //       data.logPrice * globals.harvester.logsLoaded.length >=
    //       data.powerUpgradeCost ||
    //     globals.currentCash +
    //       data.logPrice * globals.harvester.logsLoaded.length >=
    //       data.speedUpgradeCost
    //   ) {
    //     this.tractorCalled = true;
    //     globals.EventEmitter.emit('tutorialShow', 'tractor');
    //     globals.tutorialTarget = new THREE.Vector3(8, 0, -15);
    //   }
    // });

    // globals.EventEmitter.on('saw_upgrade', () => {
    //   gsap.killTweensOf(wrapper);
    //   wrapper.scale.set(0);
    // });

    // globals.EventEmitter.on('speed_upgrade', () => {
    //   gsap.killTweensOf(wrapper);
    //   wrapper.scale.set(0);
    // });
  }

  updateHelper(texture, text, scale) {
    this.helperImg.texture = TextureCache[texture];
    this.helperImg.scale.set(scale);
    this.helperText.text = text;
  }

  tutorialCall() {
    // if (!app.data.hasTutorial) {
    //   this.hand.renderable = false;
    // }
    const affordableUpgrades = [];
    if (globals.currentCash >= data.powerUpgradeCost) {
      affordableUpgrades.push(this.saw_upgrade);
    }
    if (globals.currentCash >= data.speedUpgradeCost) {
      affordableUpgrades.push(this.speed_upgrade);
    }

    if (affordableUpgrades.length == 0) {
      this.hand.visible = false;
      return;
    }

    const randomUpgrade =
      affordableUpgrades[Math.floor(Math.random() * affordableUpgrades.length)];

    this.hand.x = randomUpgrade.cont.x;
    this.hand.y = randomUpgrade.cont.y;

    this.hand.visible = true;
    this.hand.scale.set(0.5);
    this.handTl = gsap.timeline({ repeat: -1 });

    affordableUpgrades.forEach((upgrade) => {
      this.handTl.to(this.hand, {
        pixi: { x: upgrade.cont.x },
        duration: 0.5,
        ease: 'sine.inOut',
        onStart: () => {},
      });
      this.handTl.to(this.hand, {
        pixi: { scale: '-=0.1' },
        duration: 0.2,
        ease: 'sine.out',
        yoyo: true,
        repeat: 1,
      });
      this.handTl.to(upgrade.cont, {
        pixi: { scale: 0.95 },
        duration: 0.2,
        ease: 'sine.out',
        yoyo: true,
        repeat: 1,
      });
    });
  }

  tutorialKill() {
    this.tutorialDelay && this.tutorialDelay.kill();
    this.handTl && this.handTl.kill();
    gsap.killTweensOf([
      this.hand,
      this.speed_upgrade.cont,
      this.saw_upgrade.cont,
    ]);
    this.speed_upgrade.cont.scale.set(1);
    this.saw_upgrade.cont.scale.set(1);
    this.hand.visible = false;
  }

  update(time, delta) {
    this.powerUps.forEach((powerUp) => {
      powerUp.updateButton();
    });
    // if (globals.currentCash < data.powerUpgradeCost) {
    //   this.saw_upgrade.filters[0].desaturate();
    // } else {
    //   this.saw_upgrade.filters[0].reset();
    // }
    // if (globals.currentCash < data.speedUpgradeCost) {
    //   this.speed_upgrade.filters[0].desaturate();
    // } else {
    //   this.speed_upgrade.filters[0].reset();
    // }

    this.cashContainer.text.text = globals.userMoney;
    // this.cashContainer.text.scale.set(
    //   Math.min(
    //     (this.cashContainer.iWidth * 0.8) / this.cashContainer.text.width,
    //     (this.cashContainer.iHeight * 0.9) / this.cashContainer.text.height
    //   )
    // );
    // console.log(globals.collectedJunks, globals.selledJunks);
  }
}
