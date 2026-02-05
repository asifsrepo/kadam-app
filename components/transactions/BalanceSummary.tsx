import { Wallet } from "lucide-react";
import useCurrency from "@/hooks/store/useCurrency";
import type { ITransaction } from "@/types/transaction";

interface BalanceSummaryProps {
	transactions: ITransaction[];
}

const BalanceSummary = ({ transactions }: BalanceSummaryProps) => {
	const { formatAmountWithCode } = useCurrency();
	const totalDebt =
		transactions?.filter((t) => t.type === "credit").reduce((sum, t) => sum + t.amount, 0) || 0;

	const totalPaid =
		transactions?.filter((t) => t.type === "payment").reduce((sum, t) => sum + t.amount, 0) ||
		0;

	const balance = totalDebt - totalPaid;

	return (
		<div
			className={`flex items-center justify-between rounded-2xl border border-border/60 p-3 ${
				balance > 0
					? "bg-destructive/5"
					: balance < 0
						? "bg-success/5"
						: "bg-muted/40"
			}`}
		>
			<div className="flex items-center gap-2">
				<Wallet className="h-4 w-4 text-muted-foreground" />
				<span className="font-medium text-foreground text-sm">
					{balance > 0
						? "Balance (Owes)"
						: balance < 0
							? "Balance (Credit)"
							: "Balance (Settled)"}
				</span>
			</div>
			<p
				className={`font-semibold text-lg ${
					balance > 0 ? "text-destructive" : balance < 0 ? "text-success" : "text-foreground"
				}`}
			>
				{formatAmountWithCode(Math.abs(balance))}
			</p>
		</div>
	);
};

export default BalanceSummary;
