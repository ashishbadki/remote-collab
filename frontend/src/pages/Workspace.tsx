
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { ChatArea } from "../components/ChatArea";
import { getWorkspaceByIdApi } from "../api/workspace.api";
import { getChannelsByWorkspaceApi } from "../api/channel.api";
import type { Workspace } from "../types/workspace";

type Channel = {
    _id: string;
    name: string;
    type?: "text" | "voice";
};

const WorkspacePage = () => {
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const navigate = useNavigate();

    const [workspace, setWorkspace] = useState<Workspace | null>(null);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [currentChannelId, setCurrentChannelId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [userProfile, setUserProfile] = useState<{ _id: string; email: string } | null>(null);

    useEffect(() => {
        const fetchUserAndWorkspace = async () => {
            if (!workspaceId) return;

            try {
                setLoading(true);
                const [userRes, workspaceData, channelsData] = await Promise.all([
                    import("../api/user.api").then(mod => mod.getProfileApi()),
                    getWorkspaceByIdApi(workspaceId),
                    getChannelsByWorkspaceApi(workspaceId),
                ]);

                if (userRes.success) {
                    setUserProfile(userRes.user);
                }

                if (workspaceData.success) {
                    setWorkspace(workspaceData.workspace);
                }

                if (channelsData.success) {
                    setChannels(channelsData.channels);
                    if (channelsData.channels.length > 0) {
                        setCurrentChannelId(channelsData.channels[0]._id);
                    }
                }
            } catch (err) {
                console.error("Failed to load data:", err);
                setError("Failed to load workspace data.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndWorkspace();
    }, [workspaceId]);

    const handleChannelSelect = (channelId: string) => {
        setCurrentChannelId(channelId);
    };

    const isOwner = workspace?.owner === userProfile?._id;
    const isAdmin = workspace?.members?.some(
        (m) => m.userId.toString() === userProfile?._id && m.role === "admin"
    );
    const canManageChannels = isOwner || isAdmin || false;

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
                    <p className="text-gray-500 font-medium">Loading workspace...</p>
                </div>
            </div>
        );
    }

    if (error || !workspace) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="mb-2 text-xl font-bold text-gray-900">Something went wrong</h2>
                    <p className="mb-6 text-gray-500">{error || "Workspace not found"}</p>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const currentChannel = channels.find(c => c._id === currentChannelId);

    return (
        <div className="flex h-screen overflow-hidden bg-white">
            <Sidebar
                workspaceName={workspace.name}
                channels={channels}
                currentChannelId={currentChannelId}
                onChannelSelect={handleChannelSelect}
                loading={loading}
                onChannelCreated={(newChannel) => {
                    setChannels((prev) => [...prev, newChannel]);
                    setCurrentChannelId(newChannel._id);
                }}
                canManageChannels={canManageChannels}
                onChannelDeleted={(channelId) => {
                    setChannels((prev) => prev.filter((c) => c._id !== channelId));
                    if (currentChannelId === channelId) {
                        setCurrentChannelId(null);
                    }
                }}
            />
            <ChatArea
                channelName={currentChannel?.name}
                channelId={currentChannelId || undefined}
                workspaceId={workspace._id}
                canDeleteAnyMessage={canManageChannels}
            />
        </div>
    );
};

export default WorkspacePage;
