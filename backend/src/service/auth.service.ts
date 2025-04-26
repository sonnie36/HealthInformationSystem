import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Register, Login } from "../Interface/interface";
import { registrationConfirmationEmail } from "../Utils/email";

const prisma = new PrismaClient();

export const register = async (register: Register) => {
  try {
    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: register.email
      }
    });

    if (existingUser) {
      throw new Error("A user with this username already exists.");
    }

    const hashedPassword = await bcrypt.hash(register.password, 10);
    
    const user = await prisma.user.create({
      data: {
        email: register.email,
        password: hashedPassword,
        fullName: register.fullName,
        role: register.role, 
      }
    });

    // try {
    //   if (register.email) {
    //     await registrationConfirmationEmail(
    //       register.email, 
    //       register.fullName,
    //       register.role || 'DOCTOR'
    //     );
    //   }
    //   return { user, message: "User Registered Successfully" };
    // } catch (error: any) {
    //   return { user, message: 'User registered successfully but failed to send email' };
    // }
    return { user, message: "User Registered Successfully" };
  } catch (error: any) {
    throw new Error(error.message || "Failed to Register User");
  }
};

export const login = async (login: Login) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: login.email
      },
      select: {
        id: true,
        email: true,
        password: true,
        fullName: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(login.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid Password");
    }

    const token = jwt.sign(
      { 
        email: user.email, 
        id: user.id,
        role: user.role 
      }, 
      process.env.JWT_SECRET as string, 
      { expiresIn: '1h' }
    );

    const details = {
      token, 
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName
      }
    };
    
    return details;
  } catch (error: any) {
    throw new Error(error.message || "Failed to Login");
  }
};