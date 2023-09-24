import { Button } from "../ui/button";
import { TypographyBody, TypographyH4, TypographySubtle } from "../ui/typography";

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
          <Button variant={"secondary"} className="pointer-events-none">
            {style}
          </Button>
        )}
      </div>
    </div>
  );
}