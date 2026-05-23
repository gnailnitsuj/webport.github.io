var data = {"downloadedSongs": [
    {
      "id": "grateful-dead-live-1977",
      "title": "Scarlet Begonias (Live)",
      "artist": "Grateful Dead",
      "audioUrl": "https://archive.org/download/grateful-dead-live-1977/scarlet-begonias.mp3",
      "downloadedAt": "2026-05-20T14:22:00Z",
      "fileSizeBytes": 8430592
    },
    {
      "id": "miles-davis-kind-of-blue",
      "title": "So What",
      "artist": "Miles Davis",
      "audioUrl": "https://archive.org/download/miles-davis-kind-of-blue/so-what.mp3",
      "downloadedAt": "2026-05-21T09:10:00Z",
      "fileSizeBytes": 11534336
    }
  ],}


document.getElementById("beautified").innerHTML = JSON.stringify(data, undefined, 2);
