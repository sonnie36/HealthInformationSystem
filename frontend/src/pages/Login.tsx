/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn } from "lucide-react";
import {useSelector} from "react-redux";
import { useDispatch } from "react-redux";
import { loginUser } from "../../Utils/Redux/auth/AuthSlice"; 
import { useToast } from "@/hooks/use-toast";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const { toast } = useToast();

  const { loading, error } = useSelector((state: any) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      const result = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(result)){
        const { user, token } = result.payload;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        toast({
          title: "Login Successful",
          description: "Welcome back!",
          variant: "success",
        });
        navigate("/");

      }else{
        console.log("Login failed:", result.error.message);
      }
    }catch(error){
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-healthcare-primary/5 to-white">
      <Card className="w-[380px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-healthcare-primary flex items-center justify-center gap-2">
            <LogIn className="h-6 w-6" />
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-healthcare-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-healthcare-primary/20"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-healthcare-primary text-white hover:bg-healthcare-primary/90"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
            {error && (
              <p className="text-sm text-center text-red-500 mt-2">
                {error}
              </p>
            )}
            <p className="text-sm text-center text-gray-500 mt-4">
              Don't have an account?{" "}
              <Link to="/register" className="text-healthcare-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
