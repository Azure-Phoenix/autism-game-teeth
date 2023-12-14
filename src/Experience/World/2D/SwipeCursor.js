import * as THREE from 'three';
import Experience from '../../Experience.js';
import gsap from 'gsap';

export default class Cursor {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.camera = this.experience.camera;

        this.setGeometry();
        this.setTextures();
        this.setMaterial();
        this.setMesh();
    }

    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(1, 2.5);
    }

    setTextures() {
        this.textures = {};

        this.textures.color = this.resources.items.swipeCursor;
        // this.textures.color.colorSpace = THREE.SRGBColorSpace;
        this.textures.color.repeat.set(1.5, 1.5);
        this.textures.color.wrapS = THREE.RepeatWrapping;
        this.textures.color.wrapT = THREE.RepeatWrapping;

        this.textures.normal = this.resources.items.swipeCursor;
        this.textures.normal.repeat.set(1, 1);
        this.textures.normal.wrapS = THREE.RepeatWrapping;
        this.textures.normal.wrapT = THREE.RepeatWrapping;
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures.color,
            normalMap: this.textures.normal,
            transparent: true,
            opacity: 0,
            depthTest: false 
        });
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.scale.set(0.1, 0.08, 1);
        this.scene.add(this.mesh);
    }

    setPosition(pos) {
        this.mesh.position.copy(pos);
    }

    setScale(distance) {
        // console.log(distance);
        let times = distance * 0.7;
        this.mesh.scale.set(0.1 * times, 0.08 * times, 1 * times);
    }

    show() {
        gsap.to(this.material, {
            opacity: 1,
            duration: 0.5
        });
    }

    hide() {
        gsap.to(this.material, {
            opacity: 0,
            duration: 0.5,
        });
    }
}