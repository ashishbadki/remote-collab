// pages/Dashboard.tsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CreateWorkspace from "../components/CreateWorkspace";
import WorkspaceList from "../components/allWorkspaceList";
import Footer from "../components/Footer";
import { useAuth } from "../context/authContext";
import { getAllWorkspacesApi } from "../api/workspace.api";
import { deleteWorkspaceApi } from "../api/deleteWorkspace";

// Updated Workspace interface to match what WorkspaceList expects
export interface Workspace {
  _id: string;
  name: string;
  type: string;
  members?: number;
  channels?: number;
}

const Dashboard = () => {
  const { user, loading } = useAuth();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspaceLoading, setWorkspaceLoading] = useState(true);
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
      const totalMembers = data.workspaces.reduce((sum: number, ws: Workspace) => sum + (ws.members || 0), 0);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{user?.name || "User"}</span> 👋
          </h1>
          <p className="mt-2 text-gray-600">Manage your workspaces and collaborate with your team</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <CreateWorkspace onCreated={fetchWorkspaces} />
            
            
          </div>

          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Your Workspaces</h2>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}
                </div>
                <button 
                  onClick={fetchWorkspaces}
                  className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
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
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;