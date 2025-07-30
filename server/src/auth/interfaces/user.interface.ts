export interface IUser {
  id: string
  email: string
}

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}
