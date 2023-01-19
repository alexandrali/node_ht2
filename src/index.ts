import express, {Request, Response, NextFunction} from 'express';
import {v4} from 'uuid';
import User from './user-actions';
import * as userActions from './user-actions';
import * as userValidation from './validation';
import {RESPONSE_MESSAGES} from './messages';
import bcrypt from 'bcrypt';
import {ValidatedRequest, createValidator} from 'express-joi-validation';

const SALT_ROUNDS = 10;

const app = express();
const port = 3000;

const validator = createValidator();

const users: User[] = [];

app.use(express.json());

app.get(
  '/users',
  validator.query(userValidation.suggestUsersQuerySchema),
  (
    req: ValidatedRequest<userValidation.UserRequestQuerySchema>,
    res: Response
  ) => {
    const loginSubstring = req.query.loginSubstring || '';
    const limit = req.query.limit ? +req.query.limit : undefined;

    res.send(
      userActions.getUsersResponse(
        userActions.getAutoSuggestUsers(users, loginSubstring, limit)
      )
    );
  }
);

app.get('/users/:id', (req: Request, res: Response) => {
  const userIndex = userActions.findUserById(users, req.params.id);
  if (userIndex >= 0) {
    res.send(userActions.getUserResponse(users[userIndex]));
  } else {
    res.status(404).send(RESPONSE_MESSAGES.USER_NOT_FOUND);
  }
});

app.post(
  '/users',
  validator.body(userValidation.createUserBodySchema),
  (
    req: ValidatedRequest<userValidation.UserRequestBodySchema>,
    res: Response
  ) => {
    const {age, login, password} = req.body;
    const user: User = {
      id: v4(),
      login,
      password: bcrypt.hashSync(password, SALT_ROUNDS),
      age,
    };
    users.push(user);
    res.send(userActions.getUserResponse(user));
  }
);

app.put(
  '/users',
  validator.body(userValidation.editUserBodySchema),
  (
    req: ValidatedRequest<userValidation.UserRequestBodySchema>,
    res: Response
  ) => {
    const {age, id, login, password} = req.body;
    const userIndex = userActions.findUserById(users, id as string);
    if (userIndex >= 0) {
      users[userIndex].login = login;
      users[userIndex].password = password;
      users[userIndex].age = age;
      res.send(userActions.getUserResponse(users[userIndex]));
    } else {
      res.status(404).send(RESPONSE_MESSAGES.USER_NOT_FOUND);
    }
  }
);

app.delete('/users/:id', (req: Request, res: Response) => {
  const userIndex = userActions.findUserById(users, req.params.id);
  if (userIndex >= 0) {
    users[userIndex].isDeleted = true;
    res.status(204).send();
  } else {
    res.status(404).send(RESPONSE_MESSAGES.USER_NOT_FOUND);
  }
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
