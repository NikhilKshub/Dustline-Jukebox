const tracks = [
    {
        code: "A1",
        title: "Ragtime",
        artist: "Back_Drop",
        file: "assets/back_drop-ragtime.mp3"
    },
    {
        code: "A2",
        title: "Moonlight Sonata",
        artist: "GregorQuendel",
        file: "assets/beethoven-moonlight-sonata.mp3"
    },
    {
        code: "A3",
        title: "Für Elise",
        artist: "Clavier-Music",
        file: "assets/clavier-fur-elise-beethoven.mp3"
    },
    {
        code: "A4",
        title: "Black Sugar",
        artist: "MoonpetalMedia",
        file: "assets/moonpetalmedia-black-sugar.mp3"
    },
    {
        code: "A5",
        title: "In The Saloon",
        artist: "Piano_Music",
        file: "assets/music-in-the-saloon.mp3"
    },
];

const trackList = document.getElementById("track-list");
const queueList = document.getElementById("queue-list");
const queueEmpty = document.getElementById("queue-empty");
const player = document.getElementById("player");
const npCode = document.getElementById("np-code");
const npTitle = document.getElementById("np-title");
const npArtist = document.getElementById("np-artist");
const playPause = document.getElementById("play-pause");
const skip = document.getElementById("skip");
const volume = document.getElementById("volume");
const timeNow = document.getElementById("time-now");
const timeTotal = document.getElementById("time-total");
const barFill = document.querySelector(".bar-fill");
const bar = document.querySelector(".bar");

let queue = [];
let nowPlaying = null;

// all the functions
function addToQueue(track) {
    queue.push(track);
    if (nowPlaying === null) {
        playNext();
    } else {
        showQueue();
    }
}

function removeFromQueue(index) {
    queue.splice(index, 1);
    showQueue();
}

function showTracks() {
    tracks.forEach((track) => {
        const li = document.createElement("li");
        const code = document.createElement("span");
        code.className = "code";
        code.textContent = track.code;
        const title = document.createElement("span");
        title.className = "title";
        title.textContent = track.title;
        const button = document.createElement("button");
        button.textContent = "Insert coin";
        button.addEventListener("click", () => {
            addToQueue(track);
        });
        li.append(code);
        li.append(title);
        li.append(button);
        trackList.append(li);
    });
}

function showQueue() {
    queueList.textContent = "";
    queue.forEach((track, index) => {
        const li = document.createElement("li");
        const code = document.createElement("span");
        code.className = "code";
        code.textContent = track.code;
        const title = document.createElement("span");
        title.className = "title";
        title.textContent = track.title;
        const button = document.createElement("button");
        button.textContent = "Remove";
        button.addEventListener("click", () => {
            removeFromQueue(index);
        });
        li.append(code);
        li.append(title);
        li.append(button);
        queueList.append(li);
    });
    if (queue.length > 0) {
        queueEmpty.hidden = true;
    } else {
        queueEmpty.hidden = false;
    }
}

function playNext() {
    if (queue.length === 0) {
        nowPlaying = null;
        player.pause();
        npCode.textContent = "--";
        npTitle.textContent = "Nothing playing";
        npArtist.textContent = "-";
        timeNow.textContent = "0:00";
        timeTotal.textContent = "0:00";
        barFill.style.width = "0%";
        playPause.textContent = "Play";
    } else {
        nowPlaying = queue.shift();
        npCode.textContent = nowPlaying.code;
        npTitle.textContent = nowPlaying.title;
        npArtist.textContent = nowPlaying.artist;
        player.src = nowPlaying.file;
        player.play();
        playPause.textContent = "Pause";
        showQueue();
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = String(Math.floor(seconds % 60)).padStart(2, "0");
    return `${minutes}:${secs}`;
}

// all event listeners
skip.addEventListener("click", () => {
    playNext();
});

playPause.addEventListener("click", () => {
    if (nowPlaying === null) {
        return;
    }
    if (player.paused) {
        player.play();
        playPause.textContent = "Pause";
    } else {
        player.pause();
        playPause.textContent = "Play";
    }
});

player.addEventListener("ended", () => {
    playNext();
});

volume.addEventListener("input", () => {
    player.volume = volume.value;
});
player.volume = volume.value;


player.addEventListener("loadedmetadata", () => {
    timeTotal.textContent = formatTime(player.duration);
});

player.addEventListener("timeupdate", () => {
    timeNow.textContent = formatTime(player.currentTime);
    const percent = (player.currentTime / player.duration) * 100;
    barFill.style.width = `${percent}%`;
});

bar.addEventListener("click", (event) => {
    if (nowPlaying === null) {
        return;
    }
    const fraction = event.offsetX / bar.clientWidth;
    player.currentTime = fraction * player.duration;
});


showTracks();
showQueue();