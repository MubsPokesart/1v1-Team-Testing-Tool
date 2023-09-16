import {Pokemon, switchScreens} from './mon-modules.js';

// This code will make the megathreadReplaysPaste hidden element visible when the megathreadReplays checkbox is checked.
let megathreadReplaysCheckbox = document.getElementById("megathreadReplays");
let megathreadReplaysPaste = document.getElementById("megathreadReplaysPaste");

megathreadReplaysCheckbox.addEventListener("change", function() {
if (megathreadReplaysCheckbox.checked) {
    megathreadReplaysPaste.style.display = "block";
} else {
    megathreadReplaysPaste.style.display = "none";
}
});

// This code will make the specificReplaysBox hidden element visible when the customReplays checkbox is checked.
let customReplaysCheckbox = document.getElementById("customReplays");
let specificReplaysBox = document.getElementById("specificReplaysBox");

customReplaysCheckbox.addEventListener("change", function() {
if (customReplaysCheckbox.checked) {
    specificReplaysBox.style.display = "block";
} else {
    specificReplaysBox.style.display = "none";
}
});

const form = document.getElementById("monForm");
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const monBody = (monData) => {
        const monObject = {};
        for (const innerList of monData) {
          if (innerList[0] === "megathreadReplays") {
            if (!monObject.megathreadReplays) {
              monObject.megathreadReplays = [];
            }
            monObject.megathreadReplays.push(innerList[1]);
          } else {
            monObject[innerList[0]] = innerList[1];
          }
        }
        return monObject;
      };
      
    const formBody = monBody(formData);
    const url = "http://127.0.0.1:8080/submit"

    const formResponse = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }, 
        body: JSON.stringify(formBody),
    })
    .then(res => {return res.json()})

    localStorage.setItem("formResponse", JSON.stringify(formResponse));

    await switchScreens('src/templates/userinput.html');
    
});
