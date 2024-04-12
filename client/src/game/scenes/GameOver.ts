import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText : Phaser.GameObjects.Text;

    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        
        let numberWidth: string | number = this.game.config.width;
        let numWidth: number = parseInt(numberWidth as string, 10);
        
        let numberHeight: string | number = this.game.config.height;
        let numHeight: number = parseInt(numberHeight as string, 10);

        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0xff0000);

        this.background = this.add.image(numWidth, numHeight, 'background');
        this.background.setAlpha(0.5);

        this.gameOverText = this.add.text(numWidth, numHeight, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);
        
        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }
}
