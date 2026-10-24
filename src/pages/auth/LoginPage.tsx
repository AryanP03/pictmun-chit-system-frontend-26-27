import React, { useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useLogin } from "../../hooks/useLogin";
import { Eye, EyeOff, Mail } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { isLoading: loading, login } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("Please enter both username and password");
      return;
    }

    login(username, password);
  };

  return (
    <div className="relative w-full h-full min-h-0 flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-br from-[#174A3A] via-[#113a2d] to-[#0B2B26] overflow-hidden select-none">
      {/* Decorative ambient background elements cleanly contained in overflow-hidden */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#A67C52]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#174A3A]/60 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[550px] h-[550px] bg-[#A67C52]/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage: `url('/bg-pattern.png')`,
            backgroundRepeat: "repeat",
            backgroundSize: "360px",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#F2E9DB 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Main Responsive Container: Unified composition centered horizontally & vertically */}
      <div className="relative z-10 w-fit max-w-full mx-auto flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-14 xl:gap-20 my-auto">
        {/* =========================================================================
            LEFT SECTION - Official Logo & PICT MODEL UNITED NATIONS 2026-2027
            ========================================================================= */}
        <div className="hidden md:flex flex-col items-center justify-center text-center shrink-0 max-w-[280px] lg:max-w-none">
          <div className="relative group">
            {/* Ambient radiant golden halo */}
            <div className="absolute -inset-5 rounded-full bg-gradient-to-r from-[#A67C52]/50 via-[#F2E9DB]/25 to-[#A67C52]/50 blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Medallion Golden Ring */}
            <div className="relative size-32 md:size-40 lg:size-52 xl:size-60 rounded-full p-[2.5px] bg-gradient-to-tr from-[#A67C52] via-[#F5DEB3] to-[#8C6239] shadow-[0_0_50px_rgba(166,124,82,0.4)] transition-transform duration-500 group-hover:scale-105">
              <div className="w-full h-full rounded-full bg-[#0B2B26] overflow-hidden flex items-center justify-center">
                <img
                  src="/logo2026.png"
                  alt="PICT Model United Nations 2026"
                  className="w-full h-full object-cover filter drop-shadow-[0_6px_20px_rgba(0,0,0,0.6)]"
                />
              </div>
            </div>
          </div>

          <h1 className="font-serif text-lg md:text-xl lg:text-3xl xl:text-4xl font-bold tracking-wide lg:tracking-wider text-[#F2E9DB] mt-3.5 lg:mt-5 leading-tight drop-shadow-md">
            PICT MODEL UNITED NATIONS
          </h1>
          <p className="font-serif text-[10px] md:text-xs lg:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase text-[#A67C52] mt-1 lg:mt-1.5 font-semibold">
            2026 – 2027 Edition
          </p>

          {/* Golden ornamental divider with diamond star */}
          <div className="flex items-center gap-2.5 lg:gap-3 my-2.5 lg:my-3.5 w-36 md:w-44 lg:w-56 max-w-xs">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#A67C52]/60" />
            <span className="text-[#A67C52] text-xs">❖</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#A67C52]/60" />
          </div>
        </div>

        {/* =========================================================================
            RIGHT SECTION - Account Sign In Card (Compact & Content-Driven Height)
            ========================================================================= */}
        <div className="w-full max-w-[360px] sm:max-w-[380px] md:w-[330px] lg:w-[380px] xl:w-[410px] shrink-0">
          <div className="golden-swim-card w-full h-auto rounded-2xl shadow-[0_15px_45px_-10px_rgba(0,0,0,0.85)]">
            <div className="golden-swim-content w-full h-auto rounded-[calc(1rem-2px)] p-5 sm:p-6 lg:p-7 flex flex-col justify-start gap-3 sm:gap-3.5 bg-[#0B2B26]/95 backdrop-blur-xl">
              {/* Header branding */}
              <div className="flex flex-col items-center text-center">
                {/* Mobile-only logo crest (only shown when left branding is hidden) */}
                <div className="md:hidden mb-2 size-12 rounded-full p-[2px] bg-gradient-to-tr from-[#A67C52] via-[#F5DEB3] to-[#8C6239] shadow-md overflow-hidden">
                  <div className="w-full h-full rounded-full bg-[#0B2B26] overflow-hidden flex items-center justify-center">
                    <img
                      src="/logo2026.png"
                      alt="PICT MUN 2026"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <h2 className="font-serif text-xl sm:text-2xl lg:text-2.5xl font-bold tracking-wide text-[#F2E9DB]">
                  Account Sign In
                </h2>
                <p className="text-[11px] sm:text-xs text-[#F2E9DB]/70 mt-0.5">
                  Enter your credentials to enter your committee session
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 sm:gap-3 mt-0.5">
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="username"
                    className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-[#F2E9DB]"
                  >
                    Username / ID
                  </Label>
                  <Input
                    placeholder="e.g. delegate_diasec_01 or eb_unsc"
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-9.5 sm:h-10 bg-[#0e372e]/70 border-[#A67C52]/50 text-[#F2E9DB] placeholder:text-[#F2E9DB]/35 focus-visible:border-[#A67C52] focus-visible:ring-[#A67C52]/40 focus-visible:ring-2 rounded-lg text-xs sm:text-sm transition-all"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="password"
                    className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-[#F2E9DB]"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter assigned password..."
                      id="password"
                      type={passwordVisible ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-9.5 sm:h-10 pr-10 bg-[#0e372e]/70 border-[#A67C52]/50 text-[#F2E9DB] placeholder:text-[#F2E9DB]/35 focus-visible:border-[#A67C52] focus-visible:ring-[#A67C52]/40 focus-visible:ring-2 rounded-lg text-xs sm:text-sm transition-all"
                      required
                    />
                    <button
                      type="button"
                      aria-label={passwordVisible ? "Hide password" : "Show password"}
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-[#A67C52] hover:text-[#FFF4D6] transition-colors cursor-pointer"
                    >
                      {passwordVisible ? (
                        <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-9.5 sm:h-10 mt-1 rounded-lg font-serif font-bold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 bg-gradient-to-r from-[#8C6239] via-[#C89F6B] to-[#8C6239] text-[#0B2B26] hover:brightness-110 hover:shadow-[0_0_22px_rgba(166,124,82,0.45)] active:scale-[0.99] disabled:opacity-60 cursor-pointer shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="size-3 border-2 border-[#0B2B26] border-t-transparent rounded-full animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    "Authorize & Enter"
                  )}
                </Button>
              </form>

              {/* Compact Registered Credentials instruction note */}
              <div className="mt-1 pt-2 border-t border-[#A67C52]/20 flex flex-col items-center gap-1 text-center">
                <div className="flex items-center gap-1 text-[#A67C52]/85">
                  <Mail className="w-3 h-3" />
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold">Registered Credentials</span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#F2E9DB]/75 italic font-light tracking-wide leading-tight">
                  Please check your registered email for the username and password
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
