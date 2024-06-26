import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { Arcade } from './scenes/Arcade';


//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    // width: 1024,
    // height: 768,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    parent: 'game-container',
    backgroundColor: '#028af8',
    physics: {
        default: 'matter',
        matter: {
            // Matter.js specific configuration options
            gravity: { x: 0, y: 0.2 }, // Customize gravity
            debug: true // Enable debug rendering
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        // Arcade,
        GameOver
    ]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
}

export default StartGame;