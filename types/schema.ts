import z from "zod";
import { shopInfoSchema, userInfoSchema } from "@/lib/schema/onboarding";

export type UserInfoFormData = z.infer<typeof userInfoSchema>;
export type ShopInfoFormData = z.infer<typeof shopInfoSchema>;
