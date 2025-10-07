import { CreditCard, Eye, Phone, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CustomerWithBalance } from "@/types/customers";

interface CustomerCardProps {
	customer: CustomerWithBalance;
}

const CustomerCard = ({ customer }: CustomerCardProps) => {
	return (
		<Card className="transition-shadow hover:shadow-md">
			<CardContent className="p-3">
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
							variant="ghost"
							size="icon"
							className="h-7 w-7"
							asChild
							title="View customer"
						>
							<Link href={`/dashboard/customers/${customer.id}`}>
								<Eye className="h-3.5 w-3.5" />
							</Link>
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7"
							asChild
							title="Add transaction"
						>
							<Link href={`/dashboard/customers/${customer.id}/transactions/new`}>
								<Plus className="h-3.5 w-3.5" />
							</Link>
						</Button>
					</div>
				</div>

				{/* Balance Section */}
				<div className="mt-3 rounded-lg border p-2">
					<div className="text-center">
						<p className="text-[10px] text-muted-foreground">Balance</p>
						<p
							className={`font-bold text-lg ${
								customer.balance > 0
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
