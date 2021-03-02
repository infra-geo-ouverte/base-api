import * as Hapi from 'hapi';
import * as Joi from 'joi';

export interface ValidationError extends Joi.ValidationError {
  output: ValidationErrorOutput;
}

export interface ErrorOutput {
  key: string;
  path: string;
  message: string;
  type: string;
  constraint: string;
}

export interface ValidationErrorOutput {
  statusCode: string;
  payload: {
    statusCode: string;
    error: string;
    message: string;
    validation: {
      source: string;
      keys?: string[];
      errors?: ErrorOutput[];
    };
  };
}

export function failAction(messages: { [key: string]: string } = {}) {
  return (_request: Hapi.Request, _h: Hapi.ResponseToolkit, err: ValidationError) => {
    if (!err.details) {
      return err;
    }
    // parse error object
    const errors = parseError(err, messages);

    // build main error message
    const errorMessage = errors.map(e => e.message).join(', ');

    // retrieve validation failure source
    const source = err.output.payload.validation.source;

    // format error response
    err = formatResponse(err, source, errorMessage, errors);

    return err;
  };
}

function parseError(error: ValidationError, messages: object) {
  return error.details.map(i => {
    const err = {
      key: i.context.key,
      path: i.path.join('.'),
      message: i.message,
      type: i.type.split('.').shift(),
      constraint: i.type.split('.').pop()
    };

    // set custom message (if exists)
    if (messages.hasOwnProperty(err.path)) {
      err.message = messages[err.path];
    } else if (messages.hasOwnProperty(err.key)) {
      err.message = messages[err.key];
    } else if (err.constraint === 'allowUnknown') {
      err.key = null;
      err.path = null;
      err.message = 'Unknown field is not allowed';
    }

    return err;
  });
}

function formatResponse(error: ValidationError, source: string, errorMessage: string, errors: ErrorOutput[]) {
  // append errors array to response
  error.output.payload.message = errorMessage;
  error.output.payload.validation = {
    source: source,
    errors: errors
  };

  return error;
}
