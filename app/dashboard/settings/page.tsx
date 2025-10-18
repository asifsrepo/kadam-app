"use client";

import { Building2, ChevronRight, CreditCard, LogOut, Palette, Users2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ShopInfo from "@/components/stores/ShopInfo";
import { useAuth } from "@/hooks/store/useAuth";
import BackButton from "~/BackButton";
import ConfirmationDialog from "~/ConfirmationDialog";

const Settings = () => {
	const { signOut } = useAuth();
	const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

	const handleLogout = () => {
		setIsLogoutDialogOpen(true);
	};

	const handleConfirmLogout = () => {
		signOut();
		setIsLogoutDialogOpen(false);
	};

	const handleCancelLogout = () => {
		setIsLogoutDialogOpen(false);
	};

	const settingsItems = [
		{
			title: "Customers",
			description: "View and manage your customers",
			href: "/dashboard/customers",
			icon: Users2,
		},
		{
			title: "Branch Management",
			description: "View and manage your branches",
			href: "/dashboard/settings/branches",
			icon: Building2,
		},
		{
			title: "Appearance",
			description: "Customize theme and colors",
			href: "/dashboard/settings/appearance",
			icon: Palette,
		},
		{
			title: "Plans & Billing",
			description: "Manage subscription and billing",
			href: "/dashboard/settings/plans",
			icon: CreditCard,
		},
		{
			title: "Sign Out",
			description: "Log out of your account",
			href: "#",
			icon: LogOut,
			onClick: handleLogout,
		},
	];

	return (
		<div className="min-h-screen bg-background pb-24">
			<div className="sticky top-0 z-10 border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="px-3 py-3 md:px-6 md:py-4">
					<div className="flex items-center gap-3">
						<BackButton />
						<h1 className="font-semibold text-lg md:text-2xl">Settings</h1>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-3 p-3 md:gap-4 md:p-6">
				<ShopInfo variant="settings" />

				<div className="flex flex-col gap-3 md:gap-4">
					{settingsItems.map((item) => {
						const Icon = item.icon;
						const isLogout = item.title === "Sign Out";

						if (isLogout) {
							return (
								<button
									key={item.title}
									onClick={item.onClick}
									className="group flex min-h-[88px] w-full items-center gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-accent md:min-h-[96px] md:gap-4 md:p-5"
								>
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary md:h-12 md:w-12">
										<Icon className="h-5 w-5 md:h-6 md:w-6" />
									</div>

									<div className="flex min-w-0 flex-1 flex-col gap-0.5 md:gap-1">
										<h3 className="font-semibold text-base text-card-foreground group-hover:text-accent-foreground md:text-lg">
											{item.title}
										</h3>
										<p className="text-muted-foreground text-xs md:text-sm">
											{item.description}
										</p>
									</div>

									<ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent-foreground" />
								</button>
							);
						}

						return (
							<Link
								key={item.href}
								href={item.href}
								className="group flex min-h-[88px] items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent md:min-h-[96px] md:gap-4 md:p-5"
							>
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary md:h-12 md:w-12">
									<Icon className="h-5 w-5 md:h-6 md:w-6" />
								</div>

								<div className="flex min-w-0 flex-1 flex-col gap-0.5 md:gap-1">
									<h3 className="font-semibold text-base text-card-foreground group-hover:text-accent-foreground md:text-lg">
										{item.title}
									</h3>
									<p className="text-muted-foreground text-xs md:text-sm">{item.description}</p>
								</div>

								<ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent-foreground" />
							</Link>
						);
					})}
				</div>
			</div>

			<ConfirmationDialog
				isOpen={isLogoutDialogOpen}
				onClose={handleCancelLogout}
				onConfirm={handleConfirmLogout}
				title="Sign Out"
				description="Are you sure you want to sign out? You will need to sign in again to access your account."
				confirmText="Sign Out"
				cancelText="Cancel"
				confirmVariant="destructive"
				cancelVariant="outline"
			/>
		</div>
	);
};

export default Settings;