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
import { useRef } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  position: z.string(),
  currentYearsOfExperience: z.number().int().min(0),
  currentSalary: z.number().int().min(0),
  expectedMinMonthlySalary: z.number().int().min(0),
  expectedMaxMonthlySalary: z.number().int().min(0),
}).refine((obj) => obj.expectedMinMonthlySalary <= obj.expectedMaxMonthlySalary, "Invalid income range");

export default function New() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const formRef = useRef(null);

  function onSubmit(values: z.infer<typeof formSchema>) {
    (formRef.current as any).submit();
  }

  return (
    <div className="flex-1 flex align-center justify-center">
      <div className="flex-1 flex flex-col w-full px-8 sm:max-w-lg justify-center gap-2">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="w-full text-center">
              <TypographyH2>Let's get started!</TypographyH2>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Form {...form}>
              <form
                ref={formRef}
                onSubmit={form.handleSubmit(onSubmit)}
                action="/auth/sign-in"
                method="post"
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desired Position</FormLabel>
                      <FormControl>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Software Engineer" defaultValue={"Software Engineer"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Software Engineer</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
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
                />
                <FormField
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
                />
                <FormItem>
                  <FormLabel>Expected Monthly Income Range</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name="expectedMinMonthlySalary"
                      render={({ field }) => (
                        <FormControl className="flex-1">
                          <Input
                            type="number"
                            min={0}
                            placeholder="Minimum"
                            {...field}
                          />
                        </FormControl>
                      )}
                    />
                    <span className="text-sm">To</span>
                    <FormField
                      control={form.control}
                      name="expectedMinMonthlySalary"
                      render={({ field }) => (
                        <FormControl className="flex-1">
                          <Input
                            type="number"
                            min={0}
                            placeholder="Maximum"
                            {...field}
                          />
                        </FormControl>
                      )}
                    />
                  </div>
                </FormItem>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="font-semibold w-full border border-emerald-400 bg-emerald-600 hover:bg-emerald-600/80">Continue</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
