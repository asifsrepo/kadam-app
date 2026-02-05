import { Button } from "@/components/ui/button";

interface ExpiredSubscriptionCardProps {
	onRenew: () => void;
	isLoading: boolean;
}

const ExpiredSubscriptionCard = ({ onRenew, isLoading }: ExpiredSubscriptionCardProps) => {
	return (
		<div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/30 p-3 md:p-4">
			<div className="min-w-0 flex-1">
				<h3 className="font-semibold text-foreground text-sm md:text-base">
					Subscription Expired
				</h3>
				<p className="text-muted-foreground text-xs md:text-sm">
					Your subscription has expired. Please renew to continue using the service.
				</p>
			</div>
			<Button
				onClick={onRenew}
				variant="default"
				disabled={isLoading}
				className="h-11 shrink-0 text-xs md:h-11 md:text-sm"
			>
				{isLoading ? "Loading..." : "Renew Now"}
			</Button>
		</div>
	);
};

export default ExpiredSubscriptionCard;
