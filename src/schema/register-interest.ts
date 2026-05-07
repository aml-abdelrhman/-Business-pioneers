import { z } from "zod";

export const registerInterestSchema = z.object({
  full_name: z.string().min(3, { message: "validation.name_min" }),
  phone: z.string().min(10, { message: "validation.phone_invalid" }),
  payment_method: z.enum(["cash", "supported_bank", "un_supported_bank"], {
    message: "validation.payment_method_required",
  }),
  budget: z.string().min(1, { message: "validation.budget_required" }),
  city_id: z.number({ message: "validation.city_required" }),
  property_type: z.enum(
    ["apartment", "floors", "penthouse", "townhouse", "villa"],
    {
      message: "validation.property_type_required",
    },
  ),
  connection_method: z
    .array(z.enum(["whatsapp", "call"]))
    .min(1, { message: "validation.connection_method_required" }),
});

export type RegisterInterestValues = z.infer<typeof registerInterestSchema>;
