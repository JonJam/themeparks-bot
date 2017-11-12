import express = require("express");

// tslint:disable:variable-name
export function get(_req: express.Request, res: express.Response) {
  res.send("index");
}
