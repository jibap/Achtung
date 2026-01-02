var _a;

Math.seedrandom(Math.random().toString(36).substring(7)); // aléatoire procédural
import { Slider } from "./external/slider.js";
import { Achtung } from "./achtung.js";
import { randomBool, getRandomInt } from "./external/tools.js";

/// Selection des personnages et des touches
let achtung;
let settingState = 0;
let selectedContainer;
let editingName = false;


const SETTINGS_CONFIG = {
    canva: { min: 20, max: 100, default: 100 },
    speed: { min: 1, max: 50, default: 10 },
    maniability: { min: 1, max: 20, default: 10 },
    fatness: { min: 1, max: 50, default: 10 },
    holeLength: { min: 0, max: 100, default: 10 },
    bonusEffects: { min: 1, max: 20, default: 10 },
    bonusFrequency: { min: 1, max: 60, default: 10 },
    bonusDuration: { min: 1, max: 20, default: 10 }
};

const sliders = {};
const settings = {};

for (const [key, cfg] of Object.entries(SETTINGS_CONFIG)) {
    sliders[key] = new Slider(
        key + "Slider",
        document.getElementById(key + "Slider"),
        cfg.min,
        cfg.max,
        cfg.default,
        (val) => {
            settings[key] = Number(val) / 10;
        }
    );
}

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
    // RESET PlayerLine 
    playerLine.addEventListener("contextmenu", e => {
        e.preventDefault();
        playerLine.setAttribute("data-selected", "false");
        playerLine.classList.remove("selected");
        const kLeft = selectedContainer.querySelector(".keyLeft");
        const kRight = selectedContainer.querySelector(".keyRight");
        kRight.innerHTML = "Droite";
        kLeft.innerHTML = "Gauche";
        kRight.classList.remove("focused", "exists");
        kLeft.classList.remove("focused", "exists");
        kLeft.removeAttribute("data-key");
        kRight.removeAttribute("data-key");
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
        let abort = false;
        // Vérifie si la touche est déjà prise
        document.querySelectorAll('.keyLeft, .keyRight').forEach(el => {
            const key = el.dataset.key;
            el.classList.remove("exists");
            if (key && !el.classList.contains('focused') && key === e.code) {
                el.classList.toggle("exists");
                abort = true;
            }
        });
        
        if (abort) return;

        const kLeft = selectedContainer.querySelector(".keyLeft");
        const kRight = selectedContainer.querySelector(".keyRight");
        if (settingState == 0) {
            kLeft.innerHTML = e.key;
            kLeft.setAttribute("data-key", String(e.code));
            kLeft.classList.remove('focused');
            kRight.classList.add('focused');
        }
        if (settingState == 1) {
            kRight.innerHTML = e.key;
            kRight.setAttribute("data-key", String(e.code));
            selectedContainer.setAttribute("data-selected", "true");
            selectedContainer.classList.add("selected");
            kLeft.classList.add('focused');
            kRight.classList.remove('focused');
        }
        settingState = (settingState >= 1) ? 0 : settingState + 1;
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

// Random settings
document.getElementById("randomize").addEventListener("click", () => {
    for (const [key, cfg] of Object.entries(SETTINGS_CONFIG)) {
        const randomValue = getRandomInt(cfg.min, cfg.max);
        sliders[key].setValue(randomValue);
    }
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

// RESET Bonus
document.getElementById("reset").addEventListener("click", () => {
    for (const [key, cfg] of Object.entries(SETTINGS_CONFIG)) {
        sliders[key].setValue(cfg.default);
    }
    for (let bonusElement of document.querySelectorAll("#object-selector img")) {
        bonusElement.classList.remove("disabled");
    }
    let areBonusEnabled = document.getElementById("objects").checked;
    if (!areBonusEnabled)
        document.getElementById("objects").click();
});

document.querySelectorAll(".resetSlider").forEach(button => {
    button.addEventListener("click", (e) => {
        const container = e.target.parentElement;
        const sliderId = container.querySelector(".slider").id;
        const key = sliderId.replace("Slider", "");

        const cfg = SETTINGS_CONFIG[key];
        if (!cfg) return;

        sliders[key].setValue(cfg.default);
    });
});

const errorMsg = document.getElementById("error");

// Achtung !
document.getElementById("GoBtn").addEventListener("click", (e) => {
    e.stopPropagation(); // empêche le clic de remonter au document et de cacher l'erreur

    document.querySelectorAll('.keyLeft, .keyRight').forEach(k => k.classList.remove('focused'));

    if (document.querySelectorAll(".selected").length > 1) {
        try {
            document.getElementById("fullscreen-container").requestFullscreen().then(() => {
                achtung = new Achtung(settings, document.getElementById("canvas"));
                selectedContainer = undefined;
            });
        } catch (e) {
            alert("Votre navigateur ne supporte pas la fonction requestFullScreen. Mettez le à jour ou Goulag.\n" + e);
        }
    } else {
        errorMsg.style.opacity = 1;

        // on masque l'erreur si l'utilisateur clique n'importe où après
        const hideError = (evt) => {
            if (!evt.target.closest("#GoBtn")) {
                errorMsg.style.opacity = 0;
                document.removeEventListener("click", hideError);
            }
        };
        document.addEventListener("click", hideError);
    }
});


