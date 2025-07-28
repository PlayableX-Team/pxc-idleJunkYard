import { BatchedParticleRenderer, QuarksLoader } from 'three.quarks';
import { assetLoader } from '../asset_loader';
import * as THREE from 'three';
import gsap from 'gsap';
import globals from '../../globals';

export default class QuarksPool {
  constructor(threeScene) {
    this.threeScene = threeScene;
    this.batchSystem = new BatchedParticleRenderer();
    this.threeScene.add(this.batchSystem);
    this.quarksLoader = new QuarksLoader();
    this.quarksLoader.setCrossOrigin('');

    this.createPool();
  }

  effects = {};

  createPool() {
    let quarkDatas = assetLoader.quarksData;

    Object.keys(quarkDatas).forEach((key) => {
      let quarkData = quarkDatas[key];
      let speedMultiplier = quarkData.speedMultiplier || 1;
      console.log('quarkData:', quarkData);

      let pool = [];
      for (let i = 0; i < quarkData.poolCount; i++) {
        this.quarksLoader.parse(quarkData, (quark) => {
          this.threeScene.add(quark);
          quark.emitters = quark.children;

          quark.emitters.forEach((emitter) => {
            this.batchSystem.addSystem(emitter.system);

            if (quarkData.prewarm) {
              emitter.system.prewarm = true;
            }
          });

          pool.push(quark);
          quark.isBusy = false;

          quark.play = (pos) => {
            // Eğer pos verilmişse pozisyonu güncelle
            if (pos) {
              quark.position.copy(pos);
            }

            quark.emitters.forEach((emitter) => {
              emitter.system.play();
            });

            // Follow edilen quark'lar için setBusy yapmaya gerek yok
            if (!quark.targetObj) {
              quark.setBusyTemporarily();
            }
          };

          quark.stop = () => {
            quark.emitters.forEach((emitter) => {
              emitter.system.stop();
            });
          };

          // Yavaşça durdurmak için yeni fonksiyon
          quark.fadeOut = (duration = 1.0) => {
            if (quark.isFadingOut) return; // Zaten fade out yapılıyorsa tekrar başlatma

            quark.isFadingOut = true;

            // Orijinal scale değerini kullan (eğer yoksa mevcut scale'i kullan)
            const originalScale = quark.originalScale || quark.scale.x;

            // Scale ile fade out efekti
            gsap.to(quark.scale, {
              x: 0,
              y: 0,
              z: 0,
              duration: duration,
              ease: 'power2.out',
              onComplete: () => {
                quark.emitters.forEach((emitter) => {
                  emitter.system.stop();
                });
                // Scale'i orijinal haline geri döndür
                quark.scale.set(originalScale, originalScale, originalScale);
                quark.isFadingOut = false;
              },
            });
          };

          // Yavaşça başlatmak için yeni fonksiyon
          quark.fadeIn = (duration = 0.5, pos) => {
            if (quark.isFadingIn) return; // Zaten fade in yapılıyorsa tekrar başlatma

            quark.isFadingIn = true;

            if (pos) {
              quark.position.copy(pos);
            }

            // Önce sistemi başlat
            quark.emitters.forEach((emitter) => {
              emitter.system.play();
            });

            // Orijinal scale değerini kullan (eğer yoksa 1 kullan)
            const targetScale = quark.originalScale || 1;

            // Scale'i sıfırdan başlatıp orijinal scale'e büyüt
            quark.scale.set(0, 0, 0);
            gsap.to(quark.scale, {
              x: targetScale,
              y: targetScale,
              z: targetScale,
              duration: duration,
              ease: 'power2.out',
              onComplete: () => {
                quark.isFadingIn = false;
              },
            });

            // Follow edilen quark'lar için setBusy yapmaya gerek yok
            if (!quark.targetObj) {
              quark.setBusyTemporarily();
            }
          };

          quark.pause = () => {
            quark.emitters.forEach((emitter) => {
              emitter.system.pause();
            });
          };

          quark.restart = (pos) => {
            quark.position.copy(pos);

            quark.emitters.forEach((emitter) => {
              emitter.system.restart();
            });

            quark.setBusyTemporarily();
          };

          quark.setBusyTemporarily = () => {
            quark.isBusy = true;
            gsap.delayedCall(2, () => {
              quark.isBusy = false;
            });
          };

          quark.stop();
        });
      }
      this.effects[key] = pool;
    });
  }

  spawnQuarkAtPos(name, pos, scale = 1) {
    let quark = null;
    if (this.effects[name]) {
      for (let i = 0; i < this.effects[name].length; i++) {
        if (!this.effects[name][i].isBusy) {
          quark = this.effects[name][i];
          break;
        }
      }
    }

    if (quark) {
      quark.scale.set(scale, scale, scale);
      quark.restart(pos);
    }

    return quark;
  }

  attachQuarkToObj(
    name,
    obj,
    scale = 1,
    pos = new THREE.Vector3(0, 0, 0),
    rotation = new THREE.Euler(0, 0, 0)
  ) {
    let quark = this.effects[name].find((q) => !q.isBusy);
    if (quark) {
      quark.scale.set(scale, scale, scale);
      obj.add(quark);
      quark.restart(pos);
      quark.rotation.copy(rotation);
    }

    return quark;
  }

  spawnQuarkAndFollowObject(
    name,
    obj,
    scale = 1,
    rotation = new THREE.Euler(0, 0, 0),
    pos = new THREE.Vector3(0, 0, 0)
  ) {
    let quark = this.effects[name].find((q) => !q.isBusy);
    if (quark) {
      quark.scale.set(scale, scale, scale);

      // Orijinal scale değerini sakla
      quark.originalScale = scale;

      // Başlangıç pozisyonunu hesapla
      let worldPos = obj.getWorldPosition(new THREE.Vector3());
      let transformedOffset = pos.clone().applyMatrix4(obj.matrixWorld);
      let offsetPosition = worldPos
        .clone()
        .add(transformedOffset.sub(worldPos));

      quark.restart(offsetPosition);
      quark.rotation.copy(rotation);
      quark.targetObj = obj;
      quark.givenRot = rotation;
      quark.positionOffset = pos; // Yerel offset'i sakla
      this.followList.push(quark);
    }

    return quark;
  }

  followList = [];

  update(delta) {
    if (this.batchSystem) {
      this.batchSystem.update(delta);
    }

    if (this.followList.length > 0) {
      this.followList.forEach((quark) => {
        let targetObj = quark.targetObj;
        if (targetObj) {
          let targetWorldPos = targetObj.getWorldPosition(new THREE.Vector3());

          // Eğer pozisyon offset'i varsa, objenin rotasyonuna göre transform et
          if (quark.positionOffset) {
            // Yerel offset'i dünya koordinatlarına çevir
            let transformedOffset = quark.positionOffset.clone();
            transformedOffset.applyMatrix4(targetObj.matrixWorld);

            // Objenin pozisyonunu çıkararak sadece offset kısmını al
            let objWorldPos = targetObj.getWorldPosition(new THREE.Vector3());
            transformedOffset.sub(objWorldPos);

            targetWorldPos.add(transformedOffset);
          }

          quark.position.copy(targetWorldPos);
          quark.rotation.copy(quark.targetObj.rotation);
          // add rotation quark.givenRot
          quark.rotation.x += quark.givenRot.x;
          quark.rotation.y += quark.givenRot.y;
          quark.rotation.z += quark.givenRot.z;
        }
      });
    }
  }
}
