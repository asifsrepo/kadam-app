import { z } from "zod";

export const customerSchema = z.object({
	name: z.string().trim().min(2, "Name is required (minimum 2 characters)"),
	email: z.email("Please enter a valid email address"),
	phone: z.string().trim().min(10, "Phone number is required (minimum 10 digits)"),
	address: z.string().trim().min(5, "Address is required (minimum 5 characters)"),
	idNumber: z.string().trim().min(5, "ID number is required (minimum 5 characters)"),
	status: z.enum(["active", "inactive"], {
		message: "Status must be either active or inactive",
	}),
	limit: z
		.number("Credit limit must be a number")
		.positive("Credit limit must be positive")
		.min(0, "Credit limit must be at least 0"),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
