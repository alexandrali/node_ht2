// eslint-disable-next-line node/no-unpublished-import
import Joi from 'joi';
import {ContainerTypes, ValidatedRequestSchema} from 'express-joi-validation';
import {Permission} from '../config/enums';

export interface GroupRequestBodySchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    id?: string;
    name: string;
    permissions: Permission[];
  };
}

export const groupBodySchema = Joi.object({
  name: Joi.string().required(),
  permissions: Joi.array()
    .items(Joi.string().valid(...Object.values(Permission)))
    .required(),
});

export interface GroupUsersRequestBodySchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    userIds: string[];
  };
}

export const groupUsersBodySchema = Joi.object({
  userIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
});
