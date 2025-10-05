import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CustomerListSkeleton = () => {
    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index}>
                    <CardContent className="p-3">
                        
                        <div className="mb-2 flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1 space-y-2">
                                <div className="flex items-center gap-1.5">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-12" />
                                </div>
                                <Skeleton className="h-3 w-2/3" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                            <div className="flex shrink-0 gap-1">
                                <Skeleton className="h-7 w-7" />
                                <Skeleton className="h-7 w-7" />
                            </div>
                        </div>
                        <Skeleton className="my-2 h-px w-full" />
                        <div className="space-y-1.5">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-full" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default CustomerListSkeleton;

