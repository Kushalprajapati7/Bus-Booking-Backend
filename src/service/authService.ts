import { IUser } from "../interface/IUser";
import User from "../model/userModel";
import bcrypt from 'bcrypt'
import { JwtUtills } from "../utils/jwtUtiils";

class AuthServices {
    register = async (user: IUser): Promise<IUser> => {
        if (user.role && user.role === 'admin') {
            throw new Error('Cannot set role as admin during user creation');
        }
        const hashPassword = await bcrypt.hash(user.password, 10);
        user.password = hashPassword;
        const newUser = new User(user);
        return await newUser.save();
    }

    login = async (email: string, password: string): Promise<IUser | any> => {
        let user;
        user = await User.findOne({ email: email })

        if (!user) {
            throw new Error(`User with Email ${email} not found`);
        }
        const pass = await bcrypt.compare(password, user.password);
        if (!pass) {
            throw new Error(`Incorrect password`);
        }
        const role = user.role;
        const userName = user.name;
        const userId = user._id;
        const token = JwtUtills.generateToken(user.id, user.role);
        return { token, role, userName, userId };;
    }

}

export default new AuthServices();