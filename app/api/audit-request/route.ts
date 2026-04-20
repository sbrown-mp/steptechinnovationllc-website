import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface AuditRequestBody {
  name?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  industry?: string;
  primaryImprovement?: string;
  biggestBottleneck?: string;
  currentTools?: string;
}

const REQUIRED_FIELDS: Array<keyof AuditRequestBody> = [
  "name",
  "email",
  "phone",
  "industry",
  "primaryImprovement",
  "biggestBottleneck",
];

const toTrimmed = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

const sendAuditNotificationEmail = async (payload: {
  name: string;
  email: string;
  phone: string;
  business_name: string;
  industry: string;
  service_type: string;
  biggest_bottleneck: string;
  current_tools: string;
  created_date: string;
}) => {
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  if (!resendApiKey) {
    console.error("[audit-request-resend-config-error] Missing RESEND_API_KEY");
    return;
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || "Steptech Audit <onboarding@resend.dev>";

  const text = [
    "New Free System Audit Request",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
    `Business Name: ${payload.business_name || "(not provided)"}`,
    `Industry: ${payload.industry}`,
    `Primary Improvement: ${payload.service_type}`,
    `Biggest Bottleneck: ${payload.biggest_bottleneck}`,
    `Current Tools: ${payload.current_tools || "(not provided)"}`,
    `Submitted At (UTC): ${payload.created_date}`,
  ].join("\n");

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: ["sbrown@steptechinnovation.com"],
      subject: "New Free System Audit Request",
      text,
      reply_to: payload.email,
    }),
    cache: "no-store",
  });

  if (!emailResponse.ok) {
    const responseText = await emailResponse.text();
    console.error("[audit-request-resend-error]", {
      status: emailResponse.status,
      body: responseText,
    });
  }
};

export async function POST(request: Request) {
  try {
    const xanoAuditRequestUrl = process.env.XANO_AUDIT_REQUEST_URL?.trim();
    if (!xanoAuditRequestUrl) {
      console.error("[audit-request-config-error] Missing XANO_AUDIT_REQUEST_URL");

      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error.",
        },
        { status: 500 },
      );
    }

    const json = (await request.json()) as AuditRequestBody;

    const missingFields = REQUIRED_FIELDS.filter((field) => !toTrimmed(json[field]));
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required field(s): ${missingFields.join(", ")}.`,
        },
        { status: 400 },
      );
    }

    const payload = {
      name: toTrimmed(json.name),
      email: toTrimmed(json.email),
      phone: toTrimmed(json.phone),
      business_name: toTrimmed(json.businessName),
      industry: toTrimmed(json.industry),
      service_type: toTrimmed(json.primaryImprovement),
      biggest_bottleneck: toTrimmed(json.biggestBottleneck),
      current_tools: toTrimmed(json.currentTools),
      created_date: new Date().toISOString(),
    };

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (process.env.XANO_API_KEY?.trim()) {
      headers.Authorization = `Bearer ${process.env.XANO_API_KEY.trim()}`;
    }

    const xanoResponse = await fetch(xanoAuditRequestUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!xanoResponse.ok) {
      const responseText = await xanoResponse.text();
      console.error("[audit-request-xano-error]", {
        status: xanoResponse.status,
        body: responseText,
      });

      return NextResponse.json(
        {
          success: false,
          message: "Submission failed. Please try again.",
        },
        { status: 502 },
      );
    }

    await sendAuditNotificationEmail(payload);

    return NextResponse.json({
      success: true,
      message: "Request submitted successfully.",
    });
  } catch (error) {
    console.error("[audit-request-error]", error);

    return NextResponse.json(
      {
        success: false,
        message: "Submission failed. Please try again.",
      },
      { status: 502 },
    );
  }
}
