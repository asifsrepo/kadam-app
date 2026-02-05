import BackButton from "~/BackButton";

interface PlansPageHeaderProps {
	subtitle?: string;
}

const PlansPageHeader = ({ subtitle = "Choose the perfect plan" }: PlansPageHeaderProps) => {
	return (
		<div className="sticky top-0 z-10 border-border/60 border-b bg-background/90 backdrop-blur">
			<div className="px-4 py-4 md:px-6">
				<div className="flex items-center gap-3">
					<BackButton />
					<div className="min-w-0 flex-1">
						<p className="text-muted-foreground text-xs">Subscription</p>
						<h1 className="font-semibold text-base md:text-2xl">Plans & Billing</h1>
						<p className="truncate text-muted-foreground text-xs md:text-sm">
							{subtitle}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PlansPageHeader;
