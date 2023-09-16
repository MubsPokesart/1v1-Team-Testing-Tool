import {Pokemon, getName} from "./mon-modules.js";

class resultHandler {
    constructor (paste, preview){
        this.paste = paste;
        this.preview = preview;
        this.monData = [];
        this.teamData = [];
        this.monDataImport = 'Pokemon Matchups:';
        this.teamDataImport = 'Team Matchups:';
    }

    recordMondata(mon, points, pointCase){
        let monComposite = new Pokemon(mon, true);
        this.monData.push({
            details: monComposite,
            score: points,
            case: pointCase,
        })
    };

    recordTeamdata(team, points, pointCase){
        let teamComposite = [];        
        team.forEach(mon => {        
            teamComposite.push(new Pokemon(mon, true))
        });

        this.teamData.push({
            team: teamComposite,
            score: points,
            case: pointCase,
        })
    };

    exportTeamData(){
        const fullTeamsHTML = document.createElement('div');
        const markersText = [
            "Horrible Matchup", 
            "Bad Matchup", 
            "Fine Matchup", 
            "Great Matchup", 
            "Elite Matchup"
        ];

        const markersNum = [
            0.5,
            1,
            4/3,
            5/3,
            1.999999
        ];

        let countMarker = 0;
        this.teamData.sort((a, b) => a.score > b.score ? 1: -1);

        this.teamData.forEach(team =>{
            let checkMarker = countMarker;
            while (team.score > markersNum[countMarker] && countMarker < markersNum.length - 1){
                countMarker++;
            };

            if (checkMarker < countMarker || (team == this.teamData[0] && team.score < markersNum[0])) {
                const markerHeader = document.createElement('h3');
                markerHeader.textContent = markersText[countMarker];
                this.teamDataImport += `\n\t${markersText[countMarker]}:`;
                fullTeamsHTML.appendChild(markerHeader);
            };

            this.teamDataImport += `\n\t\t${(team.team.map(mon => {
                return getName(mon.name);
            })).join(' / ')}`;
            fullTeamsHTML.append(this.createTeamElement(team.team));

        });

        return fullTeamsHTML;
    }

    createTeamElement(team){
        const teamHTML = document.createElement('span');
        team.forEach(mon => {    
            let monImg = mon.getIcon();  
            teamHTML.appendChild(monImg);
        });

        const pTag = document.createElement('p');
        pTag.appendChild(teamHTML);

        return pTag;
    }

    exportMonData() {
        const fullMonsHTML = document.createElement('div');
        const markersText = [
            "Not Covered", 
            "Covered", 
            "Well Covered", 
            "Extremely Well Covered"
        ];

        const markersNum = [
            0.499999,
            1,
            2,
            2.5
        ];

        let countMarker = 0;
        this.monData.sort((a, b) => a.score > b.score ? 1: -1);
        
        let monCatagory = [];

        this.monData.forEach(mon =>{
            let checkMarker = countMarker;

            while (mon.score > markersNum[countMarker] && countMarker < markersNum.length - 1){
                countMarker++;
            };
            
            if (checkMarker < countMarker || (mon == this.monData[0] && mon.score < markersNum[0])) {
                const markerHeader = document.createElement('h3');
                markerHeader.textContent = markersText[countMarker];
                if (monCatagory.length > 0) this.monDataImport += `\n\t\t${monCatagory.join(', ')}`;
                monCatagory = [];
                this.monDataImport += `\n\t${markersText[countMarker]}:`;
                fullMonsHTML.appendChild(markerHeader);
            };
            
            monCatagory.push(getName(mon.details.name));
            fullMonsHTML.append(this.createMonElement(mon.details));

        });

        this.monDataImport += `\n\t\t${monCatagory.join(', ')}`;

        return fullMonsHTML;
    }

    createMonElement(mon){
        return mon.getIcon();
    }
}

const results = JSON.parse(localStorage.getItem('userInput'));

const resultsPaste =  results.paste;
const resultsPreview =  results.preview;
const monData = results.monData.value;
const teamData = results.teamData.value;

console.log(resultsPreview, monData)

const resultsHandler = new resultHandler(resultsPaste, resultsPreview);

monData.forEach(mon => {
    const name = mon[0]
    let score = mon[1];
    let scoreCase = '';
    switch (score) {
        case score <= 0.5:
            scoreCase = "Not Covered";
        case score <= 1:
            scoreCase = "Covered";
        case score <= 2:
            scoreCase = "Well Covered";
        case score <= 2.5:
            scoreCase = "Extremely Well Covered";
    }

    resultsHandler.recordMondata(name, score, scoreCase);
});

teamData.forEach(monTeam => {
    const team = monTeam[0]
    let score = monTeam[1];
    let no30 = true;  

    for (let mon of team){
        if (!no30){
            score -= 1;
            break;
        }
        
        for (let line of monData){
            if ((line[0] == mon) && (line[1] == 0)) no30 = false;
            break;
        }

    };

    let scoreCase = '';

    switch (score) {
        case score > 2:
            scoreCase = "Elite Matchup";
        case score <= 2:
            scoreCase = "Great Matchup";
        case score < 5 / 3:
            scoreCase = "Fine Matchup";
        case score < 4 / 3:
            scoreCase = "Bad Matchup";
        case score < 1:
            scoreCase = "Horrible Matchup";
    }

    resultsHandler.recordTeamdata(team, score, scoreCase);
    
});

document.getElementById('teams').appendChild(resultsHandler.exportTeamData());
document.getElementById('mons').appendChild(resultsHandler.exportMonData());
document.getElementById('importable').innerHTML = `${resultsHandler.teamDataImport}\n${resultsHandler.monDataImport}`;