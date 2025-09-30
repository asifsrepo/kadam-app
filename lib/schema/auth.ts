import { z } from "zod";

export const signupSchema = z
	.object({
		name: z.string().trim().min(2, "name is required"),
		email: z.email("Please enter a valid email address"),
		companyName: z.string().trim().min(2, "Company name is required"),
		password: z.string().trim().min(6, "Password must be at least 6 characters long"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
		terms: z.boolean().refine((val) => val === true, {
			message: "Please accept the terms of service",
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export const signinSchema = z.object({
	email: z.email("Please enter a valid email address"),
	password: z
		.string()
		.min(1, "Password is required")
		.min(6, "Password must be at least 6 characters long"),
});

export const resetPasswordSchema = z
	.object({
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export const forgotPasswordSchema = z.object({
	email: z.email("Please enter a valid email address"),
});
