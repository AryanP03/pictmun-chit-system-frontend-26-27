import React, { useState } from "react";
import CaptchaWidget from "../../components/captcha-widget";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

import { useLogin } from "../../hooks/useLogin";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const { isLoading: loading, login } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure CAPTCHA is verified
    if (!captchaToken) {
      alert("Please verify you are not a robot!");
      return;
    }

    // Pass username, password, and captchaToken to the login function
    login(username, password, captchaToken);
  };

  return (
    <Card className="flex flex-col md:ml-[36%] mt-[6%] mx-auto gap-3 p-6 max-w-lg w-[100%] rounded-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Login</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-4 w-full">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              placeholder="Enter your username..."
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 border border-primary"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              placeholder="Enter your Password..."
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border border-primary"
            />
          </div>

          {/* CAPTCHA */}
          <CaptchaWidget onVerify={setCaptchaToken} />
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Login;
