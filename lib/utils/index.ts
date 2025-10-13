import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

export * from "./cookies";

/**
 * Utility to wrap async calls in a standardized try-catch block.
 * Returns an object with either { data } or { error }.
 *
 * @template T - The type of the data expected from the async call.
 * @param {() => Promise<T>} call - The async function to execute.
 * @returns {Promise<{ data?: T; error?: string }>} - Result object.
 *
 * @example
 * const { data, error } = await tryCatch(async () => await getUserById(id));
 * if (error) { ... }
 */
export const tryCatch = async <T>(
	call: () => Promise<T>,
): Promise<{ data?: T; error?: string; success: boolean }> => {
	try {
		const data = await call();
		return { data, success: true };
	} catch (error: any) {
		if (error instanceof ZodError) {
			return { error: error.issues.map((e) => e.message).join(", "), success: false };
		}
		const errorMessage = error?.message || "Unknown error occurred";
		console.error(error);
		return { error: errorMessage, success: false };
	}
};

/**
 * Formats a number as currency with commas and decimal places.
 *
 * @param {number} amount - The number to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} - Formatted currency string
 *
 * @example
 * formatCurrency(1234.56) // "1,234.56"
 * formatCurrency(1000) // "1,000.00"
 * formatCurrency(1234.56, 0) // "1,235"
 */
export const formatCurrency = (amount: number = 0, decimals: number = 2): string => {
	return new Intl.NumberFormat("en-US", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	}).format(amount);
};
