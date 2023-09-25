"use client";

import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  ArrowRightIcon,
  ArrowTopRightIcon,
  BackpackIcon,
  CalendarIcon,
  ChevronDownIcon,
  CircleIcon,
  DotsHorizontalIcon,
  DotsVerticalIcon,
  PieChartIcon,
  StarIcon,
} from "@radix-ui/react-icons";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function Dashboard() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("success");
  }

  return (
    <div className="w-full flex justify-center px-4 py-8 sm:p-12">
      <div className="flex-1 space-y-4 max-w-5xl">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                Your last negotiation
              </CardTitle>
              <Link href="/feedback" className="flex items-center text-muted-foreground hover:text-foreground text-sm gap-1">
                <span>View more</span>
                <ArrowRightIcon />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {
                  ["Clarity", "Confidence", "Overall"].map((i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-base">{i}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">30%</span>
                        <Progress value={30} />
                      </div>
                    </div>
                  ))
                }
              </div>

            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
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
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">
                +201 since last hour
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="pt-8 flex items-center justify-between space-y-2">
          <h3 className="text-2xl font-semibold tracking-tight">
            Recent negotiations
          </h3>
          <div className="flex items-center space-x-2">
            <Link href="/negotiations/new" className={buttonVariants({ size: "sm", className: "border border-emerald-400 bg-emerald-600 hover:bg-emerald-600/80" })} >Practice Now</Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {
            [1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="group cursor-pointer flex flex-row justify-between hover:bg-slate-50/50">
                <div>
                  <CardHeader className="space-y-0 px-6 pt-6 pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-lg group-hover:underline">Software Engineer</CardTitle>
                      <CardDescription>Open Government Products</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-1 text-xs text-emerald-700">
                      <div className="px-2 py-0.5 bg-emerald-50 border-emerald-400 border rounded-md">
                        Arrogant
                      </div>
                      <div className="px-2 py-0.5 bg-emerald-50 border-emerald-400 border rounded-md">
                        Difficult
                      </div>
                    </div>
                    <div className="pt-4 text-xs text-muted-foreground">
                      3 days ago
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
            ))
          }
        </div>

        <Link href="/" className="pt-2 flex items-center gap-1 text-sm text-emerald-500 hover:text-emerald-600">
          See all negotiations
          <ArrowTopRightIcon />
        </Link>

        {/* <Card className="w-full sm:max-w-md pt-2">
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              action="/auth/sign-in"
              method="post"
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.org" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" size="lg">
                Log In
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <CardDescription className="w-full text-center font-light">
            Don't have an account?{" "}
            <Link href="/sign-up/" className="text-emerald-500 hover:underline">
              Sign up
            </Link>
          </CardDescription>
        </CardFooter>
      </Card> */}
      </div>
    </div>
  );
}
