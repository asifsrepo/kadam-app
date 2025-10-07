import { Building2, ChevronRight, CreditCard, Users, Users2 } from "lucide-react";
import Link from "next/link";

const Settings = () => {
	const settingsItems = [
		{
			title: "Staff Management",
			description: "Add and manage staff members and permissions",
			href: "/dashboard/settings/staffs",
			icon: Users,
		},
		{
			title: "Customers",
			description: "View and manage your customer database",
			href: "/dashboard/customers",
			icon: Users2,
		},
		{
			title: "Store Management",
			description: "Configure your store settings and preferences",
			href: "/dashboard/settings/stores",
			icon: Building2,
		},
		{
			title: "Plans & Billing",
			description: "Manage your subscription and billing details",
			href: "/dashboard/settings/plans",
			icon: CreditCard,
		},
	];

	return (
		<div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
			<div className="flex flex-col gap-2">
				<h1 className="font-bold text-2xl text-foreground md:text-3xl">Settings</h1>
				<p className="text-muted-foreground text-sm md:text-base">
					Manage your account and store preferences
				</p>
			</div>

			<div className="flex flex-col gap-3 md:gap-4">
				{settingsItems.map((item) => {
					const Icon = item.icon;
					return (
						<Link
							key={item.href}
							href={item.href}
							className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent md:p-5"
						>
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary md:h-12 md:w-12">
								<Icon className="h-5 w-5 md:h-6 md:w-6" />
							</div>

							{/* Content */}
							<div className="flex min-w-0 flex-1 flex-col gap-1">
								<h3 className="font-semibold text-card-foreground group-hover:text-accent-foreground">
									{item.title}
								</h3>
								<p className="text-muted-foreground text-sm">{item.description}</p>
							</div>

							{/* Arrow Icon */}
							<ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent-foreground" />
						</Link>
					);
				})}
			</div>
		</div>
	);
};

export default Settings;
