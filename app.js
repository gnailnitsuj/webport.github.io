const AUDIO_CACHE = 'dynamic-audio-v1';
const DB_NAME = 'OfflineMusicDB';
const DB_VERSION = 1;
let db;

const request = indexedDB.open(DB_NAME, DB_VERSION);
request.onupgradeneeded = (e) => {
    db = e.target.result;
    if (!db.objectStoreNames.contains('downloaded_songs')) {
        db.createObjectStore('downloaded_songs', { keyPath: 'id' });
    }
};
request.onsuccess = (e) => {
    db = e.target.result;
    renderOfflineLibrary();
};

// Moved outside — no longer redefined on every search
async function getRealAudioUrl(identifier) {
    const res = await fetch(`https://archive.org/metadata/${identifier}`);
    const meta = await res.json();
    const audioFile = meta.files.find(f =>
        f.name.endsWith('.mp3') || f.name.endsWith('.ogg')
    );
    return audioFile
        ? `https://archive.org/download/${identifier}/${audioFile.name}`
        : null;
}

document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    searchBtn.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        if (!query) return;

        searchResults.innerHTML = '<p>Searching for tracks...</p>';

        try {
            const response = await fetch(
                `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&mediatype=audio&fl[]=identifier,title,creator&output=json&rows=5`
            );
            const data = await response.json();

            searchResults.innerHTML = '';

            if (!data.response.docs.length) {
                searchResults.innerHTML = '<p>No songs found. Try another search!</p>';
                return;
            }

            for (const item of data.response.docs) {
                const audioUrl = await getRealAudioUrl(item.identifier);
                if (!audioUrl) continue;

                const song = {
                    id: item.identifier,
                    title: item.title || 'Unknown Title',
                    artist: item.creator || 'Unknown Artist',
                    audioUrl
                };

                const div = document.createElement('div');
                div.className = 'search-item';
                div.style.margin = "10px 0";
                div.innerHTML = `
                    <span><strong>${song.title}</strong> - ${song.artist}</span>
                    <button class="play-btn" style="font-family: inherit; font-family: 'Courier New', Courier, monospace;">Play</button>
                    <button id="dl-${song.id}" class="dl-btn">Download Offline</button>
                `;

                div.querySelector('.play-btn').addEventListener('click', () => playSong(song.audioUrl, song.title));
                div.querySelector('.dl-btn').addEventListener('click', () => downloadSong(song));
                searchResults.appendChild(div);
            } 

        } catch (error) {
            console.error("API Search Error:", error);
            searchResults.innerHTML = '<p>Error fetching results. Check your internet connection.</p>';
        }
    });
});

function playSong(url, title) {
    const audioPlayer = document.getElementById('audio-player');
    document.getElementById('now-playing').textContent = `Playing: ${title}`;
    audioPlayer.src = url;
    audioPlayer.play();
}

async function downloadSong(song) {
    const dlBtn = document.getElementById(`dl-${song.id}`);
    dlBtn.textContent = "Downloading...";
    dlBtn.disabled = true;

    try {
        const cache = await caches.open(AUDIO_CACHE);
        
        // 1. Fetch normally without 'no-cors' so we get a valid response object
        const response = await fetch(song.audioUrl);
        
        // Ensure the network request actually succeeded
        if (!response.ok) throw new Error('Network response was not ok');

        // 2. Explicitly store the request and resolved response into Cache Storage
        await cache.put(song.audioUrl, response);

        // 3. Save the metadata to IndexedDB
        const transaction = db.transaction(['downloaded_songs'], 'readwrite');
        const store = transaction.objectStore('downloaded_songs');
        store.put(song);

        transaction.oncomplete = () => {
            dlBtn.textContent = "Saved ✓";
            renderOfflineLibrary();
        };
    } catch (error) {
        console.error("Download failed:", error);
        dlBtn.textContent = "Failed";
        dlBtn.disabled = false;
    }
}

function renderOfflineLibrary() {
    if (!db) return;
    const libraryDiv = document.getElementById('offline-library');
    libraryDiv.innerHTML = '';

    const transaction = db.transaction(['downloaded_songs'], 'readonly');
    const store = transaction.objectStore('downloaded_songs');
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = () => {
        const savedSongs = getAllRequest.result;
        if (savedSongs.length === 0) {
            libraryDiv.innerHTML = '<p>No songs downloaded yet.</p>';
            return;
        }
        savedSongs.forEach(song => {
            const div = document.createElement('div');
            div.className = 'offline-item';
            div.style.margin = "5px 0";
            div.innerHTML = `
                <span><strong>${song.title}</strong> - ${song.artist} 🎵</span>
                <button class="play-offline-btn" style="font-family: inherit; font-family: 'Courier New', Courier, monospace;">Play Offline</button>
            `;
            div.querySelector('.play-offline-btn').addEventListener('click', () => playSong(song.audioUrl, song.title));
            libraryDiv.appendChild(div);
        });
    };
}
