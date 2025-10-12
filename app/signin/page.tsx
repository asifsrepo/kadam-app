"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Github, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { memo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/store/useAuth";
import { signInSchema } from "@/lib/schema/onboarding";
import { createClient } from "@/lib/supabase/client";
import { SignInFormData } from "@/types";
import CustomInput from "~/form-elements/CustomInput";
import SubmitButton from "~/form-elements/SubmitButton";
import LoadingOverlay from "~/LoadingOverlay";

const SignInPage = () => {
	const [isLoading, setIsLoading] = useState<string | null>(null);
	const [isEmailSignIn, setIsEmailSignIn] = useState(false);
	const supabase = createClient();
	const { initialize } = useAuth();
	const router = useRouter();

	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<SignInFormData>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleOAuthSignIn = async (provider: "github" | "google") => {
		setIsLoading(provider);

		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider,
			});

			if (error) throw error;
			router.push("/dashboard");
		} catch (error) {
			toast.error("Sign in failed", {
				description: error instanceof Error ? error.message : "Please try again later.",
			});
		} finally {
			setIsLoading(null);
		}
	};

	const handleEmailSignIn = async (data: SignInFormData) => {
		setIsLoading("email");

		try {
			const { error } = await supabase.auth.signInWithPassword({
				email: data.email,
				password: data.password,
			});

			if (error) throw error;

			await initialize();
			toast.success("Welcome back!");
			router.push("/dashboard");
		} catch (error) {
			toast.error("Sign in failed", {
				description: error instanceof Error ? error.message : "Please check your credentials.",
			});
		} finally {
			setIsLoading(null);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-3">
			<Card className="w-full max-w-sm">
				<CardHeader className="space-y-1 pb-4 text-center">
					<CardTitle className="font-bold text-xl">Welcome Back</CardTitle>
					<CardDescription className="text-muted-foreground text-sm">
						Sign in to your account
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{!isEmailSignIn ? (
						<>
							<div className="space-y-2">
								<Button
									variant="outline"
									type="button"
									onClick={() => handleOAuthSignIn("github")}
									className="flex h-10 w-full items-center gap-2 text-sm"
									disabled={isLoading !== null}
								>
									<Github size={16} />
									Continue with GitHub
								</Button>

								<Button
									variant="outline"
									type="button"
									onClick={() => handleOAuthSignIn("google")}
									className="flex h-10 w-full items-center gap-2 text-sm"
									disabled={isLoading !== null}
								>
									<Image alt="Google" src="/assets/google.svg" width={16} height={16} />
									Continue with Google
								</Button>
							</div>

							<div className="relative">
								<Separator />
								<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 bg-background px-2 text-muted-foreground text-xs">
									or
								</div>
							</div>

							<Button
								variant="outline"
								type="button"
								onClick={() => setIsEmailSignIn(true)}
								className="flex h-10 w-full items-center gap-2 text-sm"
								disabled={isLoading !== null}
							>
								<Mail size={16} />
								Continue with Email
							</Button>
						</>
					) : (
						<form onSubmit={handleSubmit(handleEmailSignIn)} className="space-y-3">
							<CustomInput
								label="Email"
								type="email"
								placeholder="Enter your email"
								required
								error={errors.email?.message}
								{...register("email")}
							/>
							<CustomInput
								label="Password"
								type="password"
								placeholder="Enter your password"
								required
								error={errors.password?.message}
								{...register("password")}
							/>
							<div className="flex gap-2">
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsEmailSignIn(false)}
									className="h-9 flex-1 text-sm"
									disabled={isLoading !== null}
								>
									Back
								</Button>
								<SubmitButton
									isLoading={isLoading === "email"}
									className="h-9 flex-1 text-sm"
								>
									Sign In
								</SubmitButton>
							</div>
						</form>
					)}

					<div className="text-center text-muted-foreground text-xs">
						By signing in, you agree to our terms of service and privacy policy.
					</div>
				</CardContent>
			</Card>

			<LoadingOverlay isLoading={isLoading !== null} />
		</div>
	);
};

export default memo(SignInPage);
