import z from "zod";

export const userInfoSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	phone: z.string().min(10, "Please enter a valid phone number"),
	address: z.string().optional(),
});

export const branchSchema = z.object({
	name: z.string().min(2, "Branch name must be at least 2 characters"),
	location: z.string().min(5, "Please enter a valid location"),
	isMain: z.boolean().optional(),
	debtLimit: z
		.number("Debt limit must be a number")
		.positive("Debt limit must be positive")
		.min(0, "Debt limit must be at least 0"),
});

export const shopInfoSchema = z.object({
	name: z.string().min(2, "Shop name must be at least 2 characters"),
	phone: z.string().min(10, "Please enter a valid phone number").optional(),
	branches: z.array(branchSchema).min(1, "At least one branch is required"),
});

export const editStoreSchema = z.object({
	name: z.string().min(2, "Store name must be at least 2 characters"),
	phone: z.string().min(10, "Please enter a valid phone number"),
});

export const passwordSchema = z
	.object({
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string().min(6, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export const signInSchema = z.object({
	email: z.email("Please enter a valid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});
