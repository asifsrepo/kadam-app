import z from "zod";
import { editStoreSchema, shopInfoSchema, userInfoSchema } from "@/lib/schema/onboarding";

export type UserInfoFormData = z.infer<typeof userInfoSchema>;
export type ShopInfoFormData = z.infer<typeof shopInfoSchema>;

export type EditStoreFormData = z.infer<typeof editStoreSchema>;
