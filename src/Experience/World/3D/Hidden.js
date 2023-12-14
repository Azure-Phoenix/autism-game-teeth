import * as THREE from 'three';
import Experience from '../../Experience.js';

export default class Hidden {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.hiddenPos = {};

        // Resource
        this.resource = this.resources.items.hidden;

        this.setModel();
    }

    setModel() {
        this.model = this.resource.scene;
        this.model.visible = false;
        this.model.traverse((child) => {
            if(child.isMesh){
                child.material.transparent = true;
                child.material.opacity = 0.5;
            }
            this.hiddenPos[child.name] = child.position;
        })
        this.scene.add(this.model);
    }
}