"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
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

const formSchema = z
  .object({
    // position: z.string(),
    companyName: z.string().min(0),
    // currentYearsOfExperience: z.coerce.number().int().min(0),
    // currentSalary: z.coerce.number().int().gt(0),
    minExpectedMonthlyIncome: z.coerce.number().int().gt(0).min(0),
    maxExpectedMonthlyIncome: z.coerce.number().int().gt(0).min(0),
  })
  .refine(
    (obj) => obj.minExpectedMonthlyIncome <= obj.maxExpectedMonthlyIncome,
    { message: "Invalid income range", path: ["maxExpectedMonthlyIncome"] }
  );

export default function NewNegotiationForm({ userData }: { userData: any }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      minExpectedMonthlyIncome: userData?.minExpectedMonthlyIncome,
      maxExpectedMonthlyIncome: userData?.maxExpectedMonthlyIncome,
    },
  });

  const formRef = useRef(null);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // (formRef.current as any).submit();
  }

  const [isLoading, setIsLoading] = useState(false);

  const loadingTexts = [
    "Hang tight",
    "We are setting up the negotiation",
    "This might take a minute",
  ];
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

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        action="/negotiations/"
        method="post"
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="w-full text-center">
              <TypographyH2>Start a mock negotiation</TypographyH2>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {/* <FormField
          control={form.control}
          name="position"
          render={({ field }) => ( */}
            <FormItem>
              <FormLabel>Desired Position</FormLabel>
              <FormControl>
                <Select>
                  <SelectTrigger>
                    <SelectValue
                      placeholder="Software Engineer"
                      defaultValue={"Software Engineer"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Software Engineer</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
            {/* )}
        /> */}
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desired Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Meta" {...field} />
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
            </div>
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
            className={`text-md text-slate-600 transition-opacity duration-1000 ${opacityClass} absolute`}
          >
            {isLoading ? loadingTexts[loadingTextIndex] : ""}
          </p>
        </div>
      </form>
    </Form>
  );
}
