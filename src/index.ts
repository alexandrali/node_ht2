import express, {Request, Response} from 'express';
import {v4} from 'uuid';
import User from './user-actions';
import * as userActions from './user-actions';
import * as userValidation from './validation';
import {sha512} from 'js-sha512';

const app = express();
const port = 3000;

const users: User[] = [];

app.use(express.json());

app.get('/user', (req: Request, res: Response) => {
  const validationResult = userValidation.userSchema.query.validate(req.query);
  if (validationResult.error) {
    res.status(400).send();
  } else {
    const loginSubstring = req.query.loginSubstring || '';
    const limit = req.query.limit ? +req.query.limit : undefined;

    res.send(
      userActions.getResUsers(
        userActions.getAutoSuggestUsers(users, loginSubstring.toString(), limit)
      )
    );
  }
});

app.get('/user/:id', (req: Request, res: Response) => {
  const user = users.find(user => user.id === req.params.id);
  if (user && !user.isDeleted) {
    res.send(userActions.getResUser(user));
  } else {
    res.status(404).send();
  }
});

app.post('/user', (req: Request, res: Response) => {
  if (userValidation.validateUserParams(req, res)) {
    const user: User = {
      id: v4(),
      login: req.body.login,
      password: sha512(req.body.password),
      age: req.body.age,
      isDeleted: false,
    };
    users.push(user);
    res.send(userActions.getResUser(user));
  }
});

app.put('/user', (req: Request, res: Response) => {
  if (userValidation.validateUserQuery(req, res)) {
    const userIndex = users.findIndex(user => user.id === req.body.id);
    if (userIndex >= 0) {
      if (users[userIndex].isDeleted) {
        res.status(500).send();
      } else {
        users[userIndex].login = req.body.login;
        users[userIndex].password = req.body.password;
        users[userIndex].age = req.body.age;
        res.send(userActions.getResUser(users[userIndex]));
      }
    } else {
      res.status(404).send();
    }
  }
});

app.delete('/user/:id', (req: Request, res: Response) => {
  const userIndex = users.findIndex(user => user.id === req.params.id);
  if (userIndex >= 0 && !users[userIndex].isDeleted) {
    users[userIndex].isDeleted = true;
    res.status(204).send();
  } else {
    res.status(500).send();
  }
});

app.listen(port, () => {
  console.log(`Task 1 started on port ${port}...`);
});
