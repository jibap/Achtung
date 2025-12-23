var _a;
//@ts-ignore
Math.seedrandom(Math.random().toString(36).substring(7)); // aléatoire procédural
import { Slider } from "./external/slider.js";
import { Achtung } from "./achtung.js";
import { randomBool, getRandomInt } from "./external/tools.js";
/// Selection des personnages et des touches
let achtung;
let settingState = 0;
let selectedContainer;
let editingName = false;

document.querySelectorAll('.player-container').forEach(playerLine => {
    let clickTimer;

    playerLine.addEventListener("click", () => {
       // on attend 250ms pour confirmer que ce n'est pas un double-clic
        clickTimer = setTimeout(() => {
        if (!editingName) {
            document.querySelectorAll('.keyLeft, .keyRight').forEach(k => k.classList.remove('focused'));
            selectedContainer = playerLine;
            settingState = 0;
            playerLine.querySelector(".keyLeft").classList.add("focused");
            playerLine.querySelector(".keyRight").classList.remove("focused");
        }
        }, 250);
    });

    playerLine.addEventListener("contextmenu", e => {
        e.preventDefault();
        playerLine.setAttribute("data-selected", "false");
        playerLine.classList.remove("selected");
        playerLine.querySelector(".keyRight").innerHTML = "Droite";
        playerLine.querySelector(".keyLeft").innerHTML = "Gauche";
    });

    playerLine.addEventListener('dblclick', () => {
        clearTimeout(clickTimer); // annule le clic simple
        editingName = true; // on commence l’édition
        const pElem = playerLine.querySelector('.name');
        const currentName = pElem.textContent;

        const input = document.createElement('input');
        input.type = 'text';
        input.value = '';

        pElem.replaceWith(input);
        input.focus();

        let finalized = false;  // Flag pour éviter le blur après enter
        const finalize = (escape) => {
            if (finalized) return; // déjà fait, on sort
            finalized = true;
            const newName = escape ? currentName : (input.value.trim() || currentName);
            const newP = document.createElement('p');
            newP.className = 'name';
            newP.textContent = newName;
            input.replaceWith(newP);
            editingName = false; // fin de l’édition
        };

        input.addEventListener('blur', () => finalize(false));
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();    // empêche l’action par défaut du navigateur
                e.stopPropagation();   // empêche la propagation vers le listener d'apui de touche
                finalize(false);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                finalize(true); // remet l'ancien nom
            }
        });
    }); 
});

document.addEventListener("keydown", e => {
    if (selectedContainer != undefined && !editingName) {
        if (settingState == 0) {
            selectedContainer.querySelector(".keyLeft").innerHTML = e.key;
            selectedContainer.querySelector(".keyLeft").setAttribute("data-key", String(e.code));
            selectedContainer.querySelector(".keyLeft").classList.remove('focused');
            selectedContainer.querySelector(".keyRight").classList.add('focused');
        }
        if (settingState == 1) {
            selectedContainer.querySelector(".keyRight").innerHTML = e.key;
            selectedContainer.querySelector(".keyRight").setAttribute("data-key", String(e.code));
            selectedContainer.setAttribute("data-selected", "true");
            selectedContainer.classList.add("selected");
            selectedContainer.querySelector(".keyLeft").classList.add('focused');
            selectedContainer.querySelector(".keyRight").classList.remove('focused');
        }
        if (settingState >= 1)
            settingState = 0;
        else
            settingState += 1;
    }
    if (e.key === "Escape") { // esc
        return2StartMenu();
    }
});
document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
        return2StartMenu();
    }
});

function return2StartMenu(){
    document.getElementById("fullscreen-container").style.display = "none";
        document.getElementById("Startmenu").style.display = "block";
        if (achtung != undefined)
            achtung === null || achtung === void 0 ? void 0 : achtung.destroy();
} 
// actions de la souris sur les bonus
for (let bonusElement of document.querySelectorAll("#object-selector img")) {
    bonusElement.addEventListener("click", () => {
        bonusElement.classList.toggle("disabled");
        if (bonusElement.getAttribute("class") == "disabled")
            bonusElement.setAttribute("data-selected", "false");
        else
            bonusElement.setAttribute("data-selected", "true");
    });
}
(_a = document.getElementById("objects")) === null || _a === void 0 ? void 0 : _a.addEventListener("change", () => {
    if (document.getElementById("object-selector").classList.contains("disabled")) {
        document.getElementById("object-selector").classList.remove("disabled");
    }
    else
        document.getElementById("object-selector").classList.add("disabled");
});
let settings = {
    canva: 1,
    speed: 1,
    maniability: 1,
    fatness: 1,
    holeLength: 1,
    bonusEffects: 1,
    bonusFrequency: 1,
    bonusDuration: 1
};
let canvaSlider = new Slider("canvaSlider", document.getElementById("canvaSlider"), 20, 100, 100, (val) => {
    settings.canva = val;
});
let speedSlider = new Slider("speedSlider", document.getElementById("speedSlider"), 1, 50, 10, (val) => {
    settings.speed = val / 10;
});
let maniaSlider = new Slider("maniaSlider", document.getElementById("maniaSlider"), 1, 20, 10, (val) => {
    settings.maniability = val / 10;
});
let fatSlider = new Slider("fatSlider", document.getElementById("fatSlider"), 1, 50, 10, (val) => {
    settings.fatness = val / 10;
});
let trouSlider = new Slider("trouSlider", document.getElementById("trouSlider"), 0, 100, 10, (val) => {
    settings.holeLength = val / 10;
});
let bonusSlider = new Slider("bonusSlider", document.getElementById("bonusSlider"), 1, 20, 10, (val) => {
    settings.bonusEffects = val / 10;
});
let bonusFreqSlider = new Slider("bonusFreqSlider", document.getElementById("bonusFreqSlider"), 1, 60, 10, (val) => {
    settings.bonusFrequency = val / 10;
});
let bonusDurationSlider = new Slider("bonusDurationSlider", document.getElementById("bonusDurationSlider"), 1, 20, 10, (val) => {
    settings.bonusDuration = val / 10;
});

document.getElementById("randomize").addEventListener("click", () => {
    canvaSlider.setValue(getRandomInt(20, 100));
    speedSlider.setValue(getRandomInt(5, 15));
    maniaSlider.setValue(getRandomInt(7, 15));
    fatSlider.setValue(getRandomInt(5, 15));
    trouSlider.setValue(getRandomInt(8, 30));
    bonusSlider.setValue(getRandomInt(5, 15));
    bonusFreqSlider.setValue(getRandomInt(7, 40));
    bonusDurationSlider.setValue(getRandomInt(5, 15));
    for (let bonusElement of document.querySelectorAll("#object-selector img")) {
        if (randomBool(20)) {
            bonusElement.classList.toggle("disabled");
            if (bonusElement.getAttribute("class") == "disabled")
                bonusElement.setAttribute("data-selected", "false");
            else
                bonusElement.setAttribute("data-selected", "true");
        }
    }
    let areBonusEnabled = document.getElementById("objects").checked;
    if ((randomBool(5) && areBonusEnabled) || (randomBool(80) && !areBonusEnabled))
        document.getElementById("objects").click();
});
document.getElementById("reset").addEventListener("click", () => {
    canvaSlider.setValue(100);
    speedSlider.setValue(10);
    maniaSlider.setValue(10);
    fatSlider.setValue(10);
    trouSlider.setValue(10);
    bonusSlider.setValue(10);
    bonusFreqSlider.setValue(10);
    bonusDurationSlider.setValue(10);
    for (let bonusElement of document.querySelectorAll("#object-selector img")) {
        bonusElement.classList.remove("disabled");
    }
    let areBonusEnabled = document.getElementById("objects").checked;
    if (!areBonusEnabled)
        document.getElementById("objects").click();
});
document.getElementById("Go").addEventListener("click", () => {
    document.querySelectorAll('.keyLeft, .keyRight').forEach(k => k.classList.remove('focused'));
    if (document.querySelectorAll(".selected").length > 1) {
        try {
            document.getElementById("fullscreen-container").requestFullscreen().then(() => {
                achtung = new Achtung(settings, document.getElementById("canvas"));
                selectedContainer = undefined;
            });
        }
        catch (e) {
            alert("Votre navigateur ne supporte pas la fonction requestFullScreen. Mettez le à jour ou Goulag.\n" + e);
        }
    }
    else
        alert("Il faut au moins 2 joueurs...");
});
