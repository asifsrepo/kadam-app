import { IUser } from "./user";

export interface ICustomer {
    id: string;
    name: string;
    address: string;
    email: string;
    phone: string;
    country: string;
    status: string;
    createdAt: string;
    idNumber: string;
    createdBy: IUser['id']
}