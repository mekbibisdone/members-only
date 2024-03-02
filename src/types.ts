export interface UserBody {
  fullname: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  adminKey?: string;
}

export type LoginBody = Pick<UserBody, "email" | "password">;
export type UserSensitiveInfo = Pick<UserBody, "fullname" | "email">;
