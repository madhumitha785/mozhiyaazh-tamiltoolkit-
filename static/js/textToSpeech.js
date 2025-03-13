// textToSpeech.js - Handles text to speech functionality

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const textInput = document.getElementById('textInput');
    const speakBtn = document.getElementById('speakBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resumeBtn = document.getElementById('resumeBtn');
    const stopBtn = document.getElementById('stopBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const speedRange = document.getElementById('speedRange');
    const speedValue = document.querySelector('.speed-value');
    
    // Check if browser supports Speech Synthesis
    if (!('speechSynthesis' in window)) {
        alert('Your browser does not support Text to Speech. Please use Chrome, Firefox, Edge, or Safari.');
        disableButtons();
        textInput.value = 'Text to speech not supported in this browser.';
        return;
    }
    
    // Get voices
    let voices = [];
    let tamilVoice = null;
    
    function getVoices() {
        voices = window.speechSynthesis.getVoices();
        tamilVoice = voices.find(voice => voice.lang.includes('ta')) || null;
    }
    
    // Load voices when available
    getVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = getVoices;
    }
    
    // State variables
    let currentUtterance = null;
    let isSpeaking = false;
    
    // Event listeners
    speakBtn.addEventListener('click', speak);
    pauseBtn.addEventListener('click', pause);
    resumeBtn.addEventListener('click', resume);
    stopBtn.addEventListener('click', stop);
    downloadBtn.addEventListener('click', downloadAudio);
    speedRange.addEventListener('input', updateSpeed);
    
    // Set initial button states
    setButtonState(pauseBtn, false);
    setButtonState(resumeBtn, false);
    setButtonState(stopBtn, false);
    
    // Update speed display
    function updateSpeed() {
        speedValue.textContent = `${speedRange.value}×`;
        if (currentUtterance) {
            currentUtterance.rate = parseFloat(speedRange.value);
        }
    }
    
    // Text to speech function
    function speak() {
        const text = textInput.value.trim();
        if (!text) {
            alert('Please enter some text to speak.');
            return;
        }
        stop();
        
        currentUtterance = new SpeechSynthesisUtterance(text);
        if (tamilVoice) {
            currentUtterance.voice = tamilVoice;
        }
        currentUtterance.rate = parseFloat(speedRange.value);
        
        currentUtterance.onstart = () => {
            isSpeaking = true;
            updateButtonStates();
        };
        
        currentUtterance.onend = () => {
            isSpeaking = false;
            updateButtonStates();
        };
        
        currentUtterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            alert('An error occurred during speech synthesis.');
            isSpeaking = false;
            updateButtonStates();
        };
        
        window.speechSynthesis.speak(currentUtterance);
    }
    
    function pause() {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            updateButtonStates();
        }
    }
    
    function resume() {
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            updateButtonStates();
        }
    }
    
    function stop() {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            isSpeaking = false;
            updateButtonStates();
        }
    }
    
    function updateButtonStates() {
        setButtonState(speakBtn, !isSpeaking);
        setButtonState(pauseBtn, isSpeaking && !window.speechSynthesis.paused);
        setButtonState(resumeBtn, window.speechSynthesis.paused);
        setButtonState(stopBtn, isSpeaking);
    }
    
    function setButtonState(button, enabled) {
        button.disabled = !enabled;
        button.classList.toggle('disabled', !enabled);
    }
    
    function downloadAudio() {
        alert('Audio download is not supported through the browser\'s Speech Synthesis API.');
    }
});
