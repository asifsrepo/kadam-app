import BackButton from "~/BackButton";

interface PlansPageHeaderProps {
	subtitle?: string;
}

const PlansPageHeader = ({ subtitle = "Choose the perfect plan" }: PlansPageHeaderProps) => {
	return (
		<div className="sticky top-0 z-10 border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="px-3 py-2.5 md:px-6 md:py-4">
				<div className="flex items-center gap-2 md:gap-3">
					<BackButton />
					<div className="min-w-0 flex-1">
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
