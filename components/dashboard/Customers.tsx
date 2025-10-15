import { ArrowUpRight, Plus, Users } from "lucide-react";
import Link from "next/link";
import CustomerCard from "@/components/customers/CustomerCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CustomerWithBalance } from "@/types/customers";

interface CustomersProps {
	customers: CustomerWithBalance[];
	isLoading: boolean;
}

export const Customers = ({ customers, isLoading }: CustomersProps) => {
	return (
		<div className="mb-6">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="font-semibold text-foreground text-lg">Recent Customers</h2>
				<Button variant="outline" asChild>
					<Link href="/dashboard/customers">
						<ArrowUpRight className="mr-2 h-4 w-4" />
						View All
					</Link>
				</Button>
			</div>

			{isLoading ? (
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{Array.from({ length: 8 }).map((_, i) => (
						<Card key={i}>
							<CardContent className="p-3">
								<Skeleton className="mb-2 h-4 w-3/4" />
								<Skeleton className="mb-1 h-3 w-1/2" />
								<Skeleton className="h-3 w-2/3" />
								<div className="mt-3 rounded-lg border p-2">
									<Skeleton className="mx-auto h-6 w-16" />
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			) : customers.length > 0 ? (
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{customers.map((customer) => (
						<CustomerCard key={customer.id} customer={customer} />
					))}
				</div>
			) : (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-8">
						<Users className="mb-2 h-8 w-8 text-muted-foreground" />
						<h3 className="mb-1 font-medium text-foreground">
							No customers yet
						</h3>
						<p className="text-center text-muted-foreground text-sm">
							Get started by adding your first customer
						</p>
						<Button className="mt-3" asChild>
							<Link href="/dashboard/customers/new">
								<Plus className="mr-2 h-4 w-4" />
								Add Customer
							</Link>
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
};