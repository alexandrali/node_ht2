export default interface User {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted?: boolean;
}

interface UserResponse {
  id: string;
  login: string;
  age: number;
}

export function getUsersResponse(users: User[]): UserResponse[] {
  return users.map(user => getUserResponse(user));
}

export function getUserResponse(user: User): UserResponse {
  const UserResponse: UserResponse = {
    id: user.id,
    login: user.login,
    age: user.age,
  };
  return UserResponse;
}

export function getAutoSuggestUsers(
  users: User[],
  loginSubstring: string,
  limit?: number
): User[] {
  const suggestedUsers = users
    .sort((a, b) => a.login.toLowerCase().localeCompare(b.login.toLowerCase()))
    .filter(user => user.login.includes(loginSubstring) && !user.isDeleted);
  return limit ? suggestedUsers.slice(0, limit) : suggestedUsers;
}

export function findUserById(users: User[], id: string): number {
  return users.findIndex(user => user.id === id && !user.isDeleted);
}
