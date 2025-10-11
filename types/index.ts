export * from "./custom";
export * from "./props";
export * from "./schema";
export * from "./transaction";
export * from "./user";

export const Tables = {
	UserProfiles: "profiles",
	Customers: "customers",
	Transactions: "transactions",
	Stores: "stores",
	Branches: "branches",
};

export const QueryKeys = {
	CustomersList: "customersList",
	CustomerDetails: "customerDetails",
	TransactionsList: "transactionsList",
	TransactionDetails: "transactionDetails",
	CustomersTransactions: "customersTransactions",
	StoreWithBranches: "storeWithBranches",
};
