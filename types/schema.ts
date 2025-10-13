import z from "zod";
import {
	editStoreSchema,
	passwordSchema,
	shopInfoSchema,
	signInSchema,
	userInfoSchema,
} from "@/lib/schema/onboarding";

export type SignInFormData = z.infer<typeof signInSchema>;

export type UserInfoFormData = z.infer<typeof userInfoSchema>;
export type ShopInfoFormData = z.infer<typeof shopInfoSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;

export type EditStoreFormData = z.infer<typeof editStoreSchema>;
