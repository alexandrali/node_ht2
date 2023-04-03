import groupService from '../../services/group.service';
// eslint-disable-next-line node/no-unpublished-import
import request from 'supertest';
import app from '../../app';
import expressLoader from '../../loaders/express';
import {Groups} from '../../loaders/database';
import {Permission} from '../../config/enums';

jest.mock('../../services/group.service', () => ({
  getGroups: jest.fn(),
  getGroup: jest.fn(),
  createGroup: jest.fn(),
  updateGroup: jest.fn(),
  deleteGroup: jest.fn(),
  addGroupsToGroup: jest.fn(),
  addUsersToGroup: jest.fn(),
}));

// Mocking authentication middleware
jest.mock('../../config/auth', () => jest.fn((req, res, next) => next()));

const mockedError = new Error('Test error');

const mockedGroup = {
  id: 'id',
  name: 'name',
  permissions: [Permission.read],
};

const newGroup = {
  name: 'name',
  permissions: [Permission.read],
};

const userIds = ['b9cf89ef-8738-4162-b72b-fe6ff3be9500'];

describe('GroupController', () => {
  beforeAll(() => {
    expressLoader({app});
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /groups', () => {
    it('should return array of groups', async () => {
      const mockedGroupsArray = [Groups.build(mockedGroup)];
      (
        groupService as jest.MockedObject<typeof groupService>
      ).getGroups.mockResolvedValueOnce(mockedGroupsArray);

      const response = await request(app).get('/groups');

      expect(groupService.getGroups).toBeCalled();
      expect(response.body).toEqual([mockedGroup]);
    });

    it('should call next() if request fails', async () => {
      const next = jest.fn();
      (
        groupService as jest.MockedObject<typeof groupService>
      ).getGroups.mockRejectedValueOnce(next(mockedError));

      await request(app).get('/groups');
      expect(next).toHaveBeenCalledWith(mockedError);
    });
  });

  describe('GET /groups/:id', () => {
    it('should return group by id', async () => {
      (
        groupService as jest.MockedObject<typeof groupService>
      ).getGroup.mockResolvedValue(Groups.build(mockedGroup));

      const response = await request(app).get(`/groups/${mockedGroup.id}`);

      expect(groupService.getGroup).toBeCalledWith(mockedGroup.id);
      expect(response.body).toEqual(mockedGroup);
    });

    it('should call next() if request fails', async () => {
      const next = jest.fn();
      (
        groupService as jest.MockedObject<typeof groupService>
      ).getGroup.mockRejectedValueOnce(next(mockedError));

      await request(app).get(`/groups/${mockedGroup.id}`);
      expect(next).toHaveBeenCalledWith(mockedError);
    });
  });

  describe('POST /groups', () => {
    it('should return group info if created', async () => {
      (
        groupService as jest.MockedObject<typeof groupService>
      ).createGroup.mockResolvedValueOnce(mockedGroup);

      const response = await request(app).post('/groups').send(newGroup);

      expect(groupService.createGroup).toBeCalledWith(
        mockedGroup.name,
        mockedGroup.permissions
      );
      expect(response.body).toEqual(mockedGroup);
    });

    it('should call next() if request fails', async () => {
      const next = jest.fn();
      (
        groupService as jest.MockedObject<typeof groupService>
      ).createGroup.mockRejectedValueOnce(mockedError);

      await request(app).post('/groups').send(next(mockedError));
      expect(next).toHaveBeenCalledWith(mockedError);
    });
  });

  describe('PUT /groups/:id', () => {
    it('should return group by id', async () => {
      (
        groupService as jest.MockedObject<typeof groupService>
      ).updateGroup.mockResolvedValueOnce(Groups.build(mockedGroup));

      const response = await request(app)
        .put(`/groups/${mockedGroup.id}`)
        .send(newGroup);

      expect(groupService.updateGroup).toBeCalledWith(
        mockedGroup.id,
        mockedGroup.name,
        mockedGroup.permissions
      );
      expect(response.body).toEqual(mockedGroup);
    });

    it('should call next() if request fails', async () => {
      const next = jest.fn();
      (
        groupService as jest.MockedObject<typeof groupService>
      ).updateGroup.mockRejectedValueOnce(mockedError);

      await request(app)
        .put(`/groups/${mockedGroup.id}`)
        .send(next(mockedError));
      expect(next).toHaveBeenCalledWith(mockedError);
    });
  });

  describe('DELETE /groups/:id', () => {
    it('should delete group by id', async () => {
      (
        groupService as jest.MockedObject<typeof groupService>
      ).deleteGroup.mockResolvedValueOnce(1);

      const response = await request(app).delete(`/groups/${mockedGroup.id}`);

      expect(groupService.deleteGroup).toBeCalledWith(mockedGroup.id);
      expect(response.status).toEqual(204);
    });

    it('should call next() if request fails', async () => {
      const next = jest.fn();
      (
        groupService as jest.MockedObject<typeof groupService>
      ).deleteGroup.mockRejectedValueOnce(next(mockedError));

      await request(app).delete(`/groups/${mockedGroup.id}`);
      expect(next).toHaveBeenCalledWith(mockedError);
    });
  });

  describe('POST /groups/:id/add-users', () => {
    it('should return group after users were added', async () => {
      const groupWithUsers = {
        ...mockedGroup,
        users: [
          {id: 'b9cf89ef-8738-4162-b72b-fe6ff3be9500', login: 'login', age: 15},
        ],
      };

      (
        groupService as jest.MockedObject<typeof groupService>
      ).addUsersToGroup.mockResolvedValueOnce(Groups.build(groupWithUsers));

      const response = await request(app)
        .post(`/groups/${mockedGroup.id}/add-users`)
        .send({userIds: userIds});

      expect(groupService.addUsersToGroup).toBeCalledWith(
        mockedGroup.id,
        userIds
      );
    });

    it('should call next() if request fails', async () => {
      const next = jest.fn();
      (
        groupService as jest.MockedObject<typeof groupService>
      ).addUsersToGroup.mockRejectedValueOnce(mockedError);

      await request(app)
        .post(`/groups/${mockedGroup.id}/add-users`)
        .send(next(mockedError));

      expect(next).toHaveBeenCalledWith(mockedError);
    });
  });
});
