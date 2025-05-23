let next = document.querySelector(".next");
let prev = document.querySelector(".prev");
let playbtn = document.querySelector(".player");
const seekBar = document.getElementById("seek-bar");
let musicTime = document.querySelector(".music-Time");
let loopbtn = document.querySelector(".musicbtns svg");
let notificationText = document.querySelector(".notification");
let notification = document.querySelector(".notification-bar");
let headerText = document.querySelector(".header h4");
let cards_main = document.querySelectorAll(".card-main");
let songnameli2 = document.querySelectorAll(".songList-aside ul")[0];
let songnameli = document.querySelectorAll(".songList-aside ul")[0];
let songnameUl = document.querySelector(".songList-asideUl");
let closebtn = document.querySelector(".closebtn");
let aside = document.querySelector("aside");
let songnamep = document.querySelector(".songname");
let songnamediv = document.querySelector('.songnamediv');
let currfolder;
 
async function getSongs(folder) {
  currfolder = folder;
  let response = await fetch(`http://127.0.0.1:3000/Songs/${folder}`);
  let data = await response.text();
  let div = document.createElement("div");
  div.innerHTML = data;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let i = 0; i < as.length; i++) {
    let e = as[i];
    if (e.href.endsWith(".mp3")) {
      songs.push(e.href);
    }
  }
  return songs;
}

async function main() {
  let songs = await getSongs("Playlist2");
  console.log(songs);
  for (const song of songs) {
    songnameli2.innerHTML += `<li> <img src="SVG's/music.svg" alt=""><span class="songultitle">${song
      .split(`/Songs/${currfolder}/`)[1]
      .replaceAll(
        "%20",
        " "
      )}</span> <img class="aside-playbtn" src="SVG's/plays.svg" alt=""></li>`;
  }

  let currentIndex = localStorage.getItem("currentIndex")
    ? parseInt(localStorage.getItem("currentIndex"))
    : 0;
  let audio = new Audio(songs[currentIndex]);

  if (localStorage.getItem("currentTime")) {
    audio.currentTime = parseFloat(localStorage.getItem("currentTime"));
  }

  function nextSong() {
    currentIndex = (currentIndex + 1) % songs.length;
    audio.src = songs[currentIndex];
    audio.play();

    localStorage.setItem("currentIndex", currentIndex);
  }
  function updatePlayPauseButtons() {
    if (audio.paused) {
      playbtn.src = "/SVG's/play.svg";
      Array.from(songnameli2.children).forEach((li) => {
        const asidePlayBtn = li.querySelector(".aside-playbtn");
        asidePlayBtn.src = "SVG's/plays.svg";
      });
    } else {
      playbtn.src = "/SVG's/pause.svg";
      Array.from(songnameli2.children).forEach((li, index) => {
        const asidePlayBtn = li.querySelector(".aside-playbtn");
        if (index === currentIndex) {
          asidePlayBtn.src = "SVG's/pauses.svg";
        } else {
          asidePlayBtn.src = "SVG's/plays.svg";
        }
      });
    }
  }

  playbtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
    updatePlayPauseButtons();
  });

  Array.from(songnameli2.children).forEach((li, index) => {
    const playBtn = li.querySelector(".aside-playbtn");
    playBtn.addEventListener("click", () => {
      if (currentIndex !== index) {
        currentIndex = index;
        audio.src = songs[currentIndex];
        audio.play();
      } else if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
      updatePlayPauseButtons();
      localStorage.setItem("currentIndex", currentIndex);
    });
  });

  audio.addEventListener("play", updatePlayPauseButtons);
  audio.addEventListener("pause", updatePlayPauseButtons);

  function prevSong() {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    audio.src = songs[currentIndex];
    audio.play();

    localStorage.setItem("currentIndex", currentIndex);
  }

  playbtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
  next.addEventListener("click", nextSong);
  prev.addEventListener("click", prevSong);

  window.addEventListener("keydown", (e) => {
    if (e.key == " ") {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  });

  window.addEventListener("keydown", (e) => {
    console.log(e);
    if (e.shiftKey == true && e.key == "N") {
      nextSong();
    } else if (e.shiftKey == true && e.key == "P") {
      prevSong();
    }
  });

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }
  audio.addEventListener("loadedmetadata", () => {
    audio.addEventListener("timeupdate", () => {
      const duration = audio.duration;
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      const formattedDuration = `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;
      if (isNaN(seconds) || seconds < 0) {
        return "00:00";
      }
      musicTime.innerHTML = `${formatTime(
        audio.currentTime
      )}/${formattedDuration}`;
      seekBar.value = (audio.currentTime / audio.duration) * 100;
      localStorage.setItem("currentTime", audio.currentTime);
    });
  });

  seekBar.addEventListener("input", () => {
    audio.currentTime = (seekBar.value / 100) * audio.duration;
  });

  function showHideNotification() {
    notification.style.opacity = 1;
    setTimeout(() => {
      notification.style.opacity = 0;
    }, 2000);
  }

  if (!audio.paused) {
    audio.play();
  }
  loopbtn.addEventListener("click", () => {
    if (audio.loop == true) {
      audio.loop = false;
      loopbtn.style.fill = "#909090";
      audio.addEventListener("ended", () => {
        nextSong();
      });
      notificationText.innerHTML = "Loop : OFF";
      showHideNotification();
    } else {
      audio.loop = true;
      loopbtn.style.fill = "white";
      notificationText.innerHTML = "Loop : ON";
      showHideNotification();
    }
  });

  cards_main.forEach((card) => {
    card.addEventListener("click", () => {
      songnameli.classList.toggle("dn");
    });
  });
  playbtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
    updatePlayPauseButtons();
  });

  Array.from(songnameli2.children).forEach((li, index) => {
    li.addEventListener("click", () => {
      if (currentIndex !== index) {
        currentIndex = index;
        audio.src = songs[currentIndex];
        audio.play();
      } else if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
      updatePlayPauseButtons();
      localStorage.setItem("currentIndex", currentIndex);
    });
  });
  // If the aside is not shown (playlist not active) pause the player
  function checkAside() {
    if (songnameUl.classList.contains("dn")) {
      audio.pause();
    } else {
      audio.play();
    }
  }

  if (window.innerWidth > 1000) {
    cards_main.forEach((card) => {
      card.addEventListener("click", () => {
        checkAside();
      });
    });
    aside.style.display = "flex";
    songnameli.style.display = "flex";
  } else {
    aside.style.display = "none";
    songnameli.style.display = "none";  
  }
  closebtn.addEventListener("click", () => {
    aside.classList.toggle("dn");
  });
  if (window.innerWidth < 1000) {
    cards_main.forEach((card) => {
      card.addEventListener("click", () => {
        aside.classList.toggle("dn");
      });
    });
    cards_main.forEach((card) => {
      card.addEventListener("click", () => {
        songnameli.classList.remove("dn");
      });
    });
  }
  audio.addEventListener("play", () => {
    songnamep.innerHTML = songs[currentIndex]
      .split(`/Songs/${currfolder}/`)[1]
      .replaceAll("%20", " ");
      songnamediv.classList.remove('dn');
    });
    
  audio.addEventListener("ended", () => {
    nextSong();
  });
}

main();