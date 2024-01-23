import * as THREE from 'three';
import Experience from './Experience.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import * as cameraDB from './DB/camera.json'

export default class Camera {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.debug = this.experience.debug;
        this.camera_data = cameraDB.default;

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Camera')
        }

        this.setInstance();
        // this.setControls();
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            60,
            this.sizes.width / this.sizes.height,
            0.1,
            1000
        );
        this.instance.position.set(...this.camera_data[3].data.position);
        this.instance.rotation.set(...this.camera_data[3].data.rotation);
        this.scene.add(this.instance);

        if (this.debug.active) {
            this.debugFolder
                .add(this.instance.position, 'x')
                .name('Camera_pos_X')
                .min(-10)
                .max(10)
                .step(0.001);
            this.debugFolder
                .add(this.instance.position, 'y')
                .name('Camera_pos_Y')
                .min(-10)
                .max(10)
                .step(0.001);
            this.debugFolder
                .add(this.instance.position, 'z')
                .name('Camera_pos_Z')
                .min(-10)
                .max(10)
                .step(0.001);
            this.debugFolder
                .add(this.instance.rotation, 'x')
                .name('Camera_rot_X')
                .min(-10)
                .max(10)
                .step(0.001);
            this.debugFolder
                .add(this.instance.rotation, 'y')
                .name('Camera_rot_Y')
                .min(-10)
                .max(10)
                .step(0.001);
            this.debugFolder
                .add(this.instance.rotation, 'z')
                .name('Camera_rot_Z')
                .min(-10)
                .max(10)
                .step(0.001);
        }
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update() {
        // this.controls.update();
        // console.log("Position: ", this.instance.position);
        // console.log("Rotation: ", this.instance.rotation);
    }
}