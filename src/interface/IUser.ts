import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    age:number;
    gender:number;
    role: string; 
    createdAt?:Date;
}