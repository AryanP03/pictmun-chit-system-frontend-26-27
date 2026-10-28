// src/components/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import ChitEntry from "./pages/delegates/ChitEntry";
import Inbox from "./pages/delegates/inbox";
import ChitModalWrapper from "./pages/delegates/ChitModalWrapper";
import Login from "./pages/auth/LoginPage";
import { Toaster } from "./components/ui/sonner";
import { useAuthContext } from "./context/AuthContext";
import { Topbar } from "./components/Topbar";
import BoardModal from "./pages/eb/EBModal";
import BoardInbox from "./pages/eb/BoardInbox";
import CreateEntries from "./pages/admin/CreateEntries";
import AccountsDirectory from "./pages/admin/AccountsDirectory";
import Profile from "./pages/Profile";
import { Sidebar } from "./components/Sidebar";
import { Loading } from "./components/Loading";
import SentMessages from "./pages/delegates/SentMessages";
import MarksPage from "./pages/eb/MarksPage";
import DownloadChits from "./pages/eb/DownloadChits";
import { useChitNotifications } from "./hooks/useChitNotifications";

const App: React.FC = () => {
  const { isLoading, authUser } = useAuthContext();
  useChitNotifications();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex flex-col w-full h-[100dvh] max-h-[100dvh] overflow-hidden bg-background">
        <Topbar />
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {authUser && <Sidebar />}
          <main className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden relative">
            <Routes>
              <Route
                path="/eb-board"
                element={
                  authUser && authUser.role === "EB" ? (
                    <BoardInbox />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/eb/:id"
                element={
                  authUser && authUser.role === "EB" ? (
                    <BoardModal />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/marks"
                element={
                  authUser && authUser.role === "EB" ? (
                    <MarksPage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/eb-download"
                element={
                  authUser && authUser.role === "EB" ? (
                    <DownloadChits />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/"
                element={
                  authUser ? (
                    authUser.role === "EB" ? (
                      <Navigate to="/eb-board" />
                    ) : authUser.role === "ADMIN" ? (
                      <Navigate to="/create-user" />
                    ) : (
                      <Inbox />
                    )
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/chit-entry"
                element={authUser ? <ChitEntry /> : <Navigate to="/login" />}
              />
              <Route
                path="/chit/:id"
                element={
                  authUser ? <ChitModalWrapper /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/create-user"
                element={
                  authUser && authUser.role === "ADMIN" ? (
                    <CreateEntries />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/all-users"
                element={
                  authUser && authUser.role === "ADMIN" ? (
                    <AccountsDirectory />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/profile"
                element={authUser ? <Profile /> : <Navigate to="/login" />}
              />
              <Route
                path="/login"
                element={!authUser ? <Login /> : <Navigate to="/" />}
              />
              <Route
                path="/sent-chits"
                element={!authUser ? <Login /> : <SentMessages />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
        <Toaster />
      </div>
    </>
  );
};

export default App;
