import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class Foam {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time

        // Resource
        this.resource = this.resources.items.foam;

        this.setModel()
        this.setAnimation()
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
        this.animation.mixer = new THREE.AnimationMixer(this.model);
        this.animation.foamMixer = new THREE.AnimationMixer(this.model);

        // Actions
        this.animation.actions = {}

        this.animation.actions.idle8SK = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_8_Idle_SK"));
        this.animation.actions.idle9SK = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_9_Idle_SK"));
        this.animation.actions.idle11SK = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_11_Idle_SK"));
        this.animation.actions.idle12SK = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_12_Idle_SK"));
        this.animation.actions.idle14SK = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_14_Idle_SK"));

        this.animation.actions.idle8 = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_8_0_Idle"));
        this.animation.actions.spitURFirst = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_8_10_spitFirst"));
        this.animation.actions.spitURSecond = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_8_13_spitSecond"));
        this.animation.actions.spitURThird = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_8_15_spitThird"));

        this.animation.actions.idle9 = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_9_0_Idle"));
        this.animation.actions.spitULFirst = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_9_10_spitFirst"));
        this.animation.actions.spitULSecond = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_9_13_spitSecond"));
        this.animation.actions.spitULThird = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_9_15_spitThird"));

        this.animation.actions.idle11 = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_11_0_Idle"));
        this.animation.actions.spitLRFirst = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_11_10_spitFirst"));
        this.animation.actions.spitLRSecond = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_11_13_spitSecond"));
        this.animation.actions.spitLRThird = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_11_15_spitThird"));

        this.animation.actions.idle12 = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_12_0_Idle"));
        this.animation.actions.spitLLFirst = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_12_10_spitFirst"));
        this.animation.actions.spitLLSecond = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_12_13_spitSecond"));
        this.animation.actions.spitLLThird = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_12_15_spitThird"));

        this.animation.actions.idle14 = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_14_0_Idle"));
        this.animation.actions.spitFFirst = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_14_10_spitFirst"));
        this.animation.actions.spitFSecond = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_14_13_spitSecond"));
        this.animation.actions.spitFThird = this.animation.mixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_14_15_spitThird"));

        this.animation.actions.brushingURSK0 = this.animation.foamMixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_8_BrushUpperRight_SK_0"));
        this.animation.actions.brushingURSK1 = this.animation.foamMixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_8_BrushUpperRight_SK_1"));
        this.animation.actions.brushingULSK0 = this.animation.foamMixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_9_BrushUpperLeft_SK_0"));
        this.animation.actions.brushingULSK1 = this.animation.foamMixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_9_BrushUpperLeft_SK_1"));
        this.animation.actions.brushingLRSK0 = this.animation.foamMixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_11_BrushLowerRight_SK_0"));
        this.animation.actions.brushingLRSK1 = this.animation.foamMixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_11_BrushLowerRight_SK_1"));
        this.animation.actions.brushingLLSK0 = this.animation.foamMixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_12_BrushLowerLeft_SK_0"));
        this.animation.actions.brushingLLSK1 = this.animation.foamMixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_12_BrushLowerLeft_SK_1"));
        this.animation.actions.brushingFSK0 = this.animation.foamMixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_14_BrushFront_SK_0"));
        this.animation.actions.brushingFSK1 = this.animation.foamMixer.clipAction(THREE.AnimationClip.findByName(this.resource.animations, "F_14_BrushFront_SK_1"));

        for (let anim in this.animation.actions) {
            if (anim == "idle8" || anim == "idle9" || anim == "idle11" || anim == "idle12" || anim == "idle14") {
            } else {
                this.animation.actions[anim].setLoop(THREE.LoopOnce);
                this.animation.actions[anim].clampWhenFinished = true;
            }
        }

        // this.animation.actions.current = this.animation.actions.idle8;
        // this.animation.actions.current.play();

        this.animation.actions.idle8SK.play();
        this.animation.actions.idle9SK.play();
        this.animation.actions.idle11SK.play();
        this.animation.actions.idle12SK.play();
        this.animation.actions.idle14SK.play();
        this.animation.actions.idle8.play();
        this.animation.actions.idle9.play();
        this.animation.actions.idle11.play();
        this.animation.actions.idle12.play();
        this.animation.actions.idle14.play();

        // Play the action
        this.animation.play = (name) => {
            const newAction = this.animation.actions[name];
            const oldAction = this.animation.actions.current;

            // if (name === "squeezeToothpaste") {
            //     this.animation.actions.squeezeToothpasteSK.play();
            // } 

            newAction.reset()
            newAction.play()
            // if (newAction != oldAction)
            //     newAction.crossFadeFrom(oldAction, 0.1);

            oldAction.stop();
            this.animation.actions.current = newAction;
        }
    }

    spitFirst() {
        this.animation.actions.spitURFirst.play();
        this.animation.actions.spitULFirst.play();
        this.animation.actions.idle8.stop();
        this.animation.actions.idle9.stop();
        // this.animation.actions.spitLRFirst.play();
        // this.animation.actions.spitLLFirst.play();
        // this.animation.actions.spitFFirst.play();
    }

    spitSecond() {
        this.animation.actions.spitURSecond.play();
        this.animation.actions.spitULSecond.play();
        this.animation.actions.spitLRSecond.play();
        this.animation.actions.spitLLSecond.play();
        this.animation.actions.spitURFirst.stop();
        this.animation.actions.spitULFirst.stop();
        this.animation.actions.idle11.stop();
        this.animation.actions.idle12.stop();
        // this.animation.actions.spitFSecond.play();
    }

    spitThird() {
        this.animation.actions.spitURThird.play();
        this.animation.actions.spitULThird.play();
        this.animation.actions.spitLRThird.play();
        this.animation.actions.spitLLThird.play();
        this.animation.actions.spitFThird.play();
        this.animation.actions.spitURSecond.stop();
        this.animation.actions.spitULSecond.stop();
        this.animation.actions.spitLRSecond.stop();
        this.animation.actions.spitLLSecond.stop();
        this.animation.actions.idle14.stop();
    }

    refresh() {
        this.animation.foamMixer.stopAllAction();
        this.animation.actions.idle8SK.play();
        this.animation.actions.idle9SK.play();
        this.animation.actions.idle11SK.play();
        this.animation.actions.idle12SK.play();
        this.animation.actions.idle14SK.play();
        this.animation.mixer.stopAllAction();
        this.animation.actions.idle8.play();
        this.animation.actions.idle9.play();
        this.animation.actions.idle11.play();
        this.animation.actions.idle12.play();
        this.animation.actions.idle14.play();
        this.model.visible = true;
    }

    update() {
        this.animation.mixer.update(this.time.delta);
        this.animation.foamMixer.update(0);
    }
}