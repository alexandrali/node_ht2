import express, {Request, Response} from 'express';
// eslint-disable-next-line node/no-unpublished-import
import bodyParser from 'body-parser';

import {v4} from 'uuid';

const app = express();
const port = 3000;

interface User {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
}

const users: User[] = [];

const tempUser = {
  id: '111',
  login: 'sdf',
  password: 'qweqwe',
  age: 33,
  isDeleted: false,
};

users.push(tempUser);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/user', (req: Request, res: Response) => {
  const loginSubstring = req.query.loginSubstring;
  const limit = req.query.limit;

  if (loginSubstring && limit) {
    res.send(getAutoSuggestUsers(loginSubstring.toString(), +limit));
  } else {
    res.send(users);
  }
});

app.get('/user/:id', (req: Request, res: Response) => {
  const user = users.find(user => user.id === req.params.id);
  res.send(user);
});

app.post('/user', (req: Request, res: Response) => {
  const user: User = {
    id: v4(),
    login: req.body.login,
    password: req.body.password,
    age: req.body.age,
    isDeleted: false,
  };
  users.push(user);

  res.send(user);
});

app.put('/user', (req: Request, res: Response) => {
  const userIndex = users.findIndex(user => user.id === req.body.id);
  if (userIndex >= 0) {
    users[userIndex].login = req.body.login;
    users[userIndex].password = req.body.password;
    users[userIndex].age = req.body.age;
    res.send(users[userIndex]);
  } else {
    res.send('not found');
  }
});

app.delete('/user/:id', (req: Request, res: Response) => {
  const userIndex = users.findIndex(user => user.id === req.params.id);
  if (userIndex >= 0) {
    users[userIndex].isDeleted = true;
    res.send(users[userIndex]);
  } else {
    res.send('not found!');
  }
});

app.listen(port, () => {
  console.log(`Task 1 started on port ${port}...`);
});

function getAutoSuggestUsers(loginSubstring: string, limit: number): User[] {
  const sortedByLogin = users.sort((a, b) =>
    a.login.toLowerCase() < b.login.toLowerCase()
      ? -1
      : b.login.toLowerCase() > a.login.toLowerCase()
      ? 1
      : 0
  );

  const suggestedUsers = sortedByLogin.filter(user =>
    user.login.includes(loginSubstring)
  );
  return suggestedUsers.slice(0, limit);
}
