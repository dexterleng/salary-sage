'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TypographyH1, TypographyH2 } from "@/components/ui/typography";
import ScoresCircular from "@/components/feedback/scores-circular";
import MockNegotiation from "@/components/feedback/mock-nego";

export default function Feedback() {
  const clarity = 78;
  const confidence = 42;

  const positiveFeedback = ["You were very clear in your speech", "You were very confident in your speech"];
  const negativeFeedback = ["You were not clear in your speech", "You were not confident in your speech"];

  return (
    <div className="px-32 py-12">
      <TypographyH1>Your Feedback</TypographyH1>
      <div className="flex py-6 gap-12">
        <div className="flex flex-col gap-12">
          <Card>
            <CardHeader>
              <CardTitle>
                <TypographyH2 className="ml-2">Scores</TypographyH2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="px-6 pb-6">
                <ScoresCircular clarityScore={clarity} confidenceScore={confidence} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <TypographyH2 className="ml-2">Where you did well</TypographyH2>
              </CardTitle>
              <CardContent>
                <div className="px-6 pb-6">
                  
                </div>
              </CardContent>
            </CardHeader>
            <CardContent>
              <div className="px-6 pb-6">
                
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>
              <TypographyH2 className="ml-2">Mock Negotiation</TypographyH2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="px-2 pb-6">
              <MockNegotiation position="Software Engineer" company="Open Government Products" hintCount={3} interviewerStyles={["Arrogant", "Difficult"]} transcript={["Hi", "Hello"]}/>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}