// pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import CreateWorkspace from "../components/CreateWorkspace";
import WorkspaceList from "../components/allWorkspaceList";
import { useAuth } from "../context/authContext";
import { getAllWorkspacesApi, deleteWorkspaceApi, joinWorkspaceApi } from "../api/workspace.api";
import type { Workspace } from "../types/workspace";

const Dashboard = () => {
  const { user, loading } = useAuth();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspaceLoading, setWorkspaceLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [inviteToken, setInviteToken] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalChannels: 0
  });

  const fetchWorkspaces = async () => {
    try {
      setWorkspaceLoading(true);
      const data = await getAllWorkspacesApi();
      setWorkspaces(data.workspaces);

      // Calculate statistics
      const totalMembers = data.workspaces.reduce((sum: number, ws: Workspace) => sum + (ws.members?.length || 0), 0);
      const totalChannels = data.workspaces.reduce((sum: number, ws: Workspace) => sum + (ws.channels || 0), 0);

      setStats({
        totalMembers,
        totalChannels
      });
    } catch (err) {
      console.error("Failed to load workspaces", err);
    } finally {
      setWorkspaceLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteWorkspaceApi(id);
    fetchWorkspaces();
  };

  const handleJoinWorkspace = async () => {
    if (!inviteToken.trim()) {
      setJoinError("Please enter an invite token");
      return;
    }

    setJoinLoading(true);
    setJoinError("");

    try {
      await joinWorkspaceApi(inviteToken.trim());
      setInviteToken("");
      setShowJoinModal(false);
      fetchWorkspaces();
    } catch (err: any) {
      setJoinError(
        err?.response?.data?.message || "Failed to join workspace. Please check the token."
      );
    } finally {
      setJoinLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="mb-4">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          </div>
          <p className="text-sm font-medium text-gray-600">Preparing your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{user?.name || "User"}</span> 👋
            </h1>
            <p className="mt-1 text-sm text-gray-600">Manage your workspaces and collaborate with your team</p>
          </div>
          <button
            onClick={() => setShowJoinModal(true)}
            className="h-fit rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2 font-semibold text-sm text-white shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 whitespace-nowrap"
          >
            Join Workspace
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <CreateWorkspace onCreated={fetchWorkspaces} />


          </div>

          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Your Workspaces</h2>
              <div className="flex items-center gap-4">
                <div className="text-xs text-gray-500 font-medium">
                  {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}
                </div>
                <button
                  onClick={fetchWorkspaces}
                  className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>

            <WorkspaceList
              workspaces={workspaces}
              loading={workspaceLoading}
              onDelete={handleDelete}
            />
          </div>
        </div>

        {/* Join Workspace Modal */}
        <AnimatePresence>
          {showJoinModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowJoinModal(false)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-xl"
              >
                {/* Header */}
                <div className="border-b border-gray-100 p-5">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Join Workspace
                  </h3>
                  <p className="text-sm text-gray-500">
                    Enter the invite token to join a workspace
                  </p>
                </div>

                {/* Body */}
                <div className="space-y-4 p-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Invite Token
                    </label>
                    <input
                      type="text"
                      value={inviteToken}
                      onChange={(e) => {
                        setInviteToken(e.target.value);
                        setJoinError("");
                      }}
                      placeholder="Paste your invite token here"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {joinError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <p className="text-sm text-red-700">{joinError}</p>
                    </motion.div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setShowJoinModal(false);
                        setInviteToken("");
                        setJoinError("");
                      }}
                      disabled={joinLoading}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleJoinWorkspace}
                      disabled={joinLoading || !inviteToken.trim()}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {joinLoading ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Joining...
                        </>
                      ) : (
                        "Join Workspace"
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;