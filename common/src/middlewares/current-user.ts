import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayLoad{
    id: string;
    email: string;
}


// we are modifing an existing interface definition.
declare global{
    namespace Express{
        interface Request{
            currentUser?: UserPayLoad;
        }
    }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    if(!req.session?.jwt){
        return next();
    }

    try{
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayLoad
        req.currentUser = payload;
    }catch(err){}
    next() //whether or not we decode that token successfully we want to continue.
};
