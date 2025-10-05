import { User } from "lucide-react";

interface EmptyStateProps {
    hasSearch: boolean;
}

const EmptyState = ({ hasSearch }: EmptyStateProps) => {
    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center px-4 py-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-6">
                <User className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mb-2 font-semibold text-foreground text-xl">
                {hasSearch ? "No customers found" : "No customers yet"}
            </h2>
            <p className="mb-6 max-w-md text-muted-foreground">
                {hasSearch
                    ? "Try adjusting your search terms to find what you're looking for."
                    : "Get started by adding your first customer using the button below."}
            </p>
            {!hasSearch && (
                <div className="text-muted-foreground text-sm">
                    Click the <strong className="text-foreground">+</strong> button at the bottom
                    right to add a customer
                </div>
            )}
        </div>
    );
};

export default EmptyState;

