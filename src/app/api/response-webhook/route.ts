import { type NextRequest, NextResponse } from "next/server";
import { Retell } from "retell-sdk";
import { analyzeCall } from "@/actions/retell";

const apiKey = process.env.RETELL_API_KEY || "";

export async function POST(req: NextRequest) {
  if (!process.env.RETELL_API_KEY) {
    console.error("Missing required environment variable: RETELL_API_KEY");
    return NextResponse.json({ error: "Retell API key is not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const body = JSON.parse(rawBody);

  if (!Retell.verify(rawBody, apiKey, req.headers.get("x-retell-signature") as string)) {
    console.error("Invalid signature");

    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const { event, call } = body as { event: string; call: { call_id: string } };

  switch (event) {
    case "call_started":
      console.log("Call started event received", call.call_id);
      break;
    case "call_ended":
      console.log("Call ended event received", call.call_id);
      break;
    case "call_analyzed": {
      await analyzeCall(call.call_id);
      console.log("Call analyzed event received", call.call_id);
      break;
    }
    default:
      console.log("Received an unknown event:", event);
  }

  return new NextResponse(null, { status: 204 });
}
