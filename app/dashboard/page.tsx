import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRightIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TypographyH2, TypographyH3 } from "@/components/ui/typography";
import Image from "next/image";
import OverallScores from "@/components/dashboard/overall-scores";
import ScoresCircular from "@/components/feedback/scores-circular";

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

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login/");
  }

  const { data: negotiations } = await supabase
    .from("interview")
    .select()
    .eq("userId", user.id)
    .eq("hasEnded", true)
    .order("createdAt", { ascending: false })
    .throwOnError();

  const lastNegotiationId = negotiations && negotiations.length > 0 && negotiations[0]?.id;

  const { data: lastQuantitativeFeedbacks } = await supabase
    .from("quantitative_feedback")
    .select()
    .in("interviewId", negotiations?.map(n => n.id) ?? [])
    .order("interviewId", { ascending: false })
    .throwOnError();

  const preparationMetric = lastQuantitativeFeedbacks?.find(f => f.metric === "preparation")
  const valueMetric = lastQuantitativeFeedbacks?.find(f => f.metric === "value_proposition")
  const relationshipMetric = lastQuantitativeFeedbacks?.find(f => f.metric === "relationship_building")
  const assertivenessMetric = lastQuantitativeFeedbacks?.find(f => f.metric === "assertiveness")

  const quantitativeFeedbacks: QuantitativeFeedbacks = {
    preparation: {
      title: "Preparation",
      evaluation: preparationMetric?.evaluation,
      score: preparationMetric?.score
    },
    value_proposition: {
      title: "Value Proposition",
      evaluation: valueMetric?.evaluation,
      score: valueMetric?.score
    },
    relationship_building: {
      title: "Relationship Building",
      evaluation: relationshipMetric?.evaluation,
      score: relationshipMetric?.score
    },
    assertiveness: {
      title: "Assertiveness",
      evaluation: assertivenessMetric?.evaluation,
      score: assertivenessMetric?.score
    }
  }

  const last5NegotiationIds: string[] = negotiations?.slice(0, 5).map(n => n.id) ?? [];

  const { data } = await supabase
    .from('quantitative_feedback')
    .select('interviewId, score')
    .in('interviewId', last5NegotiationIds);

  // Initialize an object to store the sum and count for each interviewId
  const avgScores: Record<string, { sum: number; count: number }> = {};

  // Calculate the sum and count for each interviewId
  data?.forEach(row => {
    if (avgScores[row.interviewId]) {
      avgScores[row.interviewId].sum += row.score;
      avgScores[row.interviewId].count++;
    } else {
      avgScores[row.interviewId] = { sum: row.score, count: 1 };
    }
  });

  // Calculate the average score for each interviewId and store in an array
  const avgScoresPerInterview: number[] = [];

  for (const interviewId in avgScores) {
    const { sum, count } = avgScores[interviewId];
    const averageScore: number = sum / count;
    avgScoresPerInterview.push(averageScore);
  }

  function formatRelativeDate(date: Date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
      return "less than a minute ago";
    } else if (diffInMinutes === 1) {
      return "1 minute ago";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours === 1) {
      return "1 hour ago";
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInDays === 1) {
      return "1 day ago";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      // Return in 'dd/mm/yyyy' format if older than a week
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    }
  }

  return (
    <div className="w-full flex justify-center px-4 py-8 sm:p-12 relative">
      <div className="flex-1 space-y-4 max-w-5xl">
        <div className="flex items-center justify-between space-y-2">
          <TypographyH2>Dashboard</TypographyH2>
        </div>
        <Link
          href="/negotiations/new"
          className="flex items-center group"
        >
          <Card className="bg-glass shadow-glass col-span-2 w-full my-8 hover:shadow-lg duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-center relative h-36">
              <div className="flex justify-center items-center gap-16 px-12 pb-4">
                <Image src="/images/interview-clip-art.png" width={160} height={160} alt="Interview clip art image" />
                <div>
                  <TypographyH2 className="group-hover:text-primary underline-offset-4 group-hover:underline">
                    Practice an AI mock negotiation
                  </TypographyH2>
                  These mock sessions will help you prepare for the real thing to get the pay you deserve.
                </div>
              </div>
              <ArrowRightIcon className="absolute bottom-8 right-8" width={24} height={24} />
            </CardContent>
          </Card>
        </Link>
        <div className="flex gap-4">
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>
                <TypographyH3>Your Last Negotiation</TypographyH3>
              </CardTitle>
              {lastNegotiationId ? <Link
                href={`/negotiations/${lastNegotiationId}/feedback`}
                className="flex items-center text-muted-foreground hover:text-foreground text-sm gap-1"
              >
                <span>View more</span>
                <ArrowRightIcon />
              </Link> : <></>}
            </CardHeader>
            <CardContent className="mt-2 mx-2">
              <ScoresCircular metrics={quantitativeFeedbacks} isEvaluationShown={false} size={84} />
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>
                <TypographyH3>Overall Progress</TypographyH3>
              </CardTitle>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
            </CardHeader>
            <CardContent className="pb-0">
              <OverallScores scores={avgScoresPerInterview} />
            </CardContent>
          </Card>
        </div>
        <div className="pt-8 flex items-center justify-between space-y-2">
          <h3 className="text-2xl font-semibold tracking-tight">
            Negotiations
          </h3>
          <div className="flex items-center space-x-2">
            <Link
              href="/negotiations/new"
              className={buttonVariants({
                size: "sm",
                className:
                  "border border-emerald-400 bg-emerald-600 hover:bg-emerald-600/80",
              })}
            >
              Practice Now
            </Link>
          </div>
        </div>

        {negotiations && negotiations.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {negotiations.map((negotiation) => {
              let difficulty = "";
              let difficultyColor = "";
              if (negotiation.difficulty <= 3) {
                difficulty = "Easy";
                difficultyColor = "emerald";
              } else if (negotiation.difficulty <= 5) {
                difficulty = "Medium";
                difficultyColor = "orange";
              } else {
                difficulty = "Hard";
                difficultyColor = "red";
              }

              return (
                <Card
                  key={negotiation.id}
                  className="group cursor-pointer flex flex-row justify-between hover:bg-slate-50"
                >
                  <div>
                    <CardHeader className="space-y-0 px-6 pt-6 pb-2">
                      <div className="space-y-1">
                        <CardTitle className="text-lg group-hover:underline">
                          {negotiation.job_title}
                        </CardTitle>
                        <CardDescription>
                          {negotiation.companyName}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`flex space-x-1 text-xs text-${difficultyColor}-700`}
                      >
                        <div
                          className={`px-2 py-0.5 bg-${difficultyColor}-50 border-${difficultyColor}-400 border rounded-md`}
                        >
                          {difficulty}
                        </div>
                      </div>
                      <div className="pt-4 text-xs text-muted-foreground">
                        {/* {formatRelativeDate(new Date(negotiation.createdAt))} */}
                        {formatRelativeDate(new Date())}
                      </div>
                    </CardContent>
                  </div>
                  <div className="p-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                        >
                          <DotsHorizontalIcon className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem>Practice again</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div>
            <Card className="p-20 w-full flex flex-col items-center">
              <p className="text-center text-muted">
                You haven't completed any practices yet
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
