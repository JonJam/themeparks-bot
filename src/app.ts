import compression = require("compression");
import express = require("express");
import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import helmet = require("helmet");
import StatusError from "./errors/StatusError";
import indexRouter from "./routes/index";
import usersRouter from "./routes/users";

const app = express();

// Middleware
// Using helmet per best practise: https://expressjs.com/en/advanced/best-practice-security.html#use-helmet
app.use(helmet());
// Using gzip compression per best practise: https://expressjs.com/en/advanced/best-practice-performance.html#use-gzip-compression
app.use(compression());

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);

// 404 - error handler
// tslint:disable:variable-name
app.use(
  (
    _req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) => {
    next(new StatusError("Not Found", 404));
  }
);

// 500 - error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Checking if headers sent per recommendation: https://expressjs.com/en/guide/error-handling.html
  if (res.headersSent) {
    return next(err);
  }

  // set locals, only providing error in development.
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.send();
});

export default app;
