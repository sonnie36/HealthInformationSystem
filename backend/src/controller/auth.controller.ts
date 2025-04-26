import { Request, Response } from "express";
import { register,login } from "../service/auth.service";

export const RegisterController = async(req:Request, res:Response) => {
 try{
    const result = await register(req.body);
    res.status(201).json(
        {
            message: result.message,
            user: result.user,
        }
    );

 }catch(error:any){
    console.log(error);
    if (error.message === "A user with this email already exists.") {
        res.status(409).json({ message: error.message }); 
    } else {
        res.status(500).json({ message: "Internal server error" });
    }
 }
}

export const LoginController = async(req:Request, res:Response) => {
    try{
        const result = await login(req.body);
        res.status(200).json(result);
    }catch(error:any){
        console.log(error);
        res.status(401).json({message: error.message || "Invalid Credentials"});

    }
}