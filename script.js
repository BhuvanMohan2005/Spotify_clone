/*console.log("Lets write Some Script");

async function main() {

    let a= await fetch("http://127.0.0.1:5500/Spotify_clone/songs/");
    let response=await a.text();
    console.log(response);
    let div =document.createElement("div");
    div.innerHTML=response;
    let tds=div.getElementsByTagName('li');
    console.log(tds)
}
main()*/


/*console.log("Fetching songs...");

async function main() {
  const res = await fetch("http://127.0.0.1:5500/Spotify_clone/songs/");
  const html = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Get all <a> elements that link to .mp3 files
  const links = [...doc.querySelectorAll("a")];
  const songs = links
    .map(link => link.getAttribute("href"))
    .filter(href => href && href.endsWith(".mp3"));

  // Create table
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.marginTop = "20px";

  // Add headers
  const headerRow = table.insertRow();
  const headerCell = document.createElement("th");
  headerCell.innerText = "🎵 Song Name";
  headerCell.style.padding = "10px";
  headerCell.style.border = "1px solid #ccc";
  headerCell.style.backgroundColor = "#1DB954";
  headerCell.style.color = "white";
  headerRow.appendChild(headerCell);

  // Add each song
  songs.forEach(song => {
    const row = table.insertRow();
    const cell = row.insertCell();
    cell.innerHTML = `<a href="./songs/${song}" target="_blank">${song}</a>`;
    cell.style.padding = "10px";
    cell.style.border = "1px solid #ccc";
  });

  // Add to body (or any container)
  document.body.appendChild(table);
}

main();*/



/*

CHATGPT

onsole.log("Scraping songs from HTML...");

async function main() {
  const res = await fetch("http://127.0.0.1:5500/Spotify_clone/songs/");
  const html = await res.text();

  // Create a temporary DOM to parse the HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Find all <a> tags that link to .mp3 files
  const links = [...doc.querySelectorAll("a")];
  const mp3Links = links
    .map(a => a.getAttribute("href"))
    .filter(href => href && href.endsWith(".mp3"));

  console.log("Found MP3s:", mp3Links);
}

main();
*/



let currentSong = new Audio();
let songs;
let currentFolder;

async function getSongs(folder) {
    const res = await fetch(`http://127.0.0.1:5500/Spotify_clone/${folder}/`);
    currentFolder = folder
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    // Use .href to get full URLs
    const links = [...doc.querySelectorAll("a")];
    const mp3Files = links
        .map(link => link.href)
        .filter(href => href.endsWith(".mp3"))
        .map(href => href.split(`/${currentFolder}/`)[1]);

    songs = mp3Files
    //for loading the playlists we use these functions here but not in main
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML += `<li> <img class="invert"src="music.svg" alt="music">
                            <div class="info">
                                <div>${song.replaceAll('%20', ' ')}</div>
                                <div>Thaman</div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img class="invert" src="playNow.svg" alt="Logo" width="25">
                            </div> </li>`;

    }

    //attach an event listener to get each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            //console.log(e.querySelector(".info>div").innerHTML)
            playMusic(e.querySelector(".info>div").innerHTML)
            play.src = "pause.svg";
        })
    })
}


const playMusic = (track, pause = false) => {
    //let currentSong= new Audio("songs/"+track);
    currentSong.src = `${currentFolder}/` + track;
    if (!pause) {
        currentSong.play()
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00     /     00:00";
}


function secondsToMinutesSeconds(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    let minsStr = mins < 10 ? '0' + mins : '' + mins;
    let secsStr = secs < 10 ? '0' + secs : '' + secs;

    return `${minsStr}:${secsStr}`;
}

async function displayAlbums() {
    const res = await fetch(`http://127.0.0.1:5500/Spotify_clone/songs/`);
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    console.log(parser, 'hi')
}
//delete this below function as it is given two times
async function displayAlbums() {

    let a = await fetch("http://127.0.0.1:5500/Spotify_clone/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer=document.querySelector('.cardContainer');
    Array.from(anchors).forEach(async (e) => {
        if (e.href.includes(`/songs`)) {
            console.log(e.href.split("/").slice(-1)[0]);
            let folder = e.href.split("/").slice(-1)[0];
            let a = await fetch(`http://127.0.0.1:5500/Spotify_clone/songs/${folder}/info.json`);
            let response = await a.json();
            console.log(response);
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}"class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="45" height="45"
                                fill="none">
                                <circle cx="12" cy="12" r="10"  fill="var(--play-fill)" />
                                <path
                                    d="M15.9453 12.3948C15.7686 13.0215 14.9333 13.4644 13.2629 14.3502C11.648 15.2064 10.8406 15.6346 10.1899 15.4625C9.9209 15.3913 9.6758 15.2562 9.47812 15.0701C9 14.6198 9 13.7465 9 12C9 10.2535 9 9.38018 9.47812 8.92995C9.6758 8.74381 9.9209 8.60868 10.1899 8.53753C10.8406 8.36544 11.648 8.79357 13.2629 9.64983C14.9333 10.5356 15.7686 10.9785 15.9453 11.6052C16.0182 11.8639 16.0182 12.1361 15.9453 12.3948Z"
                                    fill="white" />
                            </svg>
                        </div>

                        <img aria-hidden="false" draggable="false" loading="lazy"
                            src="/Spotify_clone/songs/${folder}/cover.jpeg" alt=""
                            class="LBM25IAoFtd0wh7k3EGM Z3N2sU3PRuY4NgvdEz55 DlkUu3oBOxXLc2LtOd3N PgTMmU2Gn7AESFMYhw4i">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>`;
        }

    });
       /* Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener('click', async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);

        })
    })*/

}
async function displayAlbums() {
    let a = await fetch("http://127.0.0.1:5500/Spotify_clone/songs/");
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector('.cardContainer');

    for (const e of Array.from(anchors)) {
        if (e.href.includes(`/songs`) && !e.href.endsWith("/songs/")) {
            let folder = e.href.split("/").slice(-1)[0];
            try {
                let a = await fetch(`http://127.0.0.1:5500/Spotify_clone/songs/${folder}/info.json`);
                let response = await a.json();

                cardContainer.innerHTML += `
                    <div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="45" height="45" fill="none">
                                <circle cx="12" cy="12" r="10" fill="var(--play-fill)" />
                                <path d="M15.9453 12.3948C15.7686 13.0215 ... Z" fill="white" />
                            </svg>
                        </div>
                        <img src="/Spotify_clone/songs/${folder}/cover.jpeg" alt="${response.title}">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>
                `;
            } catch (err) {
                console.warn(`Could not load info.json for ${folder}`, err);
            }
        }
    }
}


function attachCardListeners() {
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener('click', async item => {
            const folder = item.currentTarget.dataset.folder;
            await getSongs(`songs/${folder}`);
            playMusic(songs[0], true);
        });
    });
}


async function main() {
    //Get all the songs
    await getSongs("songs/NCS");
    playMusic(songs[0], true)
    await displayAlbums();
    attachCardListeners(); // Call this afterward

    /*showing all the songs in the playlist
    let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs){
        songUL.innerHTML+=`<li> <img class="invert"src="music.svg" alt="music">
                            <div class="info">
                                <div>${song.replaceAll('%20',' ')}</div>
                                <div>Thaman</div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img class="invert" src="playNow.svg" alt="Logo" width="25">
                            </div> </li>`;

    }
       
    //attach an event listener to get each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            //console.log(e.querySelector(".info>div").innerHTML)
            playMusic(e.querySelector(".info>div").innerHTML)
            play.src="pause.svg";
        })
    })


    */


    //till this you if you play the songs those will be played continuously without pausing

    //attach an event listener to play,next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "play.svg";

        }
    })


    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.duration, currentSong.currentTime)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}     / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + '%';
        currentSong.currentTime = currentSong.duration * percent / 100;
    })

    //add a event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", e => {
        document.querySelector(".left").style.left = '0';
    })
    document.querySelector(".close").addEventListener("click", e => {
        document.querySelector(".left").style.left = '-100%';
    })


    //add an event listener for previous
    previous.addEventListener("click", e => {
        currentSong.pause()
        console.log("Prev clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index - 1 >= 0) {
            playMusic(songs[index - 1])
            play.src = "pause.svg";

        }
    })
    //add an event listener for next
    next.addEventListener("click", e => {
        currentSong.pause();
        console.log("Next clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index + 1 < (songs.length)) {
            playMusic(songs[index + 1])
            play.src = "pause.svg";
        }

    })

    //Add an event for volume 
    document.querySelector('.range').getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting Volume to ", e.target.value)
        currentSong.volume = parseInt(e.target.value) / 100
    })





    //add event listener for muting the volume
    document.querySelector('.volume>img').addEventListener('click',e=>{
        if (e.target.src.includes('volume.svg')){
            e.target.src=e.target.src.replace('volume.svg','mute.svg');
            currentSong.volume=0;
            document.querySelector('.range').getElementsByTagName("input")[0].value=0;
        }
        else if (e.target.src.includes('mute.svg')){
            e.target.src=e.target.src.replace('mute.svg', 'volume.svg');
            currentSong.volume=0.1;
            document.querySelector('.range').getElementsByTagName("input")[0].value=20;
        }

    })
    
}



main()


