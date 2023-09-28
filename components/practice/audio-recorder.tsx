import React, { useState, useRef } from 'react';
import { TypographySmall, TypographySubtle, TypographyBody } from "@/components/ui/typography";
import { Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

type AudioRecorderProps = {
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  isDisabled: boolean;
  setIsUserAudioPlaying: (isPlaying: boolean) => void;
  hasPracticeEnded: boolean;
  onSubmit: (audioData: Blob) => void;
};

export default function AudioRecorder({ isRecording, setIsRecording, isDisabled, setIsUserAudioPlaying, hasPracticeEnded, onSubmit }: AudioRecorderProps) {
  const [audioData, setAudioData] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState('');
  const [audioLength, setAudioLength] = useState(0); // in seconds
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const handleRecordToggle = () => {
    if (!isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const chunks: Blob[] = [];

          mediaRecorder.current = new MediaRecorder(stream);
  
          mediaRecorder.current.ondataavailable = e => {
            if (e.data.size > 0) {
              chunks.push(e.data);
            }
          };
  
          mediaRecorder.current.start(0.1);

          // Start audio length timer
          mediaRecorder.current.onstart = () => {
            setAudioLength(0);
            const timer = setInterval(() => {
              setAudioLength(prev => prev + 1);
            }, 1000);

            mediaRecorder.current!.onstop = () => {
              clearInterval(timer);
              // Create a Blob from the recorded chunks
              const audioBlob = new Blob(chunks, { type: 'audio/wav' });
              setAudioData(audioBlob);
              setAudioURL(URL.createObjectURL(audioBlob));
            };
          };
  
          setIsRecording(true);
        })
        .catch(err => {
          console.error('Error accessing the microphone:', err);
        });
    } else {
      mediaRecorder?.current?.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async () => {
    if (!audioData) {
      return;
    }

    onSubmit(audioData);

    setAudioData(null);
    setAudioURL('');
  };

  const getTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {
        isRecording
          ? <div className='flex flex-col items-center justify-center'>
            <Button variant="destructive" className="group bg-destructive/30 hover:bg-destructive/50 rounded-full w-24 h-24" onClick={handleRecordToggle}>
              <Square className="w-12 h-12 stroke-destructive" />
            </Button>
            <TypographySmall className="mt-4 text-center text-destructive">Stop Recording</TypographySmall>
            <TypographyBody className="mt-4 text-center">{getTime(audioLength)}</TypographyBody>
          </div>
          : <div className='flex flex-col items-center justify-center'>
            <Button variant="secondary" className="group rounded-full w-24 h-24" disabled={isDisabled} onClick={handleRecordToggle}>
              <Mic className="w-12 h-12 stroke-accent group-hover:stroke-primary" />
            </Button>
            <TypographySmall className="mt-4 text-center text-accent">
              {
                hasPracticeEnded
                ? 'This is the end of the practice'
                : isDisabled
                  ? 'Wait for your turn'
                  : audioURL
                    ? 'Re-record response'
                    : 'Press to Start Speaking'
              }
            </TypographySmall>
          </div>
      }

      {audioURL && !isRecording && (window as any).safari == undefined && (
        <div className='flex flex-col justify-center items-center'>
          <TypographySubtle className='text-xs'>Preview</TypographySubtle>
          <audio
            controls
            src={audioURL}
            onPlay={() => setIsUserAudioPlaying(true)}
            onPause={() => setIsUserAudioPlaying(false)}
            className={`mt-1 ${isDisabled ? 'pointer-events-none opacity-50' : ''}`}>
          </audio>
        </div>
      )}
      {audioURL && !isRecording &&
        <Button onClick={handleSubmit} disabled={isDisabled}>
          Confirm Response
        </Button>
      }
    </div>
  );
}
