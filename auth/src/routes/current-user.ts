import express, {Request, Response} from "express";
import { currentUser } from "@vintickets/common";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req: Request, res: Response) => {
  //already moved these properties to currentUser middleware, so we just need to include it!!

  // if (!req.session || !req.session.jwt) {
  //   return res.send({ currentUser: null });
  // }
  // try {
  //   const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
  //   res.send({ currentUser: payload });
  // } catch (err) {
  //   res.send({ currentUser: null });
  // }
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
