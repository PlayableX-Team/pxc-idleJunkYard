function collectStorage(data) {
  data.magnetPoweUpSrc = storage.magnetPower.items.magnetPower.src;
  data.magnetRangePowerupSrc = storage.magnetRange.items.magnetRange.src;
  data.magnetCapacityPowerupSrc =
    storage.magnetCapacity.items.magnetCapacity.src;
  data.vehicleSpeedPowerupSrc = storage.vehicleSpeed.items.vehicleSpeed.src;
  data.helperBoxSrc = storage.helperBox.items.helperBox.src;
  data.collectJunkSrc = storage.collectJunk.items.collectJunk.src;
  data.sellJunkSrc = storage.sellJunk.items.sellJunk.src;
  data.upgradeVehicleSrc = storage.upgradeVehicle.items.upgradeVehicle.src;
  data.handSrc = storage.hand.items.hand.src;
  data.backgroundSrc = storage.background.items.background.src;
  data.endCardLogoSrc = storage.endCardLogo.items.endCardLogo.src;
  data.endCardButtonSrc = storage.endCardButton.items.endCardButton.src;
  data.moneySrc = storage.money.items.money.src;
  data.logoSrc = storage.logo.items.logo.src;
  data.gameButtonSrc = storage.gameButton.items.gameButton.src;
  data.customInGameFontSrc =
    storage.customInGameFont.items.customInGameFont.src;
  data.bgmSrc = storage.bgm.items.bgm.src;
  data.collectSoundSrc = storage.collect.items.collect.src;
  data.engineSoundSrc = storage.engine.items.engine.src;
  data.upgradeSoundSrc = storage.upgrade.items.upgrade.src;
  data.sellSoundSrc = storage.sell.items.sell.src;
  data.machineSoundSrc = storage.machine.items.machine.src;
  data.cashSoundSrc = storage.cash.items.cash.src;
  data.newLevelSoundSrc = storage.newLevel.items.newLevel.src;
  data.tapSoundSrc = storage.tap.items.tap.src;
  data.vechileBodyTextureSrc =
    storage.vehicleBodyTexture.items.vehicleBodyTextureRed.src;
  data.vechileArmTextureSrc =
    storage.vehicleArmTexture.items.vehicleArmTextureRed.src;
}

const storage = {
  vehicleBodyTexture: {
    label: 'Vehicle Body Texture',
    description: 'Uploaded Vehicle Body Texture for the game.',
    aiDescription: 'a collection of Vehicle Body Texture for branding',
    items: {
      vehicleBodyTextureRed: {
        label: 'Vehicle Body Texture Red',
        description: 'The Vehicle Body Texture Red for the game.',
        aiDescription: 'Vehicle Body Texture Red used in game',
        src: require('./assets/textures/Vehicle_Red_Texture_Body.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
      vehicleBodyTextureGreen: {
        label: 'Vehicle Body Texture Green',
        description: 'The Vehicle Body Texture Green for the game.',
        aiDescription: 'Vehicle Body Texture Green used in game',
        src: require('./assets/textures/Vehicle_Green_Texture_Body.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
      vehicleBodyTextureBlue: {
        label: 'Vehicle Body Texture Blue',
        description: 'The Vehicle Body Texture Blue for the game.',
        aiDescription: 'Vehicle Body Texture Blue used in game',
        src: require('./assets/textures/Vehicle_Blue_Texture_Body.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
      vehicleBodyTextureYellow: {
        label: 'Vehicle Body Texture Yellow',
        description: 'The Vehicle Body Texture Yellow for the game.',
        aiDescription: 'Vehicle Body Texture Yellow used in game',
        src: require('./assets/textures/Vehicle_Yellow_Texture_Body.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  vehicleArmTexture: {
    label: 'Vehicle Arm Texture',
    description: 'Uploaded Vehicle Arm Texture for the game.',
    aiDescription: 'a collection of Vehicle Arm Texture for branding',
    items: {
      vehicleArmTextureRed: {
        label: 'Vehicle Arm Texture Red',
        description: 'The Vehicle Arm Texture Red for the game.',
        aiDescription: 'Vehicle Arm Texture Red used in game',
        src: require('./assets/textures/Vehicle_Red_Texture_Arm.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
      vehicleArmTextureGreen: {
        label: 'Vehicle Arm Texture Green',
        description: 'The Vehicle Arm Texture Green for the game.',
        aiDescription: 'Vehicle Arm Texture Green used in game',
        src: require('./assets/textures/Vehicle_Green_Texture_Arm.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
      vehicleArmTextureBlue: {
        label: 'Vehicle Arm Texture Blue',
        description: 'The Vehicle Arm Texture Blue for the game.',
        aiDescription: 'Vehicle Arm Texture Blue used in game',
        src: require('./assets/textures/Vehicle_Blue_Texture_Arm.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
      vehicleArmTextureYellow: {
        label: 'Vehicle Arm Texture Yellow',
        description: 'The Vehicle Arm Texture Yellow for the game.',
        aiDescription: 'Vehicle Arm Texture Yellow used in game',
        src: require('./assets/textures/Vehicle_Yellow_Texture_Arm.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  tap: {
    label: 'Tap',
    description: 'Uploaded Tap for the game.',
    aiDescription: 'a collection of Tap for branding',
    items: {
      tap: {
        label: 'Tap',
        description: 'The Tap for the game.',
        aiDescription: 'Tap used in game',
        src: require('./assets/audio/tap.mp3'),
        type: 'audio',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  newLevel: {
    label: 'New Level',
    description: 'Uploaded New Level for the game.',
    aiDescription: 'a collection of New Level for branding',
    items: {
      newLevel: {
        label: 'New Level',
        description: 'The New Level for the game.',
        aiDescription: 'New Level used in game',
        src: require('./assets/audio/newLevel.mp3'),
        type: 'audio',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  upgrade: {
    label: 'Upgrade',
    description: 'Uploaded Upgrade for the game.',
    aiDescription: 'a collection of Upgrade for branding',
    items: {
      upgrade: {
        label: 'Upgrade',
        description: 'The Upgrade for the game.',
        aiDescription: 'Upgrade used in game',
        src: require('./assets/audio/upgrade.mp3'),
        type: 'audio',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  cash: {
    label: 'Cash',
    description: 'Uploaded Cash for the game.',
    aiDescription: 'a collection of Cash for branding',
    items: {
      cash: {
        label: 'Cash',
        description: 'The Cash for the game.',
        aiDescription: 'Cash used in game',
        src: require('./assets/audio/cash.mp3'),
        type: 'audio',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  machine: {
    label: 'Machine',
    description: 'Uploaded Machine for the game.',
    aiDescription: 'a collection of Machine for branding',
    items: {
      machine: {
        label: 'Machine',
        description: 'The Machine for the game.',
        aiDescription: 'Machine used in game',
        src: require('./assets/audio/machine.mp3'),
        type: 'audio',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  engine: {
    label: 'Engine',
    description: 'Uploaded Engine for the game.',
    aiDescription: 'a collection of Engine for branding',
    items: {
      engine: {
        label: 'Engine',
        description: 'The Engine for the game.',
        aiDescription: 'Engine used in game',
        src: require('./assets/audio/engine.mp3'),
        type: 'audio',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  bgm: {
    label: 'BGM',
    description: 'Uploaded BGM for the game.',
    aiDescription: 'a collection of BGM for branding',
    items: {
      bgm: {
        label: 'BGM',
        description: 'The BGM for the game.',
        aiDescription: 'BGM used in game',
        src: require('./assets/audio/bgm.mp3'),
        type: 'audio',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  collect: {
    label: 'Collect',
    description: 'Uploaded Collect for the game.',
    aiDescription: 'a collection of Collect for branding',
    items: {
      collect: {
        label: 'Collect',
        description: 'The Collect for the game.',
        aiDescription: 'Collect used in game',
        src: require('./assets/audio/collect.mp3'),
        type: 'audio',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  sell: {
    label: 'Sell',
    description: 'Uploaded Sell for the game.',
    aiDescription: 'a collection of Sell for branding',
    items: {
      sell: {
        label: 'Sell',
        description: 'The Sell for the game.',
        aiDescription: 'Sell used in game',
        src: require('./assets/audio/sell.mp3'),
        type: 'audio',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  customInGameFont: {
    label: 'Custom In Game Font',
    description: 'Uploaded Custom In Game Font for the game.',
    aiDescription: 'a collection of Custom In Game Font for branding',
    items: {
      customInGameFont: {
        label: 'Custom In Game Font',
        description: 'The Custom In Game Font for the game.',
        aiDescription: 'Custom In Game Font used in game',
        src: require('./assets/fonts/natoSans.woff2'),
        type: 'font',
        previewIcon: 'base64-preview-primary',
      },
      customInGameFont2: {
        label: 'Custom In Game Font Bold',
        description: 'The Custom In Game Font Bold for the game.',
        aiDescription: 'Custom In Game Font Bold used in game',
        src: require('./assets/fonts/alternative.woff2'),
        type: 'font',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  gameButton: {
    label: 'Game Button',
    description: 'Uploaded Game Button for the game.',
    aiDescription: 'a collection of Game Button for branding',
    items: {
      gameButton: {
        label: 'Game Button',
        description: 'The Game Button for the game.',
        aiDescription: 'Game Button used in game',
        src: require('./assets/2d/button.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  logo: {
    label: 'Logo',
    description: 'Uploaded Logo for the game.',
    aiDescription: 'a collection of Logo for branding',
    items: {
      logo: {
        label: 'Logo',
        description: 'The Logo for the game.',
        aiDescription: 'Logo used in game',
        src: require('./assets/2d/logo.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  money: {
    label: 'Money',
    description: 'Uploaded Money for the game.',
    aiDescription: 'a collection of Money for branding',
    items: {
      money: {
        label: 'Money',
        description: 'The Money for the game.',
        aiDescription: 'Money used in game',
        src: require('./assets/2d/money.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  endCardButton: {
    label: 'End Card Button',
    description: 'Uploaded End Card Button for the game.',
    aiDescription: 'a collection of End Card Button for branding',
    items: {
      endCardButton: {
        label: 'End Card Button',
        description: 'The End Card Button for the game.',
        aiDescription: 'End Card Button used in game',
        src: require('./assets/2d/endCardButton.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  endCardLogo: {
    label: 'End Card Logo',
    description: 'Uploaded End Card Logo for the game.',
    aiDescription: 'a collection of End Card Logo for branding',
    items: {
      endCardLogo: {
        label: 'End Card Logo',
        description: 'The End Card Logo for the game.',
        aiDescription: 'End Card Logo used in game',
        src: require('./assets/2d/endCardLogo.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  background: {
    label: 'Background',
    description: 'Uploaded Background for the game.',
    aiDescription: 'a collection of Background for branding',
    items: {
      background: {
        label: 'Background',
        description: 'The Background for the game.',
        aiDescription: 'Background used in game',
        src: require('./assets/2d/bg.jpg'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  hand: {
    label: 'Hand',
    description: 'Uploaded Hand for the game.',
    aiDescription: 'a collection of Hand for branding',
    items: {
      hand: {
        label: 'Hand',
        description: 'The Hand for the game.',
        aiDescription: 'Hand used in game',
        src: require('./assets/2d/hand.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  upgradeVehicle: {
    label: 'Upgrade Vehicle',
    description: 'Uploaded Upgrade Vehicle for the game.',
    aiDescription: 'a collection of Upgrade Vehicle for branding',
    items: {
      upgradeVehicle: {
        label: 'Upgrade Vehicle',
        description: 'The Upgrade Vehicle for the game.',
        aiDescription: 'Upgrade Vehicle used in game',
        src: require('./assets/2d/helperScreen/upgradeVechile.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  sellJunk: {
    label: 'Sell Junk',
    description: 'Uploaded Sell Junk for the game.',
    aiDescription: 'a collection of Sell Junk for branding',
    items: {
      sellJunk: {
        label: 'Sell Junk',
        description: 'The Sell Junk for the game.',
        aiDescription: 'Sell Junk used in game',
        src: require('./assets/2d/helperScreen/sellJunk.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  collectJunk: {
    label: 'Collect Junk',
    description: 'Uploaded Collect Junk for the game.',
    aiDescription: 'a collection of Collect Junk for branding',
    items: {
      collectJunk: {
        label: 'Collect Junk',
        description: 'The Collect Junk for the game.',
        aiDescription: 'Collect Junk used in game',
        src: require('./assets/2d/helperScreen/collectJunk.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  helperBox: {
    label: 'Helper Box',
    description: 'Uploaded Helper Box for the game.',
    aiDescription: 'a collection of Helper Box for branding',
    items: {
      helperBox: {
        label: 'Helper Box',
        description: 'The Helper Box for the game.',
        aiDescription: 'Helper Box used in game',
        src: require('./assets/2d/helperScreen/helperBox.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  magnetPower: {
    label: 'Magnet Power',
    description: 'Uploaded Magnet Power for the game.',
    aiDescription: 'a collection of Magnet Power for branding',
    items: {
      magnetPower: {
        label: 'Magnet Power',
        description: 'The Magnet Power for the game.',
        aiDescription: 'Magnet Power used in game',
        src: require('./assets/2d/powerUp/magnetPower.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  magnetRange: {
    label: 'Magnet Range',
    description: 'Uploaded Magnet Range for the game.',
    aiDescription: 'a collection of Magnet Range for branding',
    items: {
      magnetRange: {
        label: 'Magnet Range',
        description: 'The Magnet Range for the game.',
        aiDescription: 'Magnet Range used in game',
        src: require('./assets/2d/powerUp/magnetRange.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  magnetCapacity: {
    label: 'Magnet Capacity',
    description: 'Uploaded Magnet Capacity for the game.',
    aiDescription: 'a collection of Magnet Capacity for branding',
    items: {
      magnetCapacity: {
        label: 'Magnet Capacity',
        description: 'The Magnet Capacity for the game.',
        aiDescription: 'Magnet Capacity used in game',
        src: require('./assets/2d/powerUp/magnetCapacity.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  vehicleSpeed: {
    label: 'Vehicle Speed',
    description: 'Uploaded Vehicle Speed for the game.',
    aiDescription: 'a collection of Vehicle Speed for branding',
    items: {
      vehicleSpeed: {
        label: 'Vehicle Speed',
        description: 'The Vehicle Speed for the game.',
        aiDescription: 'Vehicle Speed used in game',
        src: require('./assets/2d/powerUp/vehicleSpeed.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
};

module.exports = { collectStorage, storage };
