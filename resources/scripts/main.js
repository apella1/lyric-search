const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");

const apiURL = "https://api.lyrics.ovh";

// searching by artist or song

async function searchSongs(term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();

  showData(data);
}

// displaying the song and artist in the DOM

function showData(data) {
  result.innerHTML = `
        <ul class='songs'>${data.data
          .map(
            (song) => `<li>
        <span><strong>${song.artist.name}</strong> - ${song.title}</span>
        <button class='btn' data-artist='${song.artist.name}' data.songtitle='${song.title}'>Get Lyrics</button> </li>`
          )
          .join("")}
    </ul>
    `;

  if (data.prev || data.next) {
    more.innerHTML = `
            ${
              data.prev
                ? `<button class='btn' onClick='getMoreSongs('${data.prev}')>Prev</button>'`
                : ""
            }

            ${
              data.next
                ? `<button class='btn' onClick='getMoreSongs('${data.next}')>Next</button>'`
                : ""
            }
        `;
  } else {
    more.innerHTML = "";
  }
}

// getting the previous and next songs

async function getMoreSongs(url) {
  const res = await fetch("https://cors-anywhere.herokuapp.com/${url}");
  const data = await res.json();

  showData();
}

// getting song lyrics

async function getLyrics(artist, songTitle) {
  const res = await fetch("${apiURL}/v1/${artist}/${songTitle}");
  const data = await res.json();

  if (data.error) {
    result.innerHTML = data.error;
  } else {
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
    <span>${lyrics}</span>;
  }

  more.innerHTML = "";
}

// the event listeners
