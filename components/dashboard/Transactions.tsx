import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Transactions = () => {
    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Recent Transactions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-8">
                        <CreditCard className="mb-2 h-8 w-8 text-muted-foreground" />
                        <h3 className="mb-1 font-medium text-foreground">Coming Soon</h3>
                        <p className="text-center text-muted-foreground text-sm">
                            Recent transactions will appear here
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};