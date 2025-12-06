import { Zap } from "lucide-react";

export * from "./custom";
export * from "./props";
export * from "./schema";
export * from "./subscription";
export * from "./transaction";
export * from "./user";

export const Tables = {
	UserProfiles: "profiles",
	Customers: "customers",
	Transactions: "transactions",
	Stores: "stores",
	Branches: "branches",
	Subscriptions: "subscriptions",
};

export const QueryKeys = {
	CustomersList: "customersList",
	CustomerDetails: "customerDetails",
	TransactionsList: "transactionsList",
	TransactionDetails: "transactionDetails",
	CustomersTransactions: "customersTransactions",
	StoreWithBranches: "storeWithBranches",
	Branches: "branches",
	UserSubscription: "userSubscription",
	SubscriptionHistory: "subscriptionHistory",
};

export interface PlanFeature {
	text: string;
	included: boolean;
}
export interface Plan {
	id: string;
	name: string;
	description: string;
	icon: typeof Zap;
	monthlyPrice: number;
	yearlyPrice: number;
	features: PlanFeature[];
	popular?: boolean;
	badge?: string;
}
