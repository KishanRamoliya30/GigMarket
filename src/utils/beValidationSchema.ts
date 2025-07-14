import { z } from "zod";
import { ServiceTier } from "../../utils/constants";

export const createGigSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(3, { message: "Title must be at least 3 characters long" }),

  description: z
    .string({
      required_error: "Description is required",
    })
    .min(10, { message: "Description must be at least 10 characters long" }),

  tier: z.nativeEnum(ServiceTier, {
    required_error: "Tier is required and must be one of Basic, Advanced, or Expert",
  }),

  time: z
    .number({
      required_error: "Time is required",
      invalid_type_error: "Time must be a number",
    })
    .positive({ message: "Time must be a positive number" }),

  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive({ message: "Price must be a positive number" }),

  keywords: z.array(z.string(), {
    invalid_type_error: "Keywords must be an array of strings",
  }).optional(),

  releventSkills: z.array(z.string(), {
    invalid_type_error: "Skills must be an array of strings",
  }).optional(),

  // certifications: z.array(z.string(), {
  //   invalid_type_error: "Certifications must be an array of strings",
  // }).optional(),

  createdByRole: z.enum(["User", "Provider"], {
    errorMap: () => ({ message: "createdByRole must be either 'User' or 'Provider'" }),
  }),

  createdBy: z
    .string({
      required_error: "User ID is required",
    })
    .min(1, { message: "User ID must not be empty" })
    .optional(),
});
