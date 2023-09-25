'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TypographyBody, TypographyH1, TypographySubtle } from "@/components/ui/typography";
import Link from "next/link";
import { BotIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import AudioRecorder from "@/components/practice/audio-recorder";
import { useState } from "react";

export default function Practice() {
  const [hasPracticeStarted, setHasPracticeStarted] = useState(false);
  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [responseData, setResponseData] = useState<HTMLAudioElement | null>(null);

  // temp delay function to simulate API request
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const handleApiRequest = async (audioData: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioData, 'recording.webm');
      await delay(5000);
      // const response = await fetch('YOUR_API_ENDPOINT', {
      //   method: 'POST',
      //   body: formData,
      // });

      // const data = await response.json();
      // setResponseData(data);

      let audioUrl = require('@/public/audio/sample-audio.mp3');
      let sound = new Audio(audioUrl);
      setResponseData(sound);
      sound.play();
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
    setIsProcessing(false);
  };

  return (
    <div className="p-12 justify-center flex flex-col items-center">
      <div className="max-w-7xl w-full">
        <div className="flex w-full justify-start items-center">
          <Link href="/dashboard"></Link>
          <TypographyH1 className="w-fit">Practice</TypographyH1>
        </div>
        <div className="flex py-6 gap-12 flex-wrap w-full">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center">
                  <div className="rounded-full w-12 h-12 bg-secondary flex items-center justify-center">
                    <BotIcon className="w-6 h-6 stroke-accent" />
                  </div>
                  <div>
                    <TypographyBody className="ml-4 text-accent">Interviewer</TypographyBody>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="px-2 pb-4">
                <div className="bg-secondary w-full h-80">
                  <div className="flex flex-col items-center justify-center h-full">
                    {
                      isProcessing
                        ? 'Waiting for your interviewer to reply...'
                        : <audio controls autoPlay={hasPracticeStarted} 
                        onPlay={() => { setHasPracticeStarted(true); setIsInterviewerSpeaking(true); }} 
                        onEnded={() => setIsInterviewerSpeaking(false)}
                        src='/audio/abstract.mp3'></audio>
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={`flex-1 ${isProcessing || isInterviewerSpeaking || !hasPracticeStarted ? 'opacity-50 bg-muted/10' : 'opacity-100 bg-card'}`}>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center">
                  <div className="rounded-full w-12 h-12 bg-glass flex items-center justify-center">
                    <User className="w-6 h-6 stroke-accent" />
                  </div>
                  <div>
                    <TypographyBody className="ml-4 text-accent">You</TypographyBody>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative flex flex-col items-center justify-center h-[calc(50vh-80px)]">
              <div className="px-2 pb-6">
                <AudioRecorder onSubmit={handleApiRequest} isProcessing={isProcessing || isInterviewerSpeaking || !hasPracticeStarted} />
              </div>
              <TypographySubtle className="absolute right-4 bottom-0">
                Stuck? <Button variant="link" className="text-primary hover:underline -ml-4">Get Hints</Button>
              </TypographySubtle>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
