import { IUser } from "./user";

export interface ICustomer {
	id: string;
	name: string;
	address: string;
	email: string;
	phone: string;
	status: string;
	createdAt: string;
	idNumber: string;
	createdBy: IUser["id"];
	limit: number;
}

export type CustomerWithBalance = ICustomer & { balance: number };
