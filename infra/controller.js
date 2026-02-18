const {
  MethodNotAllowedError,
  InternalServerError,
  ValidationError,
  NotFoundError,
} = require("./errors");

function onNoMatchHandler(req, res) {
  const publicErrorObject = new MethodNotAllowedError({ method: req.method });
  res.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(err, req, res) {
  if (err instanceof ValidationError || err instanceof NotFoundError) {
    res.status(err.statusCode).json(err);
    return;
  }

  const publicErrorObject = new InternalServerError({
    cause: err,
  });

  console.error(publicErrorObject);
  res.status(publicErrorObject.statusCode).json(publicErrorObject);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
