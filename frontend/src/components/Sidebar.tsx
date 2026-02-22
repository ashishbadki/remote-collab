import { useState } from "react";
import { useAuth } from "../context/AuthContext";
type Channel = {
    _id: string;
    name: string;
    type?: "text" | "voice";
};

type SidebarProps = {
    workspaceName: string;
    channels: Channel[];
    currentChannelId: string | null;
    onChannelSelect: (channelId: string) => void;
    loading: boolean;
};

export const Sidebar = ({
    workspaceName,
    channels,
    currentChannelId,
    onChannelSelect,
    loading,
    onChannelCreated,
    canManageChannels,
    onChannelDeleted,
}: SidebarProps & {
    onChannelCreated: (channel: Channel) => void;
    canManageChannels: boolean;
    onChannelDeleted: (channelId: string) => void;
}) => {
    const [isChannelsExpanded, setIsChannelsExpanded] = useState(true);
    const [isCreatingChannel, setIsCreatingChannel] = useState(false);
    const [newChannelName, setNewChannelName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { user } = useAuth();

    const handleCreateChannel = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newChannelName.trim()) return;

        try {
            setIsSubmitting(true);
            const response = await import("../api/channel.api").then((mod) =>
                mod.createChannelApi(window.location.pathname.split("/")[2], newChannelName)
            );

            if (response.success) {
                onChannelCreated(response.channel);
                setIsCreatingChannel(false);
                setNewChannelName("");
            }
        } catch (error) {
            console.error("Failed to create channel:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-gray-50 p-4">
                <div className="mb-6 h-8 w-3/4 animate-pulse rounded bg-gray-200"></div>
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-6 w-full animate-pulse rounded bg-gray-200"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-gray-50">
            {/* Workspace Header */}
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
                <h2 className="truncate font-bold text-gray-800">{workspaceName}</h2>
                <button className="rounded p-1 hover:bg-gray-200">
                    <svg
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-2 py-4">
                {/* Channels Section */}
                <div className="mb-6">
                    <button
                        onClick={() => setIsChannelsExpanded(!isChannelsExpanded)}
                        className="mb-2 flex w-full items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-700"
                    >
                        <span>Channels</span>
                        <svg
                            className={`h-3 w-3 params-transform transition-transform ${isChannelsExpanded ? "rotate-0" : "-rotate-90"
                                }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {isChannelsExpanded && (
                        <div className="space-y-0.5">
                            {channels.map((channel) => (
                                <div key={channel._id} className="group flex items-center pr-2">
                                    <button
                                        onClick={() => onChannelSelect(channel._id)}
                                        className={`flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${currentChannelId === channel._id
                                            ? "bg-gray-200 font-medium text-gray-900"
                                            : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                                            }`}
                                    >
                                        <span className="text-gray-400">#</span>
                                        <span className="truncate">{channel.name}</span>
                                    </button>
                                    {canManageChannels && (
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                if (window.confirm(`Are you sure you want to delete #${channel.name}?`)) {
                                                    try {
                                                        const response = await import("../api/channel.api").then((mod) =>
                                                            mod.deleteChannelApi(channel._id)
                                                        );
                                                        if (response.success) {
                                                            onChannelDeleted(channel._id);
                                                        }
                                                    } catch (error) {
                                                        console.error("Failed to delete channel:", error);
                                                    }
                                                }
                                            }}
                                            className="hidden rounded p-1 text-gray-400 hover:bg-gray-300 hover:text-red-500 group-hover:block"
                                        >
                                            <svg
                                                className="h-3 w-3"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                            {canManageChannels && (
                                <button
                                    onClick={() => setIsCreatingChannel(true)}
                                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-900"
                                >
                                    <div className="flex h-5 w-5 items-center justify-center rounded bg-gray-200 text-gray-600">
                                        <svg
                                            className="h-3 w-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4v16m8-8H4"
                                            />
                                        </svg>
                                    </div>
                                    <span>Add Channel</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Create Channel Modal */}
                {isCreatingChannel && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-96 rounded-lg bg-white p-6 shadow-xl">
                            <h3 className="mb-4 text-lg font-bold text-gray-900">Create New Channel</h3>
                            <form onSubmit={handleCreateChannel}>
                                <div className="mb-4">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Channel Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newChannelName}
                                        onChange={(e) => setNewChannelName(e.target.value)}
                                        className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        placeholder="e.g. general"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCreatingChannel(false);
                                            setNewChannelName("");
                                        }}
                                        className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !newChannelName.trim()}
                                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Creating..." : "Create Channel"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>

            {/* User Footer */}
            <div className="border-t border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500"></div>
                    <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="truncate text-xs text-gray-500">Online</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
