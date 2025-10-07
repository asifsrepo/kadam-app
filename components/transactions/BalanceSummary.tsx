import { Wallet } from "lucide-react";
import type { ITransaction } from "@/types/transaction";

interface BalanceSummaryProps {
	transactions: ITransaction[];
}

const BalanceSummary = ({ transactions }: BalanceSummaryProps) => {
	const totalDebt =
		transactions?.filter((t) => t.type === "credit").reduce((sum, t) => sum + t.amount, 0) || 0;

	const totalPaid =
		transactions?.filter((t) => t.type === "payment").reduce((sum, t) => sum + t.amount, 0) ||
		0;

	const balance = totalDebt - totalPaid;

	return (
		<div
			className={`flex items-center justify-between rounded-lg border p-3 ${
				balance > 0
					? "border-destructive/30 bg-destructive/5"
					: "border-primary/30 bg-primary/5"
			}`}
		>
			<div className="flex items-center gap-2">
				<Wallet className="h-4 w-4 text-muted-foreground" />
				<span className="font-medium text-foreground text-sm">
					{balance > 0 ? "Balance (Owes)" : "Balance (Settled)"}
				</span>
			</div>
			<p className={`font-bold text-lg ${balance > 0 ? "text-destructive" : "text-primary"}`}>
				{Math.abs(balance).toFixed(2)}
			</p>
		</div>
	);
};

export default BalanceSummary;
