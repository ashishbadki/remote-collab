import { useEffect, useRef, useState } from "react";
import { getProfileApi } from "../api/user.api";
import profileImg from "../assets/profile_img.avif";
import { Rocket } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
        <Rocket className="text-white w-5 h-5" />
      </div>
      <span className="text-xl font-semibold text-indigo-600">
        RemoteCollab
      </span>
    </div>
  );
};

const Dashboard = () => {
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfileApi();
        setProfile(data);
      } catch (error) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />

          <div className="relative" ref={dropdownRef}>
            <img
              src={profileImg}
              alt="Profile"
              onClick={() => setOpen(!open)}
              className="w-9 h-9 rounded-xl object-cover border cursor-pointer
                         hover:ring-2 hover:ring-indigo-500 transition"
            />

            {open && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl
                              shadow-lg border z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-medium text-gray-800">
                    {profile?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {profile?.email}
                  </p>
                </div>

                {/* Menu */}
                <div className="py-2">
                  <button
                    className="w-full text-left px-4 py-2 text-sm
                               text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </button>

                  <button
                    className="w-full text-left px-4 py-2 text-sm
                               text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t">
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      window.location.href = "/login";
                    }}
                    className="w-full text-left px-4 py-2 text-sm
                               text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
  <div className="text-center">
    <h2 className="text-3xl font-semibold text-gray-900">
      Welcome back, <span className="text-indigo-600">{profile?.name}</span> 👋
    </h2>

    <p className="mt-3 text-base text-gray-600 max-w-2xl mx-auto">
      Pick up where you left off. Select a workspace to continue collaborating
      with your team.
    </p>
  </div>
</main>

    </div>
  );
};

export default Dashboard;
