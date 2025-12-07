import { Button } from "@/components/ui/button";

interface ActionRequiredCardProps {
	isPastDue: boolean;
	onUpdatePayment: () => void;
}

const ActionRequiredCard = ({ isPastDue, onUpdatePayment }: ActionRequiredCardProps) => {
	return (
		<div className="flex items-center justify-between gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3 md:p-4">
			<div className="min-w-0 flex-1">
				<h3 className="font-semibold text-destructive text-sm md:text-base">
					Action Required
				</h3>
				<p className="text-destructive/80 text-xs md:text-sm">
					{isPastDue
						? "Your payment failed. Update your payment method to restore service."
						: "Your subscription is on hold. Please update your payment method or contact support."}
				</p>
			</div>
			<Button
				onClick={onUpdatePayment}
				variant="default"
				className="h-9 shrink-0 text-xs md:h-10 md:text-sm"
			>
				Update Payment
			</Button>
		</div>
	);
};

export default ActionRequiredCard;

