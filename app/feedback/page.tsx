import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { TypographyH2 } from "@/components/ui/typography";

export default function Feedback() {
  return (
    <div className="px-32 py-12">
      <TypographyH2>Feedback</TypographyH2>
      <div className="flex py-6">
        <Card>
          <CardHeader>
            <CardTitle>Scores</CardTitle>
          </CardHeader>
          <CardContent>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}