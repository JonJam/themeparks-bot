import { config } from "dotenv";

if (process.env.NODE_ENV === "development") {
  // Used only in development to load environment variables from local file.
  config();
}

export const appId = process.env.MICROSOFT_APP_ID;
export const appPassword = process.env.MICROSOFT_APP_PASSWORD;
export const port = normalizePort(process.env.PORT || "8080");
export const luisAppUrl = process.env.LUIS_APP_URL;

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string) {
  const parsedPort = parseInt(val, 10);

  if (isNaN(parsedPort)) {
    // named pipe
    return val;
  }

  if (parsedPort >= 0) {
    // port number
    return parsedPort;
  }

  return false;
}
