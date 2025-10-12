import { MapPin } from "lucide-react";
import useStores from "@/hooks/store/useStores";
import { IBranch } from "@/types/store";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

const BranchCard = ({ branch }: { branch: IBranch; }) => {
    const { activeBranch, setActiveBranch } = useStores();
    const isActive = activeBranch?.id === branch.id;

    const handleCardClick = () => {
        setActiveBranch(branch);
    };

    return (
        <Card
            key={branch.id}
            className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${isActive
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border/50"
                }`}
            onClick={handleCardClick}
        >
            <CardContent className="p-3">
                <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                            <h3 className={`truncate font-semibold text-sm ${isActive ? "text-primary" : "text-foreground"
                                }`}>
                                {branch.name}
                            </h3>
                        </div>
                        <div className="flex items-center gap-1">
                            {isActive && (
                                <Badge
                                    variant="default"
                                    className="bg-primary text-primary-foreground text-xs"
                                >
                                    Active
                                </Badge>
                            )}
                            {branch.isMain && (
                                <Badge
                                    variant="secondary"
                                    className="border-primary/20 bg-primary/10 text-primary text-xs"
                                >
                                    Main
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
                        <span className="truncate text-muted-foreground">
                            {branch.location}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
export default BranchCard;