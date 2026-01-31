import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#f6f8ff]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-xl font-bold text-gray-900"></span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
          >
            Sign Up Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-24 px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 max-w-4xl mx-auto leading-tight">
          Complete Collaboration Platform for Remote Teams
        </h1>

        <p className="mt-8 text-gray-600 max-w-2xl mx-auto text-xl">
          Chat, video calls, document collaboration, and file sharing — all in
          one secure workspace designed for modern remote teams.
        </p>

        <div className="mt-12 flex justify-center gap-4">
          <Link
            to="/signup"
            className="px-8 py-4 bg-indigo-600 text-white rounded-xl text-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Get Started Free
          </Link>

          <button className="px-8 py-4 border border-gray-300 rounded-xl text-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
            <span>▶</span> Watch Demo
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
          <Feature
            icon="💬"
            title="Real-time Chat"
            desc="Instant messaging with threads, reactions, and file sharing for seamless communication."
          />
          <Feature
            icon="📹"
            title="Video Calls"
            desc="High-quality video meetings with screen sharing and recording capabilities."
          />
          <Feature
            icon="📄"
            title="Document Collaboration"
            desc="Real-time collaborative editing with version history and comments."
          />
          <Feature
            icon="📁"
            title="File Management"
            desc="Secure file storage, sharing, and collaborative editing for all file types."
          />
        </div>
      </section>
    </div>
  );
};

const Feature = ({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) => {
  return (
    <div className="text-center p-4">
      <div className="w-16 h-16 mx-auto mb-6 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl">
        {icon}
      </div>
      <h3 className="font-bold text-xl mb-3">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
};

export default Landing;