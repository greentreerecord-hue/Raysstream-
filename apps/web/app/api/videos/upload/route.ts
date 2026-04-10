import { NextRequest, NextResponse } from "next/server";
import { enqueueTranscodeJob } from "@/server/queues";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { videoId } = body;

    if (!videoId) {
      return NextResponse.json(
        { error: "Missing videoId" },
        { status: 400 }
      );
    }

    // Add job to queue
    await enqueueTranscodeJob({ videoId });

    return NextResponse.json({
      success: true,
      message: "Transcoding job queued",
    });
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}  