// components/CreateWorkspace.tsx - Refined
import { useState } from "react";
import { workspaceApi } from "../api/workspace.api";

const CreateWorkspace = () => {
    const [name, setName] = useState("");
    const [type, setType] = useState("personal");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || loading) return;
        
        setLoading(true);
        setError("");

        try {
            await workspaceApi(name.trim(), type);
            setName("");
            setType("personal");
            // You might want to trigger a refresh of workspace list here
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to create workspace. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const workspaceTypes = [
        { value: "personal", label: "Personal", description: "For individual projects", icon: "👤" },
        { value: "team", label: "Team", description: "Small to medium teams", icon: "👥" },
        { value: "startup", label: "Startup", description: "Growing organizations", icon: "🚀" },
        { value: "enterprise", label: "Enterprise", description: "Large organizations", icon: "🏢" },
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
                <div className="mb-2 flex items-center">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                        <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Create Workspace</h2>
                        <p className="text-sm text-gray-500">Start a fresh collaboration space</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="workspace-name" className="mb-2 block text-sm font-medium text-gray-700">
                        Workspace name
                    </label>
                    <input
                        id="workspace-name"
                        type="text"
                        placeholder="e.g., Marketing Team, Project Alpha"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={loading}
                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm 
                                 placeholder-gray-400 shadow-sm transition-colors focus:border-indigo-500 
                                 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed 
                                 disabled:bg-gray-50"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Workspace type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {workspaceTypes.map((wt) => (
                            <button
                                key={wt.value}
                                type="button"
                                onClick={() => setType(wt.value)}
                                className={`flex flex-col items-center rounded-lg border p-4 transition-all ${
                                    type === wt.value
                                        ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <span className="mb-2 text-xl">{wt.icon}</span>
                                <span className="text-sm font-medium text-gray-900">{wt.label}</span>
                                <span className="mt-1 text-xs text-gray-500">{wt.description}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading || !name.trim()}
                        className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm 
                                 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 
                                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                                 disabled:cursor-not-allowed disabled:bg-indigo-400"
                    >
                        {loading ? (
                            <>
                                <svg className="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                            </>
                        ) : (
                            "Create Workspace"
                        )}
                    </button>
                </div>

                {error && (
                    <div className="rounded-lg border border-red-100 bg-red-50 p-3">
                        <div className="flex items-center">
                            <svg className="mr-2 h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                <p className="text-center text-xs text-gray-500">
                    You can invite team members after creating the workspace
                </p>
            </form>
        </div>
    );
};

export default CreateWorkspace;