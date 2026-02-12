"use client";

import { AlertCircle, CheckCircle, Clock, Loader2, XCircle } from "lucide-react";
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

type ViewState =
	| "success"
	| "action_required"
	| "pending"
	| "failed"
	| "unknown";

const CheckoutSuccessPage = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { subscription } = useSubscription();

	const subscriptionId = searchParams.get("subscription_id");
	const status = searchParams.get("status");

	const subscriptionStatus = subscription?.status;

	const viewState: ViewState = (() => {
		const normalizedParam = status?.toLowerCase();
		const normalizedSub = subscriptionStatus?.toLowerCase();

		if (["failed", "cancelled"].includes(normalizedParam || "")) return "failed";
		if (["requires_customer_action", "past_due", "on_hold"].includes(normalizedParam || ""))
			return "action_required";
		if (normalizedParam === "pending") return "pending";

		if (["failed", "cancelled"].includes(normalizedSub || "")) return "failed";
		if (["past_due", "on_hold"].includes(normalizedSub || "")) return "action_required";
		if (["active", "trialing"].includes(normalizedSub || "")) return "success";

		return "unknown";
	})();

	const handleGoToHome = () => {
		router.push("/");
	};

	const handleGoToPlans = () => {
		router.push("/settings/plans");
	};

	const handleCompletePayment = () => {
		if (subscription?.customerId) {
			router.push(`/customer-portal?customer_id=${subscription.customerId}`);
			return;
		}
		handleGoToPlans();
	};

	const isFailed = viewState === "failed";
	const isActionRequired = viewState === "action_required";
	const isPending = viewState === "pending" || viewState === "unknown";
	const isSuccess = viewState === "success";

	return (
		<div className="min-h-screen bg-background pb-24">
			<div className="sticky top-0 z-10 border-border/60 border-b bg-background/90 backdrop-blur">
				<div className="px-4 py-4 md:px-6">
					<div className="flex items-center gap-3">
						<BackButton />
						<div className="min-w-0 flex-1">
							<p className="text-muted-foreground text-xs">Checkout</p>
							<h1 className="font-semibold text-base md:text-2xl">
								{isFailed
									? "Checkout Failed"
									: isActionRequired
										? "Action Required"
										: isSuccess
											? "Checkout Success"
											: isPending
												? "Checkout Pending"
												: "Checkout Status"}
							</h1>
							<p className="truncate text-muted-foreground text-xs md:text-sm">
								{isFailed
									? "Payment could not be processed"
									: isActionRequired
										? "Complete payment to activate your subscription"
										: isSuccess
											? "Your subscription is active"
											: "Processing your subscription"}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-3 px-4 py-5 md:gap-4 md:px-6">
				<Card className="border-border/60">
					<CardHeader className="px-3 pt-3 pb-2 md:px-6 md:pt-6 md:pb-4">
						<div className="mb-2 flex items-center justify-center md:mb-3">
							{isFailed ? (
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 md:h-20 md:w-20">
									<XCircle className="h-8 w-8 text-destructive md:h-10 md:w-10" />
								</div>
							) : isActionRequired || isPending ? (
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 md:h-20 md:w-20">
									<Clock className="h-8 w-8 text-amber-600 md:h-10 md:w-10" />
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
								: isActionRequired
									? "Action Required"
									: isSuccess
										? "Subscription Activated!"
										: "Processing Your Subscription"}
						</CardTitle>
						<CardDescription className="text-center text-xs md:text-sm">
							{isFailed
								? "We couldn't process your payment. Please check your payment method and try again."
								: isActionRequired
									? "Complete payment or update your card to activate your subscription."
									: isSuccess
										? "Your subscription has been successfully activated. You now have access to all premium features."
										: "We're setting up your subscription. This may take a few moments."}
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-3 px-3 md:space-y-4 md:px-6">
						{(subscriptionId || status) && (
							<div
								className={`space-y-2.5 rounded-2xl border border-border/60 p-3 md:space-y-3 md:p-4 ${
									isFailed
										? "border-destructive/20 bg-destructive/5"
										: isActionRequired
											? "border-amber-200/70 bg-amber-50 dark:bg-amber-950/20"
											: "border-border bg-card"
								}`}
							>
								<h3 className="font-semibold text-sm md:text-base">
									{isFailed
										? "Transaction Details"
										: isActionRequired
											? "Payment Action Required"
											: "Subscription Details"}
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
											{isActionRequired && (
												<div className="flex items-center justify-between">
													<span className="text-muted-foreground text-xs md:text-sm">
														Action
													</span>
													<Badge variant="outline" className="text-xs capitalize">
														Complete payment
													</Badge>
												</div>
											)}
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
							<div className="flex items-start gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 p-3 md:gap-2.5 md:p-4">
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

						{isActionRequired && (
							<div className="flex items-start gap-2 rounded-lg border border-amber-200/70 bg-amber-50 p-3 text-amber-800 dark:border-amber-300/30 dark:bg-amber-950/20 dark:text-amber-100 md:gap-2.5 md:p-4">
								<AlertCircle className="mt-0.5 h-4 w-4 shrink-0 md:h-5 md:w-5" />
								<div className="space-y-1">
									<p className="font-medium text-xs md:text-sm">Payment requires action</p>
									<p className="text-xs leading-relaxed md:text-sm">
										Confirm the payment or update your card to activate your subscription.
										You can complete this in the customer portal.
									</p>
								</div>
							</div>
						)}

						{isPending && (
							<div className="flex items-start gap-2 rounded-lg border border-border/70 bg-muted/40 p-3 md:gap-2.5 md:p-4">
								<Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground md:h-5 md:w-5" />
								<div className="space-y-1">
									<p className="font-medium text-xs md:text-sm">Payment is pending</p>
									<p className="text-muted-foreground text-xs leading-relaxed md:text-sm">
										We’re waiting for the payment to finalize. If this stays longer than a few
										minutes, open the customer portal to complete it.
									</p>
								</div>
							</div>
						)}

						{isSuccess && (
							<div className="rounded-2xl border border-primary/20 bg-primary/5 p-3 md:p-4">
								<p className="text-center text-primary text-xs leading-relaxed md:text-sm">
									Thank you for subscribing! Your subscription is now active and
									you have access to all premium features.
								</p>
							</div>
						)}
					</CardContent>

					<CardFooter className="flex flex-col gap-2 px-3 pt-3 pb-3 md:flex-row md:gap-3 md:px-6 md:pt-4 md:pb-6">
						{isActionRequired && (
							<Button
								onClick={handleCompletePayment}
								variant="default"
								className="h-9 w-full text-xs md:h-10 md:text-sm"
							>
								Complete Payment
							</Button>
						)}
						{isFailed && (
							<Button
								onClick={handleGoToPlans}
								variant="default"
								className="h-11 w-full text-xs md:h-11 md:text-sm"
							>
								Try Again
							</Button>
						)}
						<Button
							onClick={isActionRequired || isPending ? handleGoToPlans : handleGoToHome}
							variant={isFailed ? "outline" : "default"}
							className="h-11 w-full text-xs md:h-11 md:text-sm"
						>
							{isActionRequired || isPending ? "Go to Plans" : "Go to Home"}
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
};

export default CheckoutSuccessPage;
