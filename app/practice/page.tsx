'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TypographyBody, TypographyH1, TypographySubtle } from "@/components/ui/typography";
import Link from "next/link";
import { BotIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import AudioRecorder from "@/components/practice/audio-recorder";
import { useState } from "react";

export default function Practice() {
  return (
    <div className="p-12 justify-center flex flex-col items-center">
      <div className="max-w-7xl w-full">
        <div className="flex w-full justify-start items-center">
          <Link href="/dashboard"></Link>
          <TypographyH1 className="w-fit">Practice</TypographyH1>
        </div>
        <div className="flex py-6 gap-12 flex-wrap w-full">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center">
                  <div className="rounded-full w-12 h-12 bg-secondary flex items-center justify-center">
                    <BotIcon className="w-6 h-6 stroke-accent" />
                  </div>
                  <div>
                    <TypographyBody className="ml-4 text-accent">Interviewer</TypographyBody>
                    <TypographyBody className="ml-4">Good morning Charisma! I’m from the HR in Meta.</TypographyBody>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="px-2 pb-6">
                <Card className="bg-secondary w-full h-72" />
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center">
                  <div className="rounded-full w-12 h-12 bg-glass flex items-center justify-center">
                    <User className="w-6 h-6 stroke-accent" />
                  </div>
                  <div>
                    <TypographyBody className="ml-4 text-accent">You</TypographyBody>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative flex flex-col items-center justify-center h-[calc(50vh-80px)]">
              <div className="px-2 pb-6">
                <AudioRecorder />
              </div>
              <TypographySubtle className="absolute right-4 bottom-4">
                Stuck? <Button variant="link" className="text-primary hover:underline -ml-4">Get Hints</Button>
              </TypographySubtle>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
