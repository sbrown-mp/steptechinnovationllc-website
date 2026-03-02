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
