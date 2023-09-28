'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TypographyBody, TypographyH1, TypographyH2, TypographyLarge, TypographySubtle } from "@/components/ui/typography";
import ScoresCircular from "@/components/feedback/scores-circular";
import Transcript from "@/components/feedback/transcript";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion";
import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'

interface TranscriptLine {
  isUser: boolean;
  message: string;
  createdAt: string;
}

interface QualitativeFeedback {
  title: string,
  evaluation: string,
  citation: string,
  suggestion: string | null,
  is_positive: boolean,
  score: number,
}

interface QuantitativeFeedback {
  title: string,
  evaluation: string,
  score: number
}

type QuantitativeFeedbacks = {
  preparation: QuantitativeFeedback;
  value_proposition: QuantitativeFeedback;
  relationship_building: QuantitativeFeedback;
  assertiveness: QuantitativeFeedback;
};

export default function Feedback({ params }: { params: { id: string } }) {
  const interviewId = params.id;

  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [positiveFeedbacks, setPositiveFeedbacks] = useState<QualitativeFeedback[]>([]);
  const [negativeFeedbacks, setNegativeFeedbacks] = useState<QualitativeFeedback[]>([]);
  const [quantitativeFeedbacks, setQuantitativeFeedbacks] = useState<QuantitativeFeedbacks | null>(null);

  const [searchedCitation, setSearchedCitation] = useState<string>('');

  useEffect(() => {
    fetchResponse();
  }, [])

  const fetchResponse = async () => {
    try {
      const response = await fetch(`/api/negotiations/${interviewId}/transcript`, {
        method: 'GET',
      });
      const data = await response.json();
      setTranscript(data);
    } catch (error) {
      console.error('Error getting transcript:', error);
    }

    try {
      const response = await fetch(`/api/negotiations/${interviewId}/feedback`, {
        method: 'GET',
      });
      const data = await response.json();
      setPositiveFeedbacks(data.qualitative?.filter((feedback: QualitativeFeedback) => feedback.is_positive));
      setNegativeFeedbacks(data.qualitative?.filter((feedback: QualitativeFeedback) => !feedback.is_positive));
      setQuantitativeFeedbacks(data.quantitative);
    } catch (error) {
      console.error('Error getting transcript:', error);
    }
  };

  return (
    <div className="px-32 py-12 justify-center flex flex-col items-center">
      <div className="flex w-full justify-between items-center">
        <TypographyH1 className="w-fit">Your Feedback</TypographyH1>
        <Link href="/dashboard"><Button className="w-fit" size="lg">Return to Dashboard</Button></Link>
      </div>
      <div className="flex py-6 gap-12 flex-wrap w-full">
        <div className="flex flex-1 grow flex-col gap-12">
          <Card>
            <CardHeader>
              <CardTitle>
                <TypographyH2 className="ml-2">Scores</TypographyH2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="px-6 pb-6">
                {quantitativeFeedbacks?.assertiveness
                  ? <ScoresCircular metrics={quantitativeFeedbacks} isEvaluationShown={true} />
                  : <div>
                    <Skeleton
                      count={5}
                      circle
                      height="108px"
                      width="108px"
                      containerClassName="avatar-skeleton flex gap-4"
                      className="block flex-1"
                    />
                    <Skeleton
                      count={5}
                      containerClassName="skeleton flex gap-4"
                      className="block flex-1 pt-2 mt-2"
                    />
                  </div>
                }
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
                {positiveFeedbacks?.length > 0
                  ? positiveFeedbacks.map(feedback =>
                    <Accordion type="single" collapsible key={feedback.evaluation}>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>
                          <div className="flex gap-2">
                            <CheckCircle2 className="h-6 w-6 stroke-primary" />
                            <TypographyLarge>{feedback.title}</TypographyLarge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <TypographyBody>
                            {feedback.evaluation}
                          </TypographyBody>
                          <TypographySubtle className="mt-2">
                            <i>You said:</i>
                            <Button variant="link" className="-ml-3 text-left" onClick={() => setSearchedCitation(feedback.citation)}>
                              "{feedback.citation}"
                            </Button>
                          </TypographySubtle>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )
                  : <Skeleton
                    count={3}
                    containerClassName="skeleton flex flex-col gap-4"
                    className="block flex-1 pt-2 mt-2"
                  />
                }
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
                {negativeFeedbacks?.length > 0
                  ? negativeFeedbacks.map(feedback =>
                    <Accordion type="single" collapsible key={feedback.evaluation}>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>
                          <div className="flex gap-2">
                            <XCircle className="h-6 w-6 stroke-destructive" />
                            <TypographyLarge>{feedback.title}</TypographyLarge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <TypographyBody>
                            {feedback.evaluation}
                          </TypographyBody>
                          <TypographySubtle className="mt-2">
                            <i>You said:</i>
                            <Button variant="link" className="-ml-3 text-left" onClick={() => setSearchedCitation(feedback.citation)}>
                              "{feedback.citation}"
                            </Button>
                            <br />
                            <br />
                            <i>Suggestion:</i>
                            <br />
                            <p>"{feedback.suggestion}"</p>
                          </TypographySubtle>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )
                  : <Skeleton
                    count={3}
                    containerClassName="skeleton flex flex-col gap-4"
                    className="block flex-1 pt-2 mt-2"
                  />
                }
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>
              <TypographyH2 className="ml-2">Transcript</TypographyH2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="px-2 pb-6">
              <Transcript position="Software Engineer" company="Open Government Products" tags={["Arrogant", "Difficult"]}
                transcript={transcript} citation={searchedCitation} />
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
