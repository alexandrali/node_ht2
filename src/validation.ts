import {Request, Response} from 'express';
// eslint-disable-next-line node/no-unpublished-import
import Joi from 'joi';

export const userSchema = {
  query: Joi.object({
    loginSubstring: Joi.string(),
    limit: Joi.number().integer().greater(0),
  }),
  body: Joi.object({
    id: Joi.string(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).messages({
      'string.pattern.base': '"password" must contain letters and numbers',
    }),
    login: Joi.string().required(),
    age: Joi.number().integer().greater(4).less(130).required(),
  }),
};

export function validateUserParams(req: Request, res: Response): boolean {
  const validationResult = userSchema.body.validate(req.body, {
    abortEarly: false,
  });
  if (validationResult.error) {
    res.status(400).send(validationResult.error.details);
  }
  return !validationResult.error;
}

export function validateUserQuery(req: Request, res: Response): boolean {
  const validationResult = userSchema.query.validate(req.query);
  if (validationResult.error) {
    res.status(400).send();
  }
  return !validationResult.error;
}
