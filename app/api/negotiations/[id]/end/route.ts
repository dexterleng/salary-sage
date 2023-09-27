import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    try {
        const interviewId = params.id;
        const data = {
            hasEnded: false,
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
