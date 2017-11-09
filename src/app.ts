import compression = require("compression");
import express = require("express");
import helmet = require("helmet");
import indexRouter from "./routes/index";
import usersRouter from "./routes/users";

// TODO Sort out anys
// TODO Sort out tslint disables

const app = express();

// Middleware
// Using helmet per best practise: https://expressjs.com/en/advanced/best-practice-security.html#use-helmet
app.use(helmet());
// Using gzip compression per best practise: https://expressjs.com/en/advanced/best-practice-performance.html#use-gzip-compression
app.use(compression());

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
// tslint:disable:variable-name
app.use((_req: any, _res: any, next: any) => {
  const err: any = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err: any, req: any, res: any) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("error");
});

export default app;
