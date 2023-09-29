"use client"

import Link from 'next/link'
import AlertDialog from '../../components/AlertBanner'

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
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
  email: z.string().email().min(1),
  password: z.string().min(6),
});

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const formRef = useRef(null);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (window && (window as any).gtag) { (window as any).gtag('event', 'login') }
    (formRef.current as any).submit();
  }

  return (
    <div className="flex-1 flex flex-col w-full p-8 sm:max-w-md justify-center gap-2">
      <AlertDialog />

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="w-full text-center"><TypographyH2>Welcome back</TypographyH2></CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form} >
            <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} action="/auth/sign-in" method="post" className="space-y-4">
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
                      <Input type='password' placeholder="•••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" size='lg'>Log In</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <CardDescription className='w-full text-center'>
            <TypographySubtle>
            Don't have an account? <Link href="/sign-up/" className='text-primary hover:underline'>Sign up</Link>
            </TypographySubtle>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  )
}
