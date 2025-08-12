const data = window.gameData ?? {
  camRadius: 40,
  camTheta: -0.6,
  camPhi: 0.7,
  camFov: 55,
  camOffsetX: 0,
  camOffsetY: 0,
  camOffsetZ: 0,
  customInGameFontSrc: null,

  collectSoundSrc: null,
  collectSoundVolume: 0.5,
  bgmSrc: null,
  bgmVolume: 0.5,
  engineSoundSrc: null,
  engineSoundVolume: 0.5,
  upgradeSoundSrc: null,
  upgradeSoundVolume: 0.5,
  sellSoundSrc: null,
  sellSoundVolume: 0.5,
  machineSoundSrc: null,
  machineSoundVolume: 0.5,
  cashSoundSrc: null,
  cashSoundVolume: 0.5,
  newLevelSoundSrc: null,
  newLevelSoundVolume: 0.5,
  tapSoundSrc: null,
  tapSoundVolume: 0.5,

  //TUTORIAL
  tutorialText: 'DRAG TO MOVE!',
  tutorialTextFontSize: 64,
  tutorialTextFontColor: '0xffffff',
  tutorialTextFontStroke: '0x000000',
  tutorialTextFontStrokeThickness: 6,

  capacityFullText: 'CAPACITY FULL',
  capacityFullTextFontSize: 64,
  capacityFullTextFontColor: '0xffffff',
  capacityFullTextFontStroke: '0x000000',
  capacityFullTextFontStrokeThickness: 6,

  handSrc: null,
  handScale: 1,
  handAngle: 0,
  handPosX: 321,
  handPosY: -70,
  handPos2X: 420,
  handPos2Y: -250,

  logoSrc: null,
  gameLogoScale: 2,
  gameLogoPosX: 0.65,
  gameLogoPosY: 0.6,

  gameButtonSrc: null,
  gameButtonScale: 1.5,
  gameButtonPosX: 0.5,
  gameButtonPosY: 0.6,
  gameButtonText: 'DOWNLOAD',
  gameButtonTextFontColor: '0xffffff',
  gameButtonTextFontStroke: '0x000000',
  gameButtonTextFontStrokeThickness: 5,
  gameButtonTextScale: 1,

  //MAP VİSUAL
  isRoadOpen: false,
  isVechileShadowOpen: false,
  vechileUpgradeTextRotation: Math.PI / 2,
  vechileSellTextRotation: -Math.PI / 2,

  //MONEY
  userStartMoney: 0,

  //LVL2
  junkSelledForLvl2: 100, // max 110 min 50 step:1

  //JUNK OPTİONS
  lvl1Junk1Price: 10, // label: tire model price
  lvl1Junk1Health: 2, // label: tire model health
  lvl1Junk2Price: 20, // label: washing machine model price
  lvl1Junk2Health: 4, // label: washing machine model health
  lvl1Junk3Price: 30, // label: grill model price
  lvl1Junk3Health: 6, // label: grill model health
  lvl1Junk4Price: 40, // label: window model price
  lvl1Junk4Health: 8, // label: window model health

  lvl2Junk1Price: 10, // label: barrel model price
  lvl2Junk1Health: 2, // label: barrel model health
  lvl2Junk2Price: 20, // label: distorted barrel model price
  lvl2Junk2Health: 4, // label: distorted barrel model health
  lvl2Junk3Price: 30, // label: tv model price
  lvl2Junk3Health: 6, // label: tv model health
  lvl2Junk4Price: 40, // label: trash bin model price
  lvl2Junk4Health: 8, // label: trash bin model health
  lvl2Junk5Price: 50, // label: capsule model price
  lvl2Junk5Health: 10, // label: capsule model health

  //POWERUPS CONFIG
  powerUpPanelScale: 1,
  powerUpPanelPosXVertical: 0.5,
  powerUpPanelPosYVertical: 0.6,
  powerUpPanelPosXHorizontal: 0.8,
  powerUpPanelPosYHorizontal: 0.5,

  magnetPowerCost: 100,
  magnetPowerUpgradeEffect: 0.5, // min 0.1 max100 step:0.1
  magbetPowerStartAmount: 1, // min 1 max100 step:1
  magnetPowerText: 'Magnet Power',
  isMagneyPowerupOn: true,
  magnetPoweUpSrc: null,
  magnetPoweUpScale: 0.5,

  magnetRangeCost: 200,
  magnetRangeUpgradeEffect: 1, // min 1 max100 step:1
  magnetRangeStartAmount: 5, //min 5 max100 step:1
  magnetRangeText: 'Magnet Range',
  isMagnetRangePowerupOn: true,
  magnetRangePowerupSrc: null,
  magnetRangePowerupScale: 0.5,

  magnetCapacityCost: 300,
  magnetCapacityUpgradeEffect: 10, // min 1 max100 step:1
  magnetCapacityStartAmount: 10, // min1
  magnetCapacityText: 'Magnet Capacity',
  isMagnetCapacityPowerupOn: true,
  magnetCapacityPowerupSrc: null,
  magnetCapacityPowerupScale: 0.5,

  vehicleSpeedCost: 400,
  vehicleSpeedUpgradeEffect: 0.1, // min 0.1 max 1 step:0.1
  vehicleSpeedStartAmount: 1, // min 0.1 max 2 step: 0.1
  vehicleSpeedText: 'Vehicle Speed',
  isVehicleSpeedPowerupOn: true,
  vehicleSpeedPowerupSrc: null,
  vehicleSpeedPowerupScale: 0.5,

  powerUpsTextFontSize: 20,
  powerUpsTextFontColor: '0xffffff',
  powerUpsTextFontStroke: '0x000000',
  powerUpsTextFontStrokeThickness: 5,
  powerUpsTextsPositionX: 140,
  powerUpsTextsPositionY: -35,

  costTextFontSize: 40,
  costTextFontColor: '0xffffff',
  costTextFontStroke: '0x000000',
  costTextFontStrokeThickness: 5,

  maxTextFontSize: 40,
  maxTextFontColor: '0xffffff',
  maxTextFontStroke: '0x000000',
  maxTextFontStrokeThickness: 5,

  //MONEY BAR
  moneyBarTextFontSize: 40, // min 10 max 100 step:1
  moneyBarTextFontColor: '0xffffff',
  moneyBarTextFontStroke: '0x00AA00',
  moneyBarTextFontStrokeThickness: 5, // min 0 max 5 step:0.1
  moneySrc: null,
  moneyScale: 0.75,

  //JUNK COLLECT TEXT ANİMATİON PARAMETERS
  isJunkCollectTextAnimationOn: true,
  junkCollectTextAnimationFontSize: 20, // min 10 max 100 step:1
  junkCollectTextAnimationFontColor: '0xffffff',
  junkCollectTextAnimationFontStroke: '0x000000',
  junkCollectTextAnimationFontStrokeThickness: 5, // min 0 max 5 step:0.1

  //VECHİLE
  capacityFullVechileArmAnimationColor: '#990000',
  arrowScale: 1.6,
  arrowColor: '#00ff00',
  vechileMovementRotationSpeed: 0.5,

  //HELPER SCREEN
  helperBoxSrc: null,
  helperBoxColor: 0x000000,
  helperBoxPosX: 0.5,
  helperBoxPosY: 0.22,
  collectJunkSrc: null,
  sellJunkSrc: null,
  upgradeVehicleSrc: null,
  collectJunkScale: 0.7,
  sellJunkScale: 0.7,
  upgradeVehicleScale: 0.7,
  collectJunkText: 'Let’s start collecting junk!',
  sellJunkText: 'Let’s start selling junk!',
  upgradeJunkText: 'Let’s start upgrading vechile!',
  helperTextFontSize: 20,
  helperTextFontColor: '0xffffff',
  helperTextFontStroke: '0x000000',
  helperTextFontStrokeThickness: 5,

  //MARKET && ENDCARD PARAMETERS
  junkCollectForEndCard: 200, // max 110 min 1 step:1
  junkCollectedForStore: 201, // max 110 min 1 step:1

  junkSelledForEndCard: 202, // max 110 min 1 step:1
  junkSelledForStore: 203, // max 110 min 1 step:1

  xSecondsForEndCard: 0, // min 0 max 100 step:1
  xSecondsForStore: 0, // min 0 max 100 step:1

  //EndCard Parameters
  isBackgroundImgOpen: false,
  backgroundSrc: null,
  backgroundColor: '0x000000',
  backgroundAlpha: 0.7,
  endCardLogoSrc: null,
  isLogoOpen: true,
  logoScale: 1,
  logoPosX: 0.5,
  logoPosY: 0.5,
  endCardButtonSrc: null,
  isButtonOpen: true,
  buttonScale: 0.75,
  buttonPosX: 0.5,
  buttonPosY: 0.85,
  buttonText: 'DOWNLOAD',
  buttonTextFontColor: '0xffffff',
  buttonTextFontStroke: '0x000000',
  buttonTextFontStrokeThickness: 10,
  buttonTextScale: 1,
  isHeaderTextOpen: true,
  headerText: 'IDLE_ JUNKYARD!',
  headerTextFontSize: 64,
  headerTextFontColor: '0xffffff',
  headerTextFontStroke: '0x000000',
  headerTextFontStrokeThickness: 10,
  headerTextScale: 0.5,
  headerTextPosX: 0.5,
  headerTextPosY: 0.15,
};

export default data;
