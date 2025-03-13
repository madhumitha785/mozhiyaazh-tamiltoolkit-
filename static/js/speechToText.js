// speechToText.js - Handles speech recognition functionality

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const clearBtn = document.getElementById('clearBtn');
    const saveBtn = document.getElementById('saveBtn');
    const transcript = document.getElementById('transcript');
    
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        alert('Your browser does not support Speech Recognition. Please use Chrome, Edge or Safari.');
        disableButtons();
        transcript.value = 'Speech recognition not supported in this browser. Please use Chrome, Edge or Safari.';
        return;
    }
    
    // Create speech recognition object
    const recognition = new SpeechRecognition();
    
    // Configure recognition
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ta-IN'; // Tamil language - change as needed
    
    // Variables to track state
    let isRecording = false;
    let isPaused = false;
    
    // Event listeners
    startBtn.addEventListener('click', toggleRecording);
    pauseBtn.addEventListener('click', togglePause);
    clearBtn.addEventListener('click', clearTranscript);
    saveBtn.addEventListener('click', saveTranscript);
    
    // Recognition events
    recognition.onresult = handleResult;
    recognition.onerror = handleError;
    recognition.onend = handleEnd;
    
    // Functions
    function toggleRecording() {
        if (!isRecording) {
            // Start recording
            try {
                recognition.start();
                isRecording = true;
                startBtn.textContent = 'STOP RECORDING';
                startBtn.style.backgroundColor = '#ff6b6b';
                setButtonState(pauseBtn, true);
            } catch (err) {
                console.error('Error starting recognition: ', err);
                alert('Could not start speech recognition. Please try again.');
            }
        } else {
            // Stop recording
            try {
                recognition.stop();
                isRecording = false;
                isPaused = false;
                startBtn.textContent = 'START RECORDING';
                pauseBtn.textContent = 'PAUSE';
                setButtonState(pauseBtn, false);
            } catch (err) {
                console.error('Error stopping recognition: ', err);
            }
        }
    }
    
    function togglePause() {
        if (!isRecording) return;
        
        if (!isPaused) {
            // Pause recording
            recognition.stop();
            isPaused = true;
            pauseBtn.textContent = 'RESUME';
        } else {
            // Resume recording
            try {
                recognition.start();
                isPaused = false;
                pauseBtn.textContent = 'PAUSE';
            } catch (err) {
                console.error('Error resuming recognition: ', err);
                alert('Could not resume speech recognition. Please try again.');
            }
        }
    }
    
    function clearTranscript() {
        transcript.value = '';
    }
    
    function saveTranscript() {
        if (!transcript.value.trim()) {
            alert('There is no transcript to save.');
            return;
        }
        
        // Create a blob from the transcript text
        const blob = new Blob([transcript.value], { type: 'text/plain' });
        
        // Create a download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        // Set attributes for download
        a.href = url;
        a.download = `transcript_${new Date().toISOString().slice(0,10)}.txt`;
        
        // Trigger download
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    function handleResult(event) {
        let interimTranscript = '';
        let finalTranscript = '';
        
        // Loop through results
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const text = result[0].transcript;
            
            if (result.isFinal) {
                finalTranscript += text;
            } else {
                interimTranscript += text;
            }
        }
        
        // Update transcript
        if (finalTranscript) {
            transcript.value += finalTranscript + ' ';
        }
        
        // For debugging
        console.log('Final transcript: ', finalTranscript);
        console.log('Interim transcript: ', interimTranscript);
    }
    
    function handleError(event) {
        console.error('Recognition error: ', event.error);
        
        // Handle specific errors
        if (event.error === 'not-allowed') {
            alert('Microphone access was denied. Please allow microphone access to use speech recognition.');
        } else if (event.error === 'audio-capture') {
            alert('No microphone detected. Please connect a microphone and try again.');
        } else {
            alert(`Speech recognition error: ${event.error}`);
        }
        
        isRecording = false;
        startBtn.textContent = 'START RECORDING';
        setButtonState(pauseBtn, false);
    }
    
    function handleEnd() {
        if (isRecording && !isPaused) {
            // If recording was not explicitly stopped, restart it
            try {
                recognition.start();
            } catch (err) {
                console.error('Error restarting recognition: ', err);
                isRecording = false;
                startBtn.textContent = 'START RECORDING';
                setButtonState(pauseBtn, false);
            }
        }
    }
    
    function setButtonState(button, enabled) {
        if (enabled) {
            button.removeAttribute('disabled');
            button.style.opacity = '1';
        } else {
            button.setAttribute('disabled', 'true');
            button.style.opacity = '0.5';
        }
    }
    
    function disableButtons() {
        setButtonState(startBtn, false);
        setButtonState(pauseBtn, false);
        setButtonState(saveBtn, false);
    }
    
    // Initialize button states
    setButtonState(pauseBtn, false);
});