// components/allWorkspaceList.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InviteLinkBody } from "./InviteLinkBody";
import { useAuth } from "../context/authContext";
import type { Workspace } from "../types/workspace";

type WorkspaceListProps = {
  workspaces: Workspace[];
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
};

const WorkspaceList = ({
  workspaces,
  loading,
  onDelete,
}: WorkspaceListProps) => {
  const { user } = useAuth();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [showAddMembers, setShowAddMembers] = useState<string | null>(null);

  const handleDeleteClick = async (id: string, workspaceName: string) => {
    if (confirmText !== `delete ${workspaceName}`) return;

    setDeletingId(id);
    try {
      await onDelete(id);
      setConfirmText("");
    } finally {
      setDeletingId(null);
      setDeleteConfirmId(null);
      setConfirmText("");
    }
  };

  const handleAddMembers = (workspaceId: string, ownerId: string) => {
    if (user && user._id !== ownerId) {
      alert("Only the workspace owner can invite members");
      return;
    }
    setShowAddMembers(workspaceId);
    setOpenMenuId(null);
    // In a real app, this would open a modal or navigate to a members page
    console.log(`Add members to workspace: ${workspaceId}`);
    // You can implement your add members logic here
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
        <div className="inline-flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-sm font-medium text-gray-600">Loading workspaces...</p>
        </div>
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-dashed border-gray-300 bg-white/50 p-12 text-center backdrop-blur-sm"
      >
        <div className="mx-auto max-w-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
            <svg className="h-8 w-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">No workspaces yet</h3>
          <p className="mb-4 text-sm text-gray-600">Create your first workspace to collaborate and organize your projects</p>
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white shadow-sm">
            <span>Get Started</span>
            <span>🚀</span>
          </div>
        </div>
      </motion.div>
    );
  }

  const workspaceToDelete = deleteConfirmId ? workspaces.find(ws => ws._id === deleteConfirmId) : null;

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AnimatePresence>
          {workspaces.map((ws) => (
            <motion.div
              key={ws._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              {/* Background accent */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

              {/* Content */}
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100">
                        <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">{ws.name}</h4>
                        <div className="mt-1 inline-flex items-center rounded-full bg-gray-100 px-3 py-1">
                          <span className="text-xs font-medium capitalize text-gray-700">{ws.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === ws._id ? null : ws._id)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {openMenuId === ws._id && !deleteConfirmId && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 z-20 mt-1 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
                        >
                          {/* Add Members Button */}
                          <button
                            onClick={() => handleAddMembers(ws._id, ws.owner)}
                            disabled={!(user && user._id === ws.owner)}
                            title={user && user._id !== ws.owner ? "Only owner can invite" : undefined}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group disabled:opacity-50"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 group-hover:from-blue-200 group-hover:to-cyan-200">
                              <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                              </svg>
                            </div>
                            <div className="text-left">
                              <div className="font-medium">Add Members</div>
                              <div className="text-xs text-gray-500">Invite people to collaborate</div>
                            </div>
                          </button>

                          <div className="my-1 border-t border-gray-100"></div>

                          {/* Delete Workspace Button */}
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              if (user && user._id === ws.owner) {
                                setDeleteConfirmId(ws._id);
                              } else {
                                alert("Only the workspace owner can delete this workspace");
                              }
                            }}
                            disabled={!(user && user._id === ws.owner)}
                            title={user && user._id !== ws.owner ? "Only owner can delete" : undefined}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors group disabled:opacity-50"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-100 to-orange-100 group-hover:from-red-200 group-hover:to-orange-200">
                              <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </div>
                            <div className="text-left">
                              <div className="font-medium">Delete Workspace</div>
                              <div className="text-xs text-red-500">Permanently remove workspace</div>
                            </div>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Stats */}
                <div className="mb-6 mt-4 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-blue-50 p-2">
                      <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.67 3.107a6 6 0 00-11.335 0" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{ws.members?.length ?? 0}</p>
                      <p className="text-xs text-gray-500">Members</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-green-50 p-2">
                      <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{ws.channels ?? 0}</p>
                      <p className="text-xs text-gray-500">Channels</p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                {/* Action Button */}
                <button>
                  Open Workspace
                </button>

              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal - SMALL CARD STYLE */}
      <AnimatePresence>
        {deleteConfirmId && workspaceToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4"
            onClick={() => !deletingId && (setDeleteConfirmId(null), setConfirmText(""))}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header - Compact */}
              <div className="border-b border-gray-100 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-orange-50">
                    <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Delete "{workspaceToDelete.name}"?</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                  </div>
                </div>
              </div>

              {/* Modal Body - Compact */}
              <div className="p-5">
                {/* Workspace Info - Minimal */}
                <div className="mb-4 rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100">
                      <svg className="h-4 w-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">{workspaceToDelete.name}</span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span className="capitalize">{workspaceToDelete.type}</span>
                        <span>•</span>
                        <span>{Array.isArray(workspaceToDelete.members) ? workspaceToDelete.members.length : 0} members</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warning Message - Compact */}
                <div className="mb-4 rounded-lg border border-red-100 bg-red-50 p-3">
                  <div className="flex items-start gap-2">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-red-700">
                      Once deleted, this workspace and all its data <strong>cannot be recovered</strong>.
                    </p>
                  </div>
                </div>

                {/* Confirmation Input */}
                <div className="mb-4">
                  <p className="mb-2 text-sm text-gray-700">
                    Type <span className="font-mono font-medium text-red-600">delete {workspaceToDelete.name}</span> to confirm:
                  </p>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder={`delete ${workspaceToDelete.name}`}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                    autoFocus
                  />
                  {confirmText && confirmText !== `delete ${workspaceToDelete.name}` && (
                    <p className="mt-1 text-xs text-red-600">Text doesn't match</p>
                  )}
                </div>

                {/* Action Buttons - Side by Side */}
                { /* determine ownership to guard delete */}
                {(() => {
                  const isOwner = user?._id === workspaceToDelete.owner;
                  return (
                    <>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setDeleteConfirmId(null);
                            setConfirmText("");
                          }}
                          disabled={deletingId === workspaceToDelete._id}
                          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDeleteClick(workspaceToDelete._id, workspaceToDelete.name)}
                          disabled={
                            deletingId === workspaceToDelete._id ||
                            confirmText !== `delete ${workspaceToDelete.name}` ||
                            !isOwner
                          }
                          className="flex-1 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 px-3 py-2.5 text-sm font-semibold text-white hover:from-red-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {deletingId === workspaceToDelete._id ? (
                            <span className="inline-flex items-center justify-center gap-1.5">
                              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                              Deleting...
                            </span>
                          ) : (
                            "Delete"
                          )}
                        </button>
                      </div>
                      {!isOwner && (
                        <p className="mt-2 text-xs text-red-600">
                          Only the workspace owner can delete this workspace.
                        </p>
                      )}
                    </>
                  );
                })()}

                {/* Final Note */}
                <p className="mt-3 text-center text-xs text-gray-500">
                  All data will be permanently removed
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Members Modal - Optional (you can implement this later) */}

      <AnimatePresence>
        {showAddMembers && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4"
            onClick={() => setShowAddMembers(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="border-b border-gray-100 p-5">
                <h3 className="text-lg font-semibold text-gray-900">
                  Invite Members
                </h3>
                <p className="text-sm text-gray-500">
                  Share this link to invite people
                </p>
              </div>

              {/* Body */}
              <InviteLinkBody
                workspaceId={showAddMembers}
                onClose={() => setShowAddMembers(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
};

export default WorkspaceList;