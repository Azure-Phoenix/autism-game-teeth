import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class Toothpaste {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time

        // Resource
        this.resource = this.resources.items.toothpaste;

        this.setModel()
        this.setAnimation()
    }

    setModel() {
        this.model = this.resource.scene;
        this.model.traverse((child) => {
            if (child.isMesh) {
                // set the material to double sided
                child.material.side = THREE.DoubleSide;
            }
        });
        // for (let i = 0; i < this.resource.animations.length; i++) {
        //     console.log(this.resource.animations[i].name);
        // }
        this.scene.add(this.model);
    }

    setAnimation() {
        this.animation = {}

        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model)

        // Actions
        this.animation.actions = {}

        this.animation.actions.idle = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "P_0_Idle"));
        this.animation.actions.pickToothpaste = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "P_1_PickToothpaste"));
        this.animation.actions.openToothpaste = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "P_2_OpenToothpaste"));
        this.animation.actions.pickToothbrush = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "P_4_Picktoothbrush"));
        this.animation.actions.squeezeToothpaste = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "P_5_SqueezeToothpaste"));
        this.animation.actions.squeezeToothpasteSK = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "Key_P_5_SqueezeToothpaste"));

        for (let anim in this.animation.actions) {
            if (anim != "idle") {
                this.animation.actions[anim].setLoop(THREE.LoopOnce);
                this.animation.actions[anim].clampWhenFinished = true;
            }
        }

        this.animation.actions.current = this.animation.actions.idle;
        this.animation.actions.current.play();

        // Play the action
        this.animation.play = (name) => {
            const newAction = this.animation.actions[name];
            const oldAction = this.animation.actions.current;

            if (newAction == this.animation.actions.squeezeToothpaste) {
                this.animation.actions.squeezeToothpasteSK.play();
            }

            newAction.reset()
            newAction.play()
            if (newAction != oldAction)
                newAction.crossFadeFrom(oldAction, 0);

            this.animation.actions.current = newAction;
        }
    }

    update() {
        this.animation.mixer.update(this.time.delta);
    }
}