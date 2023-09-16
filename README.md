# 1v1 Team Testing Tool

A form-based single-page web application intended for testing use by players of [Smogon's 1v1 format](https://www.smogon.com/dex/sv/formats/1v1/). Supports all generations.

## Technologies Used

```sh
Frontend: JavaScript, HTML, CSS
Backend: NodeJS (with Express)
Libraries: regex, esm, fs
```

Usage of [pkmn/ps libraries](https://github.com/pkmn/ps/blob/master/img) is also included in this project.  

## General Navigation

### Landing Page

![image](https://github.com/MubsPokesart/1v1-Team-Testing-Tool/assets/51163599/4955b287-c84f-49fb-96e3-05b65dde2bea)
> When you land on the page, you input your own page and select the generation of your choice. Along with that, you can choose your pool of selected replays (custom or provided), and provide certain usernames to scout if desired.

### Layout Menu

![0](https://github.com/MubsPokesart/1v1-Team-Testing-Tool/assets/51163599/6b50142d-163e-487f-afcc-f5908111228d)
> After you put in your selections, you have a list of replays to filter by and submit matchup data. The HTML from Pokemon Showdown is actually replicated to provide the in-game preview experience.
> You select each checkbox based on whether the matchup goes in your favor (or shift-click for very ambiguous matchups, which will give you an orange checkbox) and submit by entry. Previous inputs are saved for ease of use. Form submits by a button click or completion of filtered submissions

### Results Menu
![0](https://github.com/MubsPokesart/1v1-Team-Testing-Tool/assets/51163599/db5fe12f-73c2-487a-bcf2-19b55a83af53)
> The results of your entry submissions will be shown here.
