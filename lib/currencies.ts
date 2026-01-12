/**
 * Currency definitions and utilities for the app
 */

export interface Currency {
	code: string;
	name: string;
	symbol: string;
	locale: string;
}

/**
 * Supported currencies in the app
 */
export const CURRENCIES: Record<string, Currency> = {
	AED: {
		code: "AED",
		name: "UAE Dirham",
		symbol: "د.إ",
		locale: "ar-AE",
	},
	USD: {
		code: "USD",
		name: "US Dollar",
		symbol: "$",
		locale: "en-US",
	},
	EUR: {
		code: "EUR",
		name: "Euro",
		symbol: "€",
		locale: "de-DE",
	},
	GBP: {
		code: "GBP",
		name: "British Pound",
		symbol: "£",
		locale: "en-GB",
	},
	INR: {
		code: "INR",
		name: "Indian Rupee",
		symbol: "₹",
		locale: "en-IN",
	},
	SAR: {
		code: "SAR",
		name: "Saudi Riyal",
		symbol: "﷼",
		locale: "ar-SA",
	},
	QAR: {
		code: "QAR",
		name: "Qatari Riyal",
		symbol: "﷼",
		locale: "ar-QA",
	},
	KWD: {
		code: "KWD",
		name: "Kuwaiti Dinar",
		symbol: "د.ك",
		locale: "ar-KW",
	},
	OMR: {
		code: "OMR",
		name: "Omani Rial",
		symbol: "﷼",
		locale: "ar-OM",
	},
	BHD: {
		code: "BHD",
		name: "Bahraini Dinar",
		symbol: "د.ب",
		locale: "ar-BH",
	},
	PKR: {
		code: "PKR",
		name: "Pakistani Rupee",
		symbol: "₨",
		locale: "ur-PK",
	},
	BDT: {
		code: "BDT",
		name: "Bangladeshi Taka",
		symbol: "৳",
		locale: "bn-BD",
	},
	PHP: {
		code: "PHP",
		name: "Philippine Peso",
		symbol: "₱",
		locale: "en-PH",
	},
	NPR: {
		code: "NPR",
		name: "Nepalese Rupee",
		symbol: "₨",
		locale: "ne-NP",
	},
	LKR: {
		code: "LKR",
		name: "Sri Lankan Rupee",
		symbol: "₨",
		locale: "si-LK",
	},
};

export const DEFAULT_CURRENCY = "AED";

/**
 * Currency options for select dropdowns
 */
export const currencyOptions = Object.values(CURRENCIES).map((currency) => ({
	value: currency.code,
	label: `${currency.symbol} ${currency.name} (${currency.code})`,
}));

/**
 * Get currency info by code
 */
export const getCurrencyByCode = (code: string): Currency => {
	return CURRENCIES[code] || CURRENCIES[DEFAULT_CURRENCY];
};
