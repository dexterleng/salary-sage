import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { TypographyBody } from '../ui/typography';

type ScoresCircularProps = {
  clarityScore: number;
  confidenceScore: number;
};

export default function ScoresCircular({ clarityScore, confidenceScore }: ScoresCircularProps) {
  const overallScore = Math.round((clarityScore + confidenceScore) / 2);
  return (
    <div className="flex gap-12">
      <div>
        <div style={{ width: 126, height: 126 }}>
          <CircularProgressbar
            value={clarityScore}
            text={`${clarityScore}%`}
            styles={buildStyles({
              rotation: 0,
              strokeLinecap: 'round',
              textSize: '16px',
              pathTransitionDuration: 0.5,
              pathColor: '#007F5F',
              textColor: '#06110D',
              trailColor: '#F1F8F6',
              backgroundColor: '#F1F8F6',
            })
            }
            background={true}
          />
        </div>
        <TypographyBody className="mt-2 text-center">
          Clarity
        </TypographyBody>
      </div>
      <div>
        <div style={{ width: 126, height: 126 }}>
          <CircularProgressbar
            value={confidenceScore}
            text={`${confidenceScore}%`}
            styles={buildStyles({
              rotation: 0,
              strokeLinecap: 'round',
              textSize: '16px',
              pathTransitionDuration: 0.5,
              pathColor: '#007F5F',
              textColor: '#06110D',
              trailColor: '#F1F8F6',
              backgroundColor: '#F1F8F6',
            })
            }
            background={true}
          />
        </div>
        <TypographyBody className="mt-2 text-center">
          Confidence
        </TypographyBody>
      </div>
      <div>
        <div style={{ width: 126, height: 126 }}>
          <CircularProgressbar
            value={overallScore}
            text={`${overallScore}%`}
            styles={buildStyles({
              rotation: 0,
              strokeLinecap: 'round',
              textSize: '16px',
              pathTransitionDuration: 0.5,
              pathColor: '#007F5F',
              textColor: '#06110D',
              trailColor: '#F1F8F6',
              backgroundColor: '#F1F8F6',
            })
            }
            background={true}
          />
        </div>
        <TypographyBody className="mt-2 text-center">
          Overall
        </TypographyBody>
      </div>
    </div>
  );
}