"use server";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { tryCatch } from "@/lib/utils";
import { Tables } from "@/types";
import type { ISubscription } from "@/types/subscription";

const getUserSubscription = async () => {
	return await tryCatch<ISubscription | null>(async () => {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) throw new Error("User not found");

		const { data, error } = await supabase
			.from(Tables.Subscriptions)
			.select("*")
			.eq("userId", user.id)
			.order("createdAt", { ascending: false })
			.limit(1)
			.single();

		if (error) {
			if (error.code === "PGRST116") {
				return null;
			}
			throw error;
		}

		return data as ISubscription; 
	});
};

export const GET = async () => {
	const result = await getUserSubscription();

	// MOCK: Temporarily return expired subscription for testing
	if (result.success && result.data) {
		const mockExpiredSubscription: ISubscription = {
			...result.data,
			status: "expired",
		};
		return NextResponse.json(mockExpiredSubscription);
	}

	if (result.success && !result.data) {
		return NextResponse.json({ error: "No subscription found" }, { status: 404 });
	}

	return NextResponse.json(
		{ error: result.error || "Failed to fetch subscription" },
		{ status: 500 },
	);
};
