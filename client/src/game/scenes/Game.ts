import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { BodyType } from "matter";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    constructor() {
        super("Game");
    }
    private flipperData() {
        const flipperAngle: number = 30;
        const flipperSize: number[] = [80, 20];
        const flipperOpen: number = 150;
        const flipSpeed: number = 5;

        return [flipperAngle, flipperSize, flipperOpen, flipSpeed];
    }
    preload() {
        const flipperAngle: number = 30;
    }

    create() {
        const pinballSize = 18;
        // let plane: Phaser.Physics.Matter.Sprite;
        // let obstacle: Phaser.Physics.Matter.Sprite;
        // let spritePhysics: Phaser.Physics.Matter.MatterPhysics;
        this.matter.world.setBounds(
            0,
            0,
            this.game.config.width as number,
            this.game.config.height as number
        );

        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xaaffbb);

        this.background = this.add.image(512, 384, "background");
        this.background.setAlpha(1);
        this.background.setScale(
            this.game.config.width as number,
            this.game.config.height as number
        );

        const flipperData = this.flipperData();
        const flippers = this.createFlippers();

        const flipperL = flippers[0].body as BodyType;
        const flipperR = flippers[1];

        this.matter.world.add(flippers);
        //pinball ball
        // const bally = this.add.circle(
        const bally = this.add
            .circle(
                (this.game.config.width as number) / 2,
                (this.game.config.height as number) * (4 / 5),
                16,
                0xf9f9f9
            )
            .setDepth(100);
        // this.physics.world.enable(bally);

        const circleBody = this.matter.add.circle(
            (this.game.config.width as number) / 2 - 50,
            (this.game.config.height as number) * (1 / 5),
            16,
            {
                // isStatic: false,
                restitution: 0.5, // Adjust restitution (bounciness) as needed
                friction: 0.1, // Adjust friction as needed
                density: 0.01, // Adjust density as needed
                render: {
                    fillOpacity: 0,
                    fillColor: 0xff0000,
                },
            },
            8
        );

        bally.body = circleBody;

        const circler = this.add.circle(100, 200, pinballSize, 0xffabff);
        const bodys = this.matter.add.circle(100, 200, pinballSize);
        this.matter.add.gameObject(circler, bodys);
        this.matter.add.gameObject(bally, circleBody);
        // console.log(flippersize[0], flippersize[1]);
        //flipper left
        // this.matter.world.disableGravity();

        // spritePhysics = this.cache.json.get("sprites");
        // console.log("menuutje: ", this.cache.json.get("sprites"));

        // plane = this.matter.add.sprite(300, 360, "plane", "plane1.png", {
        //     // shape: spritePhysics.plane,
        // });
        // // plane.play("fly");

        // obstacle = this.matter.add.sprite(1100, 360, "obstacle", undefined, {
        //     // shape: spritePhysics.obstacle,
        // });

        EventBus.emit("current-scene-ready", this);
        // const shades = Matter.Bodies.rectangle(
        //     this.game.config.width as number,
        //     this.game.config.height as number / 2,
        //     this.game.config.width as number/2,
        //     this.game.config.height as number/2,
        //     {
        //         isStatic: true,
        //         isSensor: true,
        //         render: {
        //           fillStyle: 'pink'
        //         },
        //     },
        // );

        // this.matter.world.add(shades);

        if (this.input && this.input.keyboard) {
            const leftKey = this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.A
            );
            const rightKey = this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.D
            );

            const flipperAngularVelocity = 0.1; // Adjust the angular velocity as needed
            if (leftKey && rightKey) {
                console.log("Initialized both keys 'A' and 'D'.");
            }
            // Add event listeners to the keys to move the flippers
            leftKey.on("down", () => {
                // this.matter.body.setAngularVelocity(
                //     flipperL.body as BodyType,
                //     -flipperAngularVelocity
                // );
                this.matter.body.applyForce(
                    flipperL,
                    // -flipperAngularVelocity
                    { x: -flipperL.bounds.max.x / 2, y: 0 },
                    { x: 0, y: flipperAngularVelocity } // Force vector
                );
                // flipper.setAngularVelocity(-yourAngularVelocity);
                // flipperL.setAngle((this.flipperData()[0] as number) / 4);
                // (flipperL as BodyType).setAngle(
                //     this.flipperData()[2] as number
                // );

                // this.matter.body.setAngularVelocity(
                //     flippers[2] as BodyType,
                //     this.flipperData()[3] as number
                // );
                // Matter.Body.setAngularVelocity(flipperL as Matter.Body, -this.flipperData()[0] as number);
                // console.log(
                //     "activated left flipper, with angle: ",
                //     flipperL.angle.toString()
                // );
                // console.log(flipperL.angle.toString());
            });
            leftKey.on("up", () => {
                this.matter.body.applyForce(
                    flipperL,
                    // -flipperAngularVelocity
                    { x: -flipperL.bounds.max.x / 2, y: 0 },
                    { x: 0, y: -flipperAngularVelocity } // Force vector
                );
                // this.matter.body.setAngularVelocity(
                //     flippers[2] as BodyType,
                //     // this.flipperData()[0] as number
                //     0
                // );
                // flipper.setAngularVelocity(-yourAngularVelocity);
                // flipperL.setAngle((this.flipperData()[0] as number) * 4);
                // flipperL.setAngle(this.flipperData()[0] as number);
                // console.log(flipperL.angle.toString());
                // console.log(
                    //     "released left flipper, with angle: ",
                //     flipperL.angle.toString()
                // );
            });

            rightKey.on("down", () => {
                this.matter.body.setAngularVelocity(
                    flipperR.body as BodyType,
                    -flipperAngularVelocity
                );
                // flipperR.setAngle((-this.flipperData()[0] as number) / 4);
                // flipperR.setAngle(-this.flipperData()[2] as number);
                // console.log(
                //     "activated right flipper, with angle: ",
                //     flipperR.angle.toString()
                // );
            });
            // rightKey.on("up", () => {
            //     // flipperR.setAngle((-this.flipperData()[0] as number) * 4);
            //     flipperR.setAngle(-this.flipperData()[0] as number);
            //     console.log(
            //         "released right flipper, with angle: ",
            //         flipperR.angle.toString()
            //     );
            // });
        }
    }

    update() {
        // obsta
    }
    changeScene() {
        this.scene.start("GameOver");
    }

    private createFlippers() {
        // const flippersize: number[] = [120, 20]; //old variable for flipper size

        const data = this.flipperData();

        const flipperAngle = data[0] as number;

        const flipperSize = data[1] as number[];
        const flipperWidth = flipperSize[0];
        const flipperHeight = flipperSize[1];

        // Create angle constraints to limit the rotation of the flipper
        const minAngle = -Math.PI / 2; // Minimum angle (90 degrees in radians)
        const maxAngle = 0; // Maximum angle (0 degrees in radians)

        const xLeft =
            (this.game.config.width as number) / 2 - flipperWidth;
        const yLeft =
            (this.game.config.height as number) * (4 / 5) + flipperHeight;
        // const flipperGroupLeft = this.add.group();
        // const flipperL = this.add
        //     .rectangle(
        //         (this.game.config.width as number) / 2 - flipperWidth * 1.2,
        //         (this.game.config.height as number) * (4 / 5) + flipperHeight,
        //         flipperWidth * 2,
        //         flipperHeight,
        //         0xf9f9f9,
        //         1
        //     )
        //     .setOrigin(0.5)
        //     .setDepth(100);
        // flipperL.setAngle(flipperAngle);
        // flipperGroupLeft.add(flipperL);

        // const flipperLMatter = this.matter.add.rectangle(
        //     (this.game.config.width as number) / 2 - flipperWidth * 1.2,
        //     (this.game.config.height as number) * (4 / 5) + flipperHeight,
        //     flipperWidth * 2,
        //     flipperHeight,
        //     {
        //         isStatic: false,
        //         // angle: flipperAngle,
        //         render: {
        //             fillColor: 0xbbaaff,
        //         },
        //     }
        // );

        // const flipperAnchorL = this.matter.add.rectangle(
        //     (this.game.config.width as number) / 2 - flipperWidth * 1.2,
        //     (this.game.config.height as number) * (4 / 5) + flipperHeight,
        //     flipperHeight,
        //     flipperHeight,
        //     {
        //         isStatic: false,
        //         // angle: flipperAngle,
        //         render: {
        //             fillColor: 0xbbaaff,
        //         },
        //     }
        // );

        // Create flipper sprites
        const flipperLeft = this.add.rectangle(
            (this.game.config.width as number) / 2 - flipperWidth * 1.2,
            (this.game.config.height as number) * (4 / 5) + flipperHeight,
            flipperWidth, //*2 ,
            flipperHeight,
            0xabcfff
        );
        const flipperRight = this.add.rectangle(
            (this.game.config.width as number) / 2 + flipperWidth * 1.2,
            (this.game.config.height as number) * (4 / 5) + flipperHeight,
            flipperWidth,
            flipperHeight,
            0xffbcaf
        );

        // Enable Matter.js physics for flipper sprites
        const flipperL = this.matter.add.gameObject(flipperLeft, {
            isStatic: false,
        });
        const flipperR = this.matter.add.gameObject(flipperRight, {
            isStatic: false,
        });
        // Create the anchor point
        const anchorX = xLeft; // Adjust as needed
        const anchorY = yLeft; // Adjust as needed
        const anchor = this.matter.add.circle(anchorX, anchorY, 5, {
            isStatic: true,
        });

        // Create the revolute constraint between the flipper and the anchor
        this.matter.add.constraint(anchor, flipperL.body as BodyType, 0, 0, {
            pointA: { x: 0, y: 0 }, // Offset from the center of the flipper
            pointB: { x: -flipperWidth / 2, y: 0 }, // Offset from the center of the anchor
            stiffness: 0.1, // Adjust stiffness as needed
            // angleA: maxAngle,
            // angleB: minAngle
            // angleB: flipperAngle
        });


        // const minAngleConstraint = this.matter.add.constraint(
        //     anchor,
        //     flipperL.body as BodyType,
        //     0,
        //     0,
        //     {
        //         pointA: { x: 0, y: 0 }, // Offset from the center of the flipper
        //         pointB: { x: 0, y: 0 }, // Offset from the center of the anchor
        //         angleA: minAngle,
        //         angleB: minAngle,
        //         stiffness: 0.1
        //     }
        // // );

        // const maxAngleConstraint = this.matter.add.constraint(
        //     anchor,
        //     flipperL.body as BodyType,
        //     0,
        //     0,
        //     {
        //         pointA: { x: 0, y: 0 }, // Offset from the center of the flipper
        //         pointB: { x: -flipperWidth / 2, y: 0 }, // Offset from the center of the anchor
        //         angleA: maxAngle,
        //         angleB: maxAngle,
        //         stiffness: 0.1            }
        // );
        // Implement flipper movement
        // Add event listeners for flipper controls (e.g., keyboard input)

        // Similar event listeners for flipperRight

        // this.matter.add.gameObject(flipperL);
        // this.matter.add.gameObject(flipperL, flipperAnchorL);
        // Create a Matter.js composite
        // Create a Matter.js composite

        // Create revolute constraint for flipperL to allow spinning
        // const flipperPivotX = flipperL.position.x;
        // const flipperPivotY = flipperL.position.y;
        // const flipperPivot = { x: flipperPivotX, y: flipperPivotY };
        // const revoluteConstraint = this.matter.add.constraint(
        //     flipperL,
        //     flipperL
        // );

        //flipper right
        // const flipperR = this.add
        //     .rectangle(
        //         (this.game.config.width as number) / 2 + flipperWidth * 1.2,
        //         (this.game.config.height as number) * (4 / 5) + flipperHeight,
        //         flipperWidth * 2,
        //         flipperHeight,
        //         0x8dd020,
        //         1
        //     )
        //     .setOrigin(0.5)
        //     .setDepth(100);
        // flipperR.setAngle(-flipperAngle);

        // const flipperRMatter = this.matter.add.rectangle(
        //     (this.game.config.width as number) / 2 - flipperWidth * 1.2,
        //     (this.game.config.height as number) * (4 / 5) + flipperHeight,
        //     flipperWidth * 2,
        //     flipperHeight,
        //     {
        //         isStatic: false,
        //         // angle: flipperAngle,
        //         render: {
        //             fillColor: 0xbbaaff,
        //         },
        //     }
        // );
        // const flipperAnchorR = this.matter.add.rectangle(
        //     (this.game.config.width as number) / 2 - flipperWidth * 1.2,
        //     (this.game.config.height as number) * (4 / 5) + flipperHeight,
        //     flipperHeight,
        //     flipperHeight,
        //     {
        //         isStatic: true,
        //         // angle: flipperAngle,
        //         render: {
        //             fillColor: 0xbbaaff,
        //         },
        //     }
        // );
        // this.matter.add.gameObject(flipperR, flipperRMatter);
        // this.matter.add.gameObject(flipperR, flipperAnchorR);

        // Create horizontal constraint to prevent flipperL from falling off the screen
        // const minX = flipperWidth / 2; // Minimum x-coordinate
        // const maxX = (this.game.config.width as number) - flipperWidth / 2; // Maximum x-coordinate
        // const horizontalConstraint = this.matter.add.constraint(
        //     flipperL,
        //     flipperRMatter,
        //     0, // Keep the length fixed
        //     1 // High stiffness to prevent movement along the horizontal axis
        // );

        // const flipper = this.matter.add.rectangle(
        //     (this.game.config.width as number) / 2 - flipperWidth * (6 / 8),
        //     (this.game.config.height as number) * (4 / 5) + flipperHeight,
        //     flipperWidth + 10 * 1.2,
        //     flipperHeight - 10 * 3,
        //     { isStatic: true, angle: flipperAngle } // Options: make it static for the flipper
        // );
        // return [flipperL, flipperR, flipperLMatter, flipperRMatter];
        return [flipperL, flipperR];
    }
}

