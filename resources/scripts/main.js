const searchForm = document.getElementById("form");
const searchInput = document.getElementById("search");
const searchResult = document.getElementById("result");
const moreResults = document.getElementById("more");

// API URL
const apiURL = "https://api.lyrics.ovh";

// searching by artist or song

async function searchSongs(searchTerm) {
  const res = await fetch(`${apiURL}/suggest/${searchTerm}`);
  const data = await res.json();

  showData(data);
}

/** The showdData function is on the global lexical environment and thereofore can be accessed
   by the other functions defined in the global lexical environment 
*/

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
    moreResults.innerHTML = `
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
    moreResults.innerHTML = "";
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

  moreResults.innerHTML = "";
}

// Event listeners
form.addEventListener('submit', e => {
  e.preventDefault();

  const searchTerm = search.value.trim();

  if (!searchTerm) {
    alert('Please type in a search term');
  } else {
    searchSongs(searchTerm);
  }
});

// Get lyrics button click
result.addEventListener('click', e => {
  const clickedEl = e.target;

  if (clickedEl.tagName === 'BUTTON') {
    const artist = clickedEl.getAttribute('data-artist');
    const songTitle = clickedEl.getAttribute('data-songtitle');

    getLyrics(artist, songTitle);
  }
});
