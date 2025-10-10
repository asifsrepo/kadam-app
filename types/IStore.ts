import { IUser } from "./user";

export interface IStore {
	id: string;
	name: string;
	phone: string;
	ownerId: IUser["id"];
}

export interface IBranch {
	id: string;
	name: string;
	location: string;
	isMain: boolean;
	storeId: IStore["id"];
	ownerId: IUser["id"];
}
