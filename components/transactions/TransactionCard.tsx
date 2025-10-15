import { Calendar, Phone } from "lucide-react";
import { ITransactionWithCustomer } from "@/types";
import { Card, CardContent } from "../ui/card";

interface TransactionCardProps {
    transaction: ITransactionWithCustomer;
}

const TransactionCard = ({ transaction }: TransactionCardProps) => {
    const isCredit = transaction.type === "credit";
    const formattedDate = new Date(transaction.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
    const formattedTime = new Date(transaction.createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <Card className={`transition-shadow hover:shadow-md ${isCredit ? "border-l-4 border-l-destructive/30" : "border-l-4 border-l-primary/30"
            }`}>
            <CardContent className="p-3">
                <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                            <h3 className="truncate font-semibold text-foreground text-sm">
                                {transaction.customer.name}
                            </h3>
                        </div>
                        <div className="mt-1 space-y-0.5">
                            <div className="flex items-center gap-1.5 text-xs">
                                <Phone className="h-3 w-3 shrink-0 text-muted-foreground" />
                                <span className="truncate text-muted-foreground">
                                    {transaction.customer.phone}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs">
                                <Calendar className="h-3 w-3 shrink-0 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                    {formattedDate} at {formattedTime}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="shrink-0 text-right">
                        <p
                            className={`font-bold text-lg ${isCredit ? "text-destructive" : "text-primary"
                                }`}
                        >
                            {transaction.amount.toFixed(2)}
                        </p>
                        <p className="text-muted-foreground text-[10px] capitalize">{transaction.type}</p>
                    </div>
                </div>

                {transaction.notes && (
                    <div className="mt-2 pt-2 border-t border-border">
                        <p className="text-muted-foreground text-xs line-clamp-2">
                            {transaction.notes}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TransactionCard;