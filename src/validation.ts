// eslint-disable-next-line node/no-unpublished-import
import Joi from 'joi';
import {ContainerTypes, ValidatedRequestSchema} from 'express-joi-validation';
import {VALIDATION_MESSAGES} from './messages';

export interface UserRequestBodySchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    id?: string;
    name: string;
    password: string;
    login: string;
    age: number;
  };
}

export interface UserRequestQuerySchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    loginSubstring?: string;
    limit?: number;
  };
}

export const createUserBodySchema = Joi.object({
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$'))
    .required()
    .messages({
      'string.pattern.base': VALIDATION_MESSAGES.PASSWORD,
    }),
  login: Joi.string().required(),
  age: Joi.number().integer().greater(4).less(130).required(),
});

export const editUserBodySchema = Joi.object({
  id: Joi.string().required(),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$'))
    .required()
    .messages({
      'string.pattern.base': VALIDATION_MESSAGES.PASSWORD,
    }),
  login: Joi.string().required(),
  age: Joi.number().integer().greater(4).less(130).required(),
});

export const suggestUsersQuerySchema = Joi.object({
  loginSubstring: Joi.string(),
  limit: Joi.number().integer().greater(0),
});
