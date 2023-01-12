export default interface User {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
}

interface UserRes {
  id: string;
  login: string;
  age: number;
}

export function getResUser(user: User): UserRes {
  const userRes: UserRes = {
    id: user.id,
    login: user.login,
    age: user.age,
  };
  return userRes;
}

export function getResUsers(users: User[]): UserRes[] {
  return users.map(user => getResUser(user));
}

export function getAutoSuggestUsers(
  users: User[],
  loginSubstring: string,
  limit?: number
): User[] {
  const sortedByLogin = users.sort((a, b) =>
    a.login.toLowerCase() < b.login.toLowerCase()
      ? -1
      : b.login.toLowerCase() > a.login.toLowerCase()
      ? 1
      : 0
  );

  const suggestedUsers = sortedByLogin.filter(
    user => user.login.includes(loginSubstring) && !user.isDeleted
  );
  return limit ? suggestedUsers.slice(0, limit) : suggestedUsers;
}
