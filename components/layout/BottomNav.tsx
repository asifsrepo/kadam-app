"use client";

import { HomeIcon, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FloatingMenu from "./FloatingMenu";

const NAV_ITEMS = [
	{
		label: "Home",
		href: "/",
		icon: HomeIcon,
		key: "home",
	},
	{
		label: "Settings",
		href: "/settings",
		icon: Settings,
		key: "settings",
	},
];

const BottomNav = () => {
	const pathname = usePathname();
	const activeTab = pathname === "/" ? "home" : "settings";
	if (pathname === "/auth" || pathname === "/onboarding") return null;

	return (
		<>
			<FloatingMenu />

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
		</>
	);
};
export default BottomNav;
