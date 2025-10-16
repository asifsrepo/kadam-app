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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/store/useAuth";
import { signInSchema } from "@/lib/schema/onboarding";
import { createClient } from "@/lib/supabase/client";
import { SignInFormData } from "@/types";
import CustomInput from "~/form-elements/CustomInput";
import SubmitButton from "~/form-elements/SubmitButton";
import LoadingOverlay from "~/LoadingOverlay";

const AuthPage = () => {
	const [isLoading, setIsLoading] = useState<string | null>(null);
	const [isEmailSignIn, setIsEmailSignIn] = useState(false);
	const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
	const supabase = createClient();
	const { initialize } = useAuth();
	const router = useRouter();

	const {
		handleSubmit,
		register,
		formState: { errors },
		reset,
	} = useForm<SignInFormData>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleTabChange = (value: string) => {
		setActiveTab(value as "signin" | "signup");
		setIsEmailSignIn(false);
		reset();
	};

	const handleOAuthSignIn = async (provider: "github" | "google") => {
		setIsLoading(provider);

		try {
			const redirectUrl = `${window.location.origin}/auth/callback`;
			
			const { error } = await supabase.auth.signInWithOAuth({
				provider,
				options: {
					redirectTo: redirectUrl,
				},
			});

			if (error) throw error;
			
			// OAuth will handle the redirect automatically
		} catch (error) {
			toast.error(activeTab === "signin" ? "Sign in failed" : "Sign up failed", {
				description: error instanceof Error ? error.message : "Please try again later.",
			});
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
				description:
					error instanceof Error ? error.message : "Please check your credentials.",
			});
		} finally {
			setIsLoading(null);
		}
	};

	const renderSignInContent = () => (
		<>
			{!isEmailSignIn ? (
				<>
					<div className="space-y-2.5">
						<Button
							variant="outline"
							type="button"
							onClick={() => handleOAuthSignIn("github")}
							className="flex h-10 w-full items-center justify-center gap-2 font-medium text-sm"
							disabled={isLoading !== null}
						>
							<Github size={18} />
							Continue with GitHub
						</Button>

						<Button
							variant="outline"
							type="button"
							onClick={() => handleOAuthSignIn("google")}
							className="flex h-10 w-full items-center justify-center gap-2 font-medium text-sm"
							disabled={isLoading !== null}
						>
							<Image alt="Google" src="/assets/google.svg" width={18} height={18} />
							Continue with Google
						</Button>
					</div>

					<div className="relative my-4">
						<Separator />
						<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 bg-background px-2 text-muted-foreground text-xs">
							or
						</div>
					</div>

					<Button
						variant="outline"
						type="button"
						onClick={() => setIsEmailSignIn(true)}
						className="flex h-10 w-full items-center justify-center gap-2 font-medium text-sm"
						disabled={isLoading !== null}
					>
						<Mail size={18} />
						Sign in with Email
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
					<div className="flex gap-2 pt-1">
						<Button
							type="button"
							variant="outline"
							onClick={() => setIsEmailSignIn(false)}
							className="h-10 flex-1 font-medium text-sm"
							disabled={isLoading !== null}
						>
							Back
						</Button>
						<SubmitButton
							isLoading={isLoading === "email"}
							className="h-10 flex-1 font-medium text-sm"
						>
							Sign In
						</SubmitButton>
					</div>
				</form>
			)}
		</>
	);

	const renderSignUpContent = () => (
		<div className="space-y-2.5">
			<Button
				variant="outline"
				type="button"
				onClick={() => handleOAuthSignIn("github")}
				className="flex h-10 w-full items-center justify-center gap-2 font-medium text-sm"
				disabled={isLoading !== null}
			>
				<Github size={18} />
				Continue with GitHub
			</Button>

			<Button
				variant="outline"
				type="button"
				onClick={() => handleOAuthSignIn("google")}
				className="flex h-10 w-full items-center justify-center gap-2 font-medium text-sm"
				disabled={isLoading !== null}
			>
				<Image alt="Google" src="/assets/google.svg" width={18} height={18} />
				Continue with Google
			</Button>
		</div>
	);

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<Card className="w-full max-w-sm border-0 shadow-lg">
				<CardHeader className="space-y-1.5 pt-6 pb-4 text-center">
					<CardTitle className="font-bold text-xl">
						{activeTab === "signin" ? "Welcome Back" : "Get Started"}
					</CardTitle>
					<CardDescription className="text-muted-foreground text-sm">
						{activeTab === "signin"
							? "Sign in to your account"
							: "Create your account to continue"}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4 px-5 pb-6">
					<Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
						<TabsList className="grid h-10 w-full grid-cols-2">
							<TabsTrigger value="signin" className="font-medium text-sm">
								Sign In
							</TabsTrigger>
							<TabsTrigger value="signup" className="font-medium text-sm">
								Sign Up
							</TabsTrigger>
						</TabsList>
						<TabsContent value="signin" className="mt-4 space-y-4">
							{renderSignInContent()}
						</TabsContent>
						<TabsContent value="signup" className="mt-4">
							{renderSignUpContent()}
						</TabsContent>
					</Tabs>

					<div className="text-center text-muted-foreground text-xs">
						By continuing, you agree to our terms of service and privacy policy.
					</div>
				</CardContent>
			</Card>

			<LoadingOverlay isLoading={isLoading !== null} />
		</div>
	);
};

export default memo(AuthPage);