import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface StatsProps {
	currentMonthCredit: number;
	previousMonthCredit: number;
	isLoading?: boolean;
}

const Stats = ({ currentMonthCredit, previousMonthCredit, isLoading = false }: StatsProps) => {
	// Calculate percentage change
	let percentageChange = 0;
	let hasValidComparison = false;

	if (previousMonthCredit > 0) {
		percentageChange = ((currentMonthCredit - previousMonthCredit) / previousMonthCredit) * 100;
		hasValidComparison = true;
	}

	// Cap percentage at 999% for display purposes
	const displayPercentage = Math.min(Math.abs(percentageChange), 999);

	const isIncrease = percentageChange > 0;
	const isDecrease = percentageChange < 0;

	return (
		<div className="mb-6">
			<Card className="overflow-hidden border-border bg-card p-4">
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<h3 className="font-semibold text-card-foreground text-sm">
							Outstanding Credit
						</h3>
						<Badge variant="secondary" className="text-[10px]">
							This month
						</Badge>
					</div>

					<div>
						<p className="font-bold text-3xl text-card-foreground md:text-4xl">
							{isLoading ? "..." : `AED ${currentMonthCredit.toLocaleString()}`}
						</p>
					</div>

					{!isLoading && hasValidComparison && (
						<div className="flex items-center gap-2 text-xs">
							{isIncrease ? (
								<span className="font-medium text-destructive">
									↑ {displayPercentage.toFixed(0)}%
								</span>
							) : isDecrease ? (
								<span className="font-medium text-primary">
									↓ {displayPercentage.toFixed(0)}%
								</span>
							) : (
								<span className="font-medium text-muted-foreground">→ 0%</span>
							)}
							<span className="text-muted-foreground">vs last month</span>
						</div>
					)}
				</div>
			</Card>
		</div>
	);
};

export default Stats;
