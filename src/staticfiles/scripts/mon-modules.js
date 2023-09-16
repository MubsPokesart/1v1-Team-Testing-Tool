import { Sprites, Icons } from 'https://esm.sh/@pkmn/img';

export class Pokemon {
    constructor(name, back) {
        this.name = name;
        this.gen = 5;
        this.back = back;
    };

    getSprite(top, left){
        let side = 'p1';
        if (this.back) side = 'p2';
        const {url, w, h, pixelated} = Sprites.getPokemon(this.name, {gen: this.gen, side: side});

        const sprite = document.createElement('img');
        sprite.src = url;
        sprite.width = w;
        sprite.height = h;
        
        if (pixelated) sprite.style.imageRendering = 'pixelated';
        sprite.style = `position:absolute;top:${top}px;left:${left}px`;

        return sprite;
    };

    getIcon(){
        let side = 'p1';
        if (this.back) side = 'p2';
        
        const icon = document.createElement('span');
        icon.classList.add('picon');
        icon.style = Icons.getPokemon(this.name, {side: side}).style;

        return icon;
    };
}

export class MonHandler {
    constructor(paste, preview) {
        this.paste = paste;
        this.preview = preview;
        this.monData = new Map();
        this.monStatuses = new Map();
        this.teamData = new Map();
    };

    addstatus(mon, status){
        let statuses = []
        if (this.monStatuses.has(mon)){
            statuses = this.monStatuses.get(mon);
        }

        status[0] = Math.floor(status[0] / 3);
        statuses.push(status);
        this.monStatuses.set(mon, statuses);
    }

    recordData(preview, teamMatchups){
        let teamScore = 0;
        for (let i = 0; i < preview.length; i++){
            let score = 1;
            teamMatchups.forEach(matchup => {
                this.addstatus(preview[matchup.status[0] % 3], matchup.status)
                if (matchup.status[1] == 'shifted') score = 0.5;
            });

            this.monData.set(preview[i], score);
            teamScore += score;
        };

        this.teamData.set(preview, teamScore / preview.length);
    };

    checkDuplicateMatchups(preview){
        const checkStatuses = [];
        preview.forEach(mon => {
            if (this.monStatuses.has(mon)){
                this.monStatuses.get(mon).forEach(status => {
                    let modifiedStatus = [3 * status[0] + preview.indexOf(mon), status[0]] 
                    checkStatuses.push(modifiedStatus);
                });
            }; 
        });

        return checkStatuses;
    };

    getData() {
        return JSON.stringify({
            paste: this.paste,
            preview: this.preview,
            monData: this.monData,
            teamData: this.teamData,
        }, replacer);
    }

}

export async function switchScreens(path){
    const fetchedHTML = await fetch(path)
      .then(res => {return res.text()})

    const htmlScriptTags = fetchedHTML.match(/<script[^>]*>(?:.*?)<\/script>/gi);
    const nextDocument = fetchedHTML.replaceAll(/<script[^>]*>(?:.*?)<\/script>/gi, '');

    document.documentElement.innerHTML = nextDocument;

    htmlScriptTags.forEach(sc => {
      const scriptTag = document.createElement('script');
      const scriptAttributes = sc.match(/(src|type|async|defer)="([^"]+)"/g);
      for (const attribute of scriptAttributes) {
          const sa = attribute.replaceAll(`"`, "").split("=")
          scriptTag.setAttribute(sa[0], sa[1]);
      }
      document.body.appendChild(scriptTag);
    });
}

export function getName(name) {
    let newMonName = name.charAt(0).toUpperCase();
    if (newMonName.includes('-')){
        for (let i = 1; i < name.length; i++) {
            // If the current character is a hyphen, add a space and uppercase the next character.
            if (nome[i] === "-") {
            newMonName += " ";
            newMonName += name[i + 1].toUpperCase();
            i += 1;
            } else {
            // Otherwise, just add the current character to the new string.
            newMonName += monName[i];
            }
        }
    } else newMonName += name.slice(1);

    return newMonName;
};

function replacer(key, value) {
    if(value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
      };
    } else {
      return value;
    }
}
