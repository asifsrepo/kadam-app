import { Check, CreditCard, MapPin } from "lucide-react";
import useStores from "@/hooks/store/useStores";
import { formatCurrency } from "@/lib/utils";
import { IBranch } from "@/types/store";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import BranchDialog from "./BranchDialog";

const BranchCard = ({ branch }: { branch: IBranch }) => {
	const { activeBranch, setActiveBranch } = useStores();
	const isActive = activeBranch?.id === branch.id;

	const handleCardClick = (e: React.MouseEvent) => {
		if ((e.target as HTMLElement).closest("button")) {
			return;
		}
		setActiveBranch(branch);
	};

	return (
		<Card
			key={branch.id}
			className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${isActive ? "border-primary bg-primary/5 shadow-md" : "border-border/50"}`}
			onClick={handleCardClick}
		>
			<CardContent className="p-3 sm:p-4">
				<div className="space-y-2">
					<div className="flex items-start justify-between gap-2">
						<div className="min-w-0 flex-1">
							<h3
								className={`truncate font-semibold text-sm sm:text-base ${
									isActive ? "text-primary" : "text-foreground"
								}`}
							>
								{branch.name}
							</h3>
						</div>
						<div className="flex flex-shrink-0 items-center gap-1">
							{!isActive && (
								<Button
									size="sm"
									variant="outline"
									onClick={(e) => {
										e.stopPropagation();
										setActiveBranch(branch);
									}}
									className="h-8 px-2 text-xs"
								>
									<Check className="mr-1 h-3 w-3" />
									Switch
								</Button>
							)}
							<BranchDialog branch={branch} mode="edit" />
						</div>
					</div>
					<div className="space-y-1.5">
						<div className="flex items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
							<MapPin className="h-3 w-3 shrink-0 text-muted-foreground sm:h-3.5 sm:w-3.5" />
							<span className="truncate text-muted-foreground">
								{branch.location}
							</span>
						</div>
						<div className="flex items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
							<CreditCard className="h-3 w-3 shrink-0 text-muted-foreground sm:h-3.5 sm:w-3.5" />
							<span className="text-muted-foreground">
								Limit: {formatCurrency(branch.debtLimit || 0)}
							</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default BranchCard;
