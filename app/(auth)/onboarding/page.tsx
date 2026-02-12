"use client";

import { parseAsInteger, useQueryState } from "nuqs";
import { useState } from "react";
import PasswordStep from "@/components/onboarding/PasswordStep";
import PersonalInfoStep from "@/components/onboarding/PersonalInfoStep";
import ShopInfoStep from "@/components/onboarding/ShopInfoStep";
import { Progress } from "@/components/ui/progress";

const OnboardingPage = () => {
	const [step, setStep] = useQueryState("step", parseAsInteger.withDefault(1));
	const [isSubmitting, setIsSubmitting] = useState(false);

	const totalSteps = 3;
	// Progress shows current step progress: step 1 = 33%, step 2 = 66%, step 3 = 100%
	const progress = (step / totalSteps) * 100;

	const handleNext = () => {
		setStep(step + 1);
	};

	const handlePrevious = () => {
		if (step > 1) {
			setStep(step - 1);
		}
	};

	const handleComplete = (step: number) => {
		if (step === 3) {
			window.location.href = "/";
			return;
		}
		setStep(step + 1);
	};

	const renderStep = () => {
		switch (step) {
			case 1:
				return (
					<PersonalInfoStep
						onComplete={handleNext}
						isSubmitting={isSubmitting}
						setIsSubmitting={setIsSubmitting}
					/>
				);

			case 2:
				return (
					<div>
						<PasswordStep
							onComplete={handleNext}
							onPrevious={handlePrevious}
							isSubmitting={isSubmitting}
							setIsSubmitting={setIsSubmitting}
						/>
					</div>
				);

			case 3:
				return (
					<ShopInfoStep
						onPrevious={handlePrevious}
						onComplete={handleComplete}
						isSubmitting={isSubmitting}
						setIsSubmitting={setIsSubmitting}
					/>
				);

			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto flex w-full max-w-md flex-col px-4 py-8">
				<div className="mb-6 text-center">
					<h1 className="mb-2 font-semibold text-2xl text-foreground">
						Welcome to Hysabee
					</h1>
					<p className="text-muted-foreground text-sm">
						Set up your account in a few quick steps
					</p>
				</div>

				<div className="mb-6 rounded-2xl border border-border/60 bg-card p-4">
					<div className="mb-2 flex justify-between text-muted-foreground text-xs">
						<span>
							Step {step} of {totalSteps}
						</span>
						<span>{Math.round(progress)}% Complete</span>
					</div>
					<Progress value={progress} className="h-2.5" />
				</div>

				{renderStep()}

				<div className="mt-6 flex justify-center gap-2">
					{Array.from({ length: totalSteps }).map((_, index) => (
						<div
							key={index}
							className={`h-2 w-2 rounded-full ${
								index + 1 <= step ? "bg-primary" : "bg-muted"
							}`}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default OnboardingPage;
