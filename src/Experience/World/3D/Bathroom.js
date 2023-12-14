import * as THREE from 'three';
import Experience from '../../Experience.js';

export default class Bathroom
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.hiddenPos = {};

        // Resource
        this.resource = this.resources.items.bathroom;

        this.setModel();
    }

    setModel()
    {
        this.model = this.resource.scene;
        this.model.traverse((child) => {
            if(child.name == "Towel"){
                child.material.side = THREE.DoubleSide;
            }
        })
        this.scene.add(this.model);
    }
}