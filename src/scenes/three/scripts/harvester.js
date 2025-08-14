import * as THREE from 'three';
import { randFloat } from 'three/src/math/MathUtils.js';
import globals from '../../../../globals';
import gsap from 'gsap';
import AudioManager from '../../../../engine/audio/AudioManager';
import data from '../../../config/data';
import * as CANNON from 'cannon-es';
import { Vector3 } from 'three.quarks';
import { openStorePage } from '../../../../engine';

export default class Harvester extends THREE.Object3D {
  moveSpeed = 1;
  harvesterLevel = 0;
  damage = 1;

  constructor() {
    super();
    this.animations = {};
    this.model = globals.cloneModel('harvester1');
    this.scale.setScalar(0.8);
    this.add(this.model);
    this.position.set(0, 0, 10);
    this.rotation.y = Math.PI;
    globals.threeScene.add(this);
    this.crane = this.model.getObjectByName('body');
    this.canMove = true;
    this.isVechileCaptured = false;
    // Çöp objelerinin health tracking sistemi için Map
    this.junkHealthTracking = new Map();
    this.firstCollect = false;
    this.firstSell = false;
    this.firstUpgrade = false;
    this.startTutorialCompleted = false;

    // Rotasyon takibi için değişkenler
    this.previousRotation = this.rotation.y;
    this.rotationThreshold = 0.001; // Minimum rotasyon değişimi eşiği

    // Quark referanslarını saklamak için değişkenler
    this.magnetGroundQuark = null;
    this.carSmokeQuarks = [];
    this.model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = data.isVechileShadowOpen;
        child.receiveShadow = data.isVechileShadowOpen;
      }
      if (child.name == 'Mesh017') {
        child.material = new THREE.MeshStandardMaterial({
          map: globals.cloneTexture('Vehicle_Body_Texture'),
        });
      }
      let newMat = null;
      if (child.name == 'Mesh016') {
        child.material = new THREE.MeshStandardMaterial({
          map: globals.cloneTexture('Vehicle_Arm_Texture'),
        });
        newMat = child.material;
        newMat.map = globals.cloneTexture('Vehicle_Arm_Texture');
      }
      if (child.name == 'Mesh014') {
        child.material = new THREE.MeshStandardMaterial({
          map: globals.cloneTexture('Vehicle_Arm_Texture'),
        });
      }
    });

    this.start();

    this.engineSfx = AudioManager.playSFX('engine', true);
    this.recylePoints = [];
    this.armOriginalMaterials = null;
    this.armAnimationTween = null;
    this.vechileCanOpenLvl2 = true;
    this.isSellSfxPlaying = false;
  }

  start() {
    this.model.position.set(0, 0.5, 0);
    this.model.scale.set(1, 1, 1);

    this.log_locs = [];
    this.logsLoaded = [];
    this.tires = [];
    this.junksLoaded = [];
    this.magnets = [];
    this.recycleJunks = [];
    this.magnetParent = null;
    this.vechileArm = null;
    this.tires = null;

    this.model.traverse((child) => {
      if (child.name.includes('log_loc')) {
        this.log_locs.push(child);
      }
      if (child.name == 'Crane') {
        this.harvester_base = child;
      }
      if (child.name.includes('Mesh018')) {
        this.tires = child;
      }

      if (child.name.startsWith('Magnet') && child.name != 'MagnetParent') {
        this.magnets.push(child);
        child.visible = false;
      }
      if (child.name == 'MagnetParent') {
        this.magnetParent = child;
      }
      if (child.name == 'Mesh016') {
        this.vechileArm = child;
      }
    });
    gsap.delayedCall(0.1, () => {
      this.magnets[0].visible = true;
    });

    this.addPhysicsBody();

    globals.threeUpdateList.push(this);

    this.arrow = new THREE.Object3D();
    let child = globals.cloneModel('arrow');
    child.rotateY(Math.PI);
    child.scale.setScalar(data.arrowScale);
    child.position.z = 5;
    child.position.y = 1;

    // Arrow materyalini kırmızı yap
    child.traverse((mesh) => {
      if (mesh.isMesh && mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => {
            mat.color.set(data.arrowColor); // Kırmızı renk
          });
        } else {
          mesh.material.color.set(data.arrowColor); // Kırmızı renk
        }
      }
    });

    gsap.to(child.position, {
      z: '+=2',
      duration: 0.5,
      repeat: -1,
      yoyo: true,
    });

    gsap.to(child.scale, {
      x: data.arrowScale * 1.2,
      y: data.arrowScale * 1.2,
      z: data.arrowScale * 1.2,
      duration: 0.4,
      ease: 'power2.inOut',
      repeat: -1,
      yoyo: true,
    });

    this.arrow.add(child);
    this.add(this.arrow);
    gsap.delayedCall(0.3, () => {
      this.quarkFunc();
    });
  }
  quarkFunc() {
    // Magnet ground quark'ını spawn et ve referansını sakla
    this.magnetGroundQuark = globals.quarksPool.spawnQuarkAndFollowObject(
      'magnet_ground',
      this.magnetParent,
      1,
      new THREE.Euler(0, 0, 0),
      new THREE.Vector3(0, -2.5, 0)
    );

    // Car smoke quark'larını spawn et ve referanslarını sakla
    const smokeQuark1 = globals.quarksPool.spawnQuarkAndFollowObject(
      'car_smoke_new',
      this.tires,
      2,
      new THREE.Euler(0, 0, 0),
      new THREE.Vector3(0.5, 0, -0.8)
    );

    const smokeQuark2 = globals.quarksPool.spawnQuarkAndFollowObject(
      'car_smoke_new',
      this.tires,
      2,
      new THREE.Euler(0, 0, 0),
      new THREE.Vector3(-0.5, 0, -0.8)
    );

    // Smoke quark'larını array'e ekle
    if (smokeQuark1) this.carSmokeQuarks.push(smokeQuark1);
    if (smokeQuark2) this.carSmokeQuarks.push(smokeQuark2);

    // Başlangıçta durdurulmuş olarak başlat
    this.stopCarSmokeQuarks();
  }

  // Car smoke quark'larını yavaşça başlat
  startCarSmokeQuarks(fadeDuration = 0.3) {
    this.carSmokeQuarks.forEach((quark) => {
      if (quark && quark.fadeIn) {
        try {
          quark.fadeIn(fadeDuration);
        } catch (error) {
          console.warn('Smoke quark başlatılamadı:', error);
          // Fallback olarak normal play kullan
          if (quark.play) quark.play();
        }
      }
    });
  }

  // Car smoke quark'larını yavaşça durdur
  stopCarSmokeQuarks(fadeDuration = 0) {
    this.carSmokeQuarks.forEach((quark) => {
      if (quark && quark.fadeOut) {
        try {
          quark.fadeOut(fadeDuration);
          quark.scale.set(0, 0, 0);
        } catch (error) {
          console.warn('Smoke quark durdurulamadı:', error);
          // Fallback olarak normal stop kullan
          if (quark.stop) quark.stop();
        }
      }
    });
  }

  vechileArmAnimation() {
    if (!this.vechileArm) return;

    // Eğer zaten animasyon varsa durdur
    if (this.armAnimationTween) {
      this.armAnimationTween.kill();
    }

    if (!this.armOriginalMaterials) {
      this.armOriginalMaterials = [];

      // VechileArm'ın tüm mesh çocuklarını dolaş ve orijinal materyalleri sakla
      this.vechileArm.traverse((child) => {
        if (child.isMesh && child.material) {
          if (Array.isArray(child.material)) {
            // Çoklu materyal durumu
            this.armOriginalMaterials.push({
              mesh: child,
              materials: child.material.slice(), // Orijinal materyalleri kopyala
              isArray: true,
            });

            // Her materyal için klonlar oluştur
            const materialClones = child.material.map((mat) => mat.clone());
            child.material = materialClones;
          } else {
            // Tek materyal durumu
            this.armOriginalMaterials.push({
              mesh: child,
              materials: child.material,
              isArray: false,
            });

            // Materyali klonla
            child.material = child.material.clone();
          }
        }
      });
    }

    // Parlaklık animasyonu başlat
    const animationData = { intensity: 0 };

    this.armAnimationTween = gsap.to(animationData, {
      intensity: 10, // 0.8'den 1.2'ye artırıldı (daha az şeffaf)
      duration: 0.5,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1,
      onUpdate: () => {
        // Her güncelleme anında tüm materyalleri güncelle
        this.vechileArm.traverse((child) => {
          if (child.isMesh && child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => {
                if (mat.emissive) {
                  mat.emissiveIntensity = animationData.intensity;
                  mat.emissive.set(data.capacityFullVechileArmAnimationColor); // Daha koyu kırmızı (0xff0000'dan 0x990000'a)
                }
              });
            } else {
              if (child.material.emissive) {
                child.material.emissiveIntensity = animationData.intensity;
                child.material.emissive.set(
                  data.capacityFullVechileArmAnimationColor
                ); // Daha koyu kırmızı (0xff0000'dan 0x990000'a)
              }
            }
          }
        });
      },
    });
  }

  resetVechileArmToOriginal() {
    if (!this.vechileArm || !this.armOriginalMaterials) return;

    // Animasyonu durdur
    if (this.armAnimationTween) {
      this.armAnimationTween.kill();
      this.armAnimationTween = null;
    }

    // Orijinal materyalleri geri yükle
    this.armOriginalMaterials.forEach((item) => {
      if (item.isArray) {
        item.mesh.material = item.materials;
      } else {
        item.mesh.material = item.materials;
      }
    });

    // Orijinal materyal referansını temizle
    this.armOriginalMaterials = null;
  }

  addPhysicsBody() {
    const radius = 3.5; // Harvester'ın boyutuna uygun radius değeri

    this.body = globals.physicsManager.addBody({
      type: 'sphere',
      state: 'dynamic',
      position: {
        x: this.position.x,
        y: this.position.y,
        z: this.position.z,
      },
      size: {
        radius: radius,
      },
      mass: 10,
    });
  }

  stopVehicle() {
    this.body.velocity.set(0, 0, 0);
    this.canMove = false;
  }

  moveVechileToUpgradeArea(targetPosition) {
    this.canMove = false;
    this.body.velocity.set(0, 0, 0);

    // Target pozisyonunu world koordinatlarına çevir
    const worldTargetPosition = new THREE.Vector3();
    if (targetPosition.parent) {
      targetPosition.parent.localToWorld(
        worldTargetPosition.copy(targetPosition)
      );
    } else {
      worldTargetPosition.copy(targetPosition);
    }

    gsap.to(this.body.position, {
      x: worldTargetPosition.x,
      y: worldTargetPosition.y,
      z: worldTargetPosition.z,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        this.body.velocity.set(0, 0, 0);
      },
    });
    gsap.to(this.rotation, {
      y: -Math.PI / 2,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        gsap.delayedCall(2, () => {
          //this.canMove = true;
          this.body.velocity.set(0, 0, 0);
        });
      },
    });
    if (this.crane && !this.craneReturning) {
      this.craneReturning = true;
      gsap.to(this.crane.rotation, {
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => {
          this.craneReturning = false;
        },
      });
    }
  }

  move(time, delta) {
    if (!this.canMove) return;
    if (!globals.joystickData.isMoving) {
      this.body.velocity.set(0, 0, 0);

      // Araç durduğunda smoke quark'larını durdur
      this.stopCarSmokeQuarks(2);

      // Crane'i ana rotasyona döndür
      if (this.crane && !this.craneReturning) {
        this.craneReturning = true;
        gsap.to(this.crane.rotation, {
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => {
            this.craneReturning = false;
          },
        });
      }

      return;
    }

    // Araç hareket ettiğinde smoke quark'larını göster
    this.startCarSmokeQuarks();

    // Joystick hareket ettiğinde crane returning animasyonunu durdur
    if (this.craneReturning) {
      gsap.killTweensOf(this.crane.rotation);
      this.craneReturning = false;
    }

    let theta = data.camTheta;
    if (data.camPhi < 0) theta += Math.PI;

    const movement = this.calculateMovement(
      globals.joystickData.x,
      globals.joystickData.y,
      theta
    );

    this.body.velocity.x =
      movement.x *
      this.moveSpeed *
      (data.vehicleSpeedStartAmount + globals.extraSpeed);
    this.body.velocity.z =
      movement.y *
      this.moveSpeed *
      (data.vehicleSpeedStartAmount + globals.extraSpeed);

    let newQuat = new THREE.Quaternion();
    newQuat.setFromEuler(
      new THREE.Euler(0, globals.joystickData.angle + theta, 0)
    );

    this.quaternion.slerp(newQuat, delta * 10 * (this.moveSpeed / 2));

    // Rotasyon değişimini kontrol et ve magnet sallanmasını yönet
    const currentRotation = this.rotation.y;
    const rotationDifference = Math.abs(
      currentRotation - this.previousRotation
    );

    this.previousRotation = currentRotation;

    // Crane'in harvester'ın rotasyonunu gecikmeli olarak takip etmesi
    if (this.crane) {
      // Crane'in world rotasyonunu kontrol et
      let craneWorldRotation = this.crane.getWorldQuaternion(
        new THREE.Quaternion()
      );
      let craneCurrentAngle = new THREE.Euler().setFromQuaternion(
        craneWorldRotation,
        'YXZ'
      ).y;

      // Target world açısı
      let targetWorldAngle = globals.joystickData.angle + theta;

      // Açıları -π ile +π arasında normalize et
      const normalizeAngle = (angle) => {
        while (angle > Math.PI) angle -= 2 * Math.PI;
        while (angle < -Math.PI) angle += 2 * Math.PI;
        return angle;
      };

      craneCurrentAngle = normalizeAngle(craneCurrentAngle);
      targetWorldAngle = normalizeAngle(targetWorldAngle);

      // En kısa açı farkını hesapla
      let angleDiff = targetWorldAngle - craneCurrentAngle;

      // En kısa rotasyon yolunu bul
      if (angleDiff > Math.PI) {
        angleDiff -= 2 * Math.PI;
      } else if (angleDiff < -Math.PI) {
        angleDiff += 2 * Math.PI;
      }

      // Çok küçük açı değişimlerini yoksay (gereksiz titremeleri önlemek için)
      const minAngleThreshold = 0.01; // ~0.57 derece
      if (Math.abs(angleDiff) < minAngleThreshold) {
        return; // Rotasyonu güncelleme
      }

      // Gecikmeli interpolasyon
      let lerpSpeed = delta * data.vechileMovementRotationSpeed;
      let newWorldAngle = craneCurrentAngle + angleDiff * lerpSpeed;

      // Yeni açıyı normalize et
      newWorldAngle = normalizeAngle(newWorldAngle);

      // World açısını local açıya çevir (parent rotasyonunu kompanse et)
      let parentWorldRotation = this.getWorldQuaternion(new THREE.Quaternion());
      let parentAngle = new THREE.Euler().setFromQuaternion(
        parentWorldRotation,
        'YXZ'
      ).y;
      parentAngle = normalizeAngle(parentAngle);

      this.crane.rotation.y = normalizeAngle(newWorldAngle - parentAngle);
    }
  }

  calculateMovement(x, y, theta) {
    // Convert joystick input to polar coordinates
    var r = Math.sqrt(x * x + y * y);
    var phi = Math.atan2(y, x);

    // Calculate the new angle based on camera angle (theta)
    var newPhi = phi - theta;

    // Calculate movement along x and y axes
    var moveX = r * Math.cos(newPhi);
    var moveY = r * Math.sin(newPhi);

    return { x: moveX, y: moveY, angle: newPhi };
  }

  collectJunk() {
    if (globals.availableJunks.length == 0) return;

    // magnetParent kontrolü
    if (!this.magnetParent) return;

    const magnetWorldPos = this.magnetParent.getWorldPosition(
      new THREE.Vector3()
    );

    globals.availableJunks.forEach((junk) => {
      if (
        this.junksLoaded.length >=
        globals.threeGame.capacity + globals.extraCapacity
      ) {
        gsap.killTweensOf(junk.scale);
        return;
      }
      const distance = junk.position.distanceTo(magnetWorldPos);

      if (distance < data.magnetRangeStartAmount + globals.extraRange) {
        // Bu junk için tracking bilgisini al veya oluştur
        if (!this.junkHealthTracking.has(junk)) {
          this.junkHealthTracking.set(junk, {
            lastHealthDecreaseTime: 0,
            isBeingProcessed: true,
            initialHealth: junk.health, // Başlangıç health değerini sakla
            isShaking: false, // Titreme animasyonu kontrolü
          });
        }

        const trackingData = this.junkHealthTracking.get(junk);
        const currentTime = Date.now() / 1000; // saniye cinsinden

        // Her 1 saniyede bir health azalt
        if (currentTime - trackingData.lastHealthDecreaseTime >= 1) {
          junk.health -= data.magbetPowerStartAmount + globals.extraPower;
          trackingData.lastHealthDecreaseTime = currentTime;

          // Visual feedback - çöp titresin (sadece ilk seferinde başlat)
          if (!trackingData.isShaking) {
            trackingData.isShaking = true;
            gsap.to(junk.scale, {
              x: junk.scale.x + 0.2,
              y: junk.scale.y + 0.2,
              z: junk.scale.z + 0.2,
              duration: 0.1,
              yoyo: true,
              repeat: -1,
              ease: 'power2.out',
            });
          }
        }

        // Health 0 olduğunda magnetParent'e doğru hareket ettir
        if (junk.health <= 0) {
          globals.junks_collected++;

          // VechileArm animasyonunu tetikle

          // Fizik body'sini yok et
          if (junk.body) {
            globals.physicsManager.world.removeBody(junk.body);
            junk.body = null;
          }

          // availableJunks listesinden çıkar
          globals.availableJunks = globals.availableJunks.filter(
            (j) => j !== junk
          );

          // Tracking'den de çıkar
          this.junkHealthTracking.delete(junk);

          // Junk'ı toplanan listesine ekle
          this.junksLoaded.push(junk);

          // magnetParent'e attach et
          this.magnetParent.attach(junk);

          // Hedef pozisyon hesaplama
          let destPos;

          if (this.magnets && this.magnets[3] && this.magnets[3].visible) {
            // Rastgele dairesel toplama
            let sphericalPos = new THREE.Spherical(
              randFloat(1.7, 2), // rastgele yarıçap
              Math.PI / 2, // yatay düzlem
              randFloat(0, Math.PI * 2) // rastgele açı
            );
            destPos = new THREE.Vector3().setFromSpherical(sphericalPos);
            destPos.y = randFloat(-0.3, 0.3); // Y'de küçük varyasyon
          } else {
            // Normal toplama (merkeze)
            destPos = new THREE.Vector3(0, 0, 0);
          }

          gsap.to(junk.position, {
            x: destPos.x,
            y: destPos.y,
            z: destPos.z,
            duration: 0.6,
            ease: 'power1.inOut',
            onStart: () => {
              // Ses efekti çal
              gsap.killTweensOf(junk.scale);
              let baseScale = junk.scale.x;
              // Rastgele rotasyon animasyonu ekle
              gsap.to(junk.rotation, {
                x: Math.random() * Math.PI * 2,
                y: Math.random() * Math.PI * 2,
                z: Math.random() * Math.PI * 2,
                duration: 0.6,
                ease: 'power1.inOut',
              });
              globals.collectedJunks++;
              if (globals.collectedJunks == data.junkCollectForEndCard) {
                globals.EventEmitter.emit('gameFinished');
              }
              if (globals.collectedJunks == data.junkCollectedForStore) {
                openStorePage();
              }
              junk.scale.set(baseScale, baseScale, baseScale);
              if (
                this.junksLoaded.length >=
                globals.threeGame.capacity + globals.extraCapacity
              ) {
                this.vechileArmAnimation();
                gsap.to(globals.pixiGame.capacityFullText, {
                  alpha: 1,
                  duration: 0.5,
                  ease: 'power2.out',
                });
                if (!this.firstCollect) {
                  const sellPointWorldPos =
                    globals.threeGame.sellPoint.getWorldPosition(
                      new THREE.Vector3()
                    );

                  this.firstCollect = true;
                  globals.tutorialTarget = sellPointWorldPos;
                  gsap.to(globals.threeGame.sellAreaPointer.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    duration: 0.5,
                    ease: 'power2.out',
                  });
                  gsap.to(globals.threeGame.sellAreaGreenBg.scale, {
                    x: 2.3,
                    y: 2.3,
                    z: 2.3,
                    duration: 0.5,
                    ease: 'power2.out',
                  });
                }
                if (!this.firstSell) {
                  this.firstSell = true;
                  globals.pixiGame.updateHelper(
                    'sellJunk',
                    data.sellJunkText,
                    data.sellJunkScale
                  );
                }

                if (this.startTutorialCompleted) {
                  const sellPointWorldPos =
                    globals.threeGame.sellPoint.getWorldPosition(
                      new THREE.Vector3()
                    );

                  globals.tutorialTarget = sellPointWorldPos;
                  gsap.to(globals.threeGame.sellAreaGreenBg.scale, {
                    x: 2.3,
                    y: 2.3,
                    z: 2.3,
                    duration: 0.5,
                    ease: 'power2.out',
                  });
                  gsap.to(globals.threeGame.sellAreaPointer.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    duration: 0.5,
                    ease: 'power2.out',
                  });
                }
              }
              if (!this.collectSfx) {
                this.collectSfx = AudioManager.playSFX('collect');
                gsap.delayedCall(0.05, () => {
                  this.collectSfx = null;
                });
              }
            },
          });
        }
      } else {
        // Mesafe fazlaysa health'i başlangıç değerine döndür ve tracking'i temizle
        if (this.junkHealthTracking.has(junk)) {
          const trackingData = this.junkHealthTracking.get(junk);
          const oldHealth = junk.health;
          junk.health = trackingData.initialHealth;

          // Scale animasyonunu durdur (eğer varsa)
          gsap.killTweensOf(junk.scale);
          junk.scale.set(junk.baseScale, junk.baseScale, junk.baseScale); // Scale'i normale döndür

          this.junkHealthTracking.delete(junk);
        }
      }
    });
  }

  sellJunk(obj) {
    const junk = this.junksLoaded.splice(this.junksLoaded.length - 1, 1)[0];

    if (!junk) return;

    obj.attach(junk);
    this.recycleJunks.push(junk);

    globals.logs_sold++;
    if (
      globals.logs_sold >= data.junkSelledForLvl2 &&
      this.vechileCanOpenLvl2
    ) {
      this.vechileCanOpenLvl2 = false;
      globals.threeGame.borderCameraAnimation();
      this.stopVehicle();
    }
    const curve = new THREE.CubicBezierCurve3(
      junk.position,
      junk.position.clone().add(new THREE.Vector3(0, 5, 0)),
      new THREE.Vector3(3, 10, 0),
      new THREE.Vector3(0, 0, 0)
    );
    let time = { value: 0 };
    gsap.to(time, {
      value: 1,
      duration: 0.4,
      ease: 'none',
      onStart: () => {},
      onUpdate: () => {
        junk.position.copy(curve.getPoint(time.value));
      },
      onComplete: () => {
        if (!this.firstUpgrade) {
          this.firstUpgrade = true;
          const upgradeAreaWorldPos =
            globals.threeGame.garageArea.getWorldPosition(new THREE.Vector3());
          globals.tutorialTarget = upgradeAreaWorldPos;
          gsap.to(globals.threeGame.garageAreaGreenBg.scale, {
            x: 2.3,
            y: 2.3,
            z: 2.3,
            duration: 0.5,
            ease: 'power2.out',
          });
          gsap.to(globals.threeGame.garageAreaPointer.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.5,
            ease: 'power2.out',
          });
        }
        globals.pixiGame.updateHelper(
          'upgradeVehicle',
          data.upgradeJunkText,
          data.upgradeVehicleScale
        );
        globals.threeGame.canUpgrade = true;

        //  globals.threeScene.remove(junk);
        //  junk.visible = false;
        this.recycleJunk();
      },
      onStart: () => {
        this.resetVechileArmToOriginal();
        gsap.to(globals.pixiGame.capacityFullText, {
          alpha: 0,
          duration: 0.5,
          ease: 'power2.out',
        });

        if (!this.isSellSfxPlaying) {
          this.isSellSfxPlaying = true;
          const sellSound = AudioManager.playSFX('sell');
          sellSound.on('end', () => {
            this.isSellSfxPlaying = false;
          });
        }
        if (data.isJunkCollectTextAnimationOn) {
          globals.pixiGame.collectTextAnimation(junk.price, this);
        }
      },
    });

    return junk;
  }

  recycleJunk() {
    if (this.recycleJunks.length === 0) return;

    const recycleCurve = globals.threeGame.recycleCurve;
    if (!recycleCurve) return;

    // Sadece henüz animasyonda olmayan junk'ları işle
    this.recycleJunks.forEach((junk, index) => {
      if (!junk.visible || junk.isRecycling) return; // Zaten işlenmiş veya animasyonda olanları atla

      // Bu junk'ın recycle animasyonunda olduğunu işaretle
      junk.isRecycling = true;

      // Her junk için farklı delay uygula (sıralı hareket için)
      const delay = index * 0.05;

      gsap.delayedCall(delay, () => {
        if (!this.isMachineSfxPlaying) {
          this.isMachineSfxPlaying = true;
          const machineSound = AudioManager.playSFX('machine');
          machineSound.on('end', () => {
            this.isMachineSfxPlaying = false;
          });
        }
        // Animasyon başlamadan önce junk'ın hala mevcut olup olmadığını kontrol et
        if (!junk.visible || !junk.parent) return;
        globals.selledJunks++;
        if (globals.selledJunks == data.junkSelledForEndCard) {
          globals.EventEmitter.emit('gameFinished');
        }
        if (globals.selledJunks == data.junkSelledForStore) {
          openStorePage();
        }
        if (globals.gmovr) return;
        // ÖNEMLI: Animasyon başlamadan önce junk'ı ana sahneye geri ekle
        // Bu parent ilişkisi problemini çözer
        const currentWorldPosition = junk.getWorldPosition(new THREE.Vector3());

        if (junk.parent) {
          junk.parent.remove(junk);
        }
        globals.threeScene.add(junk);
        junk.position.copy(currentWorldPosition);

        // Path takip animasyonu
        let time = { value: 0 };

        gsap.to(time, {
          value: 1,
          duration: 1.0, // Path'i takip etme süresi
          ease: 'power1.inOut',
          onUpdate: () => {
            // Junk hala mevcut mu kontrol et
            if (!junk.visible) {
              // Animasyonu durdur
              gsap.killTweensOf(time);
              return;
            }
            globals.threeGame.grinderSaws.forEach((saw) => {
              saw.rotation.z += 0.01;
            });
            // Curve üzerindeki pozisyonu hesapla ve uygula
            try {
              const pathPosition = recycleCurve.getPointAt(time.value);
              junk.position.copy(pathPosition);
            } catch (error) {
              console.warn('recycleCurve.getPointAt hatası:', error);
              gsap.killTweensOf(time);
            }
          },
          onStart: () => {
            // Ses efekti çal
            if (index === 0) {
              AudioManager.playSFX('collect');
            }

            gsap.to(junk.scale, {
              x: 0.5,
              y: 0.5,
              z: 0.5,
              duration: 0.3,
            });
          },
          onComplete: () => {
            // Sadece animasyon gerçekten tamamlandıysa temizle
            if (time.value >= 1) {
              // %99 tamamlanmışsa
              globals.threeScene.remove(junk);
              junk.visible = false;
              const junkIndex = this.recycleJunks.indexOf(junk);
              if (junkIndex !== -1) {
                this.recycleJunks.splice(junkIndex, 1);
                // console.log(
                //   `Junk geri dönüştürüldü ve array'den silindi - Index: ${junkIndex}`
                // );
                globals.userMoney += junk.price;
                globals.pixiGame.moneyAnimation();
                if (!this.isCashSfxPlaying) {
                  this.isCashSfxPlaying = true;
                  const cashSound = AudioManager.playSFX('cash');
                  cashSound.on('end', () => {
                    this.isCashSfxPlaying = false;
                  });
                }
              }
            }
          },
        });
      });
    });
  }

  update(ratio, delta) {
    this.move(ratio, delta);
    //this.manageJunkSleepStates();

    this.body.velocity.y = 0;
    this.body.position.y = 0;
    this.body.quaternion.copy(this.quaternion);
    this.position.copy(this.body.position);

    this.collectJunk();

    if (globals.tutorialTarget) {
      this.arrow.visible = true;
      let pos = globals.tutorialTarget.position || globals.tutorialTarget;
      this.arrow.lookAt(pos);

      if (this.position.distanceTo(pos) < 6) {
        globals.tutorialTarget = null;
      }
    } else {
      this.arrow.visible = false;
    }
  }

  manageJunkSleepStates() {
    globals.availableJunks.forEach((junk) => {
      const distance = this.position.distanceTo(junk.position);

      if (distance < 10) {
        // Harvester yakınsa junk'ı uyandır
        if (junk.isSleeping && junk.isSleeping()) {
          junk.wakeUpBody();
          console.log(`🔥 Junk uyandırıldı - mesafe: ${distance.toFixed(2)}`);
        }
      } else {
        // Harvester uzaksa junk'ı sleep'e sok
        if (junk.isSleeping && !junk.isSleeping()) {
          junk.sleepBody();
          console.log(
            `😴 Junk sleep'e sokuldu - mesafe: ${distance.toFixed(2)}`
          );
        }
      }
    });
  }
}
