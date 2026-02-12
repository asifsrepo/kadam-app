import { CreditCard, Phone, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useCurrency from "@/hooks/store/useCurrency";
import type { CustomerWithBalance } from "@/types/customers";
import TransactionDialog from "../transactions/TransactionDialog";

interface CustomerCardProps {
	customer: CustomerWithBalance;
}

const CustomerCard = ({ customer }: CustomerCardProps) => {
	const router = useRouter();
	const { formatAmountWithCode } = useCurrency();
	const onCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const target = e.target as HTMLElement;
		const isButtonClick = target.closest("button") || target.closest("a");

		if (!isButtonClick) {
			router.push(`/customers/${customer.id}`);
		}
	};

	return (
		<Card className="min-w-[220px] cursor-pointer border-border/60 transition-shadow hover:shadow-md">
			<CardContent className="p-3" onClick={onCardClick}>
				<div className="mb-2 flex items-start justify-between gap-2">
					<div className="min-w-0 flex-1">
						<div className="flex items-center gap-1.5">
							<h3 className="truncate font-semibold text-foreground text-sm">
								{customer.name}
							</h3>
						</div>
						<div className="mt-1 space-y-0.5">
							<div className="flex items-center gap-1.5 text-xs">
								<Phone className="h-3 w-3 shrink-0 text-muted-foreground" />
								<span className="truncate text-muted-foreground">
									{customer.phone}
								</span>
							</div>
							<div className="flex items-center gap-1.5 text-xs">
								<CreditCard className="h-3 w-3 shrink-0 text-muted-foreground" />
								<span className="truncate text-muted-foreground">
									{customer?.limit?.toFixed(2) || 0} limit
								</span>
							</div>
						</div>
					</div>
					<div className="flex shrink-0 flex-col items-end gap-1">
						<TransactionDialog
							defaultCustomer={customer}
							trigger={
								<Button
									variant="outline"
									size="sm"
									className="h-9 w-9 p-0"
									aria-label={`Add transaction for ${customer.name}`}
								>
									<Plus className="h-4 w-4" />
								</Button>
							}
						/>
					</div>
				</div>

				<div className="mt-3 flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 px-3 py-2">
					<p className="text-[10px] text-muted-foreground">Balance</p>
					<p
						className={`font-semibold text-sm ${
							customer.balance > 0
								? "text-destructive"
								: customer.balance < 0
									? "text-primary"
									: "text-muted-foreground"
						}`}
					>
						{customer.balance > 0
							? formatAmountWithCode(customer.balance)
							: customer.balance < 0
								? formatAmountWithCode(Math.abs(customer.balance))
								: formatAmountWithCode(0)}
					</p>
				</div>
			</CardContent>
		</Card>
	);
};

export default CustomerCard;
