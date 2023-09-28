"use client";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button, buttonVariants } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRef, useState } from "react";
import { TypographyH2 } from "@/components/ui/typography";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/icons";

const formSchema = z
  .object({
    jobTitle: z.string().min(1),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    yearsOfExperience: z.coerce.number().gt(-1).min(0),
    currentMonthlyIncome: z.coerce.number().gt(-1).min(0),
    minExpectedMonthlyIncome: z.coerce.number().int().gt(0).min(0),
    maxExpectedMonthlyIncome: z.coerce.number().int().gt(0).min(0),
    resume: z.any().refine((obj) => {
      if (!obj) {
        return true;
      } else {
        return obj?.type === "application/pdf";
      }
    }, "Only PDF resumes are supported."),
  })
  .refine(
    (obj) => obj.minExpectedMonthlyIncome <= obj.maxExpectedMonthlyIncome,
    { message: "Invalid income range", path: ["maxExpectedMonthlyIncome"] }
  );

export default function UpdateSettingsDialog({
  open,
  setIsOpen,
  userData,
}: {
  open: boolean;
  setIsOpen: (v: boolean) => void,
  userData: any;
}) {
  const {
    jobTitle,
    firstName,
    lastName,
    yearsOfExperience,
    currentMonthlyIncome,
    minExpectedMonthlyIncome,
    maxExpectedMonthlyIncome,
  } = userData || {};

  const isOnboarded =
    yearsOfExperience !== null &&
    currentMonthlyIncome !== null &&
    minExpectedMonthlyIncome !== null &&
    maxExpectedMonthlyIncome !== null;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: jobTitle ?? "Software Engineer",
      firstName: firstName,
      lastName: lastName,
      yearsOfExperience: yearsOfExperience,
      currentMonthlyIncome: currentMonthlyIncome,
      minExpectedMonthlyIncome: minExpectedMonthlyIncome,
      maxExpectedMonthlyIncome: maxExpectedMonthlyIncome,
    },
  });

  const formRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const formData = new FormData();
    for (let key in values) {
      if ((values as any)[key] === null || (values as any)[key] === undefined) {
        continue;
      }
      formData.append(key, (values as any)[key]);
    }

    const response = await fetch("/update-user/", {
      method: "POST",
      body: formData,
    });

    if (response.redirected) {
      window.location.href = "/dashboard/";
      console.log("Done");
    } else if (!response.ok) {
      console.error("Failed to submit form:", response.statusText);
    }
  }

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
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-sm sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="w-fill text-center">
            <TypographyH2>
              {isOnboarded ? "Update Profile" : "Let's get to know each other"}
            </TypographyH2>
          </AlertDialogTitle>
          {!isOnboarded ? (
            <AlertDialogDescription>
              Providing these details will enhance the realism of your mock
              negotiations.
            </AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(onSubmit)}
            action="/update-user/"
            method="post"
            className="space-y-4"
          >
            <div className="pt-2 flex justify-between items-center gap-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Smith" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desired Position</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a job title..." />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent className="h-[300px] overflow-y-scroll">
                        {jobTitles.map((jobTitle) => (
                          <SelectItem key={jobTitle.name} value={jobTitle.name}>
                            {jobTitle.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} placeholder="3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentMonthlyIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Monthly Salary</FormLabel>
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

            <div>
              <FormLabel
                className={cn(
                  form.formState.errors.minExpectedMonthlyIncome ||
                    form.formState.errors.maxExpectedMonthlyIncome
                    ? "text-destructive"
                    : null
                )}
              >
                Desired Monthly Salary
              </FormLabel>
              <div className="pt-2 flex justify-between items-center gap-2 w-full">
                <FormField
                  control={form.control}
                  name="minExpectedMonthlyIncome"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
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
                    <FormItem className="flex-1">
                      <FormControl>
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

              <FormField
                control={form.control}
                name="resume"
                render={({ field }) => (
                  <FormItem className="pt-4">
                    <FormLabel>Resume (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="pdf/*"
                        {...field}
                        value={field.value?.fileName}
                        onChange={(e) => {
                          console.log(e.target.files);
                          field.onChange(e.target.files![0]);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              {isOnboarded ? (
                <Button
                  variant="outline"
                  className="font-semibold"
                  disabled={isLoading}
                  type="reset"
                  onClick={() => {
                    window.location.href = window.location.href;
                  }}
                >
                  Cancel
                </Button>
              ) : null}

              <Button
                type="submit"
                className="font-semibold border border-emerald-400 bg-emerald-600 hover:bg-emerald-600/80 min-w-[120px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex gap-1 items-center">
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  </div>
                ) : isOnboarded ? (
                  "Save Changes"
                ) : (
                  "Get Started"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
