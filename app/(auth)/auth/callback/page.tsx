"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/store/useAuth";
import { createClient } from "@/lib/supabase/client";
import LoadingOverlay from "~/LoadingOverlay";

const AuthCallbackPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();
    const { initialize } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();
                
                if (error) {
                    toast.error("Authentication failed", {
                        description: error.message,
                    });
                    router.push("/auth");
                    return;
                }

                if (data.session) {
                    await initialize();
                    toast.success("Successfully signed in!");
                    router.push("/");
                } else {
                    toast.error("No session found");
                    router.push("/auth");
                }
            } catch (error) {
                console.error("Auth callback error:", error);
                toast.error("Authentication failed", {
                    description: "Please try again.",
                });
                router.push("/auth");
            } finally {
                setIsLoading(false);
            }
        };

        handleAuthCallback();
    }, [supabase, initialize, router]);

    return <LoadingOverlay isLoading={isLoading} />;
};

export default AuthCallbackPage;
