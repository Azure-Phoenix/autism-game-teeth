import { gsap } from "gsap";
import Experience from "./Experience.js";
import EventEmitter from "./Utils/EventEmitter.js";

export default class Loading extends EventEmitter {
    constructor() {
        super();

        this.experience = new Experience();
        this.resources = this.experience.resources;

        this.resources.on("loaded", () => {
            document.querySelector(".progressbar").style.width =
                (this.resources.loaded / this.resources.toLoad) * 100 + "%";
        });

        this.resources.on("ready", () => {
            document.querySelector("#instructions").innerHTML = `
                <span class="buttonload" stu>
                    <i class="fa fa-spinner fa-spin"></i>Click to Start!
                </span>
            `;
            window.addEventListener("mousedown", (e) => {
                try {
                    document.querySelector(".progress").style.opacity = 1;
                    document.querySelector("#blocker").style.opacity = 1;

                    gsap.to(document.querySelector(".progress").style, {
                        opacity: 0,
                        duration: 2,
                        delay: 1,
                    });
                    gsap.to(document.querySelector("#blocker").style, {
                        opacity: 0,
                        duration: 2,
                        delay: 1,
                        onComplete: () => {
                            document.querySelector(".progress").remove();
                            document.querySelector("#blocker").remove();
                            this.trigger("start");
                        },
                    });
                } catch {}
            });

            window.addEventListener("touchstart", (e) => {
                try {
                    document.querySelector(".progress").style.opacity = 1;
                    document.querySelector("#blocker").style.opacity = 1;

                    gsap.to(document.querySelector(".progress").style, {
                        opacity: 0,
                        duration: 2,
                        delay: 1,
                    });
                    gsap.to(document.querySelector("#blocker").style, {
                        opacity: 0,
                        duration: 2,
                        delay: 1,
                        onComplete: () => {
                            document.querySelector(".progress").remove();
                            document.querySelector("#blocker").remove();
                            this.trigger("start");
                        },
                    });
                } catch {}
            });
        });
    }
}
