export interface ReqSignup {
  email: string;
  password: string;
}

export interface RespSignupPayload {
  email: string;
  user_id: string;
}
