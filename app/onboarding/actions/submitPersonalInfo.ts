"use server";

import { userInfoSchema } from "@/lib/schema/onboarding";
import { createClient } from "@/lib/supabase/server";
import { tryCatch } from "@/lib/utils";
import { Tables, UserInfoFormData } from "@/types";

export const submitPersonalInfo = async (data: UserInfoFormData) => {
    return await tryCatch(async () => {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not found");

        userInfoSchema.parse(data);

        const { error } = await supabase.from(Tables.UserProfiles).upsert({
            id: user.id,
            name: data.name,
            phone: data.phone,
            email: user.email,
            address: data.address,
        });


        if (error) throw error;

        await supabase.auth.updateUser({
            data: {
                is_onboarded: false,
                onboarding_step: 2
            }
        });

        return;
    });
};