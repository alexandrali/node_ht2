// eslint-disable-next-line node/no-unpublished-import
import Joi from 'joi';
import {ContainerTypes, ValidatedRequestSchema} from 'express-joi-validation';

type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

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
    .items(
      Joi.string().valid('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES')
    )
    .required(),
});

export interface GroupUsersRequestBodySchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    ids: string[];
  };
}

export const groupUsersBodySchema = Joi.object({
  ids: Joi.array().items(Joi.string()).required(),
});
