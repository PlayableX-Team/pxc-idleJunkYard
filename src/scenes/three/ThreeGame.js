import gsap from 'gsap';
import * as THREE from 'three';
import SphericalCamera from './scripts/sphericalCamera';
import Harvester from './scripts/harvester';
import globals from '../../../globals';
import { PhysicsManager } from '../../../engine/physics/PhysicsManager';
import { randFloat, randInt } from 'three/src/math/MathUtils.js';
import AudioManager from '../../../engine/audio/AudioManager';
import data from '../../config/data';
import Junk from './scripts/junk';

export default class ThreeGame {
  constructor() {
    console.log('ThreeGame constructor');
    globals.threeGame = this;
    this.scene = globals.threeScene;
    this.renderManager = globals.renderManager;
    this.models = this.renderManager.threeRenderer.models;
    this.tyre = globals.cloneModel('tyre-v1');

    this.tyreObjectPoints = [];
    this.washingMachinePoints = [];
    this.grillPoints = [];
    this.windowPoints = [];
    this.lvl2barrelPoints = [];
    this.lvl2distortedBarrelPoints = [];
    this.lvl2tvPoints = [];
    this.lvl2trashPoints = [];
    this.lvl2capsulePoints = [];
    this.recyclePoints = [];
    this.grinderSaws = [];
    this.moneySpawnPoint = null;
    this.canFollow = true;
    this.isFirstUpgrade = false;
    this.canUpgrade = false;

    this.AnimSpherical = new THREE.Spherical(40, -1.74, 1.4);

    // Setup orbit controls if needed
    // this.controls = new OrbitControls(this.renderManager.threeRenderer.camera, this.renderManager.threeRenderer.view);

    // Store animations and mixers
    this.animations = {};
    this.walls = [];
    this.plans = [];
    this.gateCollider = null;
    this.garageAreaGreenBg = null;
    this.sellAreaGreenBg = null;

    globals.threeUpdateList = [];
    this.sellPoint = null;
    this.garageArea = null;
    this.sellPointDistanceThreshold = 4;
  }

  start() {
    console.log('ThreeGame start');
    this.physicsManager = new PhysicsManager(false);
    globals.physicsManager = this.physicsManager;

    this.createMap();
    //this.createTrees();
    globals.harvester = this.harvester = new Harvester();

    // this.addSellArea();
    this.sellPointDistance();
    this.upgradeAreaDistance();
    //this.addUpgradeArea();

    // SphericalCamera referansını sakla
    this.sphericalCamera = new SphericalCamera(this.harvester);

    globals.treesCut = 0;
    globals.upgradesPurchased = 0;

    globals.tutorialTarget = new THREE.Vector3(5, 0, -32);
    this.createLvl1Junks();
    this.createLvl2Junks();
    this.addGroundCollider();
    this.camActive = true;

    document.addEventListener('keydown', (event) => {
      // console.log(event);

      if (event.key == 'w') {
        this.camActive = false;
        const camera = globals.threeCamera;
        camera.rotation.x += Math.PI / 180;

        console.log(camera.rotation.x);
        console.log('w');
      }

      // Test için 'b' tuşuna basıldığında kamera animasyonunu tetikle
      if (event.key == 'b') {
        this.borderCameraAnimation();
      }
    });

    this.addLvl2Pointer();
  }

  addLvl2Pointer() {
    this.pointer = new THREE.Object3D();
    let child = globals.cloneModel('arrow');

    this.pointer.add(child);
    globals.threeScene.add(this.pointer);

    let gatePos = this.borderCollerdir.getWorldPosition(new THREE.Vector3());
    this.pointer.position.copy(gatePos);
    this.pointer.position.y += 7;
    this.pointer.position.z += 1;

    this.pointer.rotateX(-Math.PI / 2);

    this.pointer.scale.setScalar(0);
  }

  createMap() {
    let map = globals.cloneModel('map');
    map.scale.setScalar(1);

    globals.threeScene.add(map);

    this.treeMeshes = [];
    globals.availableLogs = [];
    this.borderCollerdir = null;

    let wallNameConfig = ['LeftDoorPoint', 'RightDoorPoint'];

    wallNameConfig.forEach((wallName) => {
      let wall = map.getObjectByName(wallName);
      this.walls.push(wall);
    });

    map.traverse((child) => {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.name == 'sell_bg') {
        this.sellAreaGreenBg = child;
        child.scale.setScalar(0);
        //2.3 normal scale
      }
      if (child.name == 'upgrade_vehicle_bg') {
        this.garageAreaGreenBg = child;
        child.scale.setScalar(0);
        //2.3 normal scale
      }
      if (child.name == 'green_trees_parent') {
        this.treeMeshes.push(...child.children);
      }

      if (child.name == 'sawp_1') {
        this.recyclePoints.push(child);
      }
      if (child.name == 'sawp_2') {
        this.recyclePoints.push(child);
      }
      if (child.name == 'sawp_3') {
        this.recyclePoints.push(child);
      }
      if (child.name == 'sawp_4') {
        this.recyclePoints.push(child);
      }
      if (child.name == 'Grinder_Saw_1') {
        this.grinderSaws.push(child);
      }
      if (child.name == 'Grinder_Saw_2') {
        this.grinderSaws.push(child);
      }

      if (child.name == 'upadate_building') {
        this.upgradeBuilding = child;
      }
      if (child.name == 'WALL') {
        this.sellBuilding = new THREE.Object3D();
        globals.threeScene.add(this.sellBuilding);
        this.sellBuilding.position.copy(
          child.getWorldPosition(new THREE.Vector3())
        );
      }
      if (child.name == 'grinder_sell') {
        this.sellPoint = child;
      }
      if (child.name == 'sawp_1') {
        this.junkSellPoint = child;
      }

      if (child.name == 'collider_parent') {
        this.colliders = [...child.children];
        this.borderCollerdir = this.colliders[14];
      }

      if (child.name == 'house2') {
        this.highPolyHouse = child;
        child.visible = false;
      }

      if (child.name == 'house_2_base') {
        this.highPolyHouseBase = child;
        child.visible = false;
      }
      if (child.name == 'brick_plank') {
        child.visible = false;
      }

      if (
        child.name == 'way1001' ||
        child.name == 'way1003' ||
        child.name == 'way1004'
      ) {
        child.visible = false;
      }

      if (child.name == 'sell') {
        child.scale.setScalar(1.6);
        this.sellArea = child;
      }
      if (child.name == 'upgrade_vehicle') {
        child.scale.setScalar(1.6);
        this.upgradeArea = child;
      }
      if (child.name == 'garage_upgrade_vehicle') {
        this.garageArea = child;
        // child.visible = false;
      }
      if (child.name == 'truck') {
        child.scale.setScalar(1.6);
        this.truck = child;
        child.visible = false;
      }
      if (child.name.startsWith('lvl1_point_obj1')) {
        this.tyreObjectPoints.push(child);
      }
      if (child.name.startsWith('lvl1_point_obj2')) {
        this.washingMachinePoints.push(child);
      }
      if (child.name.startsWith('lvl1_point_obj3')) {
        this.grillPoints.push(child);
      }
      if (child.name.startsWith('lvl1_point_obj4')) {
        this.windowPoints.push(child);
      }
      if (child.name.startsWith('lvl2_point_obj1')) {
        this.lvl2barrelPoints.push(child);
      }
      if (child.name.startsWith('lvl2_point_obj2')) {
        this.lvl2distortedBarrelPoints.push(child);
      }
      if (child.name.startsWith('lvl2_point_obj3')) {
        this.lvl2tvPoints.push(child);
      }
      if (child.name.startsWith('lvl2_point_obj4')) {
        this.lvl2trashPoints.push(child);
      }
      if (child.name.startsWith('lvl2_point_obj5')) {
        this.lvl2capsulePoints.push(child);
      }
      if (child.name.startsWith('Mesh005_1')) {
        this.moneySpawnPoint = child;
      }
      // Set up shadows for all meshes in the map
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Ground/floor meshes should only receive shadows
        if (
          child.name.toLowerCase().includes('ground') ||
          child.name.toLowerCase().includes('floor') ||
          child.name.toLowerCase().includes('terrain')
        ) {
          child.castShadow = false;
          child.receiveShadow = true;
        }

        if (child.material instanceof THREE.MeshPhysicalMaterial) {
          child.material.roughness = 0.8;
          child.material.metalness = 0.2;
        }
      }
    });

    this.colliders.forEach((collider, index) => {
      collider.visible = false;
      collider.body = this.physicsManager.createBodyFromObject(collider, {
        type: 'static',
        mass: 0,
      });
      if (index == 14) {
        this.gateCollider = collider.body;
      }
    });

    this.addRecycleCurve();
  }
  addRecycleCurve() {
    // Köşeli yol için noktaları sırayla birleştirelim
    const points = [
      this.recyclePoints[0].getWorldPosition(new THREE.Vector3()),
      this.recyclePoints[1].getWorldPosition(new THREE.Vector3()),
      this.recyclePoints[2].getWorldPosition(new THREE.Vector3()),
      this.recyclePoints[3].getWorldPosition(new THREE.Vector3()),
    ];

    // Curve oluştur (getPointAt fonksiyonu için)
    this.recycleCurve = new THREE.CatmullRomCurve3(points);

    // Görsel çizgi için geometri oluştur
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0xff0000,
      linewidth: 3,
    }); // Kırmızı çizgi
    const recyclePath = new THREE.Line(geometry, material);

    // globals.threeScene.add(recyclePath);

    this.recyclePath = recyclePath;
  }

  addGroundCollider() {
    let ground = new THREE.Mesh(
      new THREE.PlaneGeometry(300, 300),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    ground.material.opacity = 0;
    ground.material.transparent = true;
    ground.position.set(0, 0, 0);
    ground.rotateX(-Math.PI / 2);
    ground.scale.setScalar(1);
    globals.threeScene.add(ground);

    ground.body = this.physicsManager.createBodyFromObject(ground, {
      type: 'static',
      mass: 0,
    });
  }

  createLvl1Junks() {
    const junkConfigs = [
      {
        model: 'tyre-v1',
        points: this.tyreObjectPoints,
        health: data.lvl1Junk1Health,
        price: data.lvl1Junk1Price,
      },
      {
        model: 'junk_07-v1',
        points: this.washingMachinePoints,
        health: data.lvl1Junk2Health,
        price: data.lvl1Junk2Price,
      },
      {
        model: 'junk_00-v1',
        points: this.grillPoints,
        health: data.lvl1Junk3Health,
        price: data.lvl1Junk3Price,
      },
      {
        model: 'junk_06-v1',
        points: this.windowPoints,
        health: data.lvl1Junk4Health,
        price: data.lvl1Junk4Price,
      },
    ];

    this.createJunksByConfig(junkConfigs);
  }

  createLvl2Junks() {
    const junkConfigs = [
      {
        model: 'junk_02-v1',
        points: this.lvl2barrelPoints,
        health: data.lvl2Junk1Health,
        price: data.lvl2Junk1Price,
      },
      {
        model: 'junk_04-v1',
        points: this.lvl2distortedBarrelPoints,
        health: data.lvl2Junk2Health,
        price: data.lvl2Junk2Price,
      },
      {
        model: 'tv-v1',
        points: this.lvl2tvPoints,
        health: data.lvl2Junk3Health,
        price: data.lvl2Junk3Price,
      },
      {
        model: 'junk_10-v1',
        points: this.lvl2trashPoints,
        health: data.lvl2Junk4Health,
        price: data.lvl2Junk4Price,
      },
      {
        model: 'junk_08-v1',
        points: this.lvl2capsulePoints,
        health: data.lvl2Junk5Health,
        price: data.lvl2Junk5Price,
      },
    ];

    this.createJunksByConfig(junkConfigs);
  }

  createJunksByConfig(configs) {
    // İlk config için junks array'ini sıfırla (sadece Tyre için)
    if (!this.junks) {
      this.junks = [];
      globals.availableJunks = [];
    }

    configs.forEach((config) => {
      this.createJunksFromPoints(
        config.model,
        config.points,
        config.health,
        config.price
      );
    });
  }

  createJunksFromPoints(modelName, points, health, price) {
    points.forEach((point, index) => {
      const worldPosition = point.getWorldPosition(new THREE.Vector3());
      const worldQuaternion = point.getWorldQuaternion(new THREE.Quaternion());

      const junk = new Junk(
        modelName,
        1,
        worldPosition,
        new THREE.Vector3(0, 0, 0),
        null,
        health,
        price
      );

      junk.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      junk.quaternion.copy(worldQuaternion);
      junk.addPhysicsBody();
      this.junks.push(junk);
      globals.availableJunks.push(junk);
    });

    console.log(`${modelName} için ${points.length} adet junk oluşturuldu`);
  }

  addSellArea() {
    this.sellArea.update = () => {
      if (
        this.harvester.position.distanceTo(
          this.sellArea.getWorldPosition(new THREE.Vector3())
        ) < 4
      ) {
        // console.log("sellArea update");

        if (!this.sellingLogs) {
          this.sellingLogs = true;
          this.harvester.sellLog(this.sellBuilding);
          globals.EventEmitter.emit('logs_sold');
          gsap.delayedCall(0.05, () => {
            this.sellingLogs = false;
          });
        }
      }
    };

    globals.threeUpdateList.push(this.sellArea);
  }

  sellPointDistance() {
    this.sellPoint.update = () => {
      // console.log('sellPoint update');
      if (
        this.harvester.position.distanceTo(
          this.sellPoint.getWorldPosition(new THREE.Vector3())
        ) < 5
      ) {
        this.sellPoint.visible = true;
        this.sellingLogs = true;
        this.harvester.sellJunk(this.junkSellPoint);
        globals.EventEmitter.emit('logs_sold');
        gsap.delayedCall(0.05, () => {
          this.sellingLogs = false;
        });
        if (this.sellAreaGreenBg.scale.x > 0) {
          gsap.to(this.sellAreaGreenBg.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.5,
            ease: 'power2.out',
          });
        }
      }

      this.removeJunksNearArea(
        this.sellPoint.getWorldPosition(new THREE.Vector3()),
        5
      );
    };
    globals.threeUpdateList.push(this.sellPoint);
  }
  upgradeAreaDistance() {
    this.garageArea.update = () => {
      if (
        this.harvester.position.distanceTo(
          this.garageArea.getWorldPosition(new THREE.Vector3())
        ) < 4 &&
        this.canUpgrade
      ) {
        if (!this.harvester.isVechileCaptured) {
          this.harvester.stopVehicle();
          this.harvester.isVechileCaptured = true;
          this.harvester.stopCarSmokeQuarks(0.1);
          this.harvester.moveVechileToUpgradeArea(
            this.garageArea.getWorldPosition(new THREE.Vector3())
          );
          if (this.garageAreaGreenBg.scale.x > 0) {
            gsap.to(this.garageAreaGreenBg.scale, {
              x: 0,
              y: 0,
              z: 0,
              duration: 0.5,
              ease: 'power2.out',
            });
          }
          if (!this.isFirstUpgrade) {
            this.isFirstUpgrade = true;
            globals.pixiGame.helperCont.visible = false;
            this.harvester.startTutorialCompleted = true;
          }
          this.cameraEffect();
          if (
            this.harvester.junksLoaded.length >=
            globals.capacity + globals.extraCapacity
          ) {
            globals.pixiGame.capacityFullText.alpha = 0;
          }

          this.garageArea.visible = true;
          globals.pixiGame.powerUpPanel.visible = true;
          gsap.to(globals.pixiGame.powerUpPanel, {
            pixi: { alpha: 1 },
            duration: 0.5,
            ease: 'power2.out',
          });
          // gsap.delayedCall(1.5, () => {
          //   this.cameraReset();
          // });
        }
      }
      if (
        this.harvester.position.distanceTo(
          this.garageArea.getWorldPosition(new THREE.Vector3())
        ) > 5
      ) {
        this.harvester.isVechileCaptured = false;
        // Kamera resetini çağır
      }

      this.removeJunksNearArea(
        this.garageArea.getWorldPosition(new THREE.Vector3()),
        5
      );
    };
    globals.threeUpdateList.push(this.garageArea);
  }

  // Yeni eklenen yardımcı fonksiyon
  removeJunksNearArea(areaPosition, distance) {
    if (!this.junks || this.junks.length === 0) return;

    // Geriye doğru döngü ile safe removal
    for (let i = this.junks.length - 1; i >= 0; i--) {
      const junk = this.junks[i];
      if (!junk || !junk.position) continue;

      const junkDistance = junk.position.distanceTo(areaPosition);

      if (junkDistance < distance) {
        // Junk'ı sahneden kaldır
        globals.threeScene.remove(junk);

        // Physics body'sini kaldır
        if (junk.body && globals.physicsManager) {
          globals.physicsManager.world.removeBody(junk.body);
        }

        // Array'lerden kaldır
        this.junks.splice(i, 1);

        // globals.availableJunks'tan da kaldır
        const globalIndex = globals.availableJunks.indexOf(junk);
        if (globalIndex > -1) {
          globals.availableJunks.splice(globalIndex, 1);
        }

        console.log(`Çöp silindi - Mesafe: ${junkDistance.toFixed(2)}`);
      }
    }
  }

  addUpgradeArea() {
    this.upgradeArea.update = () => {
      if (
        this.harvester.position.distanceTo(
          this.upgradeArea.getWorldPosition(new THREE.Vector3())
        ) < 4
      ) {
        globals.EventEmitter.emit('upgrade_open');
      } else {
        globals.upgradeClosedOnPurpose = false;
        globals.EventEmitter.emit('upgrade_close');
      }
    };
    globals.threeUpdateList.push(this.upgradeArea);
  }

  cameraEffect() {
    // Kameranın doğru referansını al
    const camera = globals.threeCamera;

    // Hem kameranın FOV'unu hem de data config'ini güncelle
    if (camera) {
      this.camActive = false;
      console.log(camera.fov);
      const targetFOV = camera.fov - 15;
      gsap.to(camera, {
        fov: targetFOV,
        duration: 1,
        ease: 'power2.inOut',
        onUpdate: () => {
          camera.updateProjectionMatrix();
          console.log(camera.fov);
        },
      });
    }
  }

  cameraReset() {
    const camera = globals.threeCamera;
    if (camera) {
      if (
        this.harvester.junksLoaded.length >=
        globals.capacity + globals.extraCapacity
      ) {
        globals.pixiGame.capacityFullText.alpha = 1;
      }
      gsap.to(camera, {
        fov: data.camFov,
        duration: 1,
        ease: 'power2.inOut',
        onUpdate: () => {
          camera.updateProjectionMatrix();
          console.log(camera.fov);
        },
        onComplete: () => {
          this.harvester.canMove = true;
          // this.camActive = true;
        },
      });
    }
  }

  borderCameraAnimation() {
    if (!this.borderCollerdir || !this.sphericalCamera) {
      console.warn('borderCollerdir veya sphericalCamera bulunamadı!');
      return;
    }
    this.harvester.canMove = false;
    this.canFollow = false;
    // Kameranın başlangıç pozisyonunu kaydet
    const startPosition = {
      x: this.sphericalCamera.node.position.x,
      z: this.sphericalCamera.node.position.z,
    };

    // borderCollerdir'in global pozisyonunu al
    const borderGlobalPosition = this.borderCollerdir.getWorldPosition(
      new THREE.Vector3()
    );

    // Kamera hareketini devre dışı bırak

    // Kamerayı borderCollerdir pozisyonuna götür (sadece x ve z)
    gsap.to(this.pointer.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.2,
      ease: 'power2.inOut',
      onComplete: () => {
        gsap.to(this.pointer.position, {
          y: '+=1',
          duration: 0.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
        });
      },
    });

    gsap.to(this.sphericalCamera.node.position, {
      x: borderGlobalPosition.x,
      z: borderGlobalPosition.z,
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        gsap.to(this.pointer.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1,
          ease: 'power2.inOut',
        });

        gsap.to(this.walls[0].rotation, {
          y: (-150 * Math.PI) / 180,
          duration: 1,
          ease: 'power2.inOut',
          onStart: () => {
            AudioManager.playSFX('newLevel');
          },
        });
        gsap.to(this.walls[1].rotation, {
          y: (150 * Math.PI) / 180,
          duration: 1,
          ease: 'power2.inOut',
        });
        this.gateCollider.position.y -= 10;

        gsap.delayedCall(1, () => {
          // Başlangıç pozisyonuna geri dön
          gsap.to(this.sphericalCamera.node.position, {
            x: startPosition.x,
            z: startPosition.z,
            duration: 2,
            ease: 'power2.inOut',
            onComplete: () => {
              // Kamera hareketini tekrar aktifleştir
              this.canFollow = true;
              this.harvester.canMove = true;
            },
          });
        });
      },
    });
  }

  spawnLog(pos) {
    let log = globals.cloneModel('log');

    log.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
      if (child.material) {
        child.material.roughness = 0.8;
        // child.material.metalness = 0.2;
      }
    });
    log.scale.setScalar(0);
    gsap.to(log.scale, {
      x: 0.7,
      y: 0.7,
      z: 0.7,
      duration: randFloat(0.2, 0.3),
      ease: 'sine.out',
    });
    pos.y += randFloat(1, 3);
    log.position.copy(pos);
    globals.threeScene.add(log);

    let radius = 3;
    let randonDestination = pos
      .clone()
      .add(
        new THREE.Vector3(
          randFloat(-radius, radius),
          0,
          randFloat(-radius, radius)
        )
      );

    gsap.to(log.position, {
      x: randonDestination.x,
      y: 0.5,
      z: randonDestination.z,
      duration: randFloat(0.5, 1),
      ease: 'bounce.out',
      onComplete: () => {
        globals.availableLogs.push(log);
      },
    });

    log.rotation.z = randFloat(0, Math.PI * 2);
    gsap.to(log.rotation, {
      x: Math.PI / 2,
      duration: randFloat(0.5, 1),
      ease: 'sine.out',
    });
  }

  update(time, delta) {
    // Update animations
    globals.threeUpdateList.forEach((obj) => obj.update(time, delta));

    this.physicsManager.update(delta);
    this.junks.forEach((junk) => junk.update(time, delta));

    // Update any other game logic here
  }
}
