function displayText () {
    const menu = document.getElementById("wordSelect");
    const display = document.getElementById("textDisplay");
    if (menu.selectedIndex > 0) {
        const selected = menu.options[menu.selectedIndex];
        display.value = selected.dataset.sentence;
    } else {
        display.value = "";
    }

}

function speakWord() {
    const word = document.getElementById("wordSelect").value;
    if (word) {
        speak(word);
    }
}

function speakSentence() {
    const sentence = document.getElementById("textDisplay").value;
    if (sentence) {
        speak(sentence);
    }
}

function speak(textToSay) {
 const message = new SpeechSynthesisUtterance(textToSay);
 message.pitch = 1.5;
 message.rate = 1.0;
 window.speechSynthesis.speak(message);
} 
