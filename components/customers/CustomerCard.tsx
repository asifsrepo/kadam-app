import { CreditCard, Phone, ShoppingCart, TrendingDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CustomerWithBalance } from "@/types/customers";

interface CustomerCardProps {
	customer: CustomerWithBalance;
}

const CustomerCard = ({ customer }: CustomerCardProps) => {
	const router = useRouter();
	const onCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const target = e.target as HTMLElement;
		const isButtonClick = target.closest("button") || target.closest("a");

		if (!isButtonClick) {
			router.push(`/dashboard/customers/${customer.id}`);
		}
	};
	return (
		<Card className="cursor-pointer transition-shadow hover:shadow-md">
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
					<div className="flex shrink-0 items-start gap-1">
						<Button
							variant="outline"
							size="icon"
							className="h-8 w-8 text-destructive hover:bg-destructive/10"
							aria-label={`Add credit transaction for ${customer.name}`}
							asChild
						>
							<Link
								href={`/dashboard/customers/${customer.id}/transactions/new?type=credit`}
							>
								<ShoppingCart className="h-4 w-4" />
							</Link>
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="h-8 w-8 text-primary hover:bg-primary/10"
							aria-label={`Add payment transaction for ${customer.name}`}
							asChild
						>
							<Link
								href={`/dashboard/customers/${customer.id}/transactions/new?type=payment`}
							>
								<TrendingDown className="h-4 w-4" />
							</Link>
						</Button>
					</div>
				</div>

				<div className="mt-3 rounded-lg border p-2">
					<div className="text-center">
						<p className="text-[10px] text-muted-foreground">Balance</p>
						<p
							className={`font-bold text-lg ${customer.balance > 0
								? "text-destructive"
								: customer.balance < 0
									? "text-primary"
									: "text-muted-foreground"
								}`}
						>
							{customer.balance > 0
								? `${customer.balance.toFixed(2)}`
								: customer.balance < 0
									? `${Math.abs(customer.balance).toFixed(2)}`
									: "0.00"}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default CustomerCard;
