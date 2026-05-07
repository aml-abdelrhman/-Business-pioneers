import { z } from "zod";

export const employmentSchema = z.object({
  full_name: z.string().min(3, { message: "validation.name_min" }),
  phone: z.string().min(10, { message: "validation.phone_invalid" }),
  experience: z.enum(["beginner", "intermidate", "expert"], {
    message: "validation.experience_required",
  }),
  cv: z
    .any()
    .refine((file) => file instanceof File, {
      message: "validation.cv_required",
    }),
});

export type EmploymentValues = z.infer<typeof employmentSchema>;
