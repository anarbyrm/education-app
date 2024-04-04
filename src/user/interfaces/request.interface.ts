import { Request } from "express";
import { User } from "../entities/user.entity";

export interface ExtendedRequest extends Request {
    user?: User;
}