'use client'

import { useSearchParams } from 'next/navigation'

import { AlertCircle } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"


export default function AlertBanner() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message= searchParams.get('message')

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (message) {
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {message}
      </AlertDescription>
    </Alert>
  }

  return <></>;
}
