"use server";

import { shopInfoSchema } from "@/lib/schema/onboarding";
import { createClient } from "@/lib/supabase/server";
import { tryCatch } from "@/lib/utils";
import { ShopInfoFormData, Tables } from "@/types";

const submitShopInfo = async (shopData: ShopInfoFormData) => {
	return await tryCatch(async () => {
		shopInfoSchema.parse(shopData);

		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) throw new Error("User not found");

		const { data, error } = await supabase
			.from(Tables.Stores)
			.insert({
				name: shopData.name,
				phone: shopData.phone,
				storeId: shopData.storeId,
				ownerId: user.id,
			})
			.select("id");

		if (error) throw error;

		const branchInserts = shopData.branches.map((branch) => ({
			name: branch.name,
			location: branch.location,
			isMain: branch.isMain,
			storeId: data[0].id,
			ownerId: user.id,
		}));

		const { error: branchError } = await supabase.from(Tables.Branches).insert(branchInserts);

		if (branchError) throw branchError;

		await supabase.auth.updateUser({
			data: {
				is_onboarded: true,
				onboarding_step: 3,
			},
			email: user.email,
		});
	});
};

export default submitShopInfo;
