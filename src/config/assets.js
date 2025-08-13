const assets = {
  pixi: [
    {
      name: 'yellow_button',
      src: require('@assets/2d/yellow_button.png'),
      type: 'image',
    },

    { name: 'cash_ui', src: require('@assets/2d/moneyBg.png'), type: 'image' },

    {
      name: 'Joystick_Base',
      src: require('@assets/2d/joystick/Joystick_Base.png'),
      type: 'image',
    },
    {
      name: 'Joystick_Handle',
      src: require('@assets/2d/joystick/Joystick_Handle.png'),
      type: 'image',
    },
    {
      name: 'powerUpPanel',
      src: require('@assets/2d/powerUp/powerUpPanel.png'),
      type: 'image',
    },
    {
      name: 'powerUpButton',
      src: require('@assets/2d/powerUp/powerUpButton.png'),
      type: 'image',
    },
    {
      name: 'powerUpButtonClosed',
      src: require('@assets/2d/powerUp/powerUpButtonClosed.png'),
      type: 'image',
    },
    {
      name: 'barGreen',
      src: require('@assets/2d/powerUp/barGreen.png'),
      type: 'image',
    },
    {
      name: 'barBrown',
      src: require('@assets/2d/powerUp/barBrown.png'),
      type: 'image',
    },
    {
      name: 'iconBg',
      src: require('@assets/2d/powerUp/iconBg.png'),
      type: 'image',
    },
    {
      name: 'crossButton',
      src: require('@assets/2d/powerUp/crossButton.png'),
      type: 'image',
    },
  ],
  spine: [
    {
      name: 'Analog_Spine',
      type: 'spine',
      src: require('@assets/spine/Analog_Spine/Analog_Spine.json'),
      atlas: require('@assets/spine/Analog_Spine/Analog_Spine.atlas'),
      image: require('@assets/spine/Analog_Spine/Analog_Spine.png'),
    },
  ],
  three: [
    {
      name: 'harvester1',
      src: require('@assets/models/vehicle-v5.glb'),
      type: 'glb',
    },

    {
      name: 'map',
      src: require('@assets/models/map14.glb'),
      type: 'glb',
    },

    {
      name: 'tyre-v1',
      src: require('@assets/models/junks/tyre-v3.glb'),
      type: 'glb',
    },
    {
      name: 'junk_07-v1',
      src: require('@assets/models/junks/junk_07-v2.glb'),
      type: 'glb',
    },
    {
      name: 'junk_00-v1',
      src: require('@assets/models/junks/junk_00-v3.glb'),
      type: 'glb',
    },
    {
      name: 'junk_06-v1',
      src: require('@assets/models/junks/junk_06-v3.glb'),
      type: 'glb',
    },
    {
      name: 'junk_02-v1',
      src: require('@assets/models/junks/junk_02-v3.glb'),
      type: 'glb',
    },
    {
      name: 'junk_04-v1',
      src: require('@assets/models/junks/junk_04-v3.glb'),
      type: 'glb',
    },
    {
      name: 'tv-v1',
      src: require('@assets/models/junks/tv-v3.glb'),
      type: 'glb',
    },
    {
      name: 'junk_10-v1',
      src: require('@assets/models/junks/junk_10-v3.glb'),
      type: 'glb',
    },
    {
      name: 'junk_08-v1',
      src: require('@assets/models/junks/junk_08-v3.glb'),
      type: 'glb',
    },
    {
      name: 'arrow',
      src: require('@assets/models/arrow.glb'),
      type: 'glb',
    },
  ],
  three_textures: [],
  quarks: [
    {
      name: 'magnet_ground',
      src: require('@assets/quarks/magnet_ground.json'),
      poolCount: 10,
    },

    {
      name: 'upgrade',
      src: require('@assets/quarks/upgrade.json'),
      poolCount: 10,
    },
    {
      name: 'car_smoke_new',
      src: require('@assets/quarks/car_smoke_new.json'),
      poolCount: 10,
    },
  ],
  audio: {
    tree_fall: {
      src: require('@assets/audio/tree_fall.mp3'),
      volume: 0.6,
    },

    wood: {
      src: require('@assets/audio/wood.mp3'),
      volume: 1,
    },
  },
  fonts: [
    {
      name: 'game-font',
      src: require('@assets/fonts/game-font.woff2'),
      type: 'font',
    },
  ],
};

export function insertAssets(data) {
  if (data.upgradeSoundSrc) {
    assets.audio.upgrade = {
      src: data.upgradeSoundSrc,
      volume: data.upgradeSoundVolume,
    };
  }
  if (data.engineSoundSrc) {
    assets.audio.engine = {
      src: data.engineSoundSrc,
      loop: true,
      volume: data.engineSoundVolume,
    };
  }
  if (data.bgmSrc) {
    assets.audio.bgm = {
      src: data.bgmSrc,
      loop: true,
      volume: data.bgmVolume,
    };
  }
  if (data.collectSoundSrc) {
    assets.audio.collect = {
      src: data.collectSoundSrc,
      volume: data.collectSoundVolume,
    };
  }
  if (data.sellSoundSrc) {
    assets.audio.sell = {
      src: data.sellSoundSrc,
      volume: data.sellSoundVolume,
    };
  }
  if (data.machineSoundSrc) {
    assets.audio.machine = {
      src: data.machineSoundSrc,
      volume: data.machineSoundVolume,
    };
  }
  if (data.logoSrc) {
    assets.pixi.push({
      name: 'logo',
      src: data.logoSrc,
      type: 'image',
    });
  }
  if (data.handSrc) {
    assets.pixi.push({
      name: 'hand',
      src: data.handSrc,
      type: 'image',
    });
  }
  if (data.endCardButtonSrc) {
    assets.pixi.push({
      name: 'endCardButton',
      src: data.endCardButtonSrc,
      type: 'image',
    });
  }
  if (data.backgroundSrc) {
    assets.pixi.push({
      name: 'background',
      src: data.backgroundSrc,
      type: 'image',
    });
  }
  if (data.endCardLogoSrc) {
    assets.pixi.push({
      name: 'endCardLogo',
      src: data.endCardLogoSrc,
      type: 'image',
    });
  }
  if (data.magnetPoweUpSrc) {
    assets.pixi.push({
      name: 'magnetPower',
      src: data.magnetPoweUpSrc,
      type: 'image',
    });
  }
  if (data.magnetRangePowerupSrc) {
    assets.pixi.push({
      name: 'magnetRange',
      src: data.magnetRangePowerupSrc,
      type: 'image',
    });
  }
  if (data.magnetCapacityPowerupSrc) {
    assets.pixi.push({
      name: 'magnetCapacity',
      src: data.magnetCapacityPowerupSrc,
      type: 'image',
    });
  }
  if (data.vehicleSpeedPowerupSrc) {
    assets.pixi.push({
      name: 'vehicleSpeed',
      src: data.vehicleSpeedPowerupSrc,
      type: 'image',
    });
  }
  if (data.helperBoxSrc) {
    assets.pixi.push({
      name: 'helperBox',
      src: data.helperBoxSrc,
      type: 'image',
    });
  }
  if (data.collectJunkSrc) {
    assets.pixi.push({
      name: 'collectJunk',
      src: data.collectJunkSrc,
      type: 'image',
    });
  }
  if (data.sellJunkSrc) {
    assets.pixi.push({
      name: 'sellJunk',
      src: data.sellJunkSrc,
      type: 'image',
    });
  }
  if (data.upgradeVehicleSrc) {
    assets.pixi.push({
      name: 'upgradeVehicle',
      src: data.upgradeVehicleSrc,
      type: 'image',
    });
  }
  if (data.moneySrc) {
    assets.pixi.push({
      name: 'money',
      src: data.moneySrc,
      type: 'image',
    });
  }
  if (data.gameButtonSrc) {
    assets.pixi.push({
      name: 'gameButton',
      src: data.gameButtonSrc,
      type: 'image',
    });
  }
  if (data.customInGameFontSrc) {
    assets.fonts.push({
      name: 'customInGameFont',
      src: data.customInGameFontSrc,
      type: 'font',
    });
  }
  if (data.cashSoundSrc) {
    assets.audio.cash = {
      src: data.cashSoundSrc,
      volume: data.cashSoundVolume,
    };
  }
  if (data.newLevelSoundSrc) {
    assets.audio.newLevel = {
      src: data.newLevelSoundSrc,
      volume: data.newLevelSoundVolume,
    };
  }
  if (data.tapSoundSrc) {
    assets.audio.tap = {
      src: data.tapSoundSrc,
      volume: data.tapSoundVolume,
    };
  }
}

export default assets;
