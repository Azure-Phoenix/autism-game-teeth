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
        // const testG = new THREE.SphereGeometry(0.01);
        // const testM = new THREE.MeshBasicMaterial({
        //     color: 0xff0000
        // });
        // this.testSphere = new THREE.Mesh(testG, testM);
        // // testSphere.position.set(-0.439841, 1.33573, 0.013105);
        // this.scene.add(this.testSphere);

        this.model = this.resource.scene;
        this.model.traverse((child) => {
            if(child.name == "Towel"){
                child.material.side = THREE.DoubleSide;
            }
        })
        this.scene.add(this.model);
    }
}