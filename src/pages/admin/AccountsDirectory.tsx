import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useGetAllUsers, type SystemUser } from "../../hooks/useCreateUser";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  RefreshCw,
  Search,
  Users,
  Shield,
  Briefcase,
  UserCheck,
} from "lucide-react";
import { Loading } from "../../components/Loading";

const AccountsDirectory = () => {
  const { users, loading: loadingUsers, refetchUsers } = useGetAllUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCommittee, setFilterCommittee] = useState("ALL");
  const [filterRole, setFilterRole] = useState("ALL");

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    return users.filter((u) => {
      const matchesSearch =
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.portfolio.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesComm =
        filterCommittee === "ALL" ||
        u.committee.toLowerCase() === filterCommittee.toLowerCase();
      const matchesRole =
        filterRole === "ALL" ||
        u.role.toUpperCase() === filterRole.toUpperCase();
      return matchesSearch && matchesComm && matchesRole;
    });
  }, [users, searchQuery, filterCommittee, filterRole]);

  const stats = useMemo(() => {
    const total = users.length;
    const delegates = users.filter((u) => u.role === "DELEGATE").length;
    const ebs = users.filter((u) => u.role === "EB").length;
    const admins = users.filter((u) => u.role === "ADMIN").length;
    return { total, delegates, ebs, admins };
  }, [users]);

  return (
    <div className="p-5 sm:p-6 w-full h-full max-h-full flex flex-col min-h-0 overflow-hidden bg-background">
      {/* Header & Live System Stats */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Accounts Directory
            </h1>
            <span className="py-0.5 px-2.5 rounded-full bg-[#174A3A] border border-[#A67C52]/50 text-[#FFF4D6] text-xs font-semibold">
              Admin Portal
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Complete list of all registered Delegates, Executive Board (EB), and Admin accounts.
          </p>
        </div>

        {/* Live System Stats */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B2B26] border border-[#A67C52]/30 text-xs">
            <Users className="size-3.5 text-primary" />
            <span className="text-[#F2E9DB]">Total:</span>
            <strong className="text-[#FFF4D6]">{stats.total}</strong>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B2B26] border border-[#A67C52]/30 text-xs">
            <Briefcase className="size-3.5 text-emerald-400" />
            <span className="text-[#F2E9DB]">Delegates:</span>
            <strong className="text-emerald-300">{stats.delegates}</strong>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B2B26] border border-[#A67C52]/30 text-xs">
            <Shield className="size-3.5 text-amber-400" />
            <span className="text-[#F2E9DB]">EB:</span>
            <strong className="text-amber-300">{stats.ebs}</strong>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B2B26] border border-[#A67C52]/30 text-xs">
            <UserCheck className="size-3.5 text-rose-400" />
            <span className="text-[#F2E9DB]">Admins:</span>
            <strong className="text-rose-300">{stats.admins}</strong>
          </div>
        </div>
      </div>

      {/* Directory Table Card */}
      <Card className="bg-[#0B2B26] border-[#A67C52]/40 shadow-xl flex-1 min-h-0 flex flex-col overflow-hidden">
        <CardHeader className="border-b border-[#A67C52]/20 pb-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg sm:text-xl text-[#FFF4D6] flex items-center gap-2">
                <Users className="size-5 text-primary" />
                Existing Accounts
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Showing {filteredUsers.length} of {users.length} total accounts in the database
              </p>
            </div>
            <Button
              onClick={() => refetchUsers()}
              disabled={loadingUsers}
              variant="outline"
              size="sm"
              className="bg-[#174A3A]/40 border-[#A67C52]/40 text-[#F2E9DB] hover:bg-[#174A3A] self-start sm:self-auto gap-1.5 text-xs"
            >
              <RefreshCw className={`size-3.5 ${loadingUsers ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3">
            <div className="relative">
              <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search username or portfolio..."
                className="pl-8 text-xs bg-[#174A3A]/30 border-[#A67C52]/30 text-[#F2E9DB] h-9"
              />
            </div>

            <Select value={filterCommittee} onValueChange={setFilterCommittee}>
              <SelectTrigger className="text-xs bg-[#174A3A]/30 border-[#A67C52]/30 text-[#F2E9DB] h-9">
                <SelectValue placeholder="All Committees" />
              </SelectTrigger>
              <SelectContent className="bg-[#0B2B26] border-[#A67C52]/40 text-[#F2E9DB] text-xs">
                <SelectItem value="ALL">All Committees</SelectItem>
                <SelectItem value="UNSC">UNSC</SelectItem>
                <SelectItem value="UNHRC">UNHRC</SelectItem>
                <SelectItem value="UNCSW">UNCSW</SelectItem>
                <SelectItem value="ECOFIN">ECOFIN</SelectItem>
                <SelectItem value="UNCSTD">UNCSTD</SelectItem>
                <SelectItem value="AIPPM">AIPPM</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="text-xs bg-[#174A3A]/30 border-[#A67C52]/30 text-[#F2E9DB] h-9">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent className="bg-[#0B2B26] border-[#A67C52]/40 text-[#F2E9DB] text-xs">
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="DELEGATE">Delegates</SelectItem>
                <SelectItem value="EB">Executive Board (EB)</SelectItem>
                <SelectItem value="ADMIN">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        {/* Scrollable Table Area */}
        <CardContent className="p-0 flex-1 min-h-0 overflow-y-auto">
          {loadingUsers && users.length === 0 ? (
            <div className="py-20 flex justify-center items-center">
              <Loading classes="size-8" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground text-sm">
              No accounts matching the search / filter criteria.
            </div>
          ) : (
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[600px]">
              <thead className="sticky top-0 z-10 bg-[#0B2B26] border-b border-[#A67C52]/40 text-[#FFF4D6] shadow-sm backdrop-blur-md">
                <tr>
                  <th className="py-3 px-4 font-semibold w-[28%]">Username</th>
                  <th className="py-3 px-4 font-semibold w-[16%]">Role</th>
                  <th className="py-3 px-4 font-semibold w-[20%]">Committee</th>
                  <th className="py-3 px-4 font-semibold w-[36%]">Portfolio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A67C52]/15">
                {filteredUsers.map((u: SystemUser, idx: number) => (
                  <tr
                    key={u.id || idx}
                    className={`${
                      idx % 2 === 0 ? "bg-[#174A3A]/15" : "bg-transparent"
                    } hover:bg-[#174A3A]/40 transition-colors`}
                  >
                    <td className="py-3 px-4 font-mono text-[#F2E9DB] font-medium">
                      {u.username}
                    </td>
                    <td className="py-3 px-4">
                      {u.role === "ADMIN" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950/70 text-rose-300 border border-rose-500/40">
                          ADMIN
                        </span>
                      )}
                      {u.role === "EB" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/70 text-amber-300 border border-amber-500/40">
                          EB
                        </span>
                      )}
                      {u.role === "DELEGATE" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-500/40">
                          DELEGATE
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-primary font-semibold">
                      {u.committee}
                    </td>
                    <td className="py-3 px-4 text-[#F2E9DB]/90 font-medium truncate max-w-[200px]">
                      {u.portfolio}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsDirectory;
