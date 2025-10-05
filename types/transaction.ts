import { ICustomer } from "./customers";
import { IUser } from "./user";

/**
 * Transaction types for debt management:
 * - "credit": Customer takes goods on credit (increases debt)
 * - "payment": Customer pays back debt (reduces debt)
 */
export type TransactionType = "credit" | "payment";

export interface ITransaction {
    id: string;
    customerId: ICustomer["id"];
    createdBy: IUser["id"];
    createdAt: string;
    amount: number;
    currency: string;
    type: TransactionType;
    notes: string;
    paybackDate?: string;
}