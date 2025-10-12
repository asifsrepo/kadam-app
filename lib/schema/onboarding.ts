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
});

export const shopInfoSchema = z.object({
	name: z.string().min(2, "Shop name must be at least 2 characters"),
	phone: z.string().min(10, "Please enter a valid phone number").optional(),
	storeId: z
		.string()
		.min(4, "Store Id must be at least 4 characters")
		.regex(
			/^[a-zA-Z0-9_]+$/,
			"Store Id can only contain letters, numbers, and underscores",
		),
	branches: z.array(branchSchema).min(1, "At least one branch is required"),
});
