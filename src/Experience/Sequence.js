import gsap from 'gsap';
import * as THREE from 'three';
import Experience from "./Experience";
import Raycaster from "./Raycaster";

import * as repeatDB from "./DB/repeat.json";

export default class Sequence {

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.loading = this.experience.loading;
        this.camera = this.experience.camera;
        this.repeat_Data = repeatDB.default;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();


        this.step = 1;
        this.prompotLimit = 0;
        this.timeoutLimit = 0;
        this.actionCount = 0;
        this.passActions = [3, 6];
        this.closeCamera = [7, 8, 9, 11, 12, 14]
        this.brushingCount = 0;
        this.brushingAction = [8, 9, 11, 12, 14];
        this.autoAction = [7, 10, 13, 15, 16, 17, 19, 20, 21, 22];
        this.countFlag = true;
        this.canControlBrushing = true;
        this.availableAction = false;

        window.addEventListener('mousedown', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera.instance);

            const intersects = this.raycaster.intersectObjects(this.scene.children, true);

            if (intersects.length > 0) {
                this.startObject = intersects[0].object;
            }

            if (this.brushingAction.includes(this.step)) {
                if (this.startObject.name === `Hidden_Action_8_from` && this.availableAction) {
                    window.addEventListener('mousemove', this.brushing);
                }
            }
        });
        window.addEventListener('mouseup', (event) => {
            this.brushingCount = 0;
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera.instance);

            const intersects = this.raycaster.intersectObjects(this.scene.children, true);

            if (intersects.length > 0) {
                this.endObject = intersects[0].object;
                this.trigger_action(this.step);
            }
        });


        window.addEventListener('touchstart', (event) => {
            this.mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera.instance);

            const intersects = this.raycaster.intersectObjects(this.scene.children, true);

            if (intersects.length > 0) {
                this.startObject = intersects[0].object;
            }

            if (this.brushingAction.includes(this.step)) {
                if (this.startObject.name === `Hidden_Action_8_from` && this.availableAction) {
                    window.addEventListener('touchmove', this.brushing);
                }
            }
        });
        window.addEventListener('touchend', (event) => {
            this.brushingCount = 0;
            this.mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;

            console.log(this.mouse);

            this.raycaster.setFromCamera(this.mouse, this.camera.instance);

            const intersects = this.raycaster.intersectObjects(this.scene.children, true);
            console.log(intersects[0].object);

            if (intersects.length > 0) {
                console.log("touch");
                this.endObject = intersects[0].object;
                this.trigger_action(this.step);
            }
        });

        this.sequence();
    }

    brushing = (event) => {

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        if (isNaN(this.mouse.x)) {
            this.mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;
        }

        this.raycaster.setFromCamera(this.mouse, this.camera.instance);

        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            this.targetObject = intersects[0].object;
            if (this.targetObject.name === `Hidden_Action_8_to` && this.canControlBrushing) {
                if (this.countFlag) {
                    this.brushingCount++;
                    this.countFlag = false;
                }
                console.log(this.brushingCount);
                if (this.brushingCount === 3) {
                    this.play_action(this.step);
                    this.brushingCount = 0;
                    this.canControlBrushing = false;
                    window.removeEventListener('mousemove', this.brushing);
                    window.removeEventListener('touchmove', this.brushing);
                }
            }
            if (this.targetObject.name === `Hidden_Action_8_from`) {
                this.countFlag = true;
            }
        }
    }

    sequence() {
        // start game
        this.loading.on('start', () => {
            setTimeout(() => {
                this.prompt_action(this.step);
            }, 500);

            this.experience.world.character.animation.mixer.addEventListener("finished", (e) => {
                if (!e.action._clip.name.includes("_SK")) {
                    if(this.step == 23) {
                        alert("Game Finished!!!");
                    }
                    this.canControlBrushing = true;
                    this.availableAction = false;
                    if (this.passActions.includes(this.step)) {
                        this.step++;
                    }
                    console.log(this.step);
                    this.camera_move(this.step);
                    setTimeout(() => {
                        if (this.autoAction.includes(this.step)) {
                            this.play_action(this.step);
                        } else {
                            this.prompt_action(this.step);
                        }
                    }, 2000);
                    if (this.timeoutLimit == 3) {
                        //finish game
                        alert("Time Out");
                        location.reload();
                        this.timeoutLimit = 0;
                    }
                }
            });
        });
    }

    prompt_action(id) {
        let tempID = id;
        if (this.brushingAction.includes(tempID)) {
            tempID = 8;
        }
        this.prompotLimit++;
        if (this.prompotLimit == 5) {
            // do action automatically
            this.play_action(id);
            this.timeoutLimit++;
        } else {
            this.experience.world.cursor.setPosition(this.experience.world.hidden.hiddenPos[`Hidden_Action_${tempID}_from`]);
            this.experience.world.cursor.show();
            this.experience.world.cursor.mesh.lookAt(this.camera.instance.position);
            this.experience.world.cursor.setScale(this.experience.world.hidden.hiddenPos[`Hidden_Action_${tempID}_from`].distanceTo(this.camera.instance.position));
            if (tempID != 8) {
                gsap.fromTo(this.experience.world.cursor.mesh.position, this.experience.world.hidden.hiddenPos[`Hidden_Action_${tempID}_from`], {
                    duration: 1.5,
                    delay: 1,
                    repeat: this.repeat_Data.find(item => item.id === id).repeat - 1,
                    ...this.experience.world.hidden.hiddenPos[`Hidden_Action_${tempID}_to`],
                    onComplete: () => {
                        this.experience.world.cursor.hide();
                        this.availableAction = true;
                    },
                });
            } else {
                try {
                    window.removeEventListener('mousemove', this.brushing);
                    window.removeEventListener('touchmove', this.brushing);
                } catch (error) { }
                gsap.fromTo(this.experience.world.cursor.mesh.position, this.experience.world.hidden.hiddenPos[`Hidden_Action_${tempID}_from`], {
                    duration: 0.5,
                    delay: 1,
                    repeat: 5,
                    ease: "linear",
                    yoyo: true,
                    ...this.experience.world.hidden.hiddenPos[`Hidden_Action_${tempID}_to`],
                    onComplete: () => {
                        this.experience.world.cursor.hide();
                        this.availableAction = true;
                    },
                });
            }
            setTimeout(() => {
                if (this.step == id) {
                    this.prompt_action(id);
                }
            }, 5000 + 1000 + 1500 * this.repeat_Data.find(item => item.id === id).repeat);
        }
    }

    trigger_action(id) {
        if (this.startObject.name === `Hidden_Action_${id}_from` && this.endObject.name === `Hidden_Action_${id}_to` && !this.brushingAction.includes(id)) {
            this.actionCount++;
            if (this.actionCount == this.repeat_Data.find(item => item.id === id).repeat) {
                console.log(this.availableAction);
                if (this.availableAction || this.autoAction.includes(id)) {
                    this.play_action(id);
                } else {
                    this.actionCount = 0;
                }
            }
        }
    }

    play_action(id) {
        this.prompotLimit = 0;
        this.actionCount = 0;
        this.step++;
        this.experience.world.cursor.hide();

        switch (id) {
            case 1: // Action 1: Pick Toothpaste
                this.experience.world.character.animation.play('pickToothpaste');
                this.experience.world.toothpaste.animation.play('pickToothpaste');
                this.experience.world.toothpasteLid.animation.play('pickToothpaste');
                break;
            case 2: // Action 2: Open Cap
                this.experience.world.character.animation.play('openToothpaste');
                this.experience.world.toothpaste.animation.play('openToothpaste');
                this.experience.world.toothpasteLid.animation.play('openToothpaste');
                break;
            // case 3: // Action 3: Putting Cap
            //     this.play_action(this.step);
            //     break;
            case 4: // Action 4: Pick Toothbrush
                this.experience.world.character.animation.play('pickToothbrush');
                this.experience.world.toothpaste.animation.play('pickToothbrush');
                this.experience.world.toothbrush.animation.play('pickToothbrush');
                break;
            case 5: // Action 5: Squeeze Toothpaste
                this.experience.world.toothpaste.animation.play('squeezeToothpaste');
                this.experience.world.toothbrush.animation.play('squeezeToothpaste');
                this.experience.world.toothpasteContent.animation.play('squeezeToothpaste');
                this.experience.world.character.animation.play('squeezeToothpaste');
                break;
            // case 6: // Action 6: Putting Toothpaste
            //     break;
            case 7: // Action 7: Opening Mouth
                this.experience.world.character.animation.play('openMouth');
                this.experience.world.toothpasteContent.animation.play('openMouth');
                break;
            case 8: // Action 8: Brushing Upper Right
                this.experience.world.character.animation.play('brushingUR');
                this.experience.world.toothbrush.animation.play('brushingUR');
                break;
            case 9: // Action 9: Brushing Upper Left
                this.experience.world.character.animation.play('brushingUL');
                this.experience.world.toothbrush.animation.play('brushingUL');
                break;
            case 10: // Action 10: Spitting Sputum
                this.experience.world.character.animation.play('spitFirst');
                this.experience.world.sputum.animation.play('spitFirst');
                break;
            case 11: // Action 11: Brushing Lower Right
                this.experience.world.character.animation.play('brushingLR');
                this.experience.world.toothbrush.animation.play('brushingLR');
                break;
            case 12: // Action 12: Brushing Lower Left
                this.experience.world.character.animation.play('brushingLL');
                this.experience.world.toothbrush.animation.play('brushingLL');
                break;
            case 13: // Action 13: Spitting Sputum
                this.experience.world.character.animation.play('spitSecond');
                this.experience.world.sputum.animation.play('spitFirst');
                break;
            case 14: // Action 14: Brushing Front
                this.experience.world.character.animation.play('brushingF');
                this.experience.world.toothbrush.animation.play('brushingF');
                break;
            case 15: // Action 15: Spitting Sputum
                this.experience.world.character.animation.play('spitThird');
                this.experience.world.sputum.animation.play('spitFirst');
                break;
            case 16: // Action 16: Opening Tap
                this.experience.world.character.animation.play('openTap');
                this.experience.world.toothbrush.animation.play('openTap');
                this.experience.world.waterFlow.animation.play('openTap');
                break;
            case 17: // Action 17: Washing Toothbrush
                this.experience.world.character.animation.play('washBrush');
                this.experience.world.toothbrush.animation.play('washBrush');
                break;
            case 18: // Action 18: Putting Brush
                this.experience.world.character.animation.play('putBrush');
                this.experience.world.toothbrush.animation.play('putBrush');
                break;
            case 19: // Action 19: Picking and filling up a Cup
                this.experience.world.character.animation.play('pickCup');
                this.experience.world.waterCup.animation.play('pickCup');
                this.experience.world.waterFlow.animation.play('pickCup');
                break;
            case 20: // Action 20: Closing Tap
                this.experience.world.character.animation.play('closeTap');
                this.experience.world.waterCup.animation.play('closeTap');
                this.experience.world.waterFlow.animation.play('closeTap');
                break;
            case 21: // Action 21: Cleaning Mouth
                this.experience.world.character.animation.play('cleanMouth');
                this.experience.world.waterCup.animation.play('cleanMouth');
                this.experience.world.sputum.animation.play('cleanMouth');
                break;
            case 22: // Action 22: Final Animation
                this.experience.world.character.animation.play('final');
                break;
            default:
                break;
        }
    }

    camera_move(id) {
        console.log("camera", id);
        if (this.closeCamera.includes(id)) {
            this.experience.camera.instance.fov = 30;
            this.experience.camera.instance.updateProjectionMatrix();
        } else {
            this.experience.camera.instance.fov = 60;
            this.experience.camera.instance.updateProjectionMatrix();
        }

        gsap.fromTo(this.experience.camera.instance.position,
            this.experience.camera.instance.position,
            {
                duration: 2,
                x: this.experience.camera.camera_data[id - 1].data.position[0],
                y: this.experience.camera.camera_data[id - 1].data.position[1],
                z: this.experience.camera.camera_data[id - 1].data.position[2]
            }
        );

        let startQuaternion = new THREE.Quaternion().copy(this.experience.camera.instance.quaternion);
        let endQuaternion = new THREE.Quaternion();
        endQuaternion.setFromEuler(new THREE.Euler(
            this.experience.camera.camera_data[id - 1].data.rotation[0],
            this.experience.camera.camera_data[id - 1].data.rotation[1],
            this.experience.camera.camera_data[id - 1].data.rotation[2],
            'XYZ'
        ));

        let slerpValue = { t: 0 };

        gsap.to(slerpValue, {
            duration: 2,
            t: 1,
            onUpdate: () => {
                this.experience.camera.instance.quaternion.slerpQuaternions(startQuaternion, endQuaternion, slerpValue.t);
            }
        });
    }
}