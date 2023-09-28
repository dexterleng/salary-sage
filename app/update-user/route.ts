import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import * as pdfjs from "pdfjs-dist";
// @ts-ignore
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

import type { TextItem as PdfjsTextItem } from "pdfjs-dist/types/src/display/api";
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const supabase = createRouteHandlerClient({ cookies })
  const { data } = await supabase.auth.getUser();
  const { user } = data;
  if (!user) {
    return NextResponse.redirect(`${requestUrl.origin}/login/`, { status: 301, })
  }
  console.log("received")

  const formData = await request.formData();
  const jobTitle = formData.get('jobTitle') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const yearsOfExperience = parseInt(formData.get('yearsOfExperience') as string);
  const currentMonthlyIncome = parseInt(formData.get('currentMonthlyIncome') as string);
  const minExpectedMonthlyIncome = parseInt(formData.get('minExpectedMonthlyIncome') as string);
  const maxExpectedMonthlyIncome = parseInt(formData.get('maxExpectedMonthlyIncome') as string);

  const resumeFile: File | null = formData.get('resume') as any
  const resumeFileBuffer = await resumeFile!.arrayBuffer();
  const resumeText: string = await readPdf(resumeFileBuffer!)
  
  
  console.log({ yearsOfExperience, currentMonthlyIncome, minExpectedMonthlyIncome, maxExpectedMonthlyIncome, resumeText })

  await supabase
    .from('user')
    .update({ jobTitle: jobTitle ?? "Software Engineer", firstName, lastName, yearsOfExperience, currentMonthlyIncome, minExpectedMonthlyIncome, maxExpectedMonthlyIncome, userId: user.id, resume: resumeText })
    .eq('userId', user.id)
    .throwOnError();

  return NextResponse.redirect(`${requestUrl.origin}/dashboard/`, { status: 301 })
}

const readPdf = async (file: ArrayBuffer) => {
  const pdfFile = await pdfjs.getDocument(file).promise;
  let textItems: string[] = [];
  debugger

  for (let i = 1; i <= pdfFile.numPages; i++) {
    // Parse each page into text content
    const page = await pdfFile.getPage(i);
    const textContent = await page.getTextContent();

    // Wait for font data to be loaded
    await page.getOperatorList();
    const commonObjs = page.commonObjs;

    // Convert Pdfjs TextItem type to new TextItem type
    const pageTextItems = textContent.items.map((item) => {
      const {
        str: text,
        dir, // Remove text direction
        transform,
        fontName: pdfFontName,
        ...otherProps
      } = item as PdfjsTextItem;

      // Extract x, y position of text item from transform.
      // As a side note, origin (0, 0) is bottom left.
      // Reference: https://github.com/mozilla/pdf.js/issues/5643#issuecomment-496648719
      const x = transform[4];
      const y = transform[5];

      // Use commonObjs to convert font name to original name (e.g. "GVDLYI+Arial-BoldMT")
      // since non system font name by default is a loaded name, e.g. "g_d8_f1"
      // Reference: https://github.com/mozilla/pdf.js/pull/15659
      const fontObj = commonObjs.get(pdfFontName);
      const fontName = fontObj.name;

      // pdfjs reads a "-" as "-­‐" in the resume example. This is to revert it.
      // Note "-­‐" is "-&#x00AD;‐" with a soft hyphen in between. It is not the same as "--"
      const newText = text.replace(/-­‐/g, "-");

      return newText;
    });

    // Some pdf's text items are not in order. This is most likely a result of creating it
    // from design softwares, e.g. canvas. The commented out method can sort pageTextItems
    // by y position to put them back in order. But it is not used since it might be more
    // helpful to let users know that the pdf is not in order.
    // pageTextItems.sort((a, b) => Math.round(b.y) - Math.round(a.y));

    // Add text items of each page to total
    textItems.push(...pageTextItems);
  }
  let resumeParsed = ''
  textItems.forEach(s => {
      if (s == '') {
          resumeParsed += '\n'
      } else {
          resumeParsed += s
      }
  })
  return resumeParsed
}
