import { WrapperProps } from "@/types";
import BottomNav from "./BottomNav";

const DashboardLayout = async ({ children }: WrapperProps) => {
	return (
		<main className="flex min-h-screen flex-col bg-background">
			<div className="flex-1 overflow-y-auto pb-20">{children}</div>
			<BottomNav />
		</main>
	);
};

export default DashboardLayout;
