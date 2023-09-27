import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { TypographyBody, TypographyH4, TypographySmall } from "../ui/typography";
import Fuse from 'fuse.js'
import { useEffect, useState, useRef } from "react";

type TranscriptProps = {
  position: string;
  company: string;
  tags: string[];
  transcript: TranscriptLine[];
  citation: string;
}

type TranscriptLine = {
  isUser: boolean;
  message: string;
  createdAt: string;
  timestamp?: string;
}

export default function Transcript({ position, company, tags, transcript, citation }: TranscriptProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedElementRef = useRef<HTMLDivElement>(null);
  const fuse = new Fuse(transcript, { keys: ['message'], ignoreLocation: true, threshold: 0.0, shouldSort: false });

  const [searchedLine, setSearchedLine] = useState<string>('');
  const [foundResult, setFoundResult] = useState<string>('');

  const findResults = (searchedLine: string) => {
    setFoundResult(fuse.search(searchedLine).map(result => result.item.message).slice(0, 1)[0]);
  }

  useEffect(() => {
    findResults(searchedLine);
  }, [searchedLine]);

  useEffect(() => {
    if (inputRef.current != null) {
      inputRef.current.value = citation;
    }
    findResults(citation);
  }, [citation]);

  useEffect(() => {
    if (selectedElementRef.current && foundResult) {
      console.log(selectedElementRef.current);
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
      const seconds = ((timeElapsed % 60000) / 1000).toFixed(0);
      const speaker = line.isUser ? "You" : "Interviewer";
      line.timestamp = `${minutes}:${seconds} ${speaker}`;
    })
  }, [transcript]);

  return (
    <div>
      <div>
        <TypographyH4>{position}</TypographyH4>
        <TypographyBody>{company}</TypographyBody>
      </div>
      <div className="flex gap-2 py-4">
        {tags.map(style =>
          <Button variant={"secondary"} className="pointer-events-none shadow-none" key={style}>
            {style}
          </Button>
        )}
      </div>
      <div>
        <div className="flex gap-2 mt-6">
          <Input placeholder="Search transcript..." onChange={(e) => setSearchedLine(e.target.value)} ref={inputRef} />
          <Button variant="outline">Search</Button>
        </div>
        <div className="flex flex-col gap-2 mt-4 overflow-y-auto max-h-[200vh]">
          {transcript.map((line) =>
            <div className={`p-2 rounded-md ${foundResult == line.message ? "bg-secondary/50 duration-150" : ""}`}
              key={line.message} ref={foundResult === line.message ? selectedElementRef : null}>
              <TypographyBody className="text-accent">{line.timestamp}</TypographyBody>
              <TypographySmall>{line.message}</TypographySmall>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
