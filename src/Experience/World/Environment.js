import * as THREE from 'three';
import Experience from '../Experience.js';
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.renderer = this.experience.renderer;

        this.pmremGenerator = new THREE.PMREMGenerator(this.renderer.instance);
        this.roomEnvironment = new RoomEnvironment();

        // this.setSunLight();
        // this.setModelViweLight();
        this.setEnvironment();
    }

    setSunLight() {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(this.ambientLight);

        this.lampLight = new THREE.PointLight(0xffffff, 50, 30, 2);
        this.lampLight.position.set(0.3, 8, 2);
        this.scene.add(this.lampLight);

        // Debug
        if (this.debug.active) {
            this.debugFolder
                .add(this.ambientLight, 'intensity')
                .name('sunLightIntensity')
                .min(0)
                .max(10)
                .step(0.001);
        }
    }

    setModelViweLight() {
        this.scene.environment = this.pmremGenerator.fromScene(
            this.roomEnvironment,
            0.04
        ).texture;
    }

    setEnvironment() {
        new RGBELoader()
            .setPath('environment/')
            .load('royal_esplanade_1k.hdr', (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;

                // this.scene.background = texture;
                this.scene.environment = texture;
            });
    }
}