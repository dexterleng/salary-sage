"use client";

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
import { useRef } from "react";
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

const formSchema = z
  .object({
    // desiredPosition: z.string(),
    yearsOfExperience: z.coerce.number().gt(-1).min(0),
    currentMonthlyIncome: z.coerce.number().int().gt(0).min(0),
    minExpectedMonthlyIncome: z.coerce.number().int().gt(0).min(0),
    maxExpectedMonthlyIncome: z.coerce.number().int().gt(0).min(0),
  })
  .refine(
    (obj) => obj.minExpectedMonthlyIncome <= obj.maxExpectedMonthlyIncome,
    { message: "Invalid income range", path: ["maxExpectedMonthlyIncome"] }
  );

export default function UpdateSettingsDialog({
  open,
  userData,
}: {
  open: boolean;
  userData: any;
}) {
  const {
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
      yearsOfExperience: yearsOfExperience,
      currentMonthlyIncome: currentMonthlyIncome,
      minExpectedMonthlyIncome: minExpectedMonthlyIncome,
      maxExpectedMonthlyIncome: maxExpectedMonthlyIncome,
    },
  });

  const formRef = useRef(null);

  function onSubmit(values: z.infer<typeof formSchema>) {
    (formRef.current as any).submit();
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="w-fill text-center">
            <TypographyH2>
              {isOnboarded ? "Update Profile" : "Let's get to know each other"}
            </TypographyH2>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Providing these details will enhance the realism of your mock
            negotiations.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(onSubmit)}
            action="/update-user/"
            method="post"
            className="space-y-4"
          >
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
                  <FormLabel>Current Monthly Income</FormLabel>
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
                Desired Monthly Income
              </FormLabel>
              <div className="pt-2 flex items-center gap-2 w-full">
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

            <Button
              type="submit"
              className="font-semibold w-full border border-emerald-400 bg-emerald-600 hover:bg-emerald-600/80"
            >
              { isOnboarded ? "Save Changes" : "Get Started" }
            </Button>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}