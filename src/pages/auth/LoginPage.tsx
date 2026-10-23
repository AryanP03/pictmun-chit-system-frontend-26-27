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
    <div className="relative w-full h-[calc(100vh-61px)] max-h-[calc(100vh-61px)] overflow-hidden flex flex-col lg:flex-row items-stretch justify-between bg-gradient-to-br from-[#174A3A] via-[#113a2d] to-[#0B2B26]">
      {/* Decorative ambient glowing orbs */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#A67C52]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#174A3A]/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[550px] h-[550px] bg-[#A67C52]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Official PICT MUN 2026 pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url('/bg-pattern.png')`,
          backgroundRepeat: "repeat",
          backgroundSize: "360px",
        }}
      />

      {/* Subtle luxury geometric grid fallback */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#F2E9DB 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* =========================================================================
          LEFT SECTION - Official Logo & PICT MODEL UNITED NATIONS 2026-2027
          ========================================================================= */}
      <div className="relative z-10 hidden lg:flex flex-1 flex-col items-center justify-center text-center p-6 lg:p-10 my-auto h-full">
        <div className="relative group">
          {/* Ambient radiant golden halo */}
          <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-[#A67C52]/50 via-[#F2E9DB]/25 to-[#A67C52]/50 blur-3xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Medallion Golden Ring - Perfectly fitted edge-to-edge */}
          <div className="relative size-56 xl:size-64 rounded-full p-[3px] bg-gradient-to-tr from-[#A67C52] via-[#F5DEB3] to-[#8C6239] shadow-[0_0_60px_rgba(166,124,82,0.4)] transition-transform duration-500 group-hover:scale-105">
            <div className="w-full h-full rounded-full bg-[#0B2B26] overflow-hidden flex items-center justify-center">
              <img
                src="/logo2026.png"
                alt="PICT Model United Nations 2026"
                className="w-full h-full object-cover filter drop-shadow-[0_6px_20px_rgba(0,0,0,0.6)]"
              />
            </div>
          </div>
        </div>

        <h1 className="font-serif text-3xl xl:text-4xl font-bold tracking-wider text-[#F2E9DB] mt-6 leading-tight drop-shadow-md">
          PICT MODEL UNITED NATIONS
        </h1>
        <p className="font-serif text-sm tracking-[0.35em] uppercase text-[#A67C52] mt-2 font-semibold">
          2026 – 2027 Edition
        </p>

        {/* Golden ornamental divider with diamond star */}
        <div className="flex items-center gap-3 my-4 w-60 max-w-xs">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#A67C52]/60" />
          <span className="text-[#A67C52] text-xs">❖</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#A67C52]/60" />
        </div>
      </div>

      {/* =========================================================================
          RIGHT SECTION - Login Card (Spanning full height, content moved upward)
          ========================================================================= */}
      <div className="relative z-10 w-full lg:w-[440px] xl:w-[460px] h-full shrink-0 p-3 sm:p-4 lg:p-5 flex flex-col justify-center">
        <div className="golden-swim-card h-full w-full rounded-2xl shadow-[0_15px_45px_-10px_rgba(0,0,0,0.85)]">
          <div className="golden-swim-content rounded-[calc(1rem-2px)] p-6 sm:p-8 xl:p-9 flex flex-col justify-start gap-4 sm:gap-5 h-full bg-[#0B2B26]/95 backdrop-blur-xl pt-4 sm:pt-6">
            {/* Header branding sitting directly near top edge */}
            <div className="flex flex-col items-center text-center mt-0">
              {/* Mobile-only logo crest */}
              <div className="lg:hidden mb-2.5 size-14 rounded-full p-[2px] bg-gradient-to-tr from-[#A67C52] via-[#F5DEB3] to-[#8C6239] shadow-lg overflow-hidden">
                <div className="w-full h-full rounded-full bg-[#0B2B26] overflow-hidden flex items-center justify-center">
                  <img
                    src="/logo2026.png"
                    alt="PICT MUN 2026"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-[#F2E9DB]">
                Account Sign In
              </h2>
              <p className="text-xs sm:text-sm text-[#F2E9DB]/70 mt-1">
                Enter your credentials to enter your committee session
              </p>
            </div>

            {/* Login Form positioned right below header */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 mt-1">
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="username"
                  className="text-xs font-semibold tracking-wider uppercase text-[#F2E9DB]"
                >
                  Username / ID
                </Label>
                <Input
                  placeholder="e.g. delegate_diasec_01 or eb_unsc"
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11 bg-[#0e372e]/70 border-[#A67C52]/50 text-[#F2E9DB] placeholder:text-[#F2E9DB]/35 focus-visible:border-[#A67C52] focus-visible:ring-[#A67C52]/40 focus-visible:ring-2 rounded-lg text-sm transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold tracking-wider uppercase text-[#F2E9DB]"
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
                    className="h-11 pr-11 bg-[#0e372e]/70 border-[#A67C52]/50 text-[#F2E9DB] placeholder:text-[#F2E9DB]/35 focus-visible:border-[#A67C52] focus-visible:ring-[#A67C52]/40 focus-visible:ring-2 rounded-lg text-sm transition-all"
                    required
                  />
                  <button
                    type="button"
                    aria-label={passwordVisible ? "Hide password" : "Show password"}
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-0 top-0 h-full px-3.5 flex items-center justify-center text-[#A67C52] hover:text-[#FFF4D6] transition-colors cursor-pointer"
                  >
                    {passwordVisible ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-2 rounded-lg font-serif font-bold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 bg-gradient-to-r from-[#8C6239] via-[#C89F6B] to-[#8C6239] text-[#0B2B26] hover:brightness-110 hover:shadow-[0_0_22px_rgba(166,124,82,0.45)] active:scale-[0.99] disabled:opacity-60 cursor-pointer shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="size-3.5 border-2 border-[#0B2B26] border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  "Authorize & Enter"
                )}
              </Button>
            </form>

            {/* In the remaining space below: Small italics instruction */}
            <div className="mt-4 pt-3 border-t border-[#A67C52]/20 flex flex-col items-center gap-1.5 text-center">
              <div className="flex items-center gap-1.5 text-[#A67C52]/80">
                <Mail className="w-3.5 h-3.5" />
                <span className="text-[11px] uppercase tracking-wider font-semibold">Registered Credentials</span>
              </div>
              <p className="text-xs sm:text-[13px] text-[#F2E9DB]/75 italic font-light tracking-wide leading-relaxed">
                Please check your registered email for the username and password
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
