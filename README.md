# Salary Sage

![Salary Sage](public/og-twitter.png)
https://salary-sage.vercel.app/

Salary Sage is an AI-powered web app that helps you practice negotiating your salary. It uses GPT-3.5 and GPT-4 to realistically mock an interviewer, provides hints if you are stuck, and gives detailed feedback on your performance.

It is built with Next.js, Supabase, and Tailwind CSS.

## Team Members
| Name | Matric Number | Github | Contributions |
| ---- | ------------- | ------ | ---- |
| Charisma Kausar | A0226593X | @ckcherry23 | Frontend + UI/UX |
| Dexter Leng | A0273293Y | @dexterleng | Fullstack |
| Sherwin | A0 | @ | Prompt Engineering + Backend |
| Quan Teng Foong | A0 | @ | Backend |


## Setup instructions

1. Create a [new Supabase project](https://database.new)
1. Run `npx create-next-app -e with-supabase` to create a Next.js app using the Supabase Starter template
1. Use `cd` to change into the app's directory
1. Run `npm install` to install dependencies
1. Rename `.env.local.example` to `.env.local` and update the values for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)
1. Run `npm run dev` to start the local development server

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Resources
* Tech Offers Repo - salary data
* shadcn/ui - basic UI components
