import useStores from "@/hooks/store/useStores";
import { CURRENCIES, Currency, DEFAULT_CURRENCY, getCurrencyByCode } from "@/lib/currencies";

/**
 * Hook that provides currency state and formatting utilities.
 * Currency is stored in the stores table in DB (single source of truth).
 */
const useCurrency = () => {
	const { store } = useStores();

	const currency = store?.currency || DEFAULT_CURRENCY;
	const currencyInfo = getCurrencyByCode(currency);

	const formatAmount = (amount: number, decimals: number = 2): string => {
		return new Intl.NumberFormat(currencyInfo.locale, {
			style: "currency",
			currency: currencyInfo.code,
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
		}).format(amount);
	};

	const formatAmountWithSymbol = (amount: number, decimals: number = 2): string => {
		const formatted = new Intl.NumberFormat("en-US", {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
		}).format(amount);
		return `${currencyInfo.symbol} ${formatted}`;
	};

	return {
		currency,
		currencyInfo,
		formatAmount,
		formatAmountWithSymbol,
		currencyOptions: Object.values(CURRENCIES) as Currency[],
	};
};

export default useCurrency;
