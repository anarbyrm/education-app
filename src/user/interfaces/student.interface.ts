export interface IStudentQuery {
    email?: string;
    active?: boolean;
}

type Payload = { [key: string]: (string | number) };

export type SignFunction = (payload: Payload, secret: string) => Promise<string>;
export type VerifyFunction = (token: string, secret: string) => Promise<any>;
