import User from "../model/userModel";
import { IUser } from "../interface/IUser";
class UserServices {
    addUser = async (userData: IUser): Promise<IUser> => {
        const user = new User(userData);
        return await user.save();
    }
    allUser = async (): Promise<IUser[]> => {
        const user = User.find();
        return user;
    }

    deleteUser = async (id: string): Promise<void> => {
        await User.findByIdAndDelete(id);
    }
    userById = async (id: string): Promise<IUser | null> => {
        const user = await User.findById(id);

        return user
    }
    updateUser = async (id: string, userData: IUser): Promise<IUser | null> => {
        const user = await User.findById(id);
        if (!user) {
            throw new Error("User Not Found");
        }
        return await User.findByIdAndUpdate(id, userData, { new: true });
    }


}

export default new UserServices();