import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class WaterCup {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time

        // Resource
        this.resource = this.resources.items.waterCup;

        this.setModel();
        this.setAnimation();
    }

    setModel() {
        this.model = this.resource.scene;
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

        this.animation.actions.idle = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "W_0_Idle"));
        this.animation.actions.pickCup = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "W_19_PickUpCup"));
        this.animation.actions.closeTap = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "W_20_CloseTap"));
        this.animation.actions.cleanMouth = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "W_21_FillMouthGargle"));
        // this.animation.actions.final = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "W_23_Smile"));

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

            newAction.reset()
            newAction.play()
            if (newAction != oldAction)
                newAction.crossFadeFrom(oldAction, 0);

            this.animation.actions.current = newAction;
        }
    }

    refresh() {
        this.animation.play("idle");
    }

    update() {
        this.animation.mixer.update(this.time.delta);
    }
}