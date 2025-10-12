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
			window.location.href = "/dashboard";
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
			<div className="container mx-auto px-4 py-8">
				<div className="mx-auto max-w-md">
					<div className="mb-8 text-center">
						<h1 className="mb-2 font-bold text-2xl text-foreground">
							Welcome to Kadam
						</h1>
						<p className="text-muted-foreground text-sm">
							Let's set up your account in just a few steps
						</p>
					</div>

					<div className="mb-6">
						<div className="mb-2 flex justify-between text-muted-foreground text-xs">
							<span>
								Step {step} of {totalSteps}
							</span>
							<span>{Math.round(progress)}% Complete</span>
						</div>
						<Progress value={progress} className="h-2" />
					</div>

					{renderStep()}

					<div className="mt-6 flex justify-center gap-2">
						{Array.from({ length: totalSteps }).map((_, index) => (
							<div
								key={index}
								className={`h-2 w-2 rounded-full ${index + 1 <= step ? "bg-primary" : "bg-muted"
									}`}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default OnboardingPage;
