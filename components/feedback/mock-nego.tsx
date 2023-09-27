import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { TypographyBody, TypographyH4, TypographySmall } from "../ui/typography";
import Fuse from 'fuse.js'
import { useEffect, useState } from "react";

type MockNegotiationProps = {
  position: string;
  company: string;
  tags: string[];
  transcript: TranscriptLine[];
}

type TranscriptLine = {
  isUser: boolean;
  message: string;
  createdAt: string;
  timestamp?: string;
}

export default function MockNegotiation({ position, company, tags, transcript }: MockNegotiationProps) {
  const [searchedLine, setSearchedLine] = useState<string>('');
  const [foundResults, setFoundResults] = useState<string>('');

  const fuse = new Fuse(transcript, { keys: ['message'], ignoreLocation: true, threshold: 0.0, shouldSort: false });

  useEffect(() => {
    setFoundResults(fuse.search(searchedLine).map(result => result.item.message).slice(0, 1)[0]);
  }, [searchedLine]);

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
        <div className="flex gap-2 mt-10">
          <Input placeholder="Search transcript..." onChange={(e) => setSearchedLine(e.target.value)} />
          <Button variant="outline">Search</Button>
        </div>
        <div className="flex flex-col gap-2 mt-10">
          {transcript.map((line, index) =>
            <div className={`p-2 rounded-md ${foundResults == line.message ? "bg-secondary/50 duration-150" : ""}`} key={line.message}>
              <TypographyBody className="text-accent">{line.timestamp}</TypographyBody>
              <TypographySmall>{line.message}</TypographySmall>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
