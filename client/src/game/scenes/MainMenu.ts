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

        // this.background = this.add.image(512, 384, 'background');
        this.background = this.add.image(
            numWidth / 2,
            numHeight / 2,
            "background"
        );
        this.background.setScale(numWidth, numHeight);

        this.logo = this.add
            .image(numWidth / 2, numHeight / 3, "logo")
            .setDepth(100);
        this.logo.setScale(0.65, 0.65); // Halve the size of the image

        this.title = this.add
            .text(numWidth / 2, numHeight - numHeight * 0.1, "Main Menu", {
                fontFamily: "Arial Black",
                fontSize: 38,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 4,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);


        const button = this.add.sprite(numWidth / 2, numHeight * (2/3), "button").setInteractive();
        // button.setScale(undefined, 0.7);
        button.setScale(10, 10);

        EventBus.emit("current-scene-ready", this);

        // Set button callback
        button.on("pointerdown", () => {
            // Handle button click event
            console.log("Button clicked!");
            this.changeScene();
        });
    }

    changeScene() {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }
        // `
        // this.scene.start("Game");`;

        this.scene.start("Game");
        // this.scene.start("Arcade");`
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

