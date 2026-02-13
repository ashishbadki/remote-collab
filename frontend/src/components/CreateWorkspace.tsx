// components/CreateWorkspace.tsx
import { useState } from "react";
import { createWorkspaceApi } from "../api/workspace.api";
import { motion, AnimatePresence } from "framer-motion";

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
      className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-br from-white via-gray-50/40 to-indigo-50/20 p-7 shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      {/* Decorative elements */}
      <div className="absolute -right-20 -top-20 h-40 w-40 bg-gradient-to-br from-indigo-100/30 to-purple-100/20 rounded-full blur-3xl"></div>
      <div className="absolute -left-10 bottom-0 h-32 w-32 bg-gradient-to-tr from-blue-100/20 to-cyan-100/10 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-md">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Create Workspace</h2>
              <p className="text-xs text-gray-500">Set up your new collaboration space</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2.5 block text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Workspace Name
            </label>
            <div className="relative group">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Design Team, Marketing"
                maxLength={50}
                className="w-full rounded-lg border border-gray-200/80 bg-white/80 px-4 py-3 text-sm placeholder-gray-400 transition-all duration-200 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500/30 focus:outline-none group-hover:border-gray-300"
              />
              {name.length > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
                  {name.length}<span className="text-gray-300">/50</span>
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="mb-3 block text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Choose Type
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {workspaceTypes.map((option) => (
                <motion.button
                  key={option.value}
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setType(option.value)}
                  className={`group relative rounded-lg border-2 px-3.5 py-3.5 transition-all duration-200 ${
                    type === option.value
                      ? `border-transparent bg-gradient-to-br ${option.color} text-white shadow-lg`
                      : "border-gray-200 bg-white/50 hover:border-gray-300 hover:bg-white"
                  }`}
                >
                  <div className="text-left">
                    <div className={`mb-2 text-xl ${type === option.value ? 'scale-110' : ''} transition-transform`}>{option.icon}</div>
                    <div className="text-xs font-semibold">{option.label}</div>
                  </div>
                  {type === option.value && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-2.5 top-2.5">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-lg border border-red-200/80 bg-red-50/60 backdrop-blur-sm p-3.5"
              >
                <div className="flex items-start gap-2.5">
                  <svg className="h-4 w-4 flex-shrink-0 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-red-700 font-medium">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={loading || !name.trim()}
            whileHover={{ y: loading || !name.trim() ? 0 : -1 }}
            whileTap={{ scale: loading || !name.trim() ? 1 : 0.98 }}
            className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <motion.span 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 1, repeat: Infinity }}
                  className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white"
                ></motion.span>
                Creating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Workspace
              </span>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateWorkspace;