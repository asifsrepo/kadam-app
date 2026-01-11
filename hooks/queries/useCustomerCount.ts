import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/store/useAuth";
import { createClient } from "@/lib/supabase/client";
import { QueryKeys, Tables } from "@/types";

export const useCustomerCount = () => {
	const { user } = useAuth();
	const supabase = createClient();

	return useQuery({
		queryKey: [QueryKeys.CustomersList, "count", user?.id],
		queryFn: async () => {
			const { count, error } = await supabase
				.from(Tables.Customers)
				.select("*", { count: "exact", head: true })
				.eq("createdBy", user?.id);

			if (error) throw error;

			return count || 0;
		},
		enabled: !!user?.id,
	});
};
