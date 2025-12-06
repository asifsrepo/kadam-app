import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface BillingToggleProps {
	isYearly: boolean;
	onChange: (checked: boolean) => void;
}

const BillingToggle = ({ isYearly, onChange }: BillingToggleProps) => {
	return (
		<div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card p-2.5 md:gap-3 md:p-4">
			<span
				className={`font-medium text-xs md:text-sm ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}
			>
				Monthly
			</span>
			<Switch checked={isYearly} onCheckedChange={onChange} />
			<div className="flex items-center gap-1 md:gap-1.5">
				<span
					className={`font-medium text-xs md:text-sm ${isYearly ? "text-foreground" : "text-muted-foreground"}`}
				>
					Yearly
				</span>
				{isYearly && (
					<Badge
						variant="secondary"
						className="px-1.5 py-0 text-[10px] md:px-2 md:text-xs"
					>
						Save 17%
					</Badge>
				)}
			</div>
		</div>
	);
};

export default BillingToggle;

