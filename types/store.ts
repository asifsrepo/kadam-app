import { IUser } from "./user";

// one store for a customer
export interface IStore {
	id: string;
	name: string;
	phone: string;
	ownerId: IUser["id"];
	storeId: string;
	debtLimit: number;
}

export interface IStoreWithBranches extends IStore {
	branches: IBranch[];
}

export interface IBranch {
	id: string;
	name: string;
	location: string;
	isMain: boolean;
	storeId: IStore["id"];
	ownerId: IUser["id"];
}
