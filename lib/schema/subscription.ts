import { z } from "zod";

export const subscriptionStatusSchema = z.enum([
	"active",
	"cancelled",
	"expired",
	"on_hold",
	"past_due",
	"trialing",
]);

export const subscriptionPlanSchema = z.enum(["basic", "pro", "enterprise"]);

export const billingPeriodSchema = z.enum(["monthly", "yearly"]);

export const subscriptionSchema = z.object({
	id: z.string().uuid(),
	userId: z.string().uuid(),
	customerId: z.string().min(1),
	subscriptionId: z.string().min(1),
	planId: subscriptionPlanSchema,
	billingPeriod: billingPeriodSchema,
	status: subscriptionStatusSchema,
	currentPeriodStart: z.coerce.date(),
	currentPeriodEnd: z.coerce.date(),
	cancelAtPeriodEnd: z.boolean().default(false),
	cancelledAt: z.coerce.date().optional(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

