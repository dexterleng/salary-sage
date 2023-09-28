import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { TypographyBody, TypographySmall } from '../ui/typography';
import { useEffect, useState } from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Info } from "lucide-react";


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
  overall?: QuantitativeFeedback;
};

type ScoresCircularProps = {
  metrics: QuantitativeFeedbacks | null;
  isEvaluationShown: boolean;
};

export default function ScoresCircular({ metrics, isEvaluationShown }: ScoresCircularProps) {
  if (!metrics) return <></>;
  const overallScore = (metrics?.preparation?.score + metrics?.value_proposition?.score + metrics?.relationship_building?.score + metrics?.assertiveness?.score) / 4;

  const [flatMetrics, setFlatMetrics] = useState<QuantitativeFeedback[]>([]);

  useEffect(() => {
    if (metrics) {
      let newMetrics = Object.values(metrics);
      newMetrics.push({ title: "Overall", evaluation: "", score: overallScore });
      setFlatMetrics(newMetrics);
    }
  }, [metrics])

  return (
    <div className={`flex gap-8`}>
      {flatMetrics?.map(
        (flatMetric) =>
        (
          <div key={flatMetric.title} className='flex flex-col items-center'>
            <div style={{ width: 108, height: 108 }}>
              <CircularProgressbar
                value={flatMetric.score}
                text={`${flatMetric.score}%`}
                styles={buildStyles({
                  rotation: 0,
                  strokeLinecap: 'round',
                  textSize: '16px',
                  pathTransitionDuration: 0.5,
                  pathColor: getPathColor(flatMetric.score),
                  textColor: '#06110D',
                  trailColor: '#F1F8F6',
                  backgroundColor: '#F1F8F6',
                })
                }
                background={true}
              />
            </div>
            <TypographyBody className="mt-2 text-center h-full flex items-center">
              {flatMetric.title}
              {isEvaluationShown && flatMetric.evaluation &&
                <HoverCard openDelay={100} closeDelay={100}>
                  <HoverCardTrigger><Info className="inline ml-1 hover:stroke-primary" size={14} /></HoverCardTrigger>
                  <HoverCardContent>
                    <TypographySmall className="text-center">
                      {flatMetric.evaluation}
                    </TypographySmall>
                  </HoverCardContent>
                </HoverCard>
              }
            </TypographyBody>
          </div>
        )
      )}
    </div>
  );
}

function getPathColor(score: number) {
  if (score < 50) {
    return '#C70039';
  } else if (score < 75) {
    return '#FFA135';
  } else {
    return '#007F5F';
  }
}