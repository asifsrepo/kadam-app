import { DollarSign, TrendingDown, TrendingUp, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsProps {
    totalCustomers: number;
    totalDebt: number;
    totalCredit: number;
    netBalance: number;
    isLoading?: boolean;
}

export const Stats = ({
    totalCustomers,
    totalDebt,
    totalCredit,
    netBalance,
    isLoading = false,
}: StatsProps) => {
    return (
        <div className="mb-6 space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <Card className="p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="font-medium text-[10px] text-muted-foreground uppercase tracking-wide">
                                Customers
                            </p>
                            <p className="font-bold text-foreground text-lg">
                                {isLoading ? "..." : totalCustomers}
                            </p>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <Users className="h-4 w-4 text-primary" />
                        </div>
                    </div>
                </Card>

                <Card className="p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="font-medium text-[10px] text-muted-foreground uppercase tracking-wide">
                                Net Balance
                            </p>
                            <p
                                className={`font-bold text-lg ${netBalance > 0 ? "text-destructive" : "text-primary"
                                    }`}
                            >
                                {isLoading ? "..." : `$${netBalance.toFixed(2)}`}
                            </p>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Second Row - 2 cards on mobile */}
            <div className="grid grid-cols-2 gap-3">
                <Card className="p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="font-medium text-[10px] text-muted-foreground uppercase tracking-wide">
                                Total Debt
                            </p>
                            <p className="font-bold text-destructive text-lg">
                                {isLoading ? "..." : `$${totalDebt.toFixed(2)}`}
                            </p>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
                            <TrendingUp className="h-4 w-4 text-destructive" />
                        </div>
                    </div>
                </Card>

                <Card className="p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="font-medium text-[10px] text-muted-foreground uppercase tracking-wide">
                                Total Credit
                            </p>
                            <p className="font-bold text-lg text-primary">
                                {isLoading ? "..." : `$${totalCredit.toFixed(2)}`}
                            </p>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <TrendingDown className="h-4 w-4 text-primary" />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};