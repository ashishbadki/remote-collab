import axios from "axios";
import { useState } from "react";
import { getToken } from "../utils/storage";

export const InviteLinkBody = ({
  workspaceId,
  onClose,
}: {
  workspaceId: string;
  onClose: () => void;
}) => {
  const [inviteLink, setInviteLink] = useState("");
  const [loading, setLoading] = useState(false);

  const createInvite = async () => {
    try {
      setLoading(true);
      console.log("Generating invite for workspaceId:", workspaceId);

      const res = await axios.post(
        `http://localhost:3000/api/v1/invite/${workspaceId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      console.log("Invite response:", res.data);
      const fullLink = res.data.inviteLink;
      const token = fullLink.split("/").pop();
      setInviteLink(token);
    } catch (err: any) {
      console.error("Generate invite error:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to generate invite link";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied!");
  };

  return (
    <div className="p-5 space-y-4">
      {!inviteLink ? (
        <button
          onClick={createInvite}
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white hover:from-blue-600 hover:to-cyan-600 disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate Invite Link"}
        </button>
      ) : (
        <>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 break-all">
            {inviteLink}
          </div>

          <button
            onClick={copyLink}
            className="w-full rounded-lg border border-blue-500 px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
          >
            Copy Link
          </button>
        </>
      )}

      <button
        onClick={onClose}
        className="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
      >
        Close
      </button>
    </div>
  );
};
