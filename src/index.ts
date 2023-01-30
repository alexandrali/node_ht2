import express, {Request, Response, NextFunction} from 'express';
import {v4} from 'uuid';
import * as userValidation from './validation/validation-schemas';
import {RESPONSE_MESSAGES} from './messages';
import bcrypt from 'bcrypt';
import {ValidatedRequest, createValidator} from 'express-joi-validation';
import {Op, Sequelize} from 'sequelize';
import {UserModel} from './models/user-model';

const sequelize = new Sequelize(
  'postgres://hexaunhz:QPLbFw6DkBV9-5nSv98k7dFeUeWYC48R@snuffleupagus.db.elephantsql.com/hexaunhz'
);

const Users = sequelize.define('users', UserModel, {paranoid: true});

const SALT_ROUNDS = 10;
const returnAttributes = ['login', 'password', 'age'];

const app = express();
const port = 3000;

const validator = createValidator();

async function initUsersDB() {
  try {
    await sequelize.authenticate();
    await Users.sync();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

initUsersDB();

app.use(express.json());

app.get(
  '/users',
  validator.query(userValidation.suggestUsersQuerySchema),
  async (
    req: ValidatedRequest<userValidation.UserRequestQuerySchema>,
    res: Response
  ) => {
    const loginSubstring = req.query.loginSubstring || '';
    const users = await Users.findAll({
      where: {
        login: {[Op.substring]: loginSubstring},
      },
      order: [['login', 'ASC']],
      limit: req.query.limit ? +req.query.limit : undefined,
    });
    res.send(JSON.stringify(users));
  }
);

app.get('/users/:id', async (req: Request, res: Response) => {
  const user = await Users.findOne({
    where: {id: req.params.id},
    attributes: returnAttributes,
  });
  if (user) {
    res.send(user);
  } else {
    res.status(404).send(RESPONSE_MESSAGES.USER_NOT_FOUND);
  }
});

app.post(
  '/users',
  validator.body(userValidation.createUserBodySchema),
  async (
    req: ValidatedRequest<userValidation.UserRequestBodySchema>,
    res: Response
  ) => {
    const {age, login, password} = req.body;
    const newUser = await Users.create(
      {
        id: v4(),
        login,
        password: bcrypt.hashSync(password, SALT_ROUNDS),
        age,
      },
      {returning: returnAttributes}
    );
    res.send(newUser);
  }
);

app.put(
  '/users/:id',
  validator.body(userValidation.createUserBodySchema),
  async (
    req: ValidatedRequest<userValidation.UserRequestBodySchema>,
    res: Response
  ) => {
    const {age, login, password} = req.body;
    const updatedUser = await Users.update(
      {login, password: bcrypt.hashSync(password, SALT_ROUNDS), age},
      {
        where: {id: req.params.id},
        returning: returnAttributes,
      }
    );
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      res.status(404).send(RESPONSE_MESSAGES.USER_NOT_FOUND);
    }
  }
);

app.delete('/users/:id', (req: Request, res: Response) => {
  Users.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(204).send();
});

app.use((err: unknown, res: Response, next: NextFunction) => {
  if (!err) {
    return next();
  }
  res.status(500).send(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR);
});

app.listen(port, () => {
  console.log(`Task 1 started on port ${port}...`);
});
