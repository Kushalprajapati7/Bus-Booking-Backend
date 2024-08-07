import mongoose, { Schema } from "mongoose";
import { IUser } from "../interface/IUser";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, enum: ['male', 'female', 'other'], required: true },
        role: { type: String, enum: ['admin', 'user'], default: 'user' },
    },
    {
        timestamps: true
    }
)

const User = mongoose.model<IUser>('User', userSchema);
export default User;