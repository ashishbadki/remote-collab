// components/WorkspaceList.tsx - Refined
import { useEffect, useState } from "react";
import { getAllWorkspaceApi } from "../api/getAllWorkspaces";

interface Workspace {
    _id: string;
    name: string;
    type: string;
    members?: number;
    channels?: number;
}

const WorkspaceList = () => {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchWorkspaces = async () => {
            try {
                const data = await getAllWorkspaceApi();
                // Add mock data for members and channels for demo
                const workspacesWithDetails = data.workspaces.map((ws: Workspace) => ({
                    ...ws,
                    members: Math.floor(Math.random() * 20) + 1,
                    channels: Math.floor(Math.random() * 10) + 1
                }));
                setWorkspaces(workspacesWithDetails);
            } catch (err) {
                setError("Unable to load workspaces. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchWorkspaces();
    }, []);

    const getTypeConfig = (type: string) => {
        const configs: Record<string, { color: string; bg: string; icon: string }> = {
            personal: { color: "text-purple-700", bg: "bg-purple-50", icon: "👤" },
            team: { color: "text-blue-700", bg: "bg-blue-50", icon: "👥" },
            startup: { color: "text-green-700", bg: "bg-green-50", icon: "🚀" },
            enterprise: { color: "text-indigo-700", bg: "bg-indigo-50", icon: "🏢" },
        };
        return configs[type.toLowerCase()] || configs.personal;
    };

    if (loading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
                <div className="flex flex-col items-center justify-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>
                    <p className="text-sm font-medium text-gray-700">Loading workspaces...</p>
                    <p className="mt-1 text-xs text-gray-500">This will only take a moment</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                        <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h4 className="mb-2 text-lg font-semibold text-gray-900">Unable to load</h4>
                    <p className="mb-4 text-center text-sm text-gray-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Your Workspaces</h3>
                    <p className="mt-1 text-sm text-gray-500">Select a workspace to continue collaborating</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        {workspaces.length} {workspaces.length === 1 ? 'workspace' : 'workspaces'}
                    </span>
                    <button className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium 
                                     text-gray-700 shadow-sm hover:bg-gray-50">
                        <span className="flex items-center">
                            <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filter
                        </span>
                    </button>
                </div>
            </div>

            {workspaces.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white">
                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h4 className="mb-2 text-lg font-semibold text-gray-900">No workspaces yet</h4>
                    <p className="mb-4 text-sm text-gray-600">Create your first workspace to start collaborating with your team</p>
                    <button className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm 
                                     font-medium text-white hover:bg-indigo-700">
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Workspace
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {workspaces.map((ws) => {
                        const config = getTypeConfig(ws.type);
                        return (
                            <div
                                key={ws._id}
                                className="group relative overflow-hidden rounded-xl border border-gray-200 
                                         bg-white p-5 transition-all hover:border-indigo-300 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${config.bg}`}>
                                            <span className="text-xl">{config.icon}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 group-hover:text-indigo-700">
                                                {ws.name}
                                            </h4>
                                            <div className="mt-1 flex items-center space-x-2">
                                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.color}`}>
                                                    {ws.type.charAt(0).toUpperCase() + ws.type.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <div>
                                            <div className="font-medium text-gray-900">{ws.members}</div>
                                            <div className="text-xs text-gray-500">Members</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        <div>
                                            <div className="font-medium text-gray-900">{ws.channels}</div>
                                            <div className="text-xs text-gray-500">Channels</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <button className="w-full rounded-lg bg-gray-50 py-2.5 text-sm font-medium 
                                                     text-gray-700 hover:bg-gray-100">
                                        Open Workspace
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default WorkspaceList;