
let currentSong = new Audio();
let songs;
let currentFolder;
//This will be helpful when the website alllows us to show the intermediate folders separately which is not possible in github so i have used the other version of this function below this

async function getSongs(folder) {
    const res = await fetch(`/${folder}/`);
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
        songUL.innerHTML += `<li> <img class="invert" src="images/music.svg" alt="music">
                            <div class="info">
                                <div>${song.replaceAll('%20', ' ')}</div>
                                <div>Thaman</div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img class="invert" src="images/playNow.svg" alt="Logo" width="25">
                            </div> </li>`;

    }

    //attach an event listener to get each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            //console.log(e.querySelector(".info>div").innerHTML)
            playMusic(e.querySelector(".info>div").innerHTML)
            play.src = "images/pause.svg";
        })
    })

    return songs
}

//For this I have updated the info.json file which now includes array of "songs". This actually increases manual work whenever we add anu other songs in the playlist that req updations in the info.json file

async function getSongs(folder) {
    currentFolder = folder;
    try {
        const res = await fetch(`${folder}/info.json`);
        const data = await res.json();
        songs = data.songs;

        let songUL = document.querySelector(".songList ul");
        songUL.innerHTML = "";
        for (const song of songs) {
            songUL.innerHTML += `
                <li>
                    <img class="invert" src="images/music.svg" alt="music">
                    <div class="info">
                        <div>${song}</div>
                        <div>${data.title}</div>
                    </div>
                    <div class="playNow">
                        <span>Play Now</span>
                        <img class="invert" src="images/playNow.svg" alt="Logo" width="25">
                    </div>
                </li>`;
        }
        //attach an event listener to get each song
        Array.from(songUL.getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", () => {
                playMusic(e.querySelector(".info>div").innerHTML);
                play.src = "images/pause.svg";
            });
        });

        return songs
    } catch (err) {
        console.error("Error loading songs:", err);
    }
}

const playMusic = (track, pause = false) => {
    //let currentSong= new Audio("songs/"+track);
    currentSong.src = `${currentFolder}/` + track;
    if (!pause) {
        currentSong.play()
        play.src = "images/pause.svg";
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


/* 
   displayAlbums() now uses playlists.json instead of fetching folders.
   playlists.json (in project root) must look like this:
   {
     "playlists": ["NCS", "Lofi", "Pop"]
   }
*/

async function displayAlbums() {
    try {
        const res = await fetch("playlists.json");
        const data = await res.json();

        let cardContainer = document.querySelector(".cardContainer");
        cardContainer.innerHTML = "";

        for (const folder of data.playlists) {
            try {
                const infoRes = await fetch(`songs_folder/${folder}/info.json`);
                const info = await infoRes.json();

                cardContainer.innerHTML += `
                    <div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="45" height="45" fill="none">
                                <circle cx="12" cy="12" r="10" />
                                <path
                                    d="M15.9453 12.3948C15.7686 13.0215 14.9333 13.4644 13.2629 14.3502C11.648 15.2064 10.8406 15.6346 10.1899 15.4625C9.9209 15.3913 9.6758 15.2562 9.47812 15.0701C9 14.6198 9 13.7465 9 12C9 10.2535 9 9.38018 9.47812 8.92995C9.6758 8.74381 9.9209 8.60868 10.1899 8.53753C10.8406 8.36544 11.648 8.79357 13.2629 9.64983C14.9333 10.5356 15.7686 10.9785 15.9453 11.6052C16.0182 11.8639 16.0182 12.1361 15.9453 12.3948Z"
                                    fill="rgba(224, 221, 221, 1)" />
                            </svg>
                        </div>
                        <img src="songs_folder/${folder}/cover.jpeg" alt="${info.title}">
                        <h3>${info.title}</h3>
                        <p>${info.description}</p>
                    </div>
                `;
            } catch (err) {
                console.warn(`Could not load info.json for ${folder}`, err);
            }
        }

        attachCardListeners();
    } catch (err) {
        console.error("Error loading playlists:", err);
    }
}
//load the playlist whenever the card is clicked
function attachCardListeners() {
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener('click', async item => {
            const folder = item.currentTarget.dataset.folder;
            songs = await getSongs(`songs_folder/${folder}`);
            if (songs.length > 0) playMusic(songs[0]);
        });
    });
}


async function main() {
    //Get all the songs
    await getSongs("songs_folder/NCS");
    playMusic(songs[0], true)
    await displayAlbums();

    /*showing all the songs in the playlist. This initially created here but next taken into a function 
    let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs){
        songUL.innerHTML+=`<li> <img class="invert"src="images/music.svg" alt="music">
                            <div class="info">
                                <div>${song.replaceAll('%20',' ')}</div>
                                <div>Thaman</div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img class="invert" src="images/playNow.svg" alt="Logo" width="25">
                            </div> </li>`;

    }
       
    //attach an event listener to get each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            //console.log(e.querySelector(".info>div").innerHTML)
            playMusic(e.querySelector(".info>div").innerHTML)
            play.src="images/pause.svg";
        })
    })


    */

    //till this you if you play the songs those will be played continuously without pausing

    //attach an event listener to play,next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "images/pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "images/play.svg";

        }
    })


    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.duration, currentSong.currentTime)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}     / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        if (currentSong.currentTime == currentSong.duration) {
            console.log("playing the next song")
            const currentFile = decodeURIComponent(currentSong.src.split("/").pop());
            let index = songs.indexOf(currentFile);
            playMusic(songs[(index + 1) % (songs.length)])
        }

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


    // Previous button
    previous.addEventListener("click", () => {
        console.log("Prev clicked");
        currentSong.pause();
        const currentFile = decodeURIComponent(currentSong.src.split("/").pop());
        let index = songs.indexOf(currentFile);

        if (index === -1) return;

        let prevIndex = (index - 1 + songs.length) % songs.length; // loops to last song if index = 0

        playMusic(songs[prevIndex]);
        play.src = "images/pause.svg";
    });

    // Next button
    next.addEventListener("click", () => {
        console.log("Next clicked");
        currentSong.pause();
        const currentFile = decodeURIComponent(currentSong.src.split("/").pop());
        let index = songs.indexOf(currentFile);

        if (index === -1) return; // song not found

        let nextIndex = (index + 1) % songs.length; // wraps around to 0 after last

        playMusic(songs[nextIndex]);
        play.src = "images/pause.svg";
    });
    /*
    //add an event listener for previous 
    previous.addEventListener("click", e => {
        currentSong.pause()
        console.log("Prev clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index - 1 >= 0) {
            playMusic(songs[index - 1])
            play.src = "images/pause.svg";
        }
    })
    //add an event listener for next 
    next.addEventListener("click", e => {
        currentSong.pause();
        console.log("Next clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index + 1 < (songs.length)) {
            playMusic(songs[index + 1])
            play.src = "images/pause.svg";
        }
    })*/
    //Add an event for volume 
    document.querySelector('.range').getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting Volume to ", e.target.value)
        currentSong.volume = parseInt(e.target.value) / 100
    })





    //add event listener for muting the volume
    document.querySelector('.volume>img').addEventListener('click', e => {
        if (e.target.src.includes('images/volume.svg')) {
            e.target.src = e.target.src.replace('images/volume.svg', 'images/mute.svg');
            currentSong.volume = 0;
            document.querySelector('.range').getElementsByTagName("input")[0].value = 0;
            console.log("Muted");
        }
        else if (e.target.src.includes('images/mute.svg')) {
            e.target.src = e.target.src.replace('images/mute.svg', 'images/volume.svg');
            currentSong.volume = 0.1;
            document.querySelector('.range').getElementsByTagName("input")[0].value = 20;
            console.log("Unmuted");
        }

    })

}



main()