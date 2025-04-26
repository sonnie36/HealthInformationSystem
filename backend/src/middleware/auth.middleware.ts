import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export interface payloadUser{
    id: string;
    email: string;
    role: string;
}

export interface AuthRequest extends Request {
    user?: payloadUser;
  }
  
  export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
  
    if (!token) {
        res.status(401).json({ error: 'Access denied' });
        return;
     } 

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as payloadUser;
      req.user = decoded;
      next();
    } catch (err) {
      res.status(403).json({ message: "Invalid token" });
    }
  };
  

export const authorizeDoctor = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
     res.status(401).json({ error: 'Access denied' });
     return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as payloadUser;
    req.user = decoded;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (user?.role !== 'DOCTOR') {
       res.status(403).json({ error: 'Forbidden:Only doctors can perfom this action' });
       return;
    }
    next();
  } catch (error: any) {
     res.status(401).json({ message: error.message});
  }
};