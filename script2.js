// Here , retrieving the songs from the directory
const baseUrl = "./Assets/Songs/";

// Storing the artists in the object in which artist is key and it's songs are value (in a list)
const artists = {
    "Aleemrk":
        ["1v1.mp3", "Hasrat.mp3", "KABHI KABHI.mp3", "Living In The City.mp3", "Midnight.mp3", "Prodigy.mp3", "RAAT DIN.mp3"],
    "Bella":
        ["Bellopia.mp3", "Gharwale.mp3", "Humble Poet 2.mp3", "KAALE GHERE.mp3", "PROVE THEM WRONG.mp3", "TERE HO KE.mp3"],
    "Jokhay":
        ["Bandish.mp3", "Jokhay Aur Mein.mp3", "Kab Tak.mp3", "Manzar Kashi.mp3", "Me & You.mp3", "Now & Then.mp3", "WAKE ME UP.mp3"],
    "King":
        ["F^ck What They Say.mp3", "Goat Shit.mp3", "IICONIC.mp3", "Kodak.mp3", "Pablo.mp3", "Sinner.mp3", "WarCry.mp3"],
    "KR$NA":
        ["Blowing Up.mp3", "Buss Down.mp3", "Dream.mp3", "Kaha Tak.mp3", "Makasam.mp3", "No Cap.mp3", "Sensitive.mp3"],
    "Raftaar":
        ["Aage Chal.mp3", "Baawe.mp3", "Mantoiyat.mp3", "No China.mp3", "Saza-e-Maut.mp3", "Sheikh Chilli.mp3", "Woh Raat.mp3"],
    "Talha Anjum":
        ["100 Bars.mp3", "Balli Aur Mein.mp3", "Burger-e-Karachi.mp3", "Departure Lane.mp3", "Khana Badosh.mp3", "Laga Reh.mp3", "Muntazir.mp3"],
    "Umair":
        ["Been A While.mp3", "Cold Hours.mp3", "Felony.mp3", "Hola Amigo.mp3", "Obvious.mp3", "Regrets.mp3", "Wishes.mp3"],
};

// defining global variables
let currentArtist = null;
let currentSongs = [];
let currentIndex = -1;
let audio = new Audio();

// selecting the classes from the html
const libraryDiv = document.querySelector(".library");
const songInfo = document.querySelector(".songinfo");
const playBtn = document.querySelector(".song");
const pauseBtn = document.querySelector(".pause");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".previous");
const progressBar = document.querySelector(".progress-bar");
const currentTimeEl = document.querySelector(".current-time");
const totalTimeEl = document.querySelector(".duration");
const burger = document.querySelector(".burger");
const leftside = document.querySelector(".left");
const cross = document.querySelector(".cross");

// function to clean the name of the song such as removing .mp3 from the song name
function cleanSongName(filename) {
    return filename
        .replace(/\.mp3$/i, "")
        .replace(/[_]/g, " ")
        .replace(/\s*\([^)]*\)\s*/g, "")
        .replace(/\s*-\s*.*$/, "");
}

// function to handle the duration of songs in minute and seconds in an appropriate way
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" + s : s}`;
}

// Changing the play/pause svg according to the conditions
function updatePlayPauseButton() {
    if (audio.paused || audio.ended) {
        playBtn.style.display = "block";
        pauseBtn.style.display = "none";
    } else {
        playBtn.style.display = "none";
        pauseBtn.style.display = "block";
    }
}

// Showing the songs in the library 
function showSongs(artist) {
    currentArtist = artist;
    currentSongs = artists[artist] || [];
    currentIndex = -1;

    const listDiv = document.createElement("div");
    listDiv.classList.add("song-list");

    // Separate heading and scrollable list
    listDiv.innerHTML = `
        <h3>${artist}'s Songs</h3>
        <div class="song-items">
            ${currentSongs.map((song, idx) => 
                `<p class="song-item" data-index="${idx}">${cleanSongName(song)}</p>`
            ).join("")}
        </div>
    `;

    const oldList = libraryDiv.querySelector(".song-list");
    if (oldList) oldList.remove();
    libraryDiv.appendChild(listDiv);

    // Attach click listeners to song items
    listDiv.querySelectorAll(".song-item").forEach(item => {
        item.addEventListener("click", () => {
            currentIndex = parseInt(item.dataset.index);
            playCurrentSong();
        });
    });
}

// Playing the songs
function playCurrentSong() {
    if (currentIndex < 0 || currentIndex >= currentSongs.length) return;

    const song = currentSongs[currentIndex];
    if (!song) return;

    audio.pause();

    audio = new Audio(`${baseUrl}${currentArtist}/${encodeURIComponent(song)}`);

    audio.addEventListener('play', updatePlayPauseButton);
    audio.addEventListener('pause', updatePlayPauseButton);
    audio.addEventListener('ended', updatePlayPauseButton);

    audio.play().catch(err => console.error("Playback failed:", err));

    songInfo.textContent = `${cleanSongName(song)} - ${currentArtist}`;

    audio.addEventListener("timeupdate", () => {
        if (audio.duration) {
            const percent = (audio.currentTime / audio.duration) * 100;
            progressBar.value = percent;

            progressBar.style.background = `linear-gradient(to right, white ${percent}%, grey ${percent}%)`;

            currentTimeEl.textContent = formatTime(audio.currentTime);
            totalTimeEl.textContent = formatTime(audio.duration);
        }
    });

    audio.onended = () => {
        if (currentIndex < currentSongs.length - 1) {
            currentIndex++;
            playCurrentSong();
        }
    };
}

playBtn.addEventListener("click", () => {
    if (currentIndex === -1 && currentSongs.length > 0) {
        currentIndex = 0;
        playCurrentSong();
    } else if (audio.src) {
        audio.play().catch(err => console.error(err));
    }
});

pauseBtn.addEventListener("click", () => {
    if (audio.src) {
        audio.pause();
    }
});

nextBtn.addEventListener("click", () => {
    if (currentIndex < currentSongs.length - 1) {
        currentIndex++;
        playCurrentSong();
    }
});

prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        playCurrentSong();
    }
});

progressBar.addEventListener("input", () => {
    if (audio.duration) {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    }
});

document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
        const artist = card.querySelector("h3").innerText.trim();
        showSongs(artist);
    });
});

updatePlayPauseButton();

let isMuted = false;
let previousVolume = 0.5;

const volumeSlider = document.querySelector(".volume-slider");
const volumeIcon = document.querySelector(".volume-icon");
const volumeHighPath = document.querySelector(".volume-high");
const volumeMutedPath = document.querySelector(".volume-muted");

function updateVolumeSliderBackground() {
    const percent = volumeSlider.value;
    volumeSlider.style.background = `linear-gradient(to right, white ${percent}%, #4d4d4d ${percent}%)`;
}

function updateVolumeIcon() {
    if (isMuted || audio.volume === 0) {
        volumeHighPath.style.display = "none";
        volumeMutedPath.style.display = "block";
    } else {
        volumeHighPath.style.display = "block";
        volumeMutedPath.style.display = "none";
    }
}

function setVolume(value) {
    const volume = value / 100;
    audio.volume = volume;
    volumeSlider.value = value;
    updateVolumeSliderBackground();
    updateVolumeIcon();

    isMuted = volume === 0;
    if (!isMuted) {
        previousVolume = volume;
    }
}

function toggleMute() {
    if (isMuted) {
        isMuted = false;
        setVolume(previousVolume * 100);
    } else {
        previousVolume = audio.volume;
        isMuted = true;
        setVolume(0);
    }
}

volumeSlider.addEventListener("input", () => {
    isMuted = false;
    setVolume(volumeSlider.value);
});

volumeIcon.addEventListener("click", toggleMute);
setVolume(100);


burger.addEventListener("click", () => {
    leftside.style.left = "0";
});


cross.addEventListener("click", function (e) {
    leftside.style.left = "-280px";
})


window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
        leftside.style.left = "";
    }
});
