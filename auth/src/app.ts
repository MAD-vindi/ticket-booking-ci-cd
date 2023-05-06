import express from "express";
import "express-async-errors";
import bodyParser from "body-parser";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler , NotFoundError} from "@vintickets/common";
import cookieSession from "cookie-session";

const app = express();
app.set("trust proxy", true); // so that express is aware that it's behind a proxy of ingress nginx.
app.use(bodyParser.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", async (req, res) => {
  //next(new NotFoundError()); we are not gonna use next, throw will be used with the help of a package
  // (express-async-errors)
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
