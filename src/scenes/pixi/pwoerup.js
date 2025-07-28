import globals from '../../../globals';
import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import data from '../../config/data';
import * as THREE from 'three.quarks';

const TextureCache = PIXI.utils.TextureCache;
import AudioManager from '../../../engine/audio/AudioManager';

export default class Powerup {
  constructor(
    cost = 100,
    asset,
    scale = 1,
    parent,
    posXPowerUp,
    posYPowerUp,
    nameText,
    upgradeAmount,
    upgradeType,
    level
  ) {
    this.cost = cost;
    this.asset = asset;
    this.scale = scale;
    this.parent = parent;
    this.posXPowerUp = posXPowerUp;
    this.posYPowerUp = posYPowerUp;
    this.nameText = nameText;
    this.progress = 0; // Progress değeri (0-1 arası)
    this.upgradeAmount = upgradeAmount;
    this.upgradeType = upgradeType;
    this.level = 0;
    this.init();
  }

  init() {
    console.log('Powerup constructor');

    const iconBg = PIXI.Sprite.from(TextureCache['iconBg']);
    iconBg.anchor.set(0.5);
    iconBg.scale.set(0.5);
    this.parent.addChild(iconBg);
    iconBg.position.set(this.posXPowerUp, this.posYPowerUp);

    const button = PIXI.Sprite.from(TextureCache[this.asset]);
    button.anchor.set(0.5);

    if (this.upgradeType == 'speed') {
      this.scale = data.vehicleSpeedPowerupScale;
    } else if (this.upgradeType == 'power') {
      this.scale = data.magnetRangePowerupScale;
    } else if (this.upgradeType == 'range') {
      this.scale = data.magnetRangePowerupScale;
    } else if (this.upgradeType == 'capacity') {
      this.scale = data.magnetCapacityPowerupScale;
    }
    button.scale.set(this.scale);
    this.parent.addChild(button);
    button.position.set(this.posXPowerUp, this.posYPowerUp);

    const powerUpButton = PIXI.Sprite.from(TextureCache['powerUpButton']);
    powerUpButton.anchor.set(0.5);
    powerUpButton.scale.set(1.1);
    this.parent.addChild(powerUpButton);
    powerUpButton.position.set(this.posXPowerUp + 425, this.posYPowerUp);
    this.powerUpButton = powerUpButton;

    let powerUpButtonText = new PIXI.Text(this.cost, {
      fontFamily: 'customInGameFont',
      fontSize: data.costTextFontSize,
      stroke: data.costTextFontStroke,
      strokeThickness: data.costTextFontStrokeThickness,
      fill: data.costTextFontColor,
    });
    powerUpButtonText.anchor.set(0.5);
    powerUpButton.addChild(powerUpButtonText);

    const powerUpButtonName = new PIXI.Text(this.nameText, {
      fontFamily: 'customInGameFont',
      fontSize: data.powerUpsTextFontSize,
      stroke: data.powerUpsTextFontStroke,
      strokeThickness: data.powerUpsTextFontStrokeThickness,
      fill: data.powerUpsTextFontColor,
      lineJoin: 'round',
    });
    powerUpButtonName.anchor.set(0.5);
    powerUpButtonName.position.set(
      this.posXPowerUp + data.powerUpsTextsPositionX,
      this.posYPowerUp + data.powerUpsTextsPositionY
    );
    this.parent.addChild(powerUpButtonName);

    // Parent container ayarları
    this.parent.interactive = true;
    this.parent.interactiveChildren = true;
    this.parent.zIndex = 1000;

    // Button ayarları - 'click' yerine 'pointerdown' kullan

    // Event handler'ı değiştir
    powerUpButton.on('pointerdown', (event) => {
      globals.quarksPool.spawnQuarkAndFollowObject(
        'upgrade',
        globals.threeGame.harvester,
        3,
        new THREE.Euler(0, 0, 0),
        new THREE.Vector3(0, 2, 0)
      );
      globals.pixiGame.tutorialHand.position.set(370, -260);
      powerUpButton.interactive = false;
      event.stopPropagation(); // Event bubbling'i durdur
      console.log('clicked');
      if (this.upgradeType == 'speed') {
        if (globals.userMoney < this.cost) return;
        AudioManager.playSFX('upgrade');
        AudioManager.playSFX('tap');
        this.increaseProgress();
        globals.extraSpeed += this.upgradeAmount;
        globals.userMoney -= this.cost;
        this.cost = this.cost * 2;
        powerUpButtonText.text = this.cost;
      } else if (this.upgradeType == 'power') {
        if (globals.userMoney < this.cost) return;
        AudioManager.playSFX('upgrade');
        AudioManager.playSFX('tap');
        this.increaseProgress(0.33);
        const magnets = globals.threeGame.harvester.magnets;
        magnets[this.level].visible = false;
        this.level++;
        magnets[this.level].visible = true;
        globals.userMoney -= this.cost;
        globals.extraPower += this.upgradeAmount;
        this.cost = this.cost * 2;
        powerUpButtonText.text = this.cost;
      } else if (this.upgradeType == 'range') {
        if (globals.userMoney < this.cost) return;
        AudioManager.playSFX('upgrade');
        AudioManager.playSFX('tap');
        this.increaseProgress();
        globals.extraRange += this.upgradeAmount;
        globals.userMoney -= this.cost;
        this.cost = this.cost * 2;
        powerUpButtonText.text = this.cost;
      } else if (this.upgradeType == 'capacity') {
        if (globals.userMoney < this.cost) return;
        AudioManager.playSFX('upgrade');
        AudioManager.playSFX('tap');
        this.increaseProgress();
        globals.extraCapacity += this.upgradeAmount;
        globals.userMoney -= this.cost;
        this.cost = this.cost * 2;
        powerUpButtonText.text = this.cost;
      }
      gsap.to(powerUpButton.scale, {
        x: powerUpButton.scale.x * 1.1,
        y: powerUpButton.scale.y * 1.1,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
        onComplete: () => {
          this.updateButton();
          gsap.delayedCall(0.3, () => {
            powerUpButton.interactive = true;
          });
        },
      });
    });

    const maxText = new PIXI.Text('MAX', {
      fontFamily: 'customInGameFont',
      fontSize: data.maxTextFontSize,
      stroke: data.maxTextFontStroke,
      strokeThickness: data.maxTextFontStrokeThickness,
      fill: data.maxTextFontColor,
      lineJoin: 'round',
    });
    maxText.anchor.set(0.5);
    maxText.position.set(powerUpButton.x, powerUpButton.y);
    this.parent.addChild(maxText);
    this.mainButton = powerUpButton;
    this.maxText = maxText;
    this.maxText.visible = false;

    // Progress Bar oluşturma
    this.createProgressBar();
    this.updateButton();
  }

  createProgressBar() {
    // Progress bar container oluştur
    this.progressContainer = new PIXI.Container();
    this.parent.addChild(this.progressContainer);
    this.progressContainer.position.set(
      this.posXPowerUp + 180,
      this.posYPowerUp + 10
    );

    // Arka plan bar (kahverengi)
    this.barBrown = PIXI.Sprite.from(TextureCache['barBrown']);
    this.barBrown.anchor.set(0.5);
    this.barBrown.scale.set(1.2);
    this.progressContainer.addChild(this.barBrown);

    // Dolum bar (yeşil)
    this.barGreen = PIXI.Sprite.from(TextureCache['barGreen']);
    this.barGreen.anchor.set(0, 0.5); // Sol orta noktadan anchor
    this.barGreen.scale.set(1.2);
    this.barGreen.position.x = -this.barBrown.width * 0.5; // Sol kenardan başlat
    this.progressContainer.addChild(this.barGreen);

    // Maskeleme için Graphics objesi oluştur
    this.progressMask = new PIXI.Graphics();
    this.progressContainer.addChild(this.progressMask);

    // İlk maskı uygula
    this.updateProgressBar();
  }

  updateProgressBar() {
    // Progress değerini 0-1 arasında sınırla
    const clampedProgress = Math.max(0, Math.min(1, this.progress));

    // Maskeyi temizle ve yeniden çiz
    this.progressMask.clear();
    this.progressMask.beginFill(0xffffff);

    // Maskeyı yatay olarak progress'e göre çiz (soldan sağa dolum)
    const barWidth = this.barBrown.width * 1.2; // Scale faktörünü hesaba kat
    const progressWidth = barWidth * clampedProgress;

    this.progressMask.drawRect(
      -barWidth / 2, // Sol kenar
      -this.barBrown.height * 0.6, // Üst kenar
      progressWidth, // Progress'e göre genişlik
      this.barBrown.height * 1.2 // Tam yükseklik
    );
    this.progressMask.endFill();

    // Maskeyi yeşil bar'a uygula
    this.barGreen.mask = this.progressMask;
  }

  // %20 artıran method
  increaseProgress(progressAmount = 0.25) {
    // Hedef progress değerini hesapla
    const targetProgress = Math.min(1, this.progress + progressAmount);

    // GSAP ile animasyonlu progress artışı
    gsap.to(this, {
      progress: targetProgress,
      duration: 0.5, // Animasyon süresi (saniye)
      ease: 'power2.out', // Easing fonksiyonu
      onUpdate: () => {
        // Her frame'de progress bar'ı güncelle
        this.updateProgressBar();
        if (this.progress >= 0.9) {
          this.maxText.visible = true;
          this.mainButton.visible = false;
          this.updateButton();
        }
      },
    });
  }

  // Progress'i direkt set etme method'u
  setProgress(value) {
    this.progress = Math.max(0, Math.min(1, value));
    this.updateProgressBar();
  }

  updateButton() {
    if (globals.userMoney < this.cost) {
      this.powerUpButton.texture = TextureCache['powerUpButtonClosed'];
      this.powerUpButton.interactive = false;
      this.powerUpButton.buttonMode = false;
    } else {
      this.powerUpButton.interactive = true;
      this.powerUpButton.buttonMode = true;
      this.powerUpButton.cursor = 'pointer'; // Mouse cursor'ı değiştir
      this.powerUpButton.texture = TextureCache['powerUpButton'];
    }
  }
}
