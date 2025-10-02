"use client";

import { LayoutDashboard, Settings, UserPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { WrapperProps } from "@/types";

const NAV_ITEMS = [
	{
		label: "Dashboard",
		href: "/dashboard",
		icon: LayoutDashboard,
		key: "dashboard",
	},
	{
		label: "Settings",
		href: "/dashboard/settings",
		icon: Settings,
		key: "settings",
	},
];

const DashboardLayout = ({ children }: WrapperProps) => {
	const pathname = usePathname();
	const activeTab = pathname === "/dashboard" ? "dashboard" : "settings";

	return (
		<main className="flex h-screen flex-col">
			<div className="flex-1 overflow-auto pb-16">{children}</div>

			<Button
				size="lg"
				className="fixed right-6 bottom-20 z-50 rounded-full shadow-lg"
				onClick={() => {
					console.log("Floating button clicked");
				}}
			>
				<UserPlus className="h-8 w-8" />
			</Button>

			<nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 w-full border-border border-t bg-background">
				{NAV_ITEMS.map(({ label, href, icon: Icon, key }) => {
					const active = activeTab === key;
					return (
						<Link
							key={key}
							href={href}
							prefetch
							className="relative flex flex-1 flex-col items-center justify-center py-2"
						>
							{active && (
								<div className="absolute top-0 right-0 left-0 h-[3px] rounded-t bg-primary" />
							)}
							<div
								className={`mb-1 flex items-center justify-center`}
								style={{
									width: 40,
									height: 40,
								}}
							>
								<Icon className="h-6 w-6" />
							</div>
							<span
								className={`font-medium text-xs ${
									active ? "text-primary" : "text-muted-foreground"
								}`}
								style={{
									letterSpacing: 0.1,
									marginTop: 2,
								}}
							>
								{label}
							</span>
						</Link>
					);
				})}
			</nav>
		</main>
	);
};

export default DashboardLayout;
