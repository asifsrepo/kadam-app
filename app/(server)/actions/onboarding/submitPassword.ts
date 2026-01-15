"use server";

import { passwordSchema } from "@/lib/schema/onboarding";
import { createClient } from "@/lib/supabase/server";
import { tryCatch } from "@/lib/utils";
import { PasswordFormData } from "@/types";

const submitPassword = async (data: PasswordFormData) => {
	return await tryCatch<{ passwordAlreadySet: boolean }>(async () => {
		passwordSchema.parse(data);

		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) throw new Error("User not found");

		const { error } = await supabase.auth.updateUser({
			password: data.password,
			data: {
				is_onboarded: false,
				onboarding_step: 3,
			},
			email: user.email,
		});

		if (error) {
			if (error.code === "same_password") {
				// Password is already set, just update the onboarding step without changing password
				const { error: updateError } = await supabase.auth.updateUser({
					data: {
						is_onboarded: false,
						onboarding_step: 3,
					},
					email: user.email,
				});
				if (updateError) throw updateError;
				return { passwordAlreadySet: true };
			}
			throw error;
		}

		return { passwordAlreadySet: false };
	});
};

export default submitPassword;
