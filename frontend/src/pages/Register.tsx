/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../Utils/Redux/auth/AuthSlice";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try{
      const result = dispatch(registerUser({ email, password, fullName }));
      if (registerUser.fulfilled.match(result)){
        const { user, token } = result.payload;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        toast({
          title: "Registration Successful",
          description: "Welcome aboard!",
          variant: "success",
        });
      }else{
        console.log("Registration failed:", result.error.message);
      }

    }catch(error){
      console.error("Registration error:", error);
    }
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-healthcare-primary/5 to-white">
      <Card className="w-[380px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-healthcare-primary flex items-center justify-center gap-2">
            <UserPlus className="h-6 w-6" />
            Create Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="border-healthcare-primary/20"
              />
            </div>
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
            <Button type="submit" className="w-full bg-healthcare-primary text-white hover:bg-healthcare-primary/90">
              Create Account
            </Button>
            <p className="text-sm text-center text-gray-500 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-healthcare-primary hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
