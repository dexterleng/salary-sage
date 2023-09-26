import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    try {
        const interviewId = params.id;
        const data = {
            interviewId: interviewId,
            hint: "This is a hint",
            hasEnded: false,
            lastMessage: "This is the last message",
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error }, { status: 500 });
    }
}