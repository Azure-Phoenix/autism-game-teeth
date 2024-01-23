import * as THREE from 'three';
import Experience from '../../Experience.js';

export default class Character {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;

        this.isDragging = false;
        this.isReversing = false;

        // Resource
        this.resource = this.resources.items.character;

        this.setModel();
        this.setAnimation();
    }

    setModel() {
        this.model = this.resource.scene;
        // for (let i = 0; i < this.resource.animations.length; i++) {
        //     console.log(this.resource.animations[i].name);
        // }
        // this.model.visible = false;
        this.scene.add(this.model);
    }

    setAnimation() {
        this.animation = {};

        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model);
        this.animation.brushingMixer = new THREE.AnimationMixer(this.model);


        // Actions
        this.animation.actions = {};

        this.animation.actions.blink = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_Blink"));
        this.animation.actions.idle = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_0_Idle"));
        this.animation.actions.idleSK = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_0_Idle_SK"));
        this.animation.actions.pickToothpaste = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_1_PickToothpaste"));
        this.animation.actions.openToothpaste1 = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_2-1_OpenToothpaste"));
        this.animation.actions.openToothpaste2 = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_2-2_OpenToothpaste"));
        this.animation.actions.openToothpaste3 = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_2-3_OpenToothpaste"));
        this.animation.actions.pickToothbrush = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_4_Picktoothbrush"));
        this.animation.actions.squeezeToothpaste = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_5_SqueezeToothpaste"));
        this.animation.actions.openMouth = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_7_BrushStart"));
        this.animation.actions.openMouthSK = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_7_OpenMouth_SK"));
        this.animation.actions.brushingUR = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_8_BrushUpperRight"));
        this.animation.actions.brushingUL = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_9_BrushUpperLeft"));
        this.animation.actions.spitFirst = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_10_spitFirst"));
        this.animation.actions.spitSecond = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_13_spitSecond"));
        this.animation.actions.spitThird = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_15_spitThird"));
        this.animation.actions.spitFirstSK = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_10_spitFirst_SK"));
        this.animation.actions.spitSecondSK = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_13_spitSecond_SK"));
        this.animation.actions.spitThirdSK = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_15_spitThird_SK"));
        this.animation.actions.brushingLR = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_11_BrushLowerRight"));
        this.animation.actions.brushingLL = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_12_BrushLowerLeft"));
        this.animation.actions.brushingF = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_14_BrushFront"));
        this.animation.actions.openTap = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_16_OpenTap"));
        this.animation.actions.washBrush = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_17_WashBrush"));
        this.animation.actions.putBrush = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_18_PutBrush"));
        this.animation.actions.pickCup = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_19_PickUpCup"));
        this.animation.actions.closeTap = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_20_CloseTap"));
        this.animation.actions.cleanMouth = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_21_FillMouthGargle"));
        this.animation.actions.cleanMouthSK = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_21_FillMouthGargle_SK"));
        this.animation.actions.final = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_22_Final"));
        this.animation.actions.finalSK = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_22_Final_SK"));

        for (let anim in this.animation.actions) {
            if (anim != "idle" && anim != "blink") {
                // console.log(anim);
                this.animation.actions[anim].setLoop(THREE.LoopOnce);
                this.animation.actions[anim].clampWhenFinished = true;
            }
        }

        this.animation.actions.brushingURSK = this.animation.brushingMixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_8_BrushUpperRight_SK"));
        this.animation.actions.brushingULSK = this.animation.brushingMixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_9_BrushUpperLeft_SK"));
        this.animation.actions.brushingLRSK = this.animation.brushingMixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_11_BrushLowerRight_SK"));
        this.animation.actions.brushingLLSK = this.animation.brushingMixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_12_BrushLowerLeft_SK"));
        this.animation.actions.brushingFSK = this.animation.brushingMixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "C_14_BrushFront_SK"));


        this.animation.actions.current = this.animation.actions.idle;
        this.animation.actions.current.play();

        this.animation.actions.blink.play();

        this.animation.actions.currentSK = this.animation.actions.openMouth;

        // Play the action
        this.animation.play = (name) => {
            const newAction = this.animation.actions[name];
            const oldAction = this.animation.actions.current;

            if (name === "openMouth") {
                this.animation.playSK('openMouthSK');
            } else if (name === "spitFirst") {
                this.animation.playSK('spitFirstSK');
            } else if (name === "spitSecond") {
                this.animation.playSK('spitSecondSK');
            } else if (name === "spitThird") {
                this.animation.playSK('spitThirdSK');
            } else if (name === "idle") {
                this.animation.playSK('idleSK');
                // } else if (name === "brushingUL") {
                //     // this.animation.playSK('brushingULSK');
                // } else if (name === "brushingLR") {
                //     // this.animation.playSK('brushingLRSK');
                // } else if (name === "brushingLL") {
                //     // this.animation.playSK('brushingLLSK');
                // } else if (name === "brushingF") {
                //     // this.animation.playSK('brushingFSK');
            } else if (name === "cleanMouth") {
                this.animation.playSK('cleanMouthSK');
            } else if (name === "final") {
                this.animation.playSK('finalSK');
            }

            if (name === "pickToothpaste" || name === "pickToothbrush" || name === "putBrush") {
                newAction.reset();
                if (newAction != oldAction) {
                    newAction.play();
                    oldAction.stop();
                }
            } else {
                newAction.reset();
                newAction.play();

                if (newAction != oldAction)
                    newAction.crossFadeFrom(oldAction, 0.2);
            }
            this.animation.actions.current = newAction;
        }

        this.animation.playSK = (name) => {
            const newActionSK = this.animation.actions[name];
            const oldActionSK = this.animation.actions.currentSK;

            newActionSK.reset();
            newActionSK.play();

            if (newActionSK != oldActionSK)
                newActionSK.crossFadeFrom(oldActionSK, 0);

            this.animation.actions.currentSK = newActionSK;
        }
    }

    refresh() {
        this.animation.play("idle");
    }

    update() {
        if (this.experience.sequence.isReversing) {
            this.animation.mixer.update(-this.time.delta);
        } else {
            if (this.experience.sequence.isDragging) {
                this.animation.mixer.update(0);
            } else {
                this.animation.mixer.update(this.time.delta);
            }
        }
    }
}