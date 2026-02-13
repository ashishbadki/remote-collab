import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: "💬", title: "Real-time Chat", desc: "Instant messaging with your team" },
    { icon: "📹", title: "Video Calls", desc: "High-quality video conferencing" },
    { icon: "📁", title: "File Sharing", desc: "Secure document collaboration" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-white flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl"></div>

        {/* Left Side - Brand & Benefits */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative z-10"
        >
          <div>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 mb-16 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-indigo-500/50 transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2L4 20l8-4 8 4L12 2z" />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                RemoteCollab
              </span>
            </Link>

            {/* Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl font-black text-gray-900 leading-tight">
                Welcome back to the future of <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">collaboration</span>
              </h1>
              <p className="text-xl text-gray-600">Join thousands of teams building the future together</p>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-6">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="flex items-start gap-4 group cursor-pointer"
              >
                <div className="text-3xl group-hover:scale-110 transition-transform">{benefit.icon}</div>
                <div>
                  <p className="text-gray-900 font-semibold text-lg">{benefit.title}</p>
                  <p className="text-gray-600 text-sm">{benefit.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust Badge */}
          <div className="flex items-center gap-4 text-gray-600 text-sm">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                  {i}
                </div>
              ))}
            </div>
            <span>Trusted by 10,000+ teams worldwide</span>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10"
        >
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <Link to="/" className="lg:hidden flex items-center gap-2 mb-8 group justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2L4 20l8-4 8 4L12 2z" />
                </svg>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                RemoteCollab
              </span>
            </Link>

            {/* Form Header */}
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
              <p className="text-gray-600">Access your workspace and collaborate instantly</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                  Email Address
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full px-5 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-sm"
                />
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-5 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-sm"
                />
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                >
                  <span className="text-red-500 text-lg">⚠️</span>
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}

              {/* Sign In Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 px-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/50 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </motion.button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="h-px bg-gray-300 flex-1"></div>
                <span className="text-xs text-gray-500">OR</span>
                <div className="h-px bg-gray-300 flex-1"></div>
              </div>

              {/* Google Button */}
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-5 bg-white border border-gray-300 text-gray-900 font-semibold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </motion.button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-600 mt-6">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Create free account
                </Link>
              </p>
            </form>

            {/* Footer Text */}
            <p className="text-center text-xs text-gray-500 mt-8">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Login;
