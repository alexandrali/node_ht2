import {Users} from '../loaders/database';
import bcrypt from 'bcrypt';
import {AUTH_MESSAGES} from '../config/messages';

export default {
  async login(login: string, password: string) {
    const user = await Users.findOne({
      where: {
        login: login,
      },
    });

    if (!user) {
      throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const passwordMatches = bcrypt.compareSync(
      password,
      user.get('password') as string
    );

    if (!passwordMatches) {
      throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    return user;
  },
};
