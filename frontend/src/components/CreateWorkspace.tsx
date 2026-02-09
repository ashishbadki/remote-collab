// components/CreateWorkspace.tsx
import { useState } from "react";
import { createWorkspaceApi } from "../api/workspace.api";
import { motion } from "framer-motion";

type CreateWorkspaceProps = {
  onCreated: () => void;
};

const CreateWorkspace = ({ onCreated }: CreateWorkspaceProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || loading) return;

    try {
      setLoading(true);
      setError("");

      await createWorkspaceApi(name.trim(), type);

      setName("");
      setType("personal");

      onCreated();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to create workspace. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const workspaceTypes = [
    { value: "personal", label: "Personal", icon: "👤", color: "from-blue-500 to-cyan-500" },
    { value: "team", label: "Team", icon: "👥", color: "from-green-500 to-emerald-500" },
    { value: "startup", label: "Startup", icon: "🚀", color: "from-purple-500 to-pink-500" },
    { value: "enterprise", label: "Enterprise", icon: "🏢", color: "from-orange-500 to-red-500" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50/50 p-8 shadow-sm"
    >
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Create New Workspace</h2>
        </div>
        <p className="text-sm text-gray-600">Start collaborating with your team in a new workspace</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Workspace Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter workspace name"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {name.length > 0 && (
                <span className="text-xs font-medium text-gray-500">
                  {name.length}/50
                </span>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Workspace Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {workspaceTypes.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setType(option.value)}
                className={`relative rounded-xl border p-4 transition-all ${
                  type === option.value
                    ? `border-transparent bg-gradient-to-br ${option.color} text-white shadow-md`
                    : "border-gray-300 bg-white hover:border-gray-400"
                }`}
              >
                <div className="text-left">
                  <div className="mb-2 text-lg">{option.icon}</div>
                  <div className="text-sm font-medium">{option.label}</div>
                </div>
                {type === option.value && (
                  <div className="absolute right-3 top-3">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-red-200 bg-red-50/50 p-4"
          >
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-sm font-semibold text-white shadow-sm hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-md"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Creating Workspace...
            </span>
          ) : (
            "Create Workspace"
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateWorkspace;