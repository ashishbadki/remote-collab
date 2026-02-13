import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { joinWorkspaceApi } from "../api/workspace.api";

const JoinWorkspace = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const joinWorkspace = async () => {
      try {
        if (!token) return;

        await joinWorkspaceApi(token);

        // After success → redirect
        navigate("/dashboard");

      } catch (err: any) {
        setError(
          err?.response?.data?.message || "Failed to join workspace"
        );
      } finally {
        setLoading(false);
      }
    };

    joinWorkspace();
  }, [token, navigate]);

  if (loading) {
    return <div>Joining workspace...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return null;
};

export default JoinWorkspace;
