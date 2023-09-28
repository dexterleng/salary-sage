"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TypographyH2, TypographySubtle } from "@/components/ui/typography";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { Icons } from "@/components/icons";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  jobTitle: z.string(),
  companyName: z.string().min(0),
  jobDescription: z.string().optional(),
  difficulty: z.coerce.number(),
});

export default function NewNegotiationForm({ userData }: { userData: any }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: userData.jobTitle ?? "Software Engineer",
      difficulty: 3,
    },
  });

  const formRef = useRef(null);
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const formData = new FormData();
    for (let key in values) {
      if ((values as any)[key] === null || (values as any)[key] === undefined) {
        continue;
      }
      formData.append(key, (values as any)[key]);
    }

    const response = await fetch("/negotiations/", {
      method: "POST",
      body: formData,
    });

    if (response.redirected) {
      router.push(response.url); // navigate to the redirected URL
    } else if (!response.ok) {
      console.error("Failed to submit form:", response.statusText);
    }

    // (formRef.current as any).submit();
  }

  const [isLoading, setIsLoading] = useState(false);

  const loadingTexts = ["Hang on", "We are setting up your negotiation", "This might take a minute"];
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const [opacityClass, setOpacityClass] = useState("opacity-100");
  useEffect(() => {
    let timeout: any;
    if (isLoading) {
      const interval = setInterval(() => {
        setOpacityClass("opacity-0");
        timeout = setTimeout(() => {
          setLoadingTextIndex(
            (prevIndex) => (prevIndex + 1) % loadingTexts.length
          );
          setOpacityClass("opacity-100");
        }, 1000); // This delay matches the transition duration for fading out.
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isLoading]);

  const jobTitles = [
    { name: "AI Engineer", id: "ai engineer" },
    { name: "Applications Engineer", id: "applications engineer" },
    { name: "Back End Engineer", id: "back end engineer" },
    { name: "Business Analyst", id: "business analyst" },
    { name: "Data Analyst", id: "data analyst" },
    { name: "Data Engineer", id: "data engineer" },
    { name: "Data Scientist", id: "data scientist" },
    { name: "DevOps Engineer", id: "devops engineer" },
    { name: "Enterprise Engineer", id: "enterprise engineer" },
    { name: "Full Stack Engineer", id: "full stack engineer" },
    { name: "Infrastructure Engineer", id: "infrastructure engineer" },
    { name: "Product Manager", id: "product manager" },
    { name: "Research Engineer", id: "research engineer" },
    { name: "Research Scientist", id: "research scientist" },
    { name: "Security Engineer", id: "security engineer" },
    { name: "Software Engineer", id: "software engineer" },
    { name: "Systems Analyst", id: "systems analyst" },
    { name: "Systems Engineer", id: "systems engineer" },
    { name: "Technical Program Manager", id: "technical program manager" },
    { name: "Test Engineer", id: "test engineer" },
  ];

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        action="/negotiations/"
        method="post"
      >
        <Card className="px-2">
          <CardHeader className="space-y-1">
            <CardTitle className="w-full text-center">
              <TypographyH2>Start a mock negotiation</TypographyH2>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Job Title</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? jobTitles.find(
                                (title) => title.name === field.value
                              )?.name
                            : "Select job title"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] h-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search job title..." />
                        <CommandEmpty>No job title found.</CommandEmpty>
                        <CommandGroup className=" overflow-y-scroll">
                          {jobTitles.map((title) => (
                            <CommandItem
                              value={title.name}
                              key={title.name}
                              onSelect={() => {
                                form.setValue("jobTitle", title.name);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  title.name === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {title.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Choose the job title that is most relevant.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Meta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Paste in the job description from the job listing.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={`${field.value}`}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="3">Easy</SelectItem>
                        <SelectItem value="5">Medium</SelectItem>
                        <SelectItem value="8">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
          control={form.control}
          name="currentYearsOfExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  placeholder="3"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

            {/* <FormField
          control={form.control}
          name="currentSalary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Salary</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  placeholder="5,000"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
            {/*
            <div>
              <FormLabel
                className={cn(
                  form.formState.errors.minExpectedMonthlyIncome ||
                    form.formState.errors.maxExpectedMonthlyIncome
                    ? "text-destructive"
                    : null
                )}
              >
                Expected Monthly Salary
              </FormLabel>
              <div className="pt-2 flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="minExpectedMonthlyIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="flex-1">
                        <Input
                          type="number"
                          min={0}
                          placeholder="Minimum"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <span className="text-sm">To</span>
                <FormField
                  control={form.control}
                  name="maxExpectedMonthlyIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="flex-1">
                        <Input
                          type="number"
                          min={0}
                          placeholder="Maximum"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {form.formState.errors?.minExpectedMonthlyIncome ||
              form.formState.errors?.maxExpectedMonthlyIncome ? (
                <FormMessage className="pt-2">
                  {form.formState.errors.minExpectedMonthlyIncome?.message ??
                    form.formState.errors.maxExpectedMonthlyIncome?.message ??
                    ""}
                </FormMessage>
              ) : null}
            </div> */}
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="font-semibold w-full border border-emerald-400 bg-emerald-600 hover:bg-emerald-600/80"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex gap-1 items-center">
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                </div>
              ) : (
                "Continue"
              )}
            </Button>
          </CardFooter>
        </Card>
        <div className="mt-4 w-full flex justify-center relative">
          <p
            className={`w-full text-center text-md text-slate-600 transition-opacity duration-1000 ${opacityClass} absolute`}
          >
            {isLoading ? loadingTexts[loadingTextIndex] : ""}
          </p>
        </div>
      </form>
    </Form>
  );
}
