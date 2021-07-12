  
export interface User {
    [x: string]: any;
    id: string,
    firstname: string;
    lastname: string;
    isModerate: boolean;
    email: string;
    password: string;
    token?: string;
}
