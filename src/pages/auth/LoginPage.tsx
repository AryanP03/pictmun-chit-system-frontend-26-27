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
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { isLoading: loading, login } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      alert("Please verify you are not a robot!");
      return;
    }

    login(username, password, captchaToken);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section - Image */}
      <div className="w-full hidden md:flex items-center justify-center bg-oklch(0.1994 0.0390 21.1753)">
        <img
          src="/login-side-image.png"
          alt="Login Illustration"
          className="object-cover w-50px h-100px"
        />
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6">
        <Card className="w-full max-w-md lg:max-w-lg xl:max-w-xl p-6 gap-3 rounded-md">
          <CardHeader>
            <CardTitle className="text-2xl lg:text-3xl text-center">
              Login
            </CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="flex flex-col gap-4 w-full">
              <div>
                <Label htmlFor="username" className="lg:text-lg mb-1">
                  Username
                </Label>
                <Input
                  placeholder="Enter your username..."
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="p-2 lg:p-3 lg:text-lg border border-primary"
                />
              </div>

              <div>
                <Label htmlFor="password" className="lg:text-lg mb-1">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Enter your Password..."
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 lg:p-3 lg:text-lg border border-primary"
                  />
                  <Button
                    type="button"
                    className="absolute right-0 top-1/2 border-l border-primary  -translate-y-1/2 rounded-l-none z-10 "
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    size={"icon"}
                  >
                    {passwordVisible ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </div>

              {/* CAPTCHA */}

              <div className="flex justify-center w-full">
                <div className="w-full max-w-sm">
                  <CaptchaWidget onVerify={setCaptchaToken} />
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full lg:text-lg lg:py-3"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
