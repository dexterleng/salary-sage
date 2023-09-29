import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { TypographyBody, TypographySmall } from "../ui/typography";
import Fuse from 'fuse.js'
import { useEffect, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'

type TranscriptProps = {
  transcript: TranscriptLine[];
  citation: string;
}

type TranscriptLine = {
  isUser: boolean;
  message: string;
  createdAt: string;
  timestamp?: string;
}

export default function Transcript({ transcript, citation }: TranscriptProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedElementRef = useRef<HTMLDivElement>(null);
  const fuse = new Fuse(transcript, { keys: ['message'], ignoreLocation: true, ignoreFieldNorm: true, threshold: 0.0, shouldSort: false });

  const [searchedLine, setSearchedLine] = useState<string>('');
  const [foundResult, setFoundResult] = useState<string>('');

  const findResults = (searchedLine: string) => {
    setFoundResult(fuse.search(searchedLine).map(result => result.item.message).slice(0, 1)[0]);
  }

  useEffect(() => {
    findResults(searchedLine);
  }, [searchedLine]);

  useEffect(() => {
    findResults(citation);
  }, [citation]);

  useEffect(() => {
    if (selectedElementRef.current && foundResult) {
      selectedElementRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [foundResult]);

  useEffect(() => {
    if (transcript.length <= 0) {
      return;
    }
    // get first createdAt
    const firstCreatedAt = new Date(transcript[0].createdAt);
    // create speaker timestamps for each line based on createdAt
    transcript.forEach((line) => {
      const createdAt = new Date(line.createdAt);
      const timeElapsed = createdAt.getTime() - firstCreatedAt.getTime();

      // convert milliseconds to minutes and seconds
      const minutes = Math.floor(timeElapsed / 60000);
      const seconds = (timeElapsed % 60000) / 1000
      const secondsString = seconds > 9 ? seconds.toFixed() : `0${seconds.toFixed()}`;
      const speaker = line.isUser ? "You" : "Interviewer";
      line.timestamp = `${minutes}:${secondsString} ${speaker}`;
    })
  }, [transcript]);

  return (
    <div>
      <div className="flex gap-2 pb-2">
        <Input placeholder="Search transcript..." onChange={(e) => setSearchedLine(e.target.value)} ref={inputRef} />
        <Button variant="outline">Search</Button>
      </div>
      <div className="flex flex-col gap-2 mt-4 overflow-y-auto max-h-screen pr-2">
        {transcript?.length > 0
          ? transcript.map((line) =>
            <div className={`p-2 rounded-md ${foundResult == line.message ? "bg-secondary/50 duration-150" : ""}`}
              key={line.message} ref={foundResult === line.message ? selectedElementRef : null}>
              <TypographyBody className="text-accent">{line.timestamp}</TypographyBody>
              <TypographySmall>{line.message}</TypographySmall>
            </div>
          )
          : <Skeleton
            count={20}
            containerClassName="skeleton flex flex-col mt-4"
            className="block flex-1"
          />}
      </div>
    </div>
  );
}
