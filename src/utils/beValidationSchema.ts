import { z } from "zod";
import { ServiceTier } from "../../utils/constants";

export const gigSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  tier: z.nativeEnum(ServiceTier),
  price: z.number().positive(),
  keywords: z.array(z.string()).optional(),
  provider: z.object({
    name: z.string(),
    avatar: z.string().optional(),
    skills: z.array(z.string()).optional(),
    certifications: z.array(z.string()).optional(),
    userId: z.string().min(1),
  }),
  createdBy: z.string().min(1),
});
