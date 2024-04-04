import { Request } from "express";

export interface ExtendedRequest<T> extends Request {
    user?: T;
}