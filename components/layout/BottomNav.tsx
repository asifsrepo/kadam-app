"use client";

import { HomeIcon, Settings, Users } from "lucide-react";
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
		label: "Customers",
		href: "/customers",
		icon: Users,
		key: "customers",
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
	const activeTab = (() => {
		if (pathname === "/") return "home";
		if (pathname.startsWith("/customers")) return "customers";
		if (pathname.startsWith("/settings")) return "settings";
		return "home";
	})();
	if (pathname === "/auth" || pathname === "/onboarding") return null;

	return (
		<>
			<FloatingMenu />

			<nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 w-full items-center border-border/60 border-t bg-background/90 px-4 pb-[env(safe-area-inset-bottom)] backdrop-blur">
				{NAV_ITEMS.map(({ label, href, icon: Icon, key }) => {
					const active = activeTab === key;
					return (
						<Link
							key={key}
							href={href}
							prefetch
							className="relative flex flex-1 flex-col items-center justify-center py-1"
						>
							<div
								className={`flex h-10 items-center justify-center rounded-full px-3 transition-colors ${
									active ? "bg-primary/10" : "bg-transparent"
								}`}
							>
								<Icon
									className={`h-5 w-5 ${
										active ? "text-primary" : "text-muted-foreground"
									}`}
								/>
							</div>
							<span
								className={`mt-1 text-[11px] ${
									active ? "text-foreground" : "text-muted-foreground"
								}`}
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
