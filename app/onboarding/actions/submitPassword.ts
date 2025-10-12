'use server';

import { passwordSchema } from "@/lib/schema/onboarding";
import { createClient } from "@/lib/supabase/server";
import { tryCatch } from "@/lib/utils";
import { PasswordFormData } from "@/types";

const submitPassword = async (data: PasswordFormData) => {
    return await tryCatch<void>(async () => {
        passwordSchema.parse(data);

        const supabase = await createClient();
        const { error } = await supabase.auth.updateUser({
            password: data.password,
        });

        if (error) throw error;
    });
};

export default submitPassword;