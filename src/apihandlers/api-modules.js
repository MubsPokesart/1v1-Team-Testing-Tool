import fs from "fs";

export function previewPaste(paste) {
  if (paste.length == 0) return;

  const previewRegex = new RegExp(/(.+?) @/);
  const splitPaste = paste.split('\n');
  let refinedMatches = [];

  for (let line of splitPaste) {
    const lineMatch = previewRegex.exec(line);
    if (lineMatch) {
      line = line.replace(/( \(F\)| \(M\))/g, "");
      line = nameFix(line)
      refinedMatches.push(line)
    }
  }
  
  return refinedMatches;
};

export async function generatePreview(gen, references, customInput, names) {
  // Replay Generation
  const jsonData = fs.readFileSync('./replays.json');
  const data = JSON.parse(jsonData);
  let replays = [];

  references.forEach((item) => {
    let replayReference = data[item];
    if (replayReference){
      replayReference.forEach((replay) => {
        if (replay.includes(`gen${gen}1v1`)) {
          replays.push(`${replay}.json`.replace(" ", ""));
        }
      });
   }
  });

  let customReplays = customInput.split('\n');
  customReplays.forEach((element) => {
    if (element.includes(`gen${gen}1v1-`)) {
      replays.push(`${element}.json`.replace(" ", ""));
    }
  });

  const replayData = await scrapeWebsites(replays);

  const nameData = (html, playerIndex) => {
    const pattern = `p${playerIndex}":"(.+?)"`;
    const match = new RegExp(pattern).exec(html);
    if (match) {
      return match[1].replace(/\\[u][a-zA-Z0-9]{4}/g, "").replace(/[^a-zA-Z0-9]+/g, "").toLowerCase();
    } else {
      return null;
    }
  };

  const previewData = (html, playerIndex) => {
    const pattern = new RegExp(`poke\\|p${playerIndex}\\|(.+?)\\|`, "g");
    let matches = []
    let match = null;
    do {
      match = pattern.exec(html);
      if(match) {
        let textMatch = match[0].replaceAll("|", "").replace(/pokep./g, "")
        matches.push(nameFix(textMatch));
      }
    } while (match);
    return matches
  };

  let teamData = [], nameCheck = true;
  const listNames = nameList(names);
  if (listNames[0] == '') {
    nameCheck = false;
  }

  // ListData
  replayData.forEach((element) => {
    for (let i = 1; i <= 2; i++) {
      const name = nameData(element, i);
      const preview = previewData(element, i);
      if (!preview || preview.length != 3) {
        continue;
      };
      if (nameCheck && !listNames.includes(name)) {
        continue;
      };

      teamData.push(preview);
    }
  });
  return teamData;
};

async function scrapeWebsites(urls) {
    // Create an array to store the scraped data.

    const scrapesPromises = urls.map(url => scrapeWebsite(url));
    return await Promise.all(scrapesPromises);
  
  }

async function scrapeWebsite(url) {
  // Fetch the website.
  const fetchedData = fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin"
  }).then(res => {return res.text()})

  return fetchedData;
}

function nameFix(line){
  line = line.replace(/ @(.+)/g, "")
  line = line.replace(/, ./, "")
  line = line.replace('-*', '')
  line = line.replace(/(.+?\(|\))/g, "");
  return line.replace(" ", "-").toLowerCase()
}

function nameList(names){
  names = names.toLowerCase().replace(' ', '')
  if (names.includes(',')){
      return names.split(', ');
  };
  return [names];
}