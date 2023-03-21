import {Users} from '../loaders/database';
import bcrypt from 'bcrypt';
import {AUTH_MESSAGES} from '../config/messages';
import jwt from 'jsonwebtoken';
import config from '../config';

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

    const passwordMatches = await bcrypt.compare(
      password,
      user.get('password') as string
    );

    if (!passwordMatches) {
      throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
    } else {
      const payload = {id: user.get('id')};
      return jwt.sign(payload, config.secret, {expiresIn: 120});
    }
  },
};
