import {Pokemon, getName, MonHandler, switchScreens} from './mon-modules.js';

function generateMonPreview(preview, back=false){
    const monPreview = [];
    preview.forEach(mon => {
        monPreview.push(new Pokemon(mon, back));
    });

    return monPreview;
};

function updateOpponentData(preview){
    const oppMonPreview = generateMonPreview(preview, true);
    const dupeMatchups = monRecords.checkDuplicateMatchups(preview);
    let oppSpritePos = 330;
    let monMarker = 0;

    teamPreviewOpp.innerHTML = '';
    teamPreviewOppIcons.innerHTML = '';

    oppMonPreview.forEach(mon => {
        teamPreviewOpp.appendChild(mon.getSprite(60, oppSpritePos));
        teamPreviewOppIcons.appendChild(mon.getIcon());
        teamPreviewOppNames[monMarker].innerHTML = getName(mon.name);
        oppSpritePos += 60;
        monMarker += 1;
    });

    const checkBoxes = document.querySelectorAll("input[type='checkbox']");
    dupeMatchups.forEach(dupe => {
        const index = dupe[0], shiftStatus = dupe[1];
        const checkbox = checkBoxes.item(index);
        console.log(dupe);

        checkbox.checked = true;
        if (shiftStatus == "shifted"){
            checkbox.value = "shifted";
            checkbox.style = `accent-color: orange`;
        };
    });

    return;
};

function submitEntry(e){
    e.preventDefault();

    if (previewmarker < opponentPreviews.length){
        const currentOppPreview = opponentPreviews[previewmarker];
        const currentOppScores = [];
        const teamBoxes = document.querySelectorAll("input[type='checkbox']");

        for (let i = 0; i < teamBoxes.length; i++){
            const boxStatus = teamBoxes[i].checked;
            if (boxStatus){
                const selectStatus = teamBoxes[i].value;
                currentOppScores.push({
                    mon: teamPreview[Math.floor(i/teamPreview.length)],
                    status: [i, selectStatus]
                }); 
            };
            teamBoxes[i].checked = false;
            teamBoxes[i].value = 'unshifted';
            teamBoxes[i].style = ``;

        }

        monRecords.recordData(currentOppPreview, currentOppScores);
    }
    previewmarker += 1;
    const oppPreview = opponentPreviews[previewmarker] ?? null;
    
    if (oppPreview){
        updateOpponentData(oppPreview);
        
    } else submitForm(e);

}

async function submitForm(e){
    e.preventDefault();

    localStorage.setItem("userInput", monRecords.getData());

    await switchScreens('src/templates/results.html');
}

const formResponse = JSON.parse(localStorage.getItem("formResponse"));

const teamPaste = formResponse.paste;
const teamPreview = formResponse.preview; 
const opponentPreviews = formResponse.opponentPreviews;

const monRecords = new MonHandler(teamPaste, teamPreview);

const teamPreviewMons = document.getElementById('yourTeam');
const teamPreviewIcons = document.getElementById('yourIcons');
const teamPreviewNames = document.querySelectorAll("td#yourNames");

const teamPreviewOpp = document.getElementById('opponentTeam');
const teamPreviewOppIcons = document.getElementById('opponentIcons');
const teamPreviewOppNames = document.querySelectorAll('td#opponentMonGrid');

let previewmarker = 0;

const yourPreview = generateMonPreview(teamPreview, false);
let curSpritePos = 100;
let monMarker = 0;
yourPreview.forEach(mon => {
    teamPreviewMons.appendChild(mon.getSprite(200, curSpritePos));
    teamPreviewIcons.appendChild(mon.getIcon());
    teamPreviewNames[monMarker].innerHTML = getName(mon.name);
    curSpritePos += 60;
    monMarker += 1;
});

updateOpponentData(opponentPreviews[previewmarker]);

const checkboxes = document.querySelectorAll("input[type='checkbox']");
checkboxes.forEach(checkbox => {
    checkbox.addEventListener("click", (event) => {
        if (event.shiftKey && !checkbox.checked && checkbox.value == 'shifted') {
            checkbox.value = 'unshifted';
            checkbox.style = ``;
        }

        if (event.shiftKey && checkbox.checked) {
            checkbox.value = 'shifted';
            checkbox.style = `accent-color: orange`;
        }   
    });
});
document.getElementById('submitEntry').addEventListener("click", submitEntry);
document.getElementById('submitForm').addEventListener("click", submitForm);

/*
let isShiftKeyDown = false;

window.addEventListener('keydown', (event: KeyboardEvent) => {
    isShiftKeyDown = event.shiftKey;
});

window.addEventListener('keyup', (event: KeyboardEvent) => {
    isShiftKeyDown = event.shiftKey;
});

document.querySelectorAll('input[type="checkbox"]').forEach((checkbox: HTMLInputElement) => {
    checkbox.addEventListener('change', (event: Event) => {
        if (isShiftKeyDown && !checkbox.checked) {
            // do stuff here
        }
    });
});
*/