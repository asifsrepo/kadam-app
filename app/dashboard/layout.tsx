"use client";

import { LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const pathname = usePathname();
    const activeTab = pathname === "/dashboard" ? "dashboard" : "settings";

    return (
        <main className="flex h-screen flex-col">
            <div className="flex-1 overflow-auto pb-16">
                {children}
            </div>

            <nav className="fixed right-0 bottom-0 left-0 z-50 h-16 w-full border-t bg-background">
                <div className="flex h-full items-center justify-around px-2">
                    <Button
                        variant="ghost"
                        asChild
                        className={`h-full flex-1 flex-col gap-0.5 rounded-lg ${activeTab === "dashboard"
                            ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                            : "text-muted-foreground"
                            }`}
                    >
                        <Link
                         href="/dashboard"
                         prefetch
                         >
                            <LayoutDashboard className="h-5 w-5" />
                            <span className="font-medium text-[10px]">Dashboard</span>
                        </Link>
                    </Button>

                    <Button
                        variant="ghost"
                        asChild
                        className={`h-full flex-1 flex-col gap-0.5 rounded-lg ${activeTab === "settings"
                            ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                            : "text-muted-foreground"
                            }`}
                    >
                        <Link
                            href="/dashboard/settings"
                            prefetch
                        >
                            <Settings className="h-5 w-5" />
                            <span className="font-medium text-[10px]">Settings</span>
                        </Link>
                    </Button>
                </div>
            </nav>
        </main>
    );
};

export default DashboardLayout;
