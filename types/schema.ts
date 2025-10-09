import z from "zod";
import { userInfoSchema } from "@/lib/schema/onboarding";

export type UserInfoFormData = z.infer<typeof userInfoSchema>;
