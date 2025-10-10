"use client";

import { Github } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { memo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/store/useAuth";
import { createClient } from "@/lib/supabase/client";
import LoadingOverlay from "~/LoadingOverlay";

const SignInPage = () => {
	const [isLoading, setIsLoading] = useState<string | null>(null);
	const supabase = createClient();
	const { initialize } = useAuth();
	const router = useRouter();

	const handleOAuthSignIn = async (provider: "github" | "google") => {
		setIsLoading(provider);

		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider,
			});

			if (error) throw error;

			await initialize();

			toast.success(`Redirecting to ${provider}...`);
			router.push("/dashboard");
		} catch (error) {
			toast.error("Sign in failed", {
				description: error instanceof Error ? error.message : "Please try again later.",
			});
		} finally {
			setIsLoading(null);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-2 text-center">
					<CardTitle className="font-bold text-2xl">Welcome Back</CardTitle>
					<CardDescription className="text-muted-foreground">
						Sign in to your account to continue
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-3">
						<Button
							variant="outline"
							type="button"
							onClick={() => handleOAuthSignIn("github")}
							className="flex h-11 w-full items-center gap-3"
							disabled={isLoading !== null}
						>
							<Github size={18} />
							Continue with GitHub
						</Button>

						<Button
							variant="outline"
							type="button"
							onClick={() => handleOAuthSignIn("google")}
							className="flex h-11 w-full items-center gap-3"
							disabled={isLoading !== null}
						>
							<Image alt="Google" src="/assets/google.svg" width={18} height={18} />
							Continue with Google
						</Button>
					</div>

					<div className="text-center text-muted-foreground text-sm">
						By signing in, you agree to our terms of service and privacy policy.
					</div>
				</CardContent>
			</Card>

			<LoadingOverlay isLoading={isLoading !== null} />
		</div>
	);
};

export default memo(SignInPage);
