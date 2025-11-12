import { AdminModel } from '../models/admin.model.js';
import { generateToken } from '../utils/jwt.js';

export class AuthService {
static async login(login, password) {
  const admin = await AdminModel.findByLogin(login);
  
  if (!admin) {
    throw new Error('Invalid credentials');
  }
  
  const isValid = await AdminModel.verifyPassword(password, admin.password);
  
  if (!isValid) {
    throw new Error('Invalid credentials');
  }
  
  await AdminModel.updateLastLogin(login);
  
  const token = generateToken({
    login: admin.login,
    id: admin.id
  });
  
  return {
    token,
    user: {
      login: admin.login,
      lastLogin: admin.last_login
    }
  };
}

    static async verify(user) {
        const admin = await AdminModel.findByLogin(user.login);
        if (!admin) {
            throw new Error('User not found');
        }

        return {
            login: admin.login,
            lastLogin: admin.last_login
        };
    }
}
