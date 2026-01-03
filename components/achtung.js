import { Player } from "./player.js";
import { BonusManager } from "./bonusManager.js";
import { getRandom } from "./external/tools.js";
import { PlayerManager } from "./playerManager.js";
import { CanvasManager } from "./canvasManager.js";
import { bonusBaseIterationFrequency } from "./constants.js";
export class Achtung {
    constructor(settings, canvas) {
        this.fps = 60;
        this.I = 0;
        this.interval = 0;
        this.running = true;
        this.gameOver = false;
        this.settings = settings;
        // this.defaultSnakeMode = false; 
        document.querySelectorAll(".bonus, .head").forEach((elm) => elm.remove());
        document.getElementById("Startmenu").hidden = true;
        document.getElementById("pauseMenu").style.opacity = "0";
        document.getElementById("fullscreen-container").style.display = "block";
        let ctx = canvas.getContext("2d");
        // initialisation des subdivisions du jeu
        this.canvasManager = new CanvasManager(canvas, this);
        this.canvasManager.initCells(20);
        // initialisation des joueurs
        this.playerManager = new PlayerManager(this);
        document.querySelectorAll(".player-container").forEach((element) => {
            if (element.getAttribute("data-selected") == "true") {
                let keyLeft = element.querySelector(".keyLeft").getAttribute("data-key");
                let keyRight = element.querySelector(".keyRight").getAttribute("data-key");
                let color = getComputedStyle(element).backgroundColor;
                let fullName = element.querySelector(".name").innerHTML;
                let name = element.getAttribute("id");
                this.playerManager.addPlayer(new Player(fullName, name, getRandom(this.width / 7, this.width * (6 / 7)), getRandom(this.height / 7, this.height * (6 / 7)), Math.random() * 360, color, keyLeft, keyRight, this.playerManager));
                document.getElementById("score").insertAdjacentHTML("beforeend",`<p>${fullName} : 0</p>`);
            }
        });
        let scoreWidth = document.getElementById("score-container").clientWidth;
        let maxWidth = screen.width - scoreWidth - 20;
        ctx.canvas.width = maxWidth * (settings.canva / 10);
        ctx.canvas.height = screen.height - 20;
        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // le fond du canvas
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        document.getElementById("bg_calc").style.width = this.width + "px";
        document.getElementById("bg_calc").style.height = this.height + "px";
        this.bonusManager = new BonusManager(this);
        if (settings.bonus) {
            Object.keys(settings.bonus).forEach(bonusId => {
                if (settings.bonus[bonusId]) {
                    this.bonusManager.addEffect(bonusId);
                }
            });
        }
        // initialisation du clavier
        this.keyboard = {};
        window.addEventListener('keydown', e => this.keyboard[e.code] = true);
        window.addEventListener('keyup', e => this.keyboard[e.code] = false);
        document.onkeyup = e => {
            if (e.code == "Space" && this.running)
                this.pause(), document.getElementById("pauseMenu").style.opacity = "1";
            else if (e.code == "Space" && !this.running)
                this.resume(), document.getElementById("pauseMenu").style.opacity = "0";
        };
        this.nextPlay();
    }
    destroy() {
        this.pause();
        document.getElementById("victoryScreen").style.display = "none";
        document.querySelectorAll(".bonus, .head").forEach((elm) => elm.remove());
        this.canvasManager.clear();
        this.bonusManager.clear();
        document.getElementById("bg_calc").style.background = "black";
    }
    nextPlay() {
        this.I = 0;
        this.canvasManager.clear();
        this.bonusManager.clear();
        this.playerManager.reset();
        document.getElementById("bg_calc").style.background = "black";
        for (let i = 0; i < 10; i++)
            this.update();
        this.pause();
    }
    update() {
        this.I += 1;
        this.playerManager.refreshScore();
        this.playerManager.aliveCounter = 0;
        if (this.I % Math.round(bonusBaseIterationFrequency / this.settings.bonusFrequency) == 0 && document.getElementById("objects").checked)
            this.bonusManager.spawnBonus(1);
        this.playerManager.updatePlayers();
        if (this.playerManager.aliveCounter <= 1) { // fin de la manche
            this.playerManager.refreshScore();
            this.pause();
        }
    }
    pause() {
        this.running = false;
        clearInterval(this.interval);
    }
    resume() {
        if (!this.gameOver) {
            this.interval = setInterval(() => this.update(), 1000 / this.fps);
            this.running = true;
            if (this.playerManager.aliveCounter <= 1)
                this.nextPlay();
        }
    }
}
