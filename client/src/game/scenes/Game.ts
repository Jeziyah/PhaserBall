import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { Body, BodyType } from "matter";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    constructor() {
        super("Game");
    }

    private collisionData() {
        const CATEGORY_WALL = 0x0001; //[0]
        const CATEGORY_BALL = 0x0002; //[1]
        const CATEGORY_FLIPPER = 0x0004; //[2]

        const CATEGORY_FLIPPER_SUPPORT = 0x0005; //[6]
        
        
        // Define collision masks for MatterJS Objects
        const MASK_WALL = CATEGORY_BALL; // [3] Wall collides only with ball
        const MASK_BALL = CATEGORY_WALL | CATEGORY_FLIPPER; // [4] Ball collides with wall and flipper
        const MASK_FLIPPER = CATEGORY_BALL | CATEGORY_FLIPPER_SUPPORT; // [5] Flipper collides only with ball
        
        const MASK_FLIPPER_SUPPORT = CATEGORY_FLIPPER; // [7] Flippersupport collides only with flipper
        return [
            CATEGORY_WALL,
            CATEGORY_BALL,
            CATEGORY_FLIPPER,
            MASK_WALL,
            MASK_BALL,
            MASK_FLIPPER,

            CATEGORY_FLIPPER_SUPPORT,
            MASK_FLIPPER_SUPPORT
        ];
    }

    private flipperData() {
        const flipperAngle: number = 30;
        const flipperSize: number[] = [60, 15];
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

        const generateMap = this.generateMap();
        const placeObstacles = this.placeObstacles();

        const flipperData = this.flipperData();
        const flippers = this.createFlippers();

        const flipperL = flippers[0].body as BodyType;
        const flipperR = flippers[1].body as BodyType;

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
                collisionFilter: {
                    category: this.collisionData()[1],
                    mask: this.collisionData()[4],
                },
            },
            8
        );

        bally.body = circleBody;

        const circler = this.add.circle(
            (this.game.config.width as number) / 2,
            200,
            pinballSize,
            0xffabff
        );
        const bodys = this.matter.add.circle(
            (this.game.config.width as number) / 2,
            200,
            pinballSize,
            {
                collisionFilter: {
                    category: this.collisionData()[1],
                    mask: this.collisionData()[4],
                },
            }
        );
        this.matter.add.gameObject(circler, bodys);
        this.matter.add.gameObject(bally, circleBody);

        EventBus.emit("current-scene-ready", this);

        if (this.input && this.input.keyboard) {
            const leftKey = this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.A
            );
            const rightKey = this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.D
            );

            const flipperAngularVelocity = 25; // Adjust the angular velocity as needed
            if (leftKey && rightKey) {
                console.log("Initialized both keys 'A' and 'D'.");
            }else{
                console.log("Initialized both keys 'A' and 'D'.");

            }
            leftKey.on("down", () => {
                this.matter.body.setStatic(flipperL, false);
                this.matter.body.applyForce(
                    flipperL,
                    { x: -flipperL.bounds.max.x / 2, y: 0 },
                    { x: 0, y: flipperAngularVelocity } 
                );
                this.printData(flipperL);
            });
            
            rightKey.on("down", () => {
                this.matter.body.setStatic(flipperR, false);
                this.matter.body.applyForce(
                    flipperR,
                    { x: -flipperR.bounds.max.x / 2, y: 0 },
                    { x: 0, y: -flipperAngularVelocity } 
                );
                this.printData(flipperR);
            });

            leftKey.on("up", () => {
                this.matter.body.applyForce(
                    flipperL,
                    { x: -flipperL.bounds.max.x / 2, y: 0 },
                    { x: 0, y: -flipperAngularVelocity } 
                );
                // this.matter.body.setStatic(flipperL, true);
                this.printData(flipperL);
            });
            rightKey.on("up", () => {
                this.matter.body.applyForce(
                    flipperR,
                    { x: -flipperR.bounds.max.x / 2, y: 0 },
                    { x: 0, y: flipperAngularVelocity } 
                );
                // this.matter.body.setStatic(flipperR, true);
                this.printData(flipperR);
            });
        }
    }

    printData(body: BodyType) {
        console.log("Last Properties of Flipper's Physics Body:");
        console.log("Position:", body.bounds.max.x, body.bounds.max.y);
        // console.log("Velocity:", body.velocity.x, body.velocity.y);
        console.log("Angular Velocity:", body.angularVelocity);
    }

    update() {
        // obsta
    }
    changeScene() {
        this.scene.start("GameOver");
    }

    private createFlippers() {
        const data = this.flipperData();

        const flipperAngle = data[0] as number;

        const flipperSize = data[1] as number[];
        const flipperWidth = flipperSize[0];
        const flipperHeight = flipperSize[1];

        // Create angle constraints to limit the rotation of the flipper
        const minAngle = -Math.PI / 2; // Minimum angle (90 degrees in radians)
        const maxAngle = 0; // Maximum angle (0 degrees in radians)

        const xLeft =
            (this.game.config.width as number) / 2 - flipperWidth * 1.5;
        const yLeft =
            (this.game.config.height as number) * (3.5 / 5) + flipperHeight / 2;

        const xRight =
            (this.game.config.width as number) / 2 + flipperWidth * 1.5;
        const yRight =
            (this.game.config.height as number) * (3.5 / 5) + flipperHeight / 2;

        //gameObject from Phaser.io
        const anchorX = xLeft;
        const anchorY = yLeft;
        const flipperLeft = this.add.rectangle(
            anchorX - flipperWidth,
            anchorY,
            flipperWidth,
            flipperHeight,
            0xabcfff
        );
        // flipperLeft.setAngle(flipperAngle);
        //gameObject from Matter.js
        const flipperL = this.matter.add.gameObject(flipperLeft, {
            isStatic: false,
            density: 10,
            collisionFilter: {
                category: this.collisionData()[2],
                mask: this.collisionData()[5],
            },
        });
        
        // Create the anchor point
        const anchorLeft = this.matter.add.circle(anchorX, anchorY, 15, {
            isStatic: true,
            collisionFilter: {
                category: 0x0008,
                mask: 0,
            },
            // angle: flipperAngle,
        });
        // Create the revolute constraint between the flipper and the anchor
        this.matter.add.constraint(
            flipperL.body as BodyType,
            anchorLeft,
            0,
            1,
            {
                pointA: { x: -flipperWidth / 2, y: 0 },
                pointB: {
                    x: anchorLeft.circleRadius,
                    y: anchorLeft.circleRadius,
                },
            }
        );

        
        
        //gameObject from Phaser.io
        const anchorXRight = xRight;
        const anchorYRight = yRight;
        const flipperRight = this.add.rectangle(
            anchorXRight - flipperWidth, ///2,
            anchorYRight,
            flipperWidth,
            flipperHeight,
            0xffbcaf
        );
        // flipperRight.setAngle(flipperAngle);
        const flipperR = this.matter.add.gameObject(flipperRight, {
            isStatic: false,
            density: 10,
            collisionFilter: {
                category: this.collisionData()[2],
                mask: this.collisionData()[5],
            },
        });
        // Make the anchor point
        const anchorRight = this.matter.add.circle(
            anchorXRight,
            anchorYRight,
            15,
            {
                isStatic: true,
                collisionFilter: {
                    category: 0x0008,
                    mask: 0,
                },
            }
        );
        const constr = this.matter.add.joint(
            flipperR.body as BodyType,
            anchorRight,
            0,
            1,
            {
                pointA: { x: flipperWidth / 2, y: 0 },
                pointB: {
                    x: -anchorRight.circleRadius,
                    y: anchorRight.circleRadius,
                },
            }
        );
        // console.log("point stiffness: ", constr.stiffness);
        // console.log("point length: ", constr.length);
        // console.log("point A: ", constr.pointA);
        // console.log("point B: ", constr.pointB);
        
        const verticesL = [
            { x: 0, y: 0 }, // Vertex 1
            { x: 0, y: 30 }, // Vertex 2
            { x: 65, y: 30 }, // Vertex 3
        ];
        const flipSupportLeft = this.matter.add.fromVertices(
            xLeft - 10,
            yLeft + flipperHeight * 1.5,
            [verticesL],
            {
                collisionFilter: {
                    category: this.collisionData()[6],
                    mask: this.collisionData()[7],
                },
                isStatic: true,
                restitution: 0.5,
    
            },
            true //flagInternal
        );
    
        const verticesR = [
            { x: 65, y: 0 }, // Vertex 1
            { x: 0, y: 30 }, // Vertex 2
            { x: 65, y: 30 }, // Vertex 3
        ];
        const flipSupportRight = this.matter.add.fromVertices(
            xRight + 10,
            yRight + flipperHeight * 1.5,
            [verticesR],
            {
                collisionFilter: {
                    category: this.collisionData()[6],
                    mask: this.collisionData()[7],
                },
                isStatic: true,
                restitution: 0.5,
    
            },
            true //flagInternal
        );

        return [flipperL, flipperR];
    }
    generateMap() {
        const edgeWidth = 20;
        const screenWidth = this.game.config.width as number;
        const screenLength = this.game.config.height as number;

        const degrees45 = 45;
        const radians45 = degrees45 * (Math.PI / 180);

        const degrees65 = 65;
        const radians65 = degrees65 * (Math.PI / 180);

        const UIcolor = 0xeae8ea;
        const UIcolor2 = 0xaea2ae;
        const UIcolor3 = 0xbdb5bf;

        //CREATE LEFT EDGE
        const wallL = this.add.rectangle(
            0 + edgeWidth / 2,
            (this.game.config.height as number) * (2 / 4),
            edgeWidth,
            screenLength,
            UIcolor
        );
        const wallLeft = this.matter.add.gameObject(wallL, {
            isStatic: true,
            collisionFilter: {
                category: this.collisionData()[0],
                mask: this.collisionData()[3],
            },
        });

        //CREATE RIGHT EDGE
        const wallR = this.add.rectangle(
            screenWidth - edgeWidth / 2,
            (this.game.config.height as number) * (2 / 4),
            edgeWidth,
            screenLength,
            UIcolor
        );
        const wallRight = this.matter.add.gameObject(wallR, {
            isStatic: true,
            collisionFilter: {
                category: this.collisionData()[0],
                mask: this.collisionData()[3],
            },
        });

        //CREATE BOTTOM EDGE
        const part1 = this.add.rectangle(
            screenWidth / 2,
            (this.game.config.height as number) - screenLength * (0.5 / 8),
            screenWidth,
            screenLength * (2 / 8),
            UIcolor
        );
        const part1Matter = this.matter.add.gameObject(part1, {
            isStatic: true,
            collisionFilter: {
                category: this.collisionData()[0],
                mask: this.collisionData()[3],
            },
        });

        const wedgeCornerLeft = this.add.rectangle(
            screenWidth * (7.5 / 10),
            (this.game.config.height as number) * (7 / 8) - edgeWidth * 3.25,
            // (this.game.config.height as number) - screenLength * (0.5 / 8),
            edgeWidth * 4,
            screenLength * (1.25 / 8),
            UIcolor
        );
        const wedgeCornerLeftMatter = this.matter.add.gameObject(
            wedgeCornerLeft,
            {
                isStatic: true,
                collisionFilter: {
                    category: this.collisionData()[0],
                    mask: this.collisionData()[3],
                },
            }
        );

        const wedgeLeft = this.add.rectangle(
            screenWidth * (1 / 10),
            (this.game.config.height as number) * (7 / 8) - edgeWidth * 4.125,
            // (this.game.config.height as number) - screenLength * (0.5 / 8),
            edgeWidth * 8,
            screenLength * (1.25 / 8),
            UIcolor2
        );
        const wedgeLeftMatter = this.matter.add.gameObject(wedgeLeft, {
            isStatic: true,
            angle: -radians65,
            collisionFilter: {
                category: this.collisionData()[0],
                mask: this.collisionData()[3],
            },
        });
        const wedgeRight = this.add.rectangle(
            screenWidth * (9 / 10),
            (this.game.config.height as number) * (7 / 8) - edgeWidth * 4.125,
            // (this.game.config.height as number) - screenLength * (0.5 / 8),
            edgeWidth * 8,
            screenLength * (1.25 / 8),
            UIcolor2
        );
        const wedgeRightMatter = this.matter.add.gameObject(wedgeRight, {
            isStatic: true,
            angle: radians65,
            collisionFilter: {
                category: this.collisionData()[0],
                mask: this.collisionData()[3],
                
            },
        });

        const wedgeCornerRight = this.add.rectangle(
            screenWidth * (2.5 / 10),
            (this.game.config.height as number) * (7 / 8) - edgeWidth * 2,
            // (this.game.config.height as number) - screenLength * (0.5 / 8),
            edgeWidth * 4,
            screenLength * (1.25 / 8),
            UIcolor
        );
        const wedgeCornerRightMatter = this.matter.add.gameObject(
            wedgeCornerRight,
            {
                isStatic: true,
                collisionFilter: {
                    category: this.collisionData()[0],
                    mask: this.collisionData()[3],
                },
            }
        );

        // throw new Error("Method not implemented.");
    }
    placeObstacles() {
        const screenWidth = this.game.config.width as number;
        const screenLength = this.game.config.height as number;

        const UIcolor2 = 0xaea2ae;
        const obstacleAngle = 55 * (Math.PI / 180);

        const obstacble1 = this.add.rectangle(
            screenWidth * (3 / 10),
            (this.game.config.height as number) * (2 / 8) - 20 * 2,
            // (this.game.config.height as number) - screenLength * (0.5 / 8),
            20 * 1.25,
            screenLength * (2 / 10),
            UIcolor2
        );
        const obstacble1Matter = this.matter.add.gameObject(obstacble1, {
            angle: -obstacleAngle,
            isStatic: true,
        });
        const obstacble2 = this.add.rectangle(
            screenWidth * (7 / 10),
            (this.game.config.height as number) * (4 / 8) - 20 * 2,
            // (this.game.config.height as number) - screenLength * (0.5 / 8),
            20 * 1.25,
            screenLength * (2 / 10),
            UIcolor2
        );
        const obstacble2Matter = this.matter.add.gameObject(obstacble2, {
            angle: obstacleAngle,
            isStatic: true,
        });
    }
}

