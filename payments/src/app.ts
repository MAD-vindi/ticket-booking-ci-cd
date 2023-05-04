import express from "express";
import "express-async-errors";
import bodyParser from "body-parser";
import { errorHandler, NotFoundError, currentUser } from "@vintickets/common";
import cookieSession from "cookie-session";
import { createChargeRouter } from "./routes/new";

const app = express();
app.set("trust proxy", true); // so that express is aware that it's behind a proxy of ingress nginx
app.use(bodyParser.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);

app.use(createChargeRouter);

app.all("*", async (req, res) => {
  //next(new NotFoundError()); we are not gonna use next, throw will be used with the help of a package
  // (express-async-errors)
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
