import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { QueryKeys, Tables } from "@/types";
import type { ITransaction } from "@/types/transaction";

export const useCustomerTransactions = (customerId: string) => {
	const supabase = createClient();

	return useQuery({
		queryKey: [QueryKeys.TransactionsList, customerId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from(Tables.Transactions)
				.select("*")
				.eq("customerId", customerId)
				.order("createdAt", { ascending: false });

			if (error) throw error;
			return data as ITransaction[];
		},
		enabled: !!customerId,
	});
};
