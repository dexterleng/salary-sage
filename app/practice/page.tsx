'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TypographyBody, TypographyH1, TypographySubtle } from "@/components/ui/typography";
import Link from "next/link";
import { BotIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import AudioRecorder from "@/components/practice/audio-recorder";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


export default function Practice() {
  const [hasPracticeStarted, setHasPracticeStarted] = useState(false);
  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [responseData, setResponseData] = useState<HTMLAudioElement | null>(null);
  const [hint, setHint] = useState('');
  const [hintCount, setHintCount] = useState(0);

  useEffect(() => {
    if (hasPracticeStarted) {
      setIsInterviewerSpeaking(true);
      setTimeout(() => {
        const audioElement = document.getElementById('interviewer-audio') as HTMLAudioElement;
        if (audioElement) {
          audioElement.play();
        }
      }, 1000);
    }
  }, [hasPracticeStarted]);

  // temp delay function to simulate API request
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const handleUserSubmitRequest = async (audioData: Blob) => {
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

      // let audioUrl = require('@/public/audio/abstract.mp3');
      // let sound = new Audio(audioUrl);
      // setResponseData(sound);
      // sound.play();
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
    setIsProcessing(false);
  };

  const handleHintRequest = async () => {
    setHint('Now is the time to talk about your other benefits such as annual bonus and health insurance.');
    setHintCount(hintCount + 1);
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
                          id="interviewer-audio"
                          onPlay={() => { setIsInterviewerSpeaking(true); }}
                          onEnded={() => setIsInterviewerSpeaking(false)}
                          src='/audio/abstract.mp3'></audio>
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={`flex-1 ${isProcessing || isInterviewerSpeaking ? 'opacity-50 bg-muted/10' : 'opacity-100 bg-card'}`}>
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
                <AudioRecorder onSubmit={handleUserSubmitRequest} isProcessing={isProcessing || isInterviewerSpeaking} />
              </div>
              <Popover>
                <PopoverTrigger>
                  <TypographySubtle className="absolute right-4 bottom-0">
                    Stuck?
                    <Button variant="link" className="text-primary hover:underline -ml-2" onClick={() => handleHintRequest()}>Get Hints</Button>
                  </TypographySubtle>
                </PopoverTrigger>
                <PopoverContent className="bg-glass border-none" align="center">{hint}</PopoverContent>
              </Popover>
            </CardContent>
          </Card>
        </div>
      </div>
      <AlertDialog open={!hasPracticeStarted}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mock Salary Negotiation with AI</AlertDialogTitle>
            <AlertDialogDescription>
              This is a salary negotiation practice session with an AI interviewer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setHasPracticeStarted(true)}>Start Practice</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
