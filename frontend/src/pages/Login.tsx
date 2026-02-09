import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f6f8ff] flex items-center justify-center"
      style={{
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div className="w-full flex flex-col items-center">

        <div className="flex items-center gap-2 mb-1">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-7 h-7 bg-[#5b5cf0] rounded-md flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L4 20l8-4 8 4L12 2z" />
              </svg>
            </div>
            <span className="text-[24px] font-semibold text-[#5b5cf0]">
              RemoteCollab
            </span>
          </Link>
        </div>

        <p className="text-[13px] text-gray-700 mb-6">
          Welcome back! Please log in to your account
        </p>

        <form onSubmit={handleSubmit} className="w-[350px]">

          <label className="block text-[12px] font-medium text-gray-800 mb-1 text-center">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
            className="w-full h-[34px] px-3 bg-white
                       border border-gray-300 rounded-md
                       text-[13px] text-gray-800 mb-3
                       focus:outline-none focus:ring-1 focus:ring-[#5b5cf0] focus:border-[#5b5cf0]"
          />

          <label className="block text-[12px] font-medium text-gray-800 mb-1 text-center">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full h-[34px] px-3 bg-white
                       border border-gray-300 rounded-md
                       text-[13px] text-gray-800 mb-2
                       focus:outline-none focus:ring-1 focus:ring-[#5b5cf0] focus:border-[#5b5cf0]"
          />

          <div className="text-right mb-4">
            <Link
              to="/forgot-password"
              className="text-[12px] text-[#5b5cf0] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[34px] bg-[#5b5cf0] text-white
                       text-[12px] font-medium rounded-md
                       hover:bg-[#4a4be0] transition mb-5
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <div className="flex items-center mb-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-2 text-[12px] text-gray-500">
              Or continue with
            </span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <button
            type="button"
            className="w-full h-[34px] bg-white
                       border border-gray-300 rounded-md
                       text-[12px] font-medium text-gray-900
                       flex items-center justify-center gap-2
                       hover:bg-gray-50 transition mb-5"
          >
            <span className="font-bold text-[14px]">G</span>
            Google
          </button>

          <p className="text-center text-[12px] text-gray-700">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#5b5cf0] font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Login;
