"use client"

import Link from 'next/link'
import AlertDialog from '../../components/AlertBanner'

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from '@/components/ui/button'
import { useRef } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { TypographyH2, TypographySubtle } from '@/components/ui/typography'


const formSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().min(1),
})

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

  const formRef = useRef(null);

  function onSubmit(values: z.infer<typeof formSchema>) {
    (formRef.current as any).submit();
  }

  return (
    <div className="flex-1 flex flex-col w-full p-8 sm:max-w-md justify-center gap-2">
      <AlertDialog />

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="w-full text-center"><TypographyH2>Join the waitlist</TypographyH2></CardTitle>
          <CardDescription className="w-full text-center">
            Salary Sage is currently invite-only. Sign up for access to the early beta now!
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form} >
            <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} action="/api/waitlist/" method="post" className="space-y-4">
              <div className="pt-2 flex items-center gap-2">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl className="flex-1">
                          <Input
                            placeholder="John"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl className="flex-1">
                          <Input
                            placeholder="Smith"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder="john@example.org" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" size='lg'>Join the waitlist</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
