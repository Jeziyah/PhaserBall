import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;

    constructor() {
        super("MainMenu");
    }

    create() {
        // console.log(this.game.config.width);
        // console.log(this.game.config.height);

        let numberWidth: string | number = this.game.config.width;
        let numWidth: number = parseInt(numberWidth as string, 10);
        
        let numberHeight: string | number = this.game.config.height;
        let numHeight: number = parseInt(numberHeight as string, 10);

        console.log(numWidth + ", " + numHeight);

        // this.background = this.add.image(512, 384, 'background');
        this.background = this.add.image(numWidth/2, numHeight/2, "background");

        this.logo = this.add.image(numWidth/2, numHeight/2, "logo").setDepth(100);

        this.title = this.add
            .text(numWidth/2, numHeight, "Main Menu", {
                fontFamily: "Arial Black",
                fontSize: 38,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }
`
        this.scene.start("Arcade");`
    }

    moveLogo(vueCallback: ({ x, y }: { x: number; y: number }) => void) {
        if (this.logoTween) {
            if (this.logoTween.isPlaying()) {
                this.logoTween.pause();
            } else {
                this.logoTween.play();
            }
        } else {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: "Back.easeInOut" },
                y: { value: 80, duration: 1500, ease: "Sine.easeOut" },
                yoyo: true,
                repeat: -1,

                onUpdate: () => {
                    if (vueCallback) {
                        vueCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y),
                        });
                    }
                },
            });
        }
    }
}

