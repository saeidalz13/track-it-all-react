export enum AuthStatus {
  LOADING,
  AUTH,
  UNAUTH,
}

export function isUserAuthenticated(auth: AuthStatus): boolean {
  return AuthStatus.AUTH === auth;
}
