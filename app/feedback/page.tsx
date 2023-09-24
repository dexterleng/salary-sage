'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TypographyBody, TypographyH1, TypographyH2, TypographyLarge } from "@/components/ui/typography";
import ScoresCircular from "@/components/feedback/scores-circular";
import MockNegotiation from "@/components/feedback/mock-nego";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";

export default function Feedback() {
  const clarity = 78;
  const confidence = 42;

  const positiveFeedback = ["You were very clear in your speech", "You were very confident in your speech"];
  const negativeFeedback = ["You were not clear in your speech", "You were not confident in your speech"];

  return (
    <div className="px-32 py-12 justify-center flex flex-col items-center">
      <TypographyH1 className="w-full">Your Feedback</TypographyH1>
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
                {positiveFeedback.map(line =>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <div className="flex gap-2">
                          <CheckCircledIcon className="h-6 w-6 stroke-primary" />
                          <TypographyLarge>Title</TypographyLarge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <TypographyBody>
                          {line}
                        </TypographyBody>
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
                {negativeFeedback.map(line =>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <div className="flex gap-2">
                          <CrossCircledIcon className="h-6 w-6 stroke-destructive" />
                          <TypographyLarge>Title</TypographyLarge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <TypographyBody>
                          {line}
                        </TypographyBody>
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
    </div>
  );
}