import EventEmitter from 'eventemitter3';
import data from './src/config/data';

const globals = {
  pixiScene: null,
  pixiApp: null,
  threeGame: null,
  pixiGame: null,

  EventEmitter: new EventEmitter(),

  analyticsSend: false,
  logs_collected: 0,
  logs_sold: 0,
  trees_cut: 0,
  speed_upgrade: 0,
  power_upgrade: 0,
  extraSpeed: 0,
  extraPower: 0,
  extraRange: 0,
  extraCapacity: 0,
  userMoney: data.userStartMoney,
  collectedJunks: 0,
  selledJunks: 0,
  capacity: data.magnetCapacityStartAmount,
};

export default globals;
