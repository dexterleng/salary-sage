'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TypographyBody, TypographyH1, TypographyH2, TypographyLarge, TypographySubtle } from "@/components/ui/typography";
import ScoresCircular from "@/components/feedback/scores-circular";
import MockNegotiation from "@/components/feedback/mock-nego";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion";
import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Feedback({ params }: { params: { id: string } }) {
  const clarity = 78;
  const confidence = 42;

  const positiveFeedback = [{ title: "Clarity", line: "You were very clear in your speech.", citation: "Clear speech." }];
  const negativeFeedback = [{ title: "Clarity", line: "You were not clear in your speech.", citation: "Unclear speech." }]

  const interviewId = params.id;

  return (
    <div className="px-32 py-12 justify-center flex flex-col items-center">
      <div className="flex w-full justify-between items-center">
        <TypographyH1 className="w-fit">Your Feedback</TypographyH1>
        <Link href="/dashboard"><Button className="w-fit" size="lg">Return to Dashboard</Button></Link>
      </div>
      <div className="flex py-6 gap-12 flex-wrap">
        <div className="flex flex-col gap-12">
          <Card>
            <CardHeader>
              <CardTitle>
                <TypographyH2 className="ml-2">Scores</TypographyH2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="px-12 pb-6">
                <ScoresCircular clarityScore={clarity} confidenceScore={confidence} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <TypographyH2 className="ml-2">Where you did well</TypographyH2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="pb-6 px-2">
                {positiveFeedback.map(feedback =>
                  <Accordion type="single" collapsible key={feedback.line}>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <div className="flex gap-2">
                          <CheckCircle2 className="h-6 w-6 stroke-primary" />
                          <TypographyLarge>{feedback.title}</TypographyLarge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <TypographyBody>
                          {feedback.line}
                        </TypographyBody>
                        <TypographySubtle className="italic">
                          You said: <Button variant="link" className="-ml-2">"{feedback.citation}"</Button>
                        </TypographySubtle>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <TypographyH2 className="ml-2">Where you can improve</TypographyH2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="pb-6 px-2">
                {negativeFeedback.map(feedback =>
                  <Accordion type="single" collapsible key={feedback.line}>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <div className="flex gap-2">
                          <XCircle className="h-6 w-6 stroke-destructive" />
                          <TypographyLarge>{feedback.title}</TypographyLarge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <TypographyBody>
                          {feedback.line}
                        </TypographyBody>
                        <TypographySubtle className="italic">
                          You said: <Button variant="link" className="-ml-2">"{feedback.citation}"</Button>
                        </TypographySubtle>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
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
              <MockNegotiation position="Software Engineer" company="Open Government Products" hintCount={3} interviewerStyles={["Arrogant", "Difficult"]} transcript={["Hi", "Hello"]} />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-4 mt-12">
        <Link href="/dashboard"><Button className="w-fit" size="lg">Return to Dashboard</Button></Link>
        <Link href="/dashboard"><Button className="w-fit" variant="secondary" size="lg">Practice Again</Button></Link>
      </div>
    </div>
  );
}
