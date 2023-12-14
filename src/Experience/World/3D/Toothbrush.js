import * as THREE from 'three';
import Experience from '../../Experience.js';

export default class Toothbrush {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;

        // Resource
        this.resource = this.resources.items.toothbrush;

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
        this.animation = {};

        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model);

        // Actions
        this.animation.actions = {};

        this.animation.actions.idle = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "B_0_Idle"));
        this.animation.actions.pickToothbrush = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "B_4_PickToothbrush"));
        this.animation.actions.squeezeToothpaste = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "B_5_SqueezeToothpaste"));
        this.animation.actions.brushingUR = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "B_8_BrushUpperRight"));
        this.animation.actions.brushingUL = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "B_9_BrushUpperLeft"));
        this.animation.actions.brushingLR = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "B_11_BrushLowerRight"));
        this.animation.actions.brushingLL = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "B_12_BrushLowerLeft"));
        this.animation.actions.brushingF = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "B_14_BrushFront"));
        this.animation.actions.openTap = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "B_16_OpenTap"));
        this.animation.actions.washBrush = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "B_17_WashBrush"));
        this.animation.actions.putBrush = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "B_18_PutBrush"));

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

            newAction.reset();
            newAction.play();
            if (newAction != oldAction);
                newAction.crossFadeFrom(oldAction, 0);

            this.animation.actions.current = newAction;
        }
    }

    update() {
        this.animation.mixer.update(this.time.delta);
    }
}