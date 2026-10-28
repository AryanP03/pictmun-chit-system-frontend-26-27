import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { useCreateUser } from "../../hooks/useCreateUser";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { toast } from "sonner";
import {
  UserPlus,
  RefreshCw,
  Key,
  Wand2,
  CheckCircle2,
} from "lucide-react";

export type FormDataType = {
  username: string;
  portfolio: string;
  role: string;
  committee: string;
  password: string;
};

const OFFICIAL_COMMITTEES = [
  { value: "UNSC", label: "UNSC (United Nations Security Council)" },
  { value: "UNHRC", label: "UNHRC (United Nations Human Rights Council)" },
  { value: "UNCSW", label: "UNCSW (UN Commission on the Status of Women)" },
  { value: "ECOFIN", label: "ECOFIN (Economic and Financial Committee)" },
  { value: "UNCSTD", label: "UNCSTD (UN Commission on Science and Technology)" },
  { value: "AIPPM", label: "AIPPM (All India Political Parties Meet)" },
  { value: "IP", label: "IP (International Press)" },
  { value: "CCC", label: "CCC (Continuous Crisis Committee)" },
  { value: "UNODC", label: "UNODC (UN Office on Drugs and Crime)" },
  { value: "UNFCCC", label: "UNFCCC (Framework Convention on Climate Change)" },
  { value: "OTHER", label: "Custom / Other Committee" },
];

const generateRandomPassword = () => {
  const adjectives = [
    "Nova", "Cedar", "Falcon", "Delta", "Pearl", "Lemon", "Panda",
    "Indigo", "Forest", "Silver", "Amber", "Coral", "Titan", "Cosmo"
  ];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${adj}${num}`;
};

const CreateEntries = () => {
  const [formData, setFormData] = useState<FormDataType>({
    username: "",
    portfolio: "",
    role: "DELEGATE",
    committee: "",
    password: "",
  });
  const [customCommittee, setCustomCommittee] = useState("");
  const { createUser, loading: creating } = useCreateUser();

  const effectiveCommittee =
    formData.committee === "OTHER" ? customCommittee.trim() : formData.committee;

  const handleSuggestUsername = () => {
    if (!formData.portfolio && !effectiveCommittee) {
      toast.info("Please enter a Portfolio and select a Committee first to auto-suggest a username.");
      return;
    }

    const cleanPortfolio = formData.portfolio
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    const commPart = (effectiveCommittee || "comm").toLowerCase().replace(/[^a-z0-9]/g, "");

    if (formData.role === "EB") {
      const ebUsername = cleanPortfolio
        ? `${cleanPortfolio}_eb`
        : `${commPart}_eb`;
      setFormData((prev) => ({ ...prev, username: ebUsername }));
      toast.success(`Suggested username: ${ebUsername}`);
    } else {
      const delUsername = `${cleanPortfolio || "delegate"}_${commPart}`;
      setFormData((prev) => ({ ...prev, username: delUsername }));
      toast.success(`Suggested username: ${delUsername}`);
    }
  };

  const handleGeneratePassword = () => {
    const pw = generateRandomPassword();
    setFormData((prev) => ({ ...prev, password: pw }));
    toast.success("Random secure password generated!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      toast.error("Please enter a username.");
      return;
    }
    if (!formData.password.trim()) {
      toast.error("Please enter a password.");
      return;
    }
    if (!formData.portfolio.trim()) {
      toast.error("Please enter a portfolio (e.g. Country name, Leader name, or 'Executive Board').");
      return;
    }
    if (!effectiveCommittee) {
      toast.error("Please select or enter a committee.");
      return;
    }
    if (!formData.role) {
      toast.error("Please select a role.");
      return;
    }

    const success = await createUser({
      username: formData.username.trim(),
      password: formData.password.trim(),
      portfolio: formData.portfolio.trim(),
      role: formData.role,
      committee: effectiveCommittee,
    });

    if (success) {
      // Clear form on success
      setFormData({
        username: "",
        portfolio: "",
        role: "DELEGATE",
        committee: "",
        password: "",
      });
      setCustomCommittee("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="w-full h-full max-h-full flex flex-col justify-center items-center p-4 sm:p-6 overflow-y-auto bg-background">
      <div className="w-full max-w-lg my-auto py-4">
        <Card className="bg-[#0B2B26] border-[#A67C52]/40 shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-[#A67C52]/20 pb-4 text-center">
            <div className="size-11 mx-auto rounded-full bg-[#174A3A] border border-[#A67C52]/50 flex items-center justify-center text-primary mb-2 shadow-inner">
              <UserPlus className="size-5" />
            </div>
            <CardTitle className="text-xl sm:text-2xl text-[#FFF4D6] font-semibold tracking-tight">
              Create New Account
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Add a new Delegate, Executive Board (EB), or Admin account to the system.
            </p>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-5 px-6">
              {/* Role Selector */}
              <div>
                <Label className="text-[#F2E9DB] text-xs font-semibold uppercase tracking-wider">
                  Role *
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, role: val }))}
                >
                  <SelectTrigger className="mt-1.5 bg-[#174A3A]/40 border-[#A67C52]/40 text-[#F2E9DB]">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0B2B26] border-[#A67C52]/40 text-[#F2E9DB]">
                    <SelectItem value="DELEGATE">Delegate (Committee Member)</SelectItem>
                    <SelectItem value="EB">Executive Board (EB / Chair)</SelectItem>
                    <SelectItem value="ADMIN">System Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Committee Selector */}
              <div>
                <Label className="text-[#F2E9DB] text-xs font-semibold uppercase tracking-wider">
                  Committee *
                </Label>
                <Select
                  value={formData.committee}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, committee: val }))}
                >
                  <SelectTrigger className="mt-1.5 bg-[#174A3A]/40 border-[#A67C52]/40 text-[#F2E9DB]">
                    <SelectValue placeholder="Select Committee" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0B2B26] border-[#A67C52]/40 text-[#F2E9DB] max-h-60">
                    {OFFICIAL_COMMITTEES.map((comm) => (
                      <SelectItem key={comm.value} value={comm.value}>
                        {comm.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {formData.committee === "OTHER" && (
                  <div className="mt-2">
                    <Input
                      type="text"
                      value={customCommittee}
                      onChange={(e) => setCustomCommittee(e.target.value)}
                      placeholder="Enter custom committee name..."
                      className="bg-[#174A3A]/40 border-[#A67C52]/40 text-[#F2E9DB]"
                    />
                  </div>
                )}
              </div>

              {/* Portfolio Input */}
              <div>
                <Label htmlFor="portfolio" className="text-[#F2E9DB] text-xs font-semibold uppercase tracking-wider">
                  Portfolio / Country / Title *
                </Label>
                <Input
                  type="text"
                  name="portfolio"
                  id="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  placeholder={
                    formData.role === "EB"
                      ? "e.g. Executive Board, Chairperson, or -"
                      : "e.g. Republic of India, United States, Amit Shah"
                  }
                  className="mt-1.5 bg-[#174A3A]/40 border-[#A67C52]/40 text-[#F2E9DB] placeholder:text-muted-foreground/60"
                />
              </div>

              {/* Username Input with Auto-Suggest */}
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="username" className="text-[#F2E9DB] text-xs font-semibold uppercase tracking-wider">
                    Username *
                  </Label>
                  <button
                    type="button"
                    onClick={handleSuggestUsername}
                    className="text-xs text-primary hover:text-[#FFF4D6] flex items-center gap-1 transition-colors"
                  >
                    <Wand2 className="size-3" />
                    Auto-Suggest
                  </button>
                </div>
                <Input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. republicofindia_unsc, tanishchaudhari_eb"
                  className="mt-1.5 bg-[#174A3A]/40 border-[#A67C52]/40 text-[#F2E9DB] placeholder:text-muted-foreground/60"
                />
              </div>

              {/* Password Input with Generator */}
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[#F2E9DB] text-xs font-semibold uppercase tracking-wider">
                    Password *
                  </Label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-xs text-primary hover:text-[#FFF4D6] flex items-center gap-1 transition-colors"
                  >
                    <Key className="size-3" />
                    Generate
                  </button>
                </div>
                <Input
                  type="text"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="e.g. Cedar6449, Nova5778"
                  className="mt-1.5 bg-[#174A3A]/40 border-[#A67C52]/40 text-[#F2E9DB] font-mono placeholder:text-muted-foreground/60"
                />
              </div>
            </CardContent>

            <CardFooter className="pt-2 pb-6 px-6 border-t border-[#A67C52]/20">
              <Button
                type="submit"
                disabled={creating}
                className="w-full bg-[#174A3A] hover:bg-[#1f5e4b] border border-[#A67C52] text-[#FFF4D6] font-semibold py-2.5 transition-all shadow-md"
              >
                {creating ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="size-4 animate-spin" />
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="size-4" />
                    Create Account
                  </span>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateEntries;
