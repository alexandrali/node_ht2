"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// eslint-disable-next-line node/no-unpublished-import
const body_parser_1 = __importDefault(require("body-parser"));
const uuid_1 = require("uuid");
const app = (0, express_1.default)();
const port = 3000;
const users = [];
const tempUser = {
    id: '111',
    login: 'sdf',
    password: 'qweqwe',
    age: 33,
    isDeleted: false,
};
users.push(tempUser);
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.get('/user', (req, res) => {
    const loginSubstring = req.query.loginSubstring;
    const limit = req.query.limit;
    if (loginSubstring && limit) {
        res.send(getAutoSuggestUsers(loginSubstring.toString(), +limit));
    }
    else {
        res.send(users);
    }
});
app.get('/user/:id', (req, res) => {
    const user = users.find(user => user.id === req.params.id);
    res.send(user);
});
app.post('/user', (req, res) => {
    const user = {
        id: (0, uuid_1.v4)(),
        login: req.body.login,
        password: req.body.password,
        age: req.body.age,
        isDeleted: false,
    };
    users.push(user);
    res.send(user);
});
app.put('/user', (req, res) => {
    const userIndex = users.findIndex(user => user.id === req.body.id);
    if (userIndex >= 0) {
        users[userIndex].login = req.body.login;
        users[userIndex].password = req.body.password;
        users[userIndex].age = req.body.age;
        res.send(users[userIndex]);
    }
    else {
        res.send('not found');
    }
});
app.delete('/user/:id', (req, res) => {
    const userIndex = users.findIndex(user => user.id === req.params.id);
    if (userIndex >= 0) {
        users[userIndex].isDeleted = true;
        res.send(users[userIndex]);
    }
    else {
        res.send('not found!');
    }
});
app.listen(port, () => {
    console.log(`Task 1 started on port ${port}...`);
});
function getAutoSuggestUsers(loginSubstring, limit) {
    const sortedByLogin = users.sort((a, b) => a.login.toLowerCase() < b.login.toLowerCase()
        ? -1
        : b.login.toLowerCase() > a.login.toLowerCase()
            ? 1
            : 0);
    const suggestedUsers = sortedByLogin.filter(user => user.login.includes(loginSubstring));
    return suggestedUsers.slice(0, limit);
}
//# sourceMappingURL=index.js.map