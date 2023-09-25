import React, { useState, useRef } from 'react';
import { TypographySmall } from "@/components/ui/typography";
import { Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

type AudioRecorderProps = {
  isProcessing: boolean;
  onSubmit: (audioData: Blob) => void;
};

export default function AudioRecorder({ isProcessing, onSubmit }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState('');
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const handleRecordToggle = () => {
    if (!isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          mediaRecorder.current = new MediaRecorder(stream);
          mediaRecorder.current.ondataavailable = e => {
            setAudioData(e.data);
            setAudioURL(URL.createObjectURL(e.data));
          };
          mediaRecorder.current.start();
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

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {
        isRecording
          ? <div className='flex flex-col items-center justify-center'>
            <Button variant="destructive" className="group rounded-full w-24 h-24" onClick={handleRecordToggle}>
              <Square className="w-12 h-12 stroke-destructive" />
            </Button>
            <TypographySmall className="mt-4 text-center text-destructive">Stop Recording</TypographySmall>
          </div>
          : <div className='flex flex-col items-center justify-center'>
            <Button variant="secondary" className="group rounded-full w-24 h-24" disabled={isProcessing} onClick={handleRecordToggle}>
              <Mic className="w-12 h-12 stroke-accent group-hover:stroke-primary" />
            </Button>
            <TypographySmall className="mt-4 text-center text-accent">{ isProcessing ? 'Wait for your turn' : 'Start Speaking' }</TypographySmall>
          </div>
      }

      {audioURL && !isRecording && (
        <div>
          <audio controls src={audioURL}></audio>
        </div>
      )}
      {audioURL && !isRecording &&
        <Button onClick={handleSubmit}>
          Continue
        </Button>
      }
    </div>
  );
}
