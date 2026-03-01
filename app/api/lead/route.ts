import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/lead-schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const json = (await request.json()) as unknown;
    const parsed = leadSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please review the form fields and try again.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const leadId = crypto.randomUUID();

    console.log("[lead-submission]", {
      leadId,
      receivedAt: new Date().toISOString(),
      payload: parsed.data,
    });

    // TODO: Integrate SendGrid transactional email notification.
    // TODO: Integrate CRM sync (HubSpot/Pipedrive) for lead tracking.

    return NextResponse.json({
      success: true,
      message: "Thanks - your request was received.",
      leadId,
    });
  } catch (error) {
    console.error("[lead-submission-error]", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unexpected server error. Please call us directly.",
      },
      { status: 500 },
    );
  }
}
