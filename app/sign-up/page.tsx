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
  password: z.string().min(6),
  inviteCode: z.string(),
})

export default function SignUp() {
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
          <CardTitle className="w-full text-center"><TypographyH2>Create an account</TypographyH2></CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form} >
            <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} action="/auth/sign-up" method="post" className="space-y-4">
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder="•••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inviteCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invite Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Salary Sage is currently invite-only. You can join the waitlist <Link href="/waitlist" className='text-primary hover:underline'>here</Link>.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" size='lg'>Sign Up</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <CardDescription className='w-full text-center'>
            <TypographySubtle>
            Already have an account? <Link href="/login/" className='text-primary hover:underline'>Log in</Link>
            </TypographySubtle>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  )
}
