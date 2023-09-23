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
import { Icons } from "@/components/icons"
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  inviteCode: z.string(),
})

export default function SignUp() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      inviteCode: "",
    },
  })

  const formRef = useRef(null);

  function onSubmit(values: z.infer<typeof formSchema>) {
    (formRef.current as any).submit();
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Back
      </Link>

      <AlertDialog />

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl w-full text-center">Get started</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form} >
            <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} action="/auth/sign-up" method="post" className="space-y-4">
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
                      <Input type='password' placeholder="••••••••••••••••" {...field} />
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
                      Salary Sage is currently invite-only. You can join the waitlist <Link href="/#waitlist" className='text-emerald-500 hover:underline'>here</Link>.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" size='lg'>Create Account</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <CardDescription className='w-full text-center font-light'>
            Already have an account? <Link href="/login/" className='text-emerald-500 hover:underline'>Log in</Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  )
}
