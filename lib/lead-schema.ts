import { z } from "zod";

export const leadBaseSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.email("Please enter a valid email address."),
  phone: z
    .string()
    .min(7, "Please enter a valid phone number.")
    .max(25, "Phone number is too long."),
  businessName: z.string().min(2, "Please enter your business name."),
  industry: z.string().min(2, "Please select your industry."),
  primaryImprovement: z.string().min(2, "Please select what you are primarily looking to improve.").optional(),
  biggestBottleneck: z
    .string()
    .min(12, "Please share your biggest operational bottleneck."),
  currentTools: z.string().max(500, "Please keep this under 500 characters.").optional(),
});

export const leadSchema = leadBaseSchema.extend({
  sourcePage: z.string().min(1),
  inquiryType: z.enum(["audit", "contact"]),
});

export type LeadPayload = z.infer<typeof leadSchema>;
export type LeadFormValues = z.infer<typeof leadBaseSchema>;
