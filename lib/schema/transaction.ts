import { z } from "zod";

export const transactionSchema = z.object({
	amount: z
		.number("Amount must be a number")
		.positive("Amount must be positive")
		.min(0.01, "Amount must be at least 0.01"),
	type: z.enum(["credit", "payment"], {
		message: "Type must be either credit or payment",
	}),
	notes: z.string().trim().optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
