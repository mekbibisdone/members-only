export interface UserBody {
    fullname:string,
    email:string,
    password:string,
    passwordConfirmation:string,
    adminKey?:string
}

export type UserSensitiveInfo = Pick<UserBody, 'fullname' | 'email'>