import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText : Phaser.GameObjects.Text;
    gameText: Phaser.GameObjects.Text;

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
        this.background.setScale(numWidth, numHeight);

        this.gameOverText = this.add.text(numWidth/2, numHeight* (1/ 4), 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);
        
        this.gameText = this.add.text(this.game.config.width as number / 2, this.game.config.height as number* (1.5/ 4), 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }
}
