import * as THREE from 'three';
// import EventEmitter from './Utils/EventEmitter.js'
import Experience from './Experience.js';

export default class Raycaster {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        

        window.addEventListener('mousedown', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera.instance);

            const intersects = this.raycaster.intersectObjects(this.scene.children, true);

            if (intersects.length > 0) {
                this.startObject = intersects[0].object;
                // this.trigger('startDragging');
            }
        });
        window.addEventListener('mouseup', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera.instance);

            const intersects = this.raycaster.intersectObjects(this.scene.children, true);

            if (intersects.length > 0) {
                this.endObject = intersects[0].object;
                // this.trigger('endDragging');
            }
        });
        

        window.addEventListener('touchstart', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera.instance);

            const intersects = this.raycaster.intersectObjects(this.scene.children, true);

            if (intersects.length > 0) {
                this.startObject = intersects[0].object;
                // this.trigger('startDragging');
            }
        });
        window.addEventListener('touchend', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera.instance);

            const intersects = this.raycaster.intersectObjects(this.scene.children, true);

            if (intersects.length > 0) {
                this.endObject = intersects[0].object;
                // this.trigger('endDragging');
            }
        });
    }
}