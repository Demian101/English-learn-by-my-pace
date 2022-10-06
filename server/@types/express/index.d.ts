export {}

// import { IUser } from './../../models/User';

// 命名空间里的全局变量； req.user 
declare global {
  namespace Express {
      interface Request {
          user?: any;
      }
  }
}