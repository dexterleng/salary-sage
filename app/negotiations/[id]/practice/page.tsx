'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TypographyBody, TypographyH1, TypographySmall, TypographySubtle } from "@/components/ui/typography";
import Link from "next/link";
import { BotIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import AudioRecorder from "@/components/practice/audio-recorder";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useRouter } from 'next/navigation';
import { TypeAnimation } from 'react-type-animation';
import Image from 'next/image';

export default function Practice({ params }: { params: { id: string } }) {
  const interviewId = params.id;
  const router = useRouter()

  const [hasPracticeStarted, setHasPracticeStarted] = useState(false);
  const [hasPracticeEnded, setHasPracticeEnded] = useState(false);
  const [showPracticeEndedAlert, setShowPracticeEndedAlert] = useState(false);

  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUserAudioPlaying, setIsUserAudioPlaying] = useState(false);

  const [responseUrl, setResponseUrl] = useState<string>();
  const [response, setResponse] = useState<string>('Hi Charisma, I\'m your interviewer. This meeting is to discuss your salary and other benefits expectations from this role. Hi Charisma, I\'m your interviewer. This meeting is to discuss your salary and other benefits expectations from this role. Hi Charisma, I\'m your interviewer. This meeting is to discuss your salary and other benefits expectations from this role. Hi Charisma, I\'m your interviewer. This meeting is to discuss your salary and other benefits expectations from this role. Hi Charisma, I\'m your interviewer. This meeting is to discuss your salary and other benefits expectations from this role. Hi Charisma, I\'m your interviewer. This meeting is to discuss your salary and other benefits expectations from this role. Hi Charisma, I\'m your interviewer. This meeting is to discuss your salary and other benefits expectations from this role. Hi Charisma, I\'m your interviewer. This meeting is to discuss your salary and other benefits expectations from this role. Hi Charisma, I\'m your interviewer. This meeting is to discuss your salary and other benefits expectations from this role. Hi Charisma, I\'m your interviewer. This meeting is to discuss your salary and other benefits expectations from this role. Hi Charisma, I\'m your interviewer. This meeting is to discuss your salary and other benefits expectations from this role. Hi Charisma, I\'m your interviewer. This meeting is to discuss your salary and other benefits expectations from this role. Hi Charisma, I\'m your interviewer. This meeting is to discuss your salary and other benefits expectations from this role. Hi Charisma, I\'m your interviewer. This meeting is to discuss your salary and other benefits expectations from this role. Hi Charisma, I\'m your interviewer. This meeting is to discuss your salary and other benefits expectations from this role. ');
  const [hint, setHint] = useState('Thank your interviewer for the opportunity and remain confident.');
  // const [hintCount, setHintCount] = useState(0);

  useEffect(() => {
    fetchResponse(new FormData())
  }, [])

  useEffect(() => {
    if (hasPracticeStarted && responseUrl) {
      setIsInterviewerSpeaking(true);

      setTimeout(() => {
        const audioElement = document.getElementById('interviewer-audio') as HTMLAudioElement;
        if (audioElement) {
          audioElement.play();
        } else {
          setIsInterviewerSpeaking(false);
        }
      }, 1000);
    }
  }, [hasPracticeStarted]);

  useEffect(() => {
    const elem = document.getElementById("interviewer-response") as HTMLElement;
    if (isInterviewerSpeaking && elem) {
      const intervalId = setInterval(() => {
        elem.scrollTop = elem.scrollHeight;
      }, 500);
      return () => clearInterval(intervalId);
    }
  }, [isInterviewerSpeaking]);

  const handleUserSubmitRequest = async (audioData: Blob) => {
    const formData = new FormData();
    formData.append('file', audioData, 'audio.wav');
    fetchResponse(formData);
  };

  const fetchResponse = async (formData: FormData) => {
    setHint('');
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/negotiations/${interviewId}/speak`, {
        method: 'POST',
        body: formData,
      });
      const audioBlob = await response.blob()
      const audioResponseURL = URL.createObjectURL(audioBlob);
      setResponseUrl(audioResponseURL);
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
    try {
      const response = await fetch(`/api/negotiations/${interviewId}/response`, {
        method: 'GET',
      });
      const data = await response.json();
      setResponse(data.lastMessage);

      if (data.hasEnded) {
        setHasPracticeEnded(true);
        setHint('Your practice session has ended. You can see your feedback soon');
      } else {
        setHint(data.hint);
      }
    } catch (error) {
      console.error('Error getting response:', error);
    }

    setIsProcessing(false);
  };

  const showAlertIfPracticeEnded = () => {
    if (hasPracticeEnded) {
      setTimeout(() => {
        setShowPracticeEndedAlert(true);
      }, 2000);
    }
  }

  const navigateToFeedback = async () => {
    if (!hasPracticeEnded) {
      try {
        const response = await fetch(`/api/negotiations/${interviewId}/end`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Error ending practice session:', error);
      }
    }
    router.push(`/negotiations/${interviewId}/feedback`);
  }

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
                  <div className="flex flex-col items-center justify-center h-[calc(100%)]">
                    {
                      isProcessing
                        ? 'Waiting for your interviewer to reply...'
                        : <div className="flex flex-col gap-6 justify-evenly items-center h-full w-full p-8">
                          {response && <div className="flex overflow-y-auto w-full pr-4" id="interviewer-response">
                            {/* <TypographyBody>{response}</TypographyBody> */}
                            <TypeAnimation
                              sequence={[
                                response,
                              ]}
                              wrapper="span"
                              cursor={true}
                              repeat={1}
                              style={{ fontSize: '1em', display: 'inline-block', height: '180px' }}
                              speed={60}
                            />
                          </div>}
                          <audio
                            controls autoPlay={hasPracticeStarted}
                            id="interviewer-audio"
                            onPlay={() => setIsInterviewerSpeaking(true)}
                            onPause={() => setIsInterviewerSpeaking(false)}
                            onError={() => setIsInterviewerSpeaking(false)}
                            onEnded={() => showAlertIfPracticeEnded()}
                            src={responseUrl}
                            className={`fill-black ${isRecording || isUserAudioPlaying ? 'pointer-events-none opacity-50' : ''}`}
                          ></audio>
                        </div>
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
            <CardContent className="relative flex flex-col items-center justify-center h-80">
              <div className="px-2 pb-6">
                <AudioRecorder
                  isRecording={isRecording}
                  setIsRecording={setIsRecording}
                  isDisabled={isProcessing || isInterviewerSpeaking || hasPracticeEnded}
                  setIsUserAudioPlaying={setIsUserAudioPlaying}
                  hasPracticeEnded={hasPracticeEnded}
                  onSubmit={handleUserSubmitRequest} />
              </div>
              <Popover>
                <PopoverTrigger className="group" disabled={isProcessing || isInterviewerSpeaking}>
                  <TypographySubtle className="absolute right-6 bottom-0 p-2">
                    Stuck?
                    <span className="text-primary underline-offset-4 group-hover:underline ml-1" >Get Hints</span>
                  </TypographySubtle>
                </PopoverTrigger>
                <PopoverContent className="bg-glass border-none" align="center">{
                  hint
                    ? <div className="flex items-center justify-center">            
                      <TypographySmall>{hint}</TypographySmall>
                      <Image src="/images/salary-sage-mascot.png" width={70} height={120} alt="Salary sage mascot" className="hue-rotate-30 ml-2" />
                      </div>
                    : <div className="flex justify-center items-center">
                      Loading hints...
                      <div className="ml-4 animate-spin w-8 h-8 border-2 border-b-0 border-primary border-solid rounded-full"></div>
                    </div>
                }</PopoverContent>
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
      <AlertDialog>
        <AlertDialogTrigger><Button className="mt-8" variant={`${hasPracticeEnded ? "default" : "link"}`} size="lg">End Practice</Button></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{hasPracticeEnded ? 'End Practice' : 'Are you sure you want to end this practice?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {hasPracticeEnded ? 'You can now view your feedback.' : 'Ending a practice session before it is complete might result in a lower score.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={navigateToFeedback}>End Practice</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showPracticeEndedAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Your practice session has ended</AlertDialogTitle>
            <AlertDialogDescription>
              Great job! You can now view your feedback.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={navigateToFeedback}>View Feedback</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
