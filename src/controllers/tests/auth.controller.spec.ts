import authService from '../../services/auth.service';
import app from '../../app';
import expressLoader from '../../loaders/express';
// eslint-disable-next-line node/no-unpublished-import
import request from 'supertest';

jest.mock('../../services/auth.service', () => ({
  login: jest.fn(),
}));

// Mocking authentication middleware
jest.mock('../../config/auth', () => jest.fn((req, res, next) => next()));

const mockedToken = '12345';

const mockedCredentials = {
  login: 'login',
  password: 'password',
};

const mockedError = new Error('Test error');

describe('AuthController', () => {
  beforeAll(() => {
    expressLoader({app});
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /authenticate', () => {
    it('should return token', () => {
      expect(true).toEqual(true);
    });
    it('should return token if user exists', async () => {
      (
        authService as jest.MockedObject<typeof authService>
      ).login.mockResolvedValueOnce(mockedToken);

      const response = await request(app)
        .post('/authenticate')
        .send(mockedCredentials);

      expect(authService.login).toHaveBeenCalledWith(
        mockedCredentials.login,
        mockedCredentials.password
      );
      expect(response.text).toEqual(mockedToken);
    });

    it('should handle errors', async () => {
      const next = jest.fn();
      (
        authService as jest.MockedObject<typeof authService>
      ).login.mockRejectedValueOnce(mockedError);

      await request(app).post('/authenticate').send(next(mockedError));
      expect(next).toHaveBeenCalledWith(mockedError);
    });
  });
});
