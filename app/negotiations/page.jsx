"use client"

import React, { useState, useRef, useEffect } from 'react';

export default function Test() {
    const [recording, setRecording] = useState(false);
    const [audioData, setAudioData] = useState(null);
    const [audioURL, setAudioURL] = useState(null); // New state to store the audio URL
    const mediaRecorder = useRef(null);
    const audioPlayerRef = useRef(null);

    const handleRecordPause = () => {
        if (!recording) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    mediaRecorder.current = new MediaRecorder(stream);
                    mediaRecorder.current.addEventListener('dataavailable', e => {
                        setAudioData(e.data);
                        // setAudioURL(URL.createObjectURL(e.data)); // Create a URL for the audio blob
                    });
                    mediaRecorder.current.start();
                    setRecording(true);
                })
                .catch(err => {
                    console.error('Error accessing the microphone:', err);
                });
        } else {
            console.log("STOP")
            mediaRecorder.current.stop();
            setRecording(false);
        }
    };

    const handleSubmit = async () => {
        if (!audioData) return;

        const formData = new FormData();
        formData.append('file', audioData, 'audio.wav');

        try {
            const response = await fetch('/api/negotiations/1/speak', {
                method: 'POST',
                body: formData,
            });
            const audioBlob = await response.blob()
            const audioResponseURL = URL.createObjectURL(audioBlob);
            setAudioURL(audioResponseURL);

            audioPlayerRef.current.addEventListener('loadeddata', playAudioWhenLoaded);
        } catch (error) {
            console.error('Error uploading audio:', error);
        }
    };

    const playAudioWhenLoaded = () => {
        console.log("playAudioWhenLoaded")
        audioPlayerRef.current.play();
        audioPlayerRef.current.removeEventListener('loadeddata', playAudioWhenLoaded);
    };

    // useEffect(() => {
    //     console.log("addEventListener")
    //     if (audioPlayerRef.current) {
    //         console.log("register")
    //         audioPlayerRef.current.addEventListener('loadeddata', playAudioWhenLoaded);
    //     }
    // }, [audioPlayerRef])

    return (
        <div>
            <button onClick={handleRecordPause}>
                {recording ? 'Pause' : 'Record'}
            </button>
            <button onClick={handleSubmit}>
                Submit
            </button>

            {/* Audio player to play back the recorded audio */}
            <div>
                <audio controls ref={audioPlayerRef} src={audioURL}></audio>
            </div>
        </div>
    );
}
