import userService from '../../services/user.service';
// eslint-disable-next-line node/no-unpublished-import
import request from 'supertest';
import app from '../../app';
import expressLoader from '../../loaders/express';
import {Users} from '../../loaders/database';

jest.mock('../../services/user.service', () => ({
  getSuggestedUsers: jest.fn(),
  getUser: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));

// Mocking authentication middleware
jest.mock('../../config/auth', () => jest.fn((req, res, next) => next()));

const mockedError = new Error('Test error');

const newUser = {
  login: 'login',
  password: 'password1',
  age: 55,
};

const mockedUser = {
  login: 'login',
  id: 'userid',
  age: 55,
};

describe('UserController', () => {
  beforeAll(() => {
    expressLoader({app});
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /users', () => {
    it('should return array of suggested users', async () => {
      const mockedUsersArray = [Users.build(mockedUser)];
      (
        userService as jest.MockedObject<typeof userService>
      ).getSuggestedUsers.mockResolvedValue(mockedUsersArray);

      const params = {
        limit: undefined,
        loginSubstring: '',
      };

      const response = await request(app).get('/users').send(params);

      expect(userService.getSuggestedUsers).toBeCalledWith(
        params.loginSubstring,
        params.limit
      );
      expect(response.body).toEqual([mockedUser]);
    });

    it('should call next() if request fails', async () => {
      const next = jest.fn();
      (
        userService as jest.MockedObject<typeof userService>
      ).getSuggestedUsers.mockRejectedValueOnce(next(mockedError));

      const params = {
        limit: undefined,
        loginSubstring: '',
      };

      await request(app).get('/users').send(params);
      expect(next).toHaveBeenCalledWith(mockedError);
    });
  });

  describe('GET /users/:id', () => {
    it('should return user by id', async () => {
      (
        userService as jest.MockedObject<typeof userService>
      ).getUser.mockResolvedValueOnce(Users.build(mockedUser));

      const response = await request(app).get(`/users/${mockedUser.id}`);

      expect(userService.getUser).toBeCalledWith(mockedUser.id);
      expect(response.body).toEqual(mockedUser);
    });

    it('should call next() if request fails', async () => {
      const next = jest.fn();
      (
        userService as jest.MockedObject<typeof userService>
      ).getUser.mockRejectedValueOnce(next(mockedError));

      await request(app).get(`/users/${mockedUser.id}`);
      expect(next).toHaveBeenCalledWith(mockedError);
    });
  });

  describe('POST /users', () => {
    it('should return user info if created', async () => {
      (
        userService as jest.MockedObject<typeof userService>
      ).createUser.mockResolvedValue(mockedUser);

      const response = await request(app).post('/users').send(newUser);

      expect(userService.createUser).toBeCalledWith(
        newUser.age,
        newUser.login,
        newUser.password
      );
      expect(response.body).toEqual(mockedUser);
    });

    it('should call next() if request fails', async () => {
      const next = jest.fn();
      (
        userService as jest.MockedObject<typeof userService>
      ).createUser.mockRejectedValueOnce(mockedError);

      await request(app).post('/users').send(next(mockedError));
      expect(next).toHaveBeenCalledWith(mockedError);
    });
  });

  describe('PUT /users/:id', () => {
    it('should return user by id', async () => {
      (
        userService as jest.MockedObject<typeof userService>
      ).updateUser.mockResolvedValue(Users.build(mockedUser));

      const response = await request(app)
        .put(`/users/${mockedUser.id}`)
        .send(newUser);

      expect(userService.updateUser).toBeCalledWith(
        mockedUser.id,
        mockedUser.age,
        mockedUser.login,
        newUser.password
      );
      expect(response.body).toEqual(mockedUser);
    });

    it('should call next() if request fails', async () => {
      const next = jest.fn();
      (
        userService as jest.MockedObject<typeof userService>
      ).updateUser.mockRejectedValueOnce(mockedError);

      await request(app).put(`/users/${mockedUser.id}`).send(next(mockedError));
      expect(next).toHaveBeenCalledWith(mockedError);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user by id', async () => {
      (
        userService as jest.MockedObject<typeof userService>
      ).deleteUser.mockResolvedValue(1);

      const response = await request(app).delete(`/users/${mockedUser.id}`);

      expect(userService.deleteUser).toBeCalledWith(mockedUser.id);
      expect(response.status).toEqual(204);
    });

    it('should call next() if request fails', async () => {
      const next = jest.fn();
      (
        userService as jest.MockedObject<typeof userService>
      ).deleteUser.mockRejectedValueOnce(next(mockedError));

      await request(app).delete(`/users/${mockedUser.id}`);
      expect(next).toHaveBeenCalledWith(mockedError);
    });
  });
});
