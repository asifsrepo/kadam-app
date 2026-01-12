import { IUser } from "./user";

// one store for a customer
export interface IStore {
	id: string;
	name: string;
	phone: string;
	ownerId: IUser["id"];
	currency: string;
}

export interface IBranch {
	id: string;
	name: string;
	location: string;
	isMain: boolean;
	storeId: IStore["id"];
	ownerId: IUser["id"];
	debtLimit: number;
}
