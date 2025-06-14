import { NextFunction, Request, Response } from "express";
import { respondWithError } from "../utils/json_resp.js";

type CustomErrorObj = {
  statusCode: number;
  message: string;
};

export function errorHandler(err: Error, _: Request, res: Response, __: NextFunction) {
  const customError: CustomErrorObj = getCustomError(err);

  if (customError.statusCode >= 500) {
    console.log(customError.message);
  }
  respondWithError(res, customError.statusCode, customError.message);
}

function getCustomError(err: Error) {
  const result: CustomErrorObj = {
    statusCode: 500,
    message: "Something went wrong on our end",
  };

  if (err instanceof BadRequestError) {
    result.statusCode = 400;
    result.message = err.message;
  }

  if (err instanceof UnauthorizedError) {
    result.statusCode = 401;
    result.message = err.message;
  }

  if (err instanceof ForbiddenError) {
    result.statusCode = 403;
    result.message = err.message;
  }

  if (err instanceof NotFoundError) {
    result.statusCode = 404;
    result.message = err.message;
  }

  return result;
}

// TODO: Each Class can have its own status code and Default message

export class BadRequestError extends Error {
  //400
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends Error {
  //401
  constructor(message: string) {
    super(message);
  }
}

export class ForbiddenError extends Error {
  //403
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends Error {
  //404
  constructor(message: string) {
    super(message);
  }
}
