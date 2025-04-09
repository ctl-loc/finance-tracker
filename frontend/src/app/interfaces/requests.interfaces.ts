export interface AuthReq {
  username: string;
  password: string;
}
export interface AuthRes {
  token: string;
}
export interface RegisterReq {
  username: string;
  password: string;
  email: string;
}
export interface RegisterRes {
  message: string;
}
