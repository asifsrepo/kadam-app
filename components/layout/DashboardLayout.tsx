import { WrapperProps } from "@/types";
import BottomNav from "./BottomNav";

const DashboardLayout = async ({ children }: WrapperProps) => {
	return (
		<main className="flex h-screen flex-col">
			<div className="flex-1 overflow-auto pb-16">{children}</div>
			<BottomNav />
		</main>
	);
};

export default DashboardLayout;
