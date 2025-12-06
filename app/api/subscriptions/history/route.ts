"use server";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { tryCatch } from "@/lib/utils";
import { Tables } from "@/types";
import type { ISubscription } from "@/types/subscription";

const getUserSubscriptionsHistory = async () => {
	return await tryCatch<ISubscription[]>(async () => {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) throw new Error("User not found");

		const { data, error } = await supabase
			.from(Tables.Subscriptions)
			.select("*")
			.eq("userId", user.id)
			.order("createdAt", { ascending: false });

		if (error) {
			throw error;
		}

		return (data as ISubscription[]) || [];
	});
};

export const GET = async () => {
	const result = await getUserSubscriptionsHistory();

	if (result.success && result.data) {
		return NextResponse.json(result.data);
	}

	return NextResponse.json(
		{ error: result.error || "Failed to fetch subscription history" },
		{ status: 500 },
	);
};
