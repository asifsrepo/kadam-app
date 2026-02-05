import { Users2 } from "lucide-react";
import BackButton from "~/BackButton";

const StaffsPage = () => {
	return (
		<div className="min-h-screen bg-background pb-24">
			<div className="sticky top-0 z-10 border-border/60 border-b bg-background/90 backdrop-blur">
				<div className="px-4 py-4 md:px-6">
					<div className="flex items-center gap-3">
						<BackButton />
						<div>
							<p className="text-muted-foreground text-xs">Team</p>
							<h1 className="font-semibold text-lg md:text-2xl">Staffs</h1>
						</div>
					</div>
				</div>
			</div>

			<div className="px-4 py-5 md:px-6">
				<div className="flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card p-6 text-center">
					<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
						<Users2 className="h-6 w-6 text-primary" />
					</div>
					<div>
						<h2 className="font-semibold text-base">Staff management coming soon</h2>
						<p className="text-muted-foreground text-sm">
							We’re working on staff roles and access controls.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StaffsPage;
