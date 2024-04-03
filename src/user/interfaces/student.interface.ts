export interface IStudentQuery {
    search?: string;
    email?: string;
    active?: number;
    frozen?: number;
}


type Payload = { [key: string]: (string | number) };

export type SignFunction = (payload: Payload, secret: string) => Promise<string>;
export type VerifyFunction = (token: string, secret: string) => Promise<any>;

export const enum OptionType {
    AVATAR = "AVATAR",
    LECTURE = "LECTURE"
}