import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { TypographyBody, TypographyH4, TypographySubtle, TypographySmall } from "../ui/typography";
import { Card, CardContent } from "../ui/card";
import { PlayIcon } from "@radix-ui/react-icons"

type MockNegotiationProps = {
  position: string;
  company: string;
  hintCount: number;
  interviewerStyles: string[];
  transcript: string[];
}

export default function MockNegotiation({ position, company, hintCount, interviewerStyles, transcript }: MockNegotiationProps) {
  return (
    <div>
      <div>
        <TypographyH4>{position}</TypographyH4>
        <TypographyBody>{company}</TypographyBody>
        <TypographySubtle>{hintCount} Hints Used</TypographySubtle>
      </div>
      <div className="flex gap-2 py-4">
        {interviewerStyles.map(style =>
          <Button variant={"secondary"} className="pointer-events-none shadow-none" key={style}>
            {style}
          </Button>
        )}
      </div>
      <div>
        <Card className="shadow-none bg-glass my-6">
          <CardContent className="flex pt-6 justify-between items-center">
            <Button variant="secondary" size="icon" className="h-12 w-12 rounded-full">
              <PlayIcon className="h-6 w-6" />
            </Button>
            <div style={{ width: 300 }}></div>
            <TypographySubtle>1:25/2:00</TypographySubtle>
          </CardContent>
        </Card>
        <div className="flex gap-2 mt-10">
          <Input placeholder="Search transcript..." />
          <Button variant="outline">Search</Button>
        </div>
        <div className="flex flex-col gap-2 mt-10">
          {transcript.map(line =>
            <div className="mb-4" key={line}>
              <TypographyBody className="text-accent">0:00 Interviewer (AI)</TypographyBody>
              <TypographySmall>{line}</TypographySmall>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
