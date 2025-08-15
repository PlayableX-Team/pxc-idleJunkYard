import * as THREE from 'three';
import globals from '../../../../globals';
import gsap from 'gsap';
import AudioManager from '../../../../engine/audio/AudioManager';
import data from '../../../config/data';
import * as CANNON from 'cannon-es';

export default class Junk extends THREE.Object3D {
  constructor(
    model,
    scale,
    position = new THREE.Vector3(0, 0, 0),
    rotation = new THREE.Vector3(0, 0, 0),
    body = null,
    health,
    price,
    canCollect = true
  ) {
    super();
    this.animations = {};
    this.model = globals.cloneModel(model);

    // // Modelin metalik değerini artır
    // this.model.traverse((child) => {
    //   if (child.isMesh && child.material) {
    //     if (Array.isArray(child.material)) {
    //       // Eğer material bir array ise, her materyal için işlem yap
    //       child.material.forEach((material) => {
    //         if (
    //           material.isMeshStandardMaterial ||
    //           material.isMeshPhysicalMaterial
    //         ) {
    //           material.metalness = 0.5; // Metalik değerini 0.3 artır, maksimum 1.0
    //         }
    //       });
    //     } else {
    //       // Tek materyal ise
    //       if (
    //         child.material.isMeshStandardMaterial ||
    //         child.material.isMeshPhysicalMaterial
    //       ) {
    //         child.material.metalness = 1; // Metalik değerini 0.3 artır, maksimum 1.0
    //       }
    //     }
    //   }
    // });

    this.scale.setScalar(scale);
    this.baseScale = this.scale.x;
    this.add(this.model);
    this.position.copy(position);
    // this.rotation.copy(rotation);
    globals.threeScene.add(this);
    this.body = body;
    this.health = health;
    this.price = price;
    this.canCollect = canCollect;
    gsap.delayedCall(0.5, () => {
      this.sleepBody();
    });
  }

  addPhysicsBody() {
    this.body = globals.physicsManager.createBodyFromObject(this.model, {
      type: 'dynamic',
      mass: 10,
      sizeMultiplier: new THREE.Vector3(1, 1, 1),
    });
    this.body.position.copy(this.position);
    // Quaternion'ı da kopyala
    this.body.quaternion.copy(this.quaternion);

    this.body.linearDamping = 0.01; // Lineer hareketi yavaşlat
    this.body.angularDamping = 0.01; // Açısal hareketi yavaşlat
  }

  // Body'yi sleep state'e sokma metodu
  sleepBody() {
    if (this.body) {
      // Hızları sıfırla
      this.body.velocity.set(0, 0, 0);
      this.body.angularVelocity.set(0, 0, 0);

      // Sleep state'ini SLEEPING olarak ayarla
      this.body.sleepState = CANNON.BODY_SLEEP_STATES.SLEEPING;

      // Alternatif olarak sleep() metodunu kullan
      this.body.sleep();

      console.log("Junk body sleep state'e sokuldu:", this.body.sleepState);
    }
  }

  // Body'yi uyandırma metodu
  wakeUpBody() {
    if (this.body) {
      this.body.wakeUp();
      console.log('Junk body uyandırıldı:', this.body.sleepState);
    }
  }

  // Sleep durumunu kontrol etme metodu
  isSleeping() {
    return (
      this.body && this.body.sleepState === CANNON.BODY_SLEEP_STATES.SLEEPING
    );
  }

  update(ratio, delta) {
    // Body yoksa update yapma
    if (!this.body) return;

    // Eğer body sleeping değilse pozisyonu senkronize et
    if (!this.isSleeping()) {
      //this.body.quaternion.copy(this.quaternion);
      this.position.copy(this.body.position);
      this.quaternion.copy(this.body.quaternion);
    }
    // this.quaternion.copy(this.body.quaternion); // rotation yerine quaternion kullan
  }
}
