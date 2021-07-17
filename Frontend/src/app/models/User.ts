  
export interface User {
    [x: string]: any;
    id: string,
    firstName: string;
    lastName: string;
    isModerate: boolean;
    email: string;
    password: string;
    token?: string;
}
