import Experience from '../Experience.js';
import Environment from './Environment.js';
import Character from './3D/Character.js';
import Toothpaste from './3D/Toothpaste.js';
import ToothpasteLid from './3D/ToothpasteLid.js';
import Toothbrush from './3D/Toothbrush.js';
import Sputum from './3D/Sputum.js';
import Hidden from './3D/Hidden.js';
import Bathroom from './3D/Bathroom.js';
import WaterCup from './3D/WaterCup';
import WaterFlow from './3D/WaterFlow';
import ToothpasteContent from './3D/ToothpasteContent.js';
import Cursor from './2D/SwipeCursor.js';
import Instruct from './Audio/Instruct.js';
import WaterInCup from './3D/WaterInCup';

export default class World {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.hidden = new Hidden();
            this.character = new Character();
            this.toothpaste = new Toothpaste();
            this.toothpasteLid = new ToothpasteLid();
            this.toothpasteContent = new ToothpasteContent();
            this.toothbrush = new Toothbrush();
            this.sputum = new Sputum();
            this.waterCup = new WaterCup();
            this.waterFlow = new WaterFlow();
            this.waterInCup = new WaterInCup();
            this.bathroom = new Bathroom();
            this.cursor = new Cursor();
            this.instruct = new Instruct();
            this.environment = new Environment();
        });
    }

    update() {
        if (this.character)
            this.character.update();
        if (this.toothpaste)
            this.toothpaste.update();
        if (this.toothpasteLid)
            this.toothpasteLid.update();
        if (this.toothpasteContent)
            this.toothpasteContent.update();
        if (this.toothbrush)
            this.toothbrush.update();
        if (this.sputum)
            this.sputum.update();
        if (this.waterCup)
            this.waterCup.update();
        if (this.waterFlow)
            this.waterFlow.update();
        if (this.waterInCup)
            this.waterInCup.update();
    }
}