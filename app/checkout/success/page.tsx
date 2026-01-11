"use client";

import { AlertCircle, CheckCircle, Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useSubscription } from "@/hooks/queries/useSubscription";
import BackButton from "~/BackButton";

const CheckoutSuccessPage = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { subscription } = useSubscription();

	const subscriptionId = searchParams.get("subscription_id");
	const status = searchParams.get("status");

	const handleGoToHome = () => {
		router.push("/");
	};

	const handleGoToPlans = () => {
		router.push("/settings/plans");
	};

	const isFailed = status === "failed";
	const isSuccess = !!subscriptionId && !isFailed;

	return (
		<div className="min-h-screen bg-background pb-24">
			<div className="sticky top-0 z-10 border-border border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
				<div className="px-3 py-2.5 md:px-6 md:py-4">
					<div className="flex items-center gap-2 md:gap-3">
						<BackButton />
						<div className="min-w-0 flex-1">
							<h1 className="font-semibold text-base md:text-2xl">
								{isFailed
									? "Checkout Failed"
									: isSuccess
										? "Checkout Success"
										: "Checkout Status"}
							</h1>
							<p className="truncate text-muted-foreground text-xs md:text-sm">
								{isFailed
									? "Payment could not be processed"
									: isSuccess
										? "Your subscription is active"
										: "Processing your subscription"}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-3 p-3 md:gap-4 md:p-6">
				<Card className="border-border">
					<CardHeader className="px-3 pt-3 pb-2 md:px-6 md:pt-6 md:pb-4">
						<div className="mb-2 flex items-center justify-center md:mb-3">
							{isFailed ? (
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 md:h-20 md:w-20">
									<XCircle className="h-8 w-8 text-destructive md:h-10 md:w-10" />
								</div>
							) : isSuccess ? (
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 md:h-20 md:w-20">
									<CheckCircle className="h-8 w-8 text-primary md:h-10 md:w-10" />
								</div>
							) : (
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 md:h-20 md:w-20">
									<Loader2 className="h-8 w-8 animate-spin text-primary md:h-10 md:w-10" />
								</div>
							)}
						</div>
						<CardTitle className="text-center text-base md:text-lg">
							{isFailed
								? "Payment Failed"
								: isSuccess
									? "Subscription Activated!"
									: "Processing Your Subscription"}
						</CardTitle>
						<CardDescription className="text-center text-xs md:text-sm">
							{isFailed
								? "We couldn't process your payment. Please check your payment method and try again."
								: isSuccess
									? "Your subscription has been successfully activated. You now have access to all premium features."
									: "We're setting up your subscription. This may take a few moments."}
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-3 px-3 md:space-y-4 md:px-6">
						{(subscriptionId || status) && (
							<div
								className={`space-y-2.5 rounded-lg border p-3 md:space-y-3 md:p-4 ${
									isFailed
										? "border-destructive/20 bg-destructive/5"
										: "border-border bg-card"
								}`}
							>
								<h3 className="font-semibold text-sm md:text-base">
									{isFailed ? "Transaction Details" : "Subscription Details"}
								</h3>
								<div className="space-y-2 md:space-y-2.5">
									{subscription ? (
										<>
											<div className="flex items-center justify-between">
												<span className="text-muted-foreground text-xs md:text-sm">
													Plan
												</span>
												<span className="font-medium text-foreground text-xs md:text-sm">
													{subscription.planName}
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-muted-foreground text-xs md:text-sm">
													Billing Period
												</span>
												<span className="font-medium text-foreground text-xs capitalize md:text-sm">
													{subscription.billingPeriod}
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-muted-foreground text-xs md:text-sm">
													Status
												</span>
												<span className="font-medium text-foreground text-xs capitalize md:text-sm">
													{subscription.status}
												</span>
											</div>
											{subscription.currentPeriodEnd && (
												<div className="flex items-center justify-between">
													<span className="text-muted-foreground text-xs md:text-sm">
														Next Billing Date
													</span>
													<span className="font-medium text-foreground text-xs md:text-sm">
														{new Date(
															subscription.currentPeriodEnd,
														).toLocaleDateString()}
													</span>
												</div>
											)}
										</>
									) : (
										<>
											{status && (
												<div className="flex items-center justify-between">
													<span className="text-muted-foreground text-xs md:text-sm">
														Status
													</span>
													<Badge
														variant={
															isFailed ? "destructive" : "default"
														}
														className="text-xs capitalize"
													>
														{status}
													</Badge>
												</div>
											)}
											{subscriptionId && (
												<div className="flex items-center justify-between">
													<span className="text-muted-foreground text-xs md:text-sm">
														Subscription ID
													</span>
													<span className="font-mono text-foreground text-xs md:text-sm">
														{subscriptionId.substring(0, 24)}...
													</span>
												</div>
											)}
										</>
									)}
								</div>
							</div>
						)}

						{isFailed && (
							<div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 md:gap-2.5 md:p-4">
								<AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive md:h-5 md:w-5" />
								<div className="space-y-1">
									<p className="font-medium text-destructive text-xs md:text-sm">
										Payment could not be processed
									</p>
									<p className="text-destructive/80 text-xs leading-relaxed md:text-sm">
										Please check your payment method, ensure you have sufficient
										funds, and try again. If the problem persists, contact
										support.
									</p>
								</div>
							</div>
						)}

						{isSuccess && (
							<div className="rounded-lg border border-primary/20 bg-primary/5 p-3 md:p-4">
								<p className="text-center text-primary text-xs leading-relaxed md:text-sm">
									Thank you for subscribing! Your subscription is now active and
									you have access to all premium features.
								</p>
							</div>
						)}
					</CardContent>

					<CardFooter className="flex flex-col gap-2 px-3 pt-3 pb-3 md:flex-row md:gap-3 md:px-6 md:pt-4 md:pb-6">
						{isFailed && (
							<Button
								onClick={handleGoToPlans}
								variant="default"
								className="h-9 w-full text-xs md:h-10 md:text-sm"
							>
								Try Again
							</Button>
						)}
						<Button
							onClick={handleGoToHome}
							variant={isFailed ? "outline" : "default"}
							className="h-9 w-full text-xs md:h-10 md:text-sm"
						>
							Go to Home
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
};

export default CheckoutSuccessPage;
