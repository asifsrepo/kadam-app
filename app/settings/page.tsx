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
			href: "/customers",
			icon: Users2,
		},
		{
			title: "Branch Management",
			description: "View and manage your branches",
			href: "/settings/branches",
			icon: Building2,
		},
		{
			title: "Appearance",
			description: "Customize theme and colors",
			href: "/settings/appearance",
			icon: Palette,
		},
		{
			title: "Plans & Billing",
			description: "Manage subscription and billing",
			href: "/settings/plans",
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
			<div className="sticky top-0 z-10 border-border/60 border-b bg-background/90 backdrop-blur">
				<div className="px-4 py-4 md:px-6">
					<div className="flex items-center gap-3">
						<BackButton />
						<div>
							<p className="text-muted-foreground text-xs">Manage your store</p>
							<h1 className="font-semibold text-lg md:text-2xl">Settings</h1>
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-4 px-4 py-5 md:px-6">
				<ShopInfo variant="settings" />

				<div className="flex flex-col gap-3">
					{settingsItems.map((item) => {
						const Icon = item.icon;
						const isLogout = item.title === "Sign Out";

						if (isLogout) {
							return (
								<button
									key={item.title}
									onClick={item.onClick}
									className="group flex min-h-[76px] w-full items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 text-left transition-colors hover:bg-accent/60"
								>
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
										<Icon className="h-5 w-5" />
									</div>

									<div className="flex min-w-0 flex-1 flex-col gap-0.5">
										<h3 className="font-semibold text-base text-card-foreground group-hover:text-accent-foreground">
											{item.title}
										</h3>
										<p className="text-muted-foreground text-xs">
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
								className="group flex min-h-[76px] items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:bg-accent/60"
							>
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
									<Icon className="h-5 w-5" />
								</div>

								<div className="flex min-w-0 flex-1 flex-col gap-0.5">
									<h3 className="font-semibold text-base text-card-foreground group-hover:text-accent-foreground">
										{item.title}
									</h3>
									<p className="text-muted-foreground text-xs">{item.description}</p>
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
