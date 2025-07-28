import globals from '../../../../globals';
import data from '../../../config/data';
import * as THREE from 'three';

export default class SphericalCamera {
  constructor(followObject = null) {
    this.camera = globals.threeCamera;
    this.node = new THREE.Object3D();
    this.node.add(this.camera);
    this.followObject = followObject;
    globals.threeScene.add(this.node);

    this.camData = {
      radius: data.camRadius,
      theta: data.camTheta,
      phi: data.camPhi,
      fov: data.camFov,
      offsetX: data.camOffsetX,
      offsetY: data.camOffsetY,
      offsetZ: data.camOffsetZ,
    };

    this.spherical = new THREE.Spherical(
      this.camData.radius,
      this.camData.phi,
      this.camData.theta
    );
    this.offset = new THREE.Vector3(
      this.camData.offsetX,
      this.camData.offsetY,
      this.camData.offsetZ
    );

    this.camera.position.setFromSpherical(this.spherical);
    this.camera.lookAt(this.followObject?.position.clone());

    this.refPos = this.followObject?.position.clone();

    this.followObject.position.copy(this.refPos.clone().add(this.offset));

    this.camera.near = 2;
    this.camera.far = 10000000;
    this.camera.fov = data.camFov;
    this.camera.updateProjectionMatrix();

    this.start();
  }

  start() {
    globals.threeUpdateList.push(this);
  }

  update() {
    if (this.followObject && globals.threeGame.canFollow) {
      this.node.position.copy(this.followObject.position);

      this.spherical.radius = this.camData.radius;
      this.spherical.phi = this.camData.phi;
      this.spherical.theta = this.camData.theta;

      this.camera.position.setFromSpherical(this.spherical);
      this.camera.lookAt(this.followObject?.position.clone().add(this.offset));

      this.camera.updateProjectionMatrix();
    }
  }
}
